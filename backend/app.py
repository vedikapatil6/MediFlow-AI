from fastapi.responses import FileResponse, StreamingResponse
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
from io import BytesIO
from email_service import send_nurse_notification, send_discharge_summary_to_guardian, send_test_email
from database import get_nurse_email
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from database import (
    patients_collection, 
    discharge_logs_collection,
    nurse_tasks_collection,
    init_sample_data
)
from models import Patient, PatientUpdate
from agents.discharge_agent import discharge_workflow

app = FastAPI(title="MediFlow AI", description="AI-powered hospital discharge system")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    init_sample_data()

@app.get("/")
def root():
    return {"message": "MediFlow AI Backend is running!", "status": "healthy"}

# ==================== PATIENT ENDPOINTS ====================

@app.get("/api/patients")
def get_patients():
    """Get all patients"""
    patients = list(patients_collection.find({}, {"_id": 0}))
    return {"patients": patients}

@app.get("/api/patients/{patient_id}")
def get_patient(patient_id: str):
    """Get specific patient"""
    patient = patients_collection.find_one({"patient_id": patient_id}, {"_id": 0})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {"patient": patient}

@app.put("/api/patients/{patient_id}")
def update_patient(patient_id: str, update: PatientUpdate):
    """Update patient data"""
    update_data = {"updated_at": datetime.utcnow()}
    
    if update.vital_signs:
        update_data["vital_signs"] = update.vital_signs.dict()
    if update.treatment_status:
        update_data["treatment_status"] = update.treatment_status
    
    result = patients_collection.update_one(
        {"patient_id": patient_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    return {"message": "Patient updated successfully"}

@app.post("/api/patients/{patient_id}/approve")
def approve_patient_discharge(patient_id: str):
    """Doctor approves patient for discharge"""
    patient = patients_collection.find_one({"patient_id": patient_id}, {"_id": 0})
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    result = patients_collection.update_one(
        {"patient_id": patient_id},
        {"$set": {
            "status": "doctor_approved",
            "approved_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Log the approval
    discharge_logs_collection.insert_one({
        "patient_id": patient_id,
        "action": "doctor_approved",
        "details": f"Doctor approved discharge for patient {patient_id}",
        "agent": "Doctor",
        "timestamp": datetime.utcnow()
    })
    
    # 🔔 SEND EMAIL TO NURSE
    try:
        nurse_email = get_nurse_email()
        send_nurse_notification(nurse_email, patient)
        print(f"✅ Nurse notification sent for patient {patient_id}")
    except Exception as e:
        print(f"⚠️ Failed to send nurse notification: {e}")
    
    return {"message": "Patient approved for discharge", "status": "doctor_approved"}

# ==================== DISCHARGE DETECTION ====================

@app.post("/api/run-discharge-detection")
def run_discharge_detection():
    """Run the discharge readiness detection workflow"""
    try:
        # Execute LangGraph workflow
        result = discharge_workflow.invoke({"input": "start_detection"})
        
        return {
            "status": "completed",
            "ready_patients": result.get("ready_patients", []),
            "processed_count": result.get("processed_count", 0),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Workflow failed: {str(e)}")

# ==================== DISCHARGE LOGS ====================

@app.get("/api/discharge-logs")
def get_discharge_logs():
    """Get discharge activity logs"""
    logs = list(discharge_logs_collection.find({}, {"_id": 0}).sort("timestamp", -1).limit(50))
    return {"logs": logs}

# ==================== NURSE TASKS ENDPOINTS ====================

@app.get("/api/nurse-tasks")
def get_all_nurse_tasks():
    """Get all patients approved by doctor (for nurse dashboard)"""
    # Return all patients with status 'doctor_approved'
    patients = list(patients_collection.find({"status": "doctor_approved"}, {"_id": 0}))
    
    # Attach checklist from nurse_tasks_collection
    for p in patients:
        checklist_doc = nurse_tasks_collection.find_one({"patient_id": p["patient_id"]}, {"_id": 0})
        if checklist_doc:
            p["pending_nurse_tasks"] = [t["label"] for t in checklist_doc.get("tasks", [])]
            p["nurse_status"] = checklist_doc.get("status", "pending")
        else:
            p["pending_nurse_tasks"] = []
            p["nurse_status"] = "pending"
    
    return {"patients": patients}

@app.get("/api/nurse-tasks/{patient_id}")
def get_nurse_tasks_for_patient(patient_id: str):
    """Get nurse tasks for a specific patient"""
    patient = patients_collection.find_one({"patient_id": patient_id}, {"_id": 0})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Check if checklist already exists
    checklist_doc = nurse_tasks_collection.find_one({"patient_id": patient_id}, {"_id": 0})
    
    if not checklist_doc:
        # Generate checklist using AI
        try:
            from agents.nurse_agent import generate_nurse_checklist
            tasks = generate_nurse_checklist(patient)
            
            # Store generated checklist
            nurse_tasks_collection.insert_one({
                "patient_id": patient_id,
                "tasks": [{"label": task, "completed": False, "completed_at": None} for task in tasks],
                "status": "pending",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            })
            
            return {"tasks": tasks, "status": "pending"}
        except Exception as e:
            # Fallback to default checklist if AI fails
            default_tasks = [
                "Administer final medication",
                "Remove IV line",
                "Check and record final vital signs",
                "Patient education on post-discharge care",
                "Collect discharge documentation"
            ]
            
            nurse_tasks_collection.insert_one({
                "patient_id": patient_id,
                "tasks": [{"label": task, "completed": False, "completed_at": None} for task in default_tasks],
                "status": "pending",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            })
            
            return {"tasks": default_tasks, "status": "pending"}
    
    # Return existing checklist
    tasks = [t["label"] for t in checklist_doc.get("tasks", [])]
    return {"tasks": tasks, "status": checklist_doc.get("status", "pending")}

@app.post("/api/nurse-tasks/{patient_id}/update")
def update_nurse_checklist(patient_id: str, data: dict):
    """Update nurse checklist with completed tasks"""
    checklist = data.get("checklist", [])
    checked = data.get("checked", {})
    note = data.get("note", "")
    
    # Build tasks with completion status
    tasks = []
    for idx, item in enumerate(checklist):
        is_completed = bool(checked.get(str(idx), False))
        tasks.append({
            "label": item,
            "completed": is_completed,
            "completed_by": "nurse" if is_completed else None,
            "completed_at": datetime.utcnow() if is_completed else None
        })
    
    # Determine if all tasks are completed
    all_completed = all(checked.values()) if checked else False
    
    # Update nurse tasks collection
    nurse_tasks_collection.update_one(
        {"patient_id": patient_id},
        {"$set": {
            "tasks": tasks,
            "handover_note": note,
            "status": "completed" if all_completed else "pending",
            "updated_at": datetime.utcnow()
        }},
        upsert=True
    )
    
    # Update patient status if all tasks completed
    if all_completed:
        patients_collection.update_one(
            {"patient_id": patient_id},
            {"$set": {
                "status": "nurse_completed",
                "nurse_completed_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }}
        )
        
        # Log the completion
        discharge_logs_collection.insert_one({
            "patient_id": patient_id,
            "action": "nurse_tasks_completed",
            "details": f"Nurse completed all discharge tasks for patient {patient_id}",
            "agent": "Nurse",
            "timestamp": datetime.utcnow()
        })
    
    return {"success": True, "status": "completed" if all_completed else "pending"}

@app.post("/api/nurse-tasks/{patient_id}/add")
def add_checklist_item(patient_id: str, data: dict):
    """Add a new task to the checklist"""
    item = data.get("item", "")
    
    if not item:
        raise HTTPException(status_code=400, detail="Task item cannot be empty")
    
    nurse_tasks_collection.update_one(
        {"patient_id": patient_id},
        {"$push": {
            "tasks": {
                "label": item,
                "completed": False,
                "completed_at": None
            }
        }},
        upsert=True
    )
    
    return {"success": True, "message": "Task added successfully"}

# ==================== PHARMACY ENDPOINTS ====================

@app.get("/api/pharmacy")
def get_pharmacy_patients():
    """Get all patients ready for pharmacy (nurse completed)"""
    patients = list(patients_collection.find({"status": "nurse_completed"}, {"_id": 0}))
    
    # Attach nurse notes
    for p in patients:
        nurse_tasks = nurse_tasks_collection.find_one({"patient_id": p["patient_id"]}, {"_id": 0})
        if nurse_tasks:
            p["nurse_notes"] = nurse_tasks.get("handover_note", "")
    
    return {"patients": patients}

@app.get("/api/pharmacy/{patient_id}")
def get_pharmacy_prescription(patient_id: str):
    """Get or generate pharmacy prescription for patient"""
    patient = patients_collection.find_one({"patient_id": patient_id}, {"_id": 0})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Get nurse notes
    nurse_tasks = nurse_tasks_collection.find_one({"patient_id": patient_id}, {"_id": 0})
    
    # Generate prescription using AI
    try:
        from agents.pharmacy_agent import generate_prescription
        prescription = generate_prescription(patient, nurse_tasks)
        
        return {
            "prescription": prescription,
            "patient": patient,
            "nurse_notes": nurse_tasks.get("handover_note", "") if nurse_tasks else ""
        }
    except Exception as e:
        # Fallback to basic prescription
        return {
            "prescription": f"""
PRESCRIPTION FOR {patient['name']}
Patient ID: {patient['patient_id']}
Diagnosis: {patient['diagnosis']}

MEDICATIONS:
- Medication as prescribed by doctor
- Follow dosage instructions carefully

INSTRUCTIONS:
- Take medications with food
- Complete full course of treatment
- Report any side effects

FOLLOW-UP:
- Schedule appointment in 1 week
            """.strip(),
            "patient": patient,
            "nurse_notes": nurse_tasks.get("handover_note", "") if nurse_tasks else ""
        }

@app.post("/api/pharmacy/{patient_id}/complete")
def complete_pharmacy_prescription(patient_id: str, data: dict):
    """Mark pharmacy prescription as completed"""
    prescription = data.get("prescription", {})
    
    patients_collection.update_one(
        {"patient_id": patient_id},
        {"$set": {
            "status": "pharmacy_completed",
            "prescription": prescription,
            "pharmacy_completed_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }}
    )
    
    # Log the completion
    discharge_logs_collection.insert_one({
        "patient_id": patient_id,
        "action": "pharmacy_completed",
        "details": f"Pharmacy completed prescription for patient {patient_id}",
        "agent": "Pharmacy",
        "timestamp": datetime.utcnow()
    })
    
    return {"success": True, "message": "Prescription completed"}

@app.get("/api/patients/{patient_id}/download-prescription")
def download_prescription_pdf(patient_id: str):
    """Download prescription as PDF"""
    patient = patients_collection.find_one({"patient_id": patient_id}, {"_id": 0})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    prescription = patient.get("prescription", "Prescription not available")
    if isinstance(prescription, dict):
        prescription = str(prescription)
    
    # Create PDF
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []
    
    title_style = ParagraphStyle('Title', parent=styles['Title'], fontSize=20, textColor=colors.HexColor('#f59e0b'))
    story.append(Paragraph(f"Prescription - {patient['name']}", title_style))
    story.append(Spacer(1, 0.3*inch))
    
    story.append(Paragraph(f"<b>Patient ID:</b> {patient['patient_id']}", styles['Normal']))
    story.append(Paragraph(f"<b>Date:</b> {datetime.utcnow().strftime('%Y-%m-%d')}", styles['Normal']))
    story.append(Spacer(1, 0.2*inch))
    
    for line in prescription.split('\n'):
        if line.strip():
            story.append(Paragraph(line.strip(), styles['Normal']))
    
    doc.build(story)
    buffer.seek(0)
    
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=Prescription_{patient_id}.pdf"
        }
    )

# ==================== SUMMARY ENDPOINTS ====================

@app.get("/api/summary")
def get_summary_patients():
    """Get all patients ready for summary generation"""
    # ✅ FIXED: Now accepts both pharmacy_completed AND summary_completed
    patients = list(patients_collection.find(
        {"status": {"$in": ["pharmacy_completed", "summary_completed"]}}, 
        {"_id": 0}
    ))
    print(f"📊 Summary Portal: Found {len(patients)} patients")  # Debug log
    return {"patients": patients}

@app.get("/api/patients/{patient_id}/summary")
def get_patient_summary(patient_id: str):
    """Get AI-generated discharge summary for patient"""
    patient = patients_collection.find_one({"patient_id": patient_id}, {"_id": 0})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Get nurse tasks and notes
    nurse_tasks = nurse_tasks_collection.find_one({"patient_id": patient_id}, {"_id": 0})
    
    state = {
        "patient": patient,
        "nurse_notes": nurse_tasks.get("handover_note", "") if nurse_tasks else ""
    }
    
    try:
        from agents.summary_agent import summary_workflow
        result = summary_workflow.invoke(state)
        summary_text = result.get("summary", "")
    except Exception as e:
        print(f"⚠️ Summary generation failed: {e}")
        # Fallback summary
        summary_text = f"""
DISCHARGE SUMMARY

Patient Name: {patient['name']}
Patient ID: {patient['patient_id']}
Age: {patient['age']}
Diagnosis: {patient['diagnosis']}

Admission Date: {patient['admission_date']}
Discharge Date: {datetime.utcnow().strftime('%Y-%m-%d')}

Treatment Status: {patient['treatment_status']}

Vital Signs at Discharge:
- Blood Pressure: {patient['vital_signs']['blood_pressure']}
- Heart Rate: {patient['vital_signs']['heart_rate']} bpm
- Temperature: {patient['vital_signs']['temperature']}°F

Nurse Notes: {state.get('nurse_notes', 'None')}

Follow-up: Schedule appointment in 1 week.
        """.strip()
    
    # ✅ UPDATE STATUS: Mark as summary_completed so it stays in the list
    patients_collection.update_one(
        {"patient_id": patient_id},
        {"$set": {
            "status": "summary_completed",
            "summary": summary_text,
            "summary_generated_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }}
    )
    
    return {"summary": summary_text, "patient": patient}

@app.get("/api/patients/{patient_id}/download-summary")
def download_summary_pdf(patient_id: str):
    """Download discharge summary as PDF"""
    patient = patients_collection.find_one({"patient_id": patient_id}, {"_id": 0})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    summary = patient.get("summary", "Summary not available")
    
    # Create PDF
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []
    
    # Title
    title_style = ParagraphStyle('Title', parent=styles['Title'], fontSize=20, textColor=colors.HexColor('#2563eb'))
    story.append(Paragraph(f"Discharge Summary - {patient['name']}", title_style))
    story.append(Spacer(1, 0.3*inch))
    
    # Patient Info
    story.append(Paragraph(f"<b>Patient ID:</b> {patient['patient_id']}", styles['Normal']))
    story.append(Paragraph(f"<b>Diagnosis:</b> {patient['diagnosis']}", styles['Normal']))
    story.append(Spacer(1, 0.2*inch))
    
    # Summary
    for line in summary.split('\n'):
        if line.strip():
            story.append(Paragraph(line.strip(), styles['Normal']))
    
    doc.build(story)
    buffer.seek(0)
    
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=Discharge_Summary_{patient_id}.pdf"
        }
    )

# ==================== BILLING ENDPOINTS ====================

@app.get("/api/billing")
def get_billing_patients():
    """Get all patients ready for billing"""
    # ✅ FIXED: Accept pharmacy_completed, summary_completed, AND billing_completed
    patients = list(patients_collection.find(
        {"status": {"$in": ["pharmacy_completed", "summary_completed", "billing_completed"]}},
        {"_id": 0}
    ))
    print(f"💰 Billing Portal: Found {len(patients)} patients")  # Debug log
    return {"patients": patients}

@app.post("/api/billing/{patient_id}/generate")
def generate_billing(patient_id: str):
    """Generate bill for patient"""
    patient = patients_collection.find_one({"patient_id": patient_id}, {"_id": 0})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Calculate costs
    try:
        from agents.billing_agent import calculate_bill
        bill = calculate_bill(patient)
    except Exception as e:
        print(f"⚠️ Billing agent failed: {e}")
        # Fallback billing calculation
        from datetime import datetime as dt
        admission_date = dt.strptime(patient["admission_date"], "%Y-%m-%d")
        days_stayed = max((dt.utcnow() - admission_date).days, 1)  # Minimum 1 day
        
        room_charges = 500 * days_stayed
        doctor_charges = 200
        prescription_cost = 150
        total = room_charges + doctor_charges + prescription_cost
        
        bill = {
            "patient_id": patient["patient_id"],
            "patient_name": patient["name"],
            "admission_date": patient["admission_date"],
            "discharge_date": dt.utcnow().strftime("%Y-%m-%d"),
            "days_stayed": days_stayed,
            "breakdown": {
                "room_charges": room_charges,
                "doctor_charges": doctor_charges,
                "prescription_cost": prescription_cost
            },
            "total_amount": total,
            "currency": "USD"
        }
    
    # Update patient with bill
    patients_collection.update_one(
        {"patient_id": patient_id},
        {"$set": {
            "status": "billing_completed",
            "bill": bill,
            "billing_completed_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }}
    )
    
    # Log billing completion
    discharge_logs_collection.insert_one({
        "patient_id": patient_id,
        "action": "billing_completed",
        "details": f"Bill generated for patient {patient_id}. Total: ${bill['total_amount']}",
        "agent": "Billing",
        "timestamp": datetime.utcnow()
    })
    
    return {"bill": bill, "patient": patient}

@app.post("/api/billing/{patient_id}/complete")
def complete_billing_and_notify(patient_id: str):
    """Complete billing and send all documents to guardian"""
    patient = patients_collection.find_one({"patient_id": patient_id}, {"_id": 0})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Get summary
    summary = patient.get("summary", f"Discharge summary for {patient['name']}")
    
    # Get prescription
    prescription = patient.get("prescription", "Prescription details not available")
    if isinstance(prescription, dict):
        prescription = str(prescription)
    
    # Get bill
    bill = patient.get("bill")
    if not bill:
        from agents.billing_agent import calculate_bill
        bill = calculate_bill(patient)
        patients_collection.update_one(
            {"patient_id": patient_id},
            {"$set": {"bill": bill}}
        )
    

    # Mark as fully completed
    patients_collection.update_one(
        {"patient_id": patient_id},
        {"$set": {
            "status": "discharge_complete",
            "discharge_completed_at": datetime.utcnow()
        }}
    )
    
    return {"success": True, "message": "Discharge completed and guardian notified", "bill": bill}

@app.get("/api/patients/{patient_id}/download-bill")
def download_bill_pdf(patient_id: str):
    """Download bill as PDF"""
    patient = patients_collection.find_one({"patient_id": patient_id}, {"_id": 0})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    bill = patient.get("bill")
    if not bill:
        from agents.billing_agent import calculate_bill
        bill = calculate_bill(patient)
    
    # Create PDF
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []
    
    title_style = ParagraphStyle('Title', parent=styles['Title'], fontSize=20, textColor=colors.HexColor('#dc2626'))
    story.append(Paragraph("INVOICE", title_style))
    story.append(Paragraph("St. Jude's Medical Center", styles['Heading2']))
    story.append(Spacer(1, 0.3*inch))
    
    # Patient & Bill Info
    info_data = [
        ["Patient Name:", patient['name']],
        ["Patient ID:", patient['patient_id']],
        ["Admission Date:", bill['admission_date']],
        ["Discharge Date:", bill['discharge_date']],
        ["Days Stayed:", f"{bill['days_stayed']} days"]
    ]
    info_table = Table(info_data)
    story.append(info_table)
    story.append(Spacer(1, 0.3*inch))
    
    # Bill breakdown
    bill_data = [
        ["Description", "Amount (₹)"],
        ["Room Charges", f"₹{bill['breakdown']['room_charges']:,.2f}"],
        ["Doctor Charges", f"₹{bill['breakdown']['doctor_charges']:,.2f}"],
        ["Nursing Charges", f"₹{bill['breakdown'].get('nursing_charges', 0):,.2f}"],
        ["Prescription Cost", f"₹{bill['breakdown']['prescription_cost']:,.2f}"],
        ["Additional Charges", f"₹{bill['breakdown'].get('additional_charges', 0):,.2f}"],
        ["Subtotal", f"₹{bill['breakdown'].get('subtotal', 0):,.2f}"],
        ["GST (18%)", f"₹{bill['breakdown'].get('gst_18_percent', 0):,.2f}"],
        ["TOTAL AMOUNT", f"₹{bill['total_amount']:,.2f}"]
    ]
    
    bill_table = Table(bill_data, colWidths=[4*inch, 2*inch])
    bill_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#fee2e2')),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    story.append(bill_table)
    
    doc.build(story)
    buffer.seek(0)
    
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=Bill_{patient_id}.pdf"
        }
    )

@app.post("/api/billing/{patient_id}/send-to-guardian")
def send_documents_to_guardian(patient_id: str):
    """Send discharge documents to guardian via email"""
    patient = patients_collection.find_one({"patient_id": patient_id}, {"_id": 0})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Get all required documents
    summary = patient.get("summary", "Summary not available")
    prescription = patient.get("prescription", "Prescription not available")
    bill = patient.get("bill")
    
    if not bill:
        from agents.billing_agent import calculate_bill
        bill = calculate_bill(patient)
        patients_collection.update_one(
            {"patient_id": patient_id},
            {"$set": {"bill": bill}}
        )
    
    # Send email with PDF
    guardian_email = patient.get("guardian_email")
    if not guardian_email:
        raise HTTPException(status_code=400, detail="Guardian email not found")
    
    try:
        from email_service import send_discharge_summary_to_guardian
        success = send_discharge_summary_to_guardian(
            guardian_email, patient, summary, prescription, bill
        )
        
        if success:
            # Update patient status
            patients_collection.update_one(
                {"patient_id": patient_id},
                {"$set": {
                    "status": "discharge_complete",
                    "guardian_notified_at": datetime.utcnow()
                }}
            )
            
            # Log the action
            discharge_logs_collection.insert_one({
                "patient_id": patient_id,
                "action": "guardian_notified",
                "details": f"Discharge documents sent to {guardian_email}",
                "agent": "System",
                "timestamp": datetime.utcnow()
            })
            
            return {"success": True, "message": "Documents sent successfully to guardian"}
        else:
            raise HTTPException(status_code=500, detail="Failed to send email")
            
    except Exception as e:
        print(f"❌ Error sending to guardian: {e}")
        raise HTTPException(status_code=500, detail=str(e))
# ==================== RUN SERVER ====================

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting MediFlow AI Backend...")
    uvicorn.run(app, host="127.0.0.1", port=8000)
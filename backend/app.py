from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from database import (
    patients_collection, 
    discharge_logs_collection, 
    init_sample_data
)
from models import Patient, PatientUpdate
from agents.discharge_agent import discharge_workflow

app = FastAPI(title="MediFlow AI", description="AI-powered hospital discharge system")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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

@app.get("/api/discharge-logs")
def get_discharge_logs():
    """Get discharge activity logs"""
    logs = list(discharge_logs_collection.find({}, {"_id": 0}).sort("timestamp", -1).limit(50))
    return {"logs": logs}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

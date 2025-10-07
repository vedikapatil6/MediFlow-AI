from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
DATABASE_NAME = "mediflow_ai"

client = MongoClient(MONGO_URL)
db = client[DATABASE_NAME]

# Collections
patients_collection = db["patients"]
discharge_logs_collection = db["discharge_logs"]

def get_database():
    return db

# Sample data initialization
def init_sample_data():
    if patients_collection.count_documents({}) == 0:
        sample_patients = [
            {
                "patient_id": "PAT001",
                "name": "John Smith",
                "age": 45,
                "diagnosis": "Acute Myocardial Infarction",
                "admission_date": "2024-09-20",
                "vital_signs": {
                    "blood_pressure": "120/80",
                    "heart_rate": 75,
                    "temperature": 98.6,
                    "respiratory_rate": 16,
                    "oxygen_saturation": 98
                },
                "treatment_status": "completed",
                "ready_for_discharge": False,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "patient_id": "PAT002",
                "name": "Emma Johnson",
                "age": 28,
                "diagnosis": "Acute Appendicitis",
                "admission_date": "2024-09-22",
                "vital_signs": {
                    "blood_pressure": "110/70",
                    "heart_rate": 80,
                    "temperature": 99.1,
                    "respiratory_rate": 18,
                    "oxygen_saturation": 99
                },
                "treatment_status": "in-progress",
                "ready_for_discharge": False,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ]
        patients_collection.insert_many(sample_patients)
        print("Sample data initialized!")

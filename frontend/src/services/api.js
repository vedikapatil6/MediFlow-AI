import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const apiService = {
  // Patients
  getPatients: () => axios.get(`${API_BASE_URL}/api/patients`),
  
  getPatient: (patientId) => axios.get(`${API_BASE_URL}/api/patients/${patientId}`),
  
  updatePatient: (patientId, data) => axios.put(`${API_BASE_URL}/api/patients/${patientId}`, data),
  
  // Discharge Detection
  runDischargeDetection: () => axios.post(`${API_BASE_URL}/api/run-discharge-detection`),
  
  // Discharge Logs
  getDischargeLog: () => axios.get(`${API_BASE_URL}/api/discharge-logs`),
  
  // Nurse Tasks
  getNurseTasks: (patientId) => axios.get(`${API_BASE_URL}/api/nurse-tasks/${patientId}`),
  
  updateNurseTasks: (patientId, data) => 
    axios.post(`${API_BASE_URL}/api/nurse-tasks/${patientId}/update`, data),
  
  addNurseTask: (patientId, item) => 
    axios.post(`${API_BASE_URL}/api/nurse-tasks/${patientId}/add`, { item }),
  
  // Summary
  getPatientSummary: (patientId) => 
    axios.get(`${API_BASE_URL}/api/patients/${patientId}/summary`),
  
  // Pharmacy (coming soon)
  getPharmacyTasks: (patientId) => 
    axios.get(`${API_BASE_URL}/api/pharmacy/${patientId}`),
  
  // Billing (coming soon)
  generateBill: (patientId) => 
    axios.post(`${API_BASE_URL}/api/billing/${patientId}/generate`)
};
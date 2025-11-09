import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Get all patients
  getPatients: () => api.get('/api/patients'),

  // Get specific patient
  getPatient: (patientId) => api.get(`/api/patients/${patientId}`),

  // Update patient
  updatePatient: (patientId, data) => api.put(`/api/patients/${patientId}`, data),

  // Run discharge detection
  runDischargeDetection: () => api.post('/api/run-discharge-detection'),

  // Get logs
  getDischargeLog: () => api.get('/api/discharge-logs'),

  // Get discharge summary (new endpoint)
  getPatientSummary: (patientId) => api.get(`/api/patients/${patientId}/summary`)
};

export default api;

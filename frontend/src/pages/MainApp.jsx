import React, { useState, useEffect } from 'react';
import { Download, Menu, X, Activity, Users, Pill, FileText, DollarSign, User, CheckCircle, AlertCircle, Plus, Trash2, RefreshCw, Mail, Send } from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://localhost:8000';

const apiService = {
  getPatients: () => fetch(`${API_BASE_URL}/api/patients`).then(r => r.json()),
  runDischargeDetection: () => fetch(`${API_BASE_URL}/api/run-discharge-detection`, { method: 'POST' }).then(r => r.json()),
  approvePatient: (patientId) => fetch(`${API_BASE_URL}/api/patients/${patientId}/approve`, { method: 'POST' }).then(r => r.json()),
  getNurseTasks: (patientId) => fetch(`${API_BASE_URL}/api/nurse-tasks/${patientId}`).then(r => r.json()),
  updateNurseTasks: (patientId, data) => fetch(`${API_BASE_URL}/api/nurse-tasks/${patientId}/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  addNurseTask: (patientId, item) => fetch(`${API_BASE_URL}/api/nurse-tasks/${patientId}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item })
  }).then(r => r.json()),
  getPharmacyPatients: () => fetch(`${API_BASE_URL}/api/pharmacy`).then(r => r.json()),
  getPharmacyPrescription: (patientId) => fetch(`${API_BASE_URL}/api/pharmacy/${patientId}`).then(r => r.json()),
  completePharmacy: (patientId, prescription) => fetch(`${API_BASE_URL}/api/pharmacy/${patientId}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prescription })
  }).then(r => r.json()),
  getBillingPatients: () => fetch(`${API_BASE_URL}/api/billing`).then(r => r.json()),
  generateBill: (patientId) => fetch(`${API_BASE_URL}/api/billing/${patientId}/generate`, { method: 'POST' }).then(r => r.json()),
  sendToGuardian: (patientId) => fetch(`${API_BASE_URL}/api/billing/${patientId}/send-to-guardian`, { method: 'POST' }).then(r => r.json()),
  getSummaryPatients: () => fetch(`${API_BASE_URL}/api/summary`).then(r => r.json()),
  getPatientSummary: (patientId) => fetch(`${API_BASE_URL}/api/patients/${patientId}/summary`).then(r => r.json()),
  downloadPDF: (patientId, type) => `${API_BASE_URL}/api/patients/${patientId}/download-${type}`
};

// Auth Component
const AuthPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
            <Activity className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">MediFlow AI</h1>
          <p className="text-gray-600">Hospital Discharge Management</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

// Main Dashboard
const MainDashboard = ({ onNavigate }) => {
  const portals = [
    { name: 'Doctor Portal', icon: User, path: 'doctor', color: 'bg-blue-500', desc: 'Discharge readiness evaluation' },
    { name: 'Nurse Portal', icon: Activity, path: 'nurse', color: 'bg-green-500', desc: 'Task management & patient care' },
    { name: 'Pharmacy Portal', icon: Pill, path: 'pharmacy', color: 'bg-amber-500', desc: 'Prescription management' },
    { name: 'Billing Portal', icon: DollarSign, path: 'billing', color: 'bg-red-500', desc: 'Generate invoices & notify guardian' },
    { name: 'Summary Portal', icon: FileText, path: 'summary', color: 'bg-purple-500', desc: 'Discharge summaries' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-16 h-16" />
                <h1 className="text-5xl font-bold">St. Jude's Medical</h1>
              </div>
              <h2 className="text-3xl font-semibold mb-4">AI-Powered Discharge Management</h2>
              <p className="text-lg mb-6 opacity-90">
                Streamline your discharge workflow with intelligent automation.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">About Our Hospital</h3>
              <p className="mb-4">With over 50 years of excellence in healthcare.</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold">500+</div>
                  <div className="text-sm">Beds</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold">200+</div>
                  <div className="text-sm">Doctors</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold">24/7</div>
                  <div className="text-sm">Emergency</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Select Your Portal</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portals.map((portal, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate(portal.path)}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer"
            >
              <div className={`${portal.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <portal.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">{portal.name}</h3>
              <p className="text-gray-600 text-center text-sm">{portal.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Doctor Portal
const DoctorPortal = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await apiService.getPatients();
      setPatients(response.patients || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRunDetection = async () => {
    setLoading(true);
    try {
      await apiService.runDischargeDetection();
      await fetchPatients();
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleApprove = async () => {
    try {
      await apiService.approvePatient(selectedPatient.patient_id);
      await fetchPatients();
      setSelectedPatient(null);
      alert('Patient approved! Nurse has been notified via email.');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const readyCount = patients.filter(p => p.ready_for_discharge).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2">Doctor Portal</h1>
      <p className="text-gray-600 mb-6">Review and approve patients for discharge</p>

      <div className="flex gap-3 mb-6">
        <button
          onClick={handleRunDetection}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
          {loading ? 'Running...' : 'Run Discharge Detection'}
        </button>
        <button onClick={fetchPatients} className="border border-gray-300 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="text-gray-600 mb-2">Total Patients</div>
          <div className="text-4xl font-bold">{patients.length}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="text-gray-600 mb-2">Ready for Discharge</div>
          <div className="text-4xl font-bold text-blue-600">{readyCount}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="text-gray-600 mb-2">In Treatment</div>
          <div className="text-4xl font-bold text-amber-500">{patients.length - readyCount}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Age</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Diagnosis</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {patients.map(patient => (
              <tr key={patient.patient_id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={patient.photo_url} alt={patient.name} className="w-10 h-10 rounded-full" />
                    <span className="font-semibold">{patient.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">{patient.patient_id}</td>
                <td className="px-6 py-4 text-sm">{patient.age}</td>
                <td className="px-6 py-4 text-sm">{patient.diagnosis}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    patient.ready_for_discharge ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {patient.ready_for_discharge ? 'Ready' : 'In Progress'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {patient.ready_for_discharge && patient.status !== 'doctor_approved' && (
                    <button
                      onClick={() => setSelectedPatient(patient)}
                      className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-700"
                    >
                      Review
                    </button>
                  )}
                  {patient.status === 'doctor_approved' && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
                      <CheckCircle className="w-3 h-3" /> Approved
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedPatient(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Discharge Approval</h2>
            <div className="flex items-center gap-4 mb-6">
              <img src={selectedPatient.photo_url} alt={selectedPatient.name} className="w-16 h-16 rounded-full" />
              <div>
                <h3 className="text-xl font-bold">{selectedPatient.name}</h3>
                <p className="text-gray-600">{selectedPatient.diagnosis}</p>
                <p className="text-sm text-gray-500">ID: {selectedPatient.patient_id}</p>
              </div>
            </div>
            <div className="border-t pt-4 mb-4">
              <h4 className="font-semibold mb-2">Vital Signs:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>BP: {selectedPatient.vital_signs.blood_pressure}</div>
                <div>HR: {selectedPatient.vital_signs.heart_rate} bpm</div>
                <div>Temp: {selectedPatient.vital_signs.temperature}°F</div>
                <div>O2: {selectedPatient.vital_signs.oxygen_saturation}%</div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">AI has determined this patient is ready for discharge. Do you approve?</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSelectedPatient(null)} className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-100">
                No, Cancel
              </button>
              <button onClick={handleApprove} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Yes, Approve Discharge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Nurse Portal
const NursePortal = () => {
  const [approvedPatients, setApprovedPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [checklist, setChecklist] = useState([]);
  const [checked, setChecked] = useState({});
  const [note, setNote] = useState('');
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchApprovedPatients();
  }, []);

  const fetchApprovedPatients = async () => {
    try {
      const response = await apiService.getPatients();
      const approved = response.patients.filter(p => p.status === 'doctor_approved');
      setApprovedPatients(approved);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSelectPatient = async (patient) => {
    setSelectedPatient(patient);
    try {
      const tasks = await apiService.getNurseTasks(patient.patient_id);
      setChecklist(tasks.tasks || []);
      setChecked({});
      setNote('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddTask = async () => {
    if (newTask.trim()) {
      try {
        await apiService.addNurseTask(selectedPatient.patient_id, newTask);
        setChecklist([...checklist, newTask]);
        setNewTask('');
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleDeleteTask = (index) => {
    setChecklist(checklist.filter((_, i) => i !== index));
    const newChecked = { ...checked };
    delete newChecked[index];
    setChecked(newChecked);
  };

  const handleSubmit = async () => {
    try {
      await apiService.updateNurseTasks(selectedPatient.patient_id, { checklist, checked, note });
      await fetchApprovedPatients();
      setSelectedPatient(null);
      alert('Tasks completed and submitted to Pharmacy!');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const allChecked = checklist.length > 0 && Object.keys(checked).length === checklist.length && Object.values(checked).every(v => v);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2">Nurse Portal</h1>
      <p className="text-gray-600 mb-6">Complete discharge checklist</p>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-bold mb-4">Approved Patients</h2>
          <div className="space-y-2">
            {approvedPatients.map(patient => (
              <div
                key={patient.patient_id}
                onClick={() => handleSelectPatient(patient)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedPatient?.patient_id === patient.patient_id ? 'bg-blue-50 border border-blue-200' : ''
                }`}
              >
                <img src={patient.photo_url} alt={patient.name} className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <div className="font-semibold">{patient.name}</div>
                  <div className="text-sm text-gray-600">{patient.diagnosis}</div>
                </div>
              </div>
            ))}
            {approvedPatients.length === 0 && (
              <div className="text-center text-gray-500 py-8">No patients ready</div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedPatient ? (
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center gap-4 mb-6">
                <img src={selectedPatient.photo_url} alt={selectedPatient.name} className="w-16 h-16 rounded-full" />
                <div>
                  <h2 className="text-2xl font-bold">{selectedPatient.name}</h2>
                  <p className="text-gray-600">{selectedPatient.diagnosis}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-bold mb-4">Discharge Checklist</h3>
                
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Add new task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button onClick={handleAddTask} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>

                <div className="space-y-2 mb-6">
                  {checklist.map((task, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        checked={checked[idx] || false}
                        onChange={(e) => setChecked({ ...checked, [idx]: e.target.checked })}
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <span className={`flex-1 ${checked[idx] ? 'line-through text-gray-400' : ''}`}>{task}</span>
                      <button onClick={() => handleDeleteTask(idx)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <textarea
                  placeholder="Handover notes..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                />

                <button
                  onClick={handleSubmit}
                  disabled={!allChecked}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {allChecked ? 'Complete & Submit to Pharmacy' : 'Complete all tasks to proceed'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl text-gray-600">Select a patient</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Pharmacy Portal
const PharmacyPortal = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescription, setPrescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await apiService.getPharmacyPatients();
      setPatients(response.patients || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSelectPatient = async (patient) => {
    setSelectedPatient(patient);
    setLoading(true);
    try {
      const data = await apiService.getPharmacyPrescription(patient.patient_id);
      setPrescription(typeof data.prescription === 'string' ? data.prescription : JSON.stringify(data.prescription, null, 2));
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleComplete = async () => {
    try {
      await apiService.completePharmacy(selectedPatient.patient_id, prescription);
      await fetchPatients();
      setSelectedPatient(null);
      alert('Prescription completed and sent to Summary Portal!');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDownloadPDF = () => {
    window.open(apiService.downloadPDF(selectedPatient.patient_id, 'prescription'), '_blank');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2">Pharmacy Portal</h1>
      <p className="text-gray-600 mb-6">Generate prescriptions</p>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-bold mb-4">Nurse Completed</h2>
          <div className="space-y-2">
            {patients.map(patient => (
              <div
                key={patient.patient_id}
                onClick={() => handleSelectPatient(patient)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedPatient?.patient_id === patient.patient_id ? 'bg-amber-50 border border-amber-200' : ''
                }`}
              >
                <img src={patient.photo_url} alt={patient.name} className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <div className="font-semibold">{patient.name}</div>
                  <div className="text-sm text-gray-600">{patient.diagnosis}</div>
                </div>
              </div>
            ))}
            {patients.length === 0 && (
              <div className="text-center text-gray-500 py-8">No patients ready</div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedPatient ? (
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img src={selectedPatient.photo_url} alt={selectedPatient.name} className="w-16 h-16 rounded-full" />
                  <div>
                    <h2 className="text-2xl font-bold">{selectedPatient.name}</h2>
                    <p className="text-gray-600">{selectedPatient.diagnosis}</p>
                  </div>
                </div>
                {!loading && prescription && (
                  <button
                    onClick={handleDownloadPDF}
                    className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                )}
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-600 mb-2" />
                  <p>Generating prescription...</p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-bold mb-4">Prescription</h3>
                  <textarea
                    value={prescription}
                    onChange={(e) => setPrescription(e.target.value)}
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm mb-4"
                  />
                  <button
                    onClick={handleComplete}
                    className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700"
                  >
                    Complete & Send to Summary
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow p-12 text-center">
              <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl text-gray-600">Select a patient</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Summary Portal
const SummaryPortal = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await apiService.getSummaryPatients();
      setPatients(response.patients || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSelectPatient = async (patient) => {
    setSelectedPatient(patient);
    setLoading(true);
    try {
      const data = await apiService.getPatientSummary(patient.patient_id);
      setSummary(data.summary || '');
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleDownloadPDF = () => {
    window.open(apiService.downloadPDF(selectedPatient.patient_id, 'summary'), '_blank');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2">Summary Portal</h1>
      <p className="text-gray-600 mb-6">View and download discharge summaries</p>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-bold mb-4">Pharmacy Completed</h2>
          <div className="space-y-2">
            {patients.map(patient => (
              <div
                key={patient.patient_id}
                onClick={() => handleSelectPatient(patient)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedPatient?.patient_id === patient.patient_id ? 'bg-purple-50 border border-purple-200' : ''
                }`}
              >
                <img src={patient.photo_url} alt={patient.name} className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <div className="font-semibold">{patient.name}</div>
                  <div className="text-sm text-gray-600">{patient.diagnosis}</div>
                </div>
              </div>
            ))}
            {patients.length === 0 && (
              <div className="text-center text-gray-500 py-8">No patients ready</div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedPatient ? (
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img src={selectedPatient.photo_url} alt={selectedPatient.name} className="w-16 h-16 rounded-full" />
                  <div>
                    <h2 className="text-2xl font-bold">{selectedPatient.name}</h2>
                    <p className="text-gray-600">{selectedPatient.diagnosis}</p>
                  </div>
                </div>
                {!loading && summary && (
                  <button
                    onClick={handleDownloadPDF}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                )}
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-600 mb-2" />
                  <p>Generating summary...</p>
                </div>
              ) : (
                <div className="border-t pt-6">
                  <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap font-mono text-sm">
                    {summary}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl text-gray-600">Select a patient</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Billing Portal
const BillingPortal = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await apiService.getBillingPatients();
      setPatients(response.patients || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSelectPatient = async (patient) => {
    setSelectedPatient(patient);
    setLoading(true);
    try {
      const data = await apiService.generateBill(patient.patient_id);
      setBill(data.bill);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleDownloadPDF = (type) => {
    window.open(apiService.downloadPDF(selectedPatient.patient_id, type), '_blank');
  };

  const handleSendToGuardian = async () => {
    if (!selectedPatient.guardian_email) {
      alert('No guardian email found for this patient!');
      return;
    }

    if (!window.confirm(`Send discharge documents to ${selectedPatient.guardian_email}?`)) {
      return;
    }

    setSending(true);
    try {
      const response = await apiService.sendToGuardian(selectedPatient.patient_id);
      if (response.success) {
        alert(`Discharge documents sent successfully to ${selectedPatient.guardian_email}!`);
        await fetchPatients();
        setSelectedPatient(null);
      }
    } catch (error) {
      alert('Failed to send email: ' + error.message);
      console.error('Error:', error);
    }
    setSending(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2">Billing Portal</h1>
      <p className="text-gray-600 mb-6">Generate invoices and notify guardian</p>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-bold mb-4">Ready for Billing</h2>
          <div className="space-y-2">
            {patients.map(patient => (
              <div
                key={patient.patient_id}
                onClick={() => handleSelectPatient(patient)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedPatient?.patient_id === patient.patient_id ? 'bg-red-50 border border-red-200' : ''
                }`}
              >
                <img src={patient.photo_url} alt={patient.name} className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <div className="font-semibold">{patient.name}</div>
                  <div className="text-sm text-gray-600">{patient.diagnosis}</div>
                </div>
              </div>
            ))}
            {patients.length === 0 && (
              <div className="text-center text-gray-500 py-8">No patients ready</div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedPatient ? (
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img src={selectedPatient.photo_url} alt={selectedPatient.name} className="w-16 h-16 rounded-full" />
                  <div>
                    <h2 className="text-2xl font-bold">{selectedPatient.name}</h2>
                    <p className="text-gray-600">{selectedPatient.diagnosis}</p>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-red-600 mb-2" />
                  <p>Generating bill...</p>
                </div>
              ) : bill ? (
                <div className="border-t pt-6">
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="text-xl font-bold mb-4">Invoice Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Admission Date:</span>
                        <span className="font-semibold">{bill.admission_date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discharge Date:</span>
                        <span className="font-semibold">{bill.discharge_date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Days Stayed:</span>
                        <span className="font-semibold">{bill.days_stayed} days</span>
                      </div>
                      <div className="border-t pt-3 mt-3">
                        <h4 className="font-bold mb-2">Charges Breakdown:</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Room Charges:</span>
                            <span className="font-semibold">₹{bill.breakdown.room_charges.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Doctor Charges:</span>
                            <span className="font-semibold">₹{bill.breakdown.doctor_charges.toLocaleString('en-IN')}</span>
                          </div>
                          {bill.breakdown.nursing_charges && (
                            <div className="flex justify-between">
                              <span>Nursing Charges:</span>
                              <span className="font-semibold">₹{bill.breakdown.nursing_charges.toLocaleString('en-IN')}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Prescription Cost:</span>
                            <span className="font-semibold">₹{bill.breakdown.prescription_cost.toLocaleString('en-IN')}</span>
                          </div>
                          {bill.breakdown.additional_charges > 0 && (
                            <div className="flex justify-between">
                              <span>Additional Charges:</span>
                              <span className="font-semibold">₹{bill.breakdown.additional_charges.toLocaleString('en-IN')}</span>
                            </div>
                          )}
                          {bill.breakdown.subtotal && (
                            <div className="flex justify-between border-t pt-2">
                              <span>Subtotal:</span>
                              <span className="font-semibold">₹{bill.breakdown.subtotal.toLocaleString('en-IN')}</span>
                            </div>
                          )}
                          {bill.breakdown.gst_18_percent && (
                            <div className="flex justify-between">
                              <span>GST (18%):</span>
                              <span className="font-semibold">₹{bill.breakdown.gst_18_percent.toLocaleString('en-IN')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between text-xl">
                          <span className="font-bold">TOTAL AMOUNT:</span>
                          <span className="font-bold text-red-600">₹{bill.total_amount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Download PDFs Section */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <button
                      onClick={() => handleDownloadPDF('summary')}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Summary PDF
                    </button>
                    <button
                      onClick={() => handleDownloadPDF('prescription')}
                      className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 flex items-center justify-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Prescription PDF
                    </button>
                    <button
                      onClick={() => handleDownloadPDF('bill')}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Bill PDF
                    </button>
                  </div>

                  {/* Send to Guardian Button */}
                  <button
                    onClick={handleSendToGuardian}
                    disabled={sending}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {sending ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Sending Email...
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5" />
                        📧 Send All Documents to Guardian
                      </>
                    )}
                  </button>
                  <p className="text-sm text-gray-600 text-center mt-2">
                    Guardian Email: <span className="font-semibold">{selectedPatient.guardian_email || 'Not available'}</span>
                  </p>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow p-12 text-center">
              <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl text-gray-600">Select a patient to generate bill</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <AuthPage onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'home': return <MainDashboard onNavigate={setCurrentView} />;
      case 'doctor': return <DoctorPortal />;
      case 'nurse': return <NursePortal />;
      case 'pharmacy': return <PharmacyPortal />;
      case 'billing': return <BillingPortal />;
      case 'summary': return <SummaryPortal />;
      default: return <MainDashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 flex-1 ml-4">
              <Activity className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">MediFlow AI</span>
            </div>
            <button
              onClick={() => { setIsAuthenticated(false); setCurrentView('home'); }}
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-2xl">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold">Navigation</h2>
              <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              {[
                { label: 'Home', value: 'home', icon: Activity },
                { label: 'Doctor Portal', value: 'doctor', icon: User },
                { label: 'Nurse Portal', value: 'nurse', icon: Activity },
                { label: 'Pharmacy Portal', value: 'pharmacy', icon: Pill },
                { label: 'Billing Portal', value: 'billing', icon: DollarSign },
                { label: 'Summary Portal', value: 'summary', icon: FileText }
              ].map(item => (
                <button
                  key={item.value}
                  onClick={() => { setCurrentView(item.value); setSidebarOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 rounded-lg mb-1"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {renderView()}
    </div>
  );
};

export default App;
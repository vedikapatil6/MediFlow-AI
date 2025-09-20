import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const patientQueue = [
    { id: 1, name: 'Sarah Johnson', condition: 'Post-Surgery Recovery', room: 'A-301', priority: 'high', readiness: 95 },
    { id: 2, name: 'Michael Chen', condition: 'Cardiac Monitoring', room: 'CCU-102', priority: 'medium', readiness: 78 },
    { id: 3, name: 'Emily Davis', condition: 'Pneumonia Treatment', room: 'B-205', priority: 'low', readiness: 45 },
  ];

  const recentActivity = [
    { time: '10:30 AM', action: 'Approved discharge for John Smith', type: 'approved' },
    { time: '09:45 AM', action: 'Requested additional tests for Maria Garcia', type: 'pending' },
    { time: '08:15 AM', action: 'Updated treatment plan for Robert Wilson', type: 'updated' },
  ];

  return (
    <DashboardLayout 
      title="Doctor Portal" 
      subtitle="Patient Care & Discharge Management"
      userRole="Dr. Sarah Williams"
      bgGradient="from-red-50 to-red-100"
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Patients</p>
              <p className="text-3xl font-bold text-gray-800">24</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ready for Discharge</p>
              <p className="text-3xl font-bold text-green-600">8</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Review</p>
              <p className="text-3xl font-bold text-orange-600">5</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏰</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Critical Cases</p>
              <p className="text-3xl font-bold text-red-600">2</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🚨</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Patient Queue */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Discharge Queue</h3>
            <div className="space-y-4">
              {patientQueue.map((patient) => (
                <div key={patient.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-800">{patient.name}</h4>
                      <p className="text-sm text-gray-500">{patient.condition}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        patient.priority === 'high' ? 'bg-red-100 text-red-800' :
                        patient.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {patient.priority}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">Room {patient.room}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">Readiness Score</span>
                        <span className="text-xs font-medium">{patient.readiness}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            patient.readiness >= 80 ? 'bg-green-500' :
                            patient.readiness >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${patient.readiness}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">
                        Review
                      </button>
                      {patient.readiness >= 80 && (
                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">
                          Approve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    activity.type === 'approved' ? 'bg-green-500' :
                    activity.type === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
            <h4 className="font-bold mb-2">AI Assistant</h4>
            <p className="text-sm mb-4 opacity-90">Get AI-powered insights for patient care decisions</p>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
              Ask AI Assistant
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;

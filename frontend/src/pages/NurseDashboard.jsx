import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const NurseDashboard = () => {
  const [tasks] = useState([
    { id: 1, patient: 'John Smith', task: 'Pre-discharge medication review', priority: 'high', time: '10:30 AM' },
    { id: 2, patient: 'Maria Garcia', task: 'Vital signs check', priority: 'medium', time: '11:00 AM' },
    { id: 3, patient: 'Robert Chen', task: 'Discharge education', priority: 'high', time: '11:30 AM' },
  ]);

  return (
    <DashboardLayout 
      title="Nurse Station" 
      subtitle="Patient Care & Monitoring"
      userRole="Nurse Jennifer Martinez"
      bgGradient="from-emerald-50 to-emerald-100"
    >
      {/* Task Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Pending Tasks</h3>
            <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              ⏰
            </span>
          </div>
          <p className="text-3xl font-bold text-orange-600">12</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Completed Today</h3>
            <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              ✅
            </span>
          </div>
          <p className="text-3xl font-bold text-green-600">28</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Critical Alerts</h3>
            <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              🚨
            </span>
          </div>
          <p className="text-3xl font-bold text-red-600">2</p>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Today's Tasks</h3>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <input type="checkbox" className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-gray-800">{task.task}</p>
                  <p className="text-sm text-gray-500">Patient: {task.patient} • {task.time}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                task.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NurseDashboard;

import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'doctor',
      title: 'Doctor Portal',
      description: 'Access patient records, manage discharge orders, and coordinate with the medical team for efficient patient care.',
      icon: '👨‍⚕️',
      color: 'from-red-400 to-red-600',
      buttonColor: 'bg-red-500 hover:bg-red-600',
      path: '/doctor-dashboard'
    },
    {
      id: 'nurse',
      title: 'Nurse Station',
      description: 'Monitor patient vitals, update care plans, and ensure all discharge preparations are completed safely.',
      icon: '👩‍⚕️',
      color: 'from-emerald-400 to-emerald-600',
      buttonColor: 'bg-emerald-500 hover:bg-emerald-600',
      path: '/nurse-dashboard'
    },
    {
      id: 'reception',
      title: 'Reception Desk',
      description: 'Handle patient admissions, manage appointments, and coordinate discharge paperwork and billing processes.',
      icon: '🏢',
      color: 'from-amber-400 to-orange-500',
      buttonColor: 'bg-orange-500 hover:bg-orange-600',
      path: '/reception-dashboard'
    },
    {
      id: 'pharmacy',
      title: 'Pharmacy Portal',
      description: 'Process discharge prescriptions, verify medication orders, and ensure proper medication counseling.',
      icon: '💊',
      color: 'from-purple-400 to-purple-600',
      buttonColor: 'bg-purple-500 hover:bg-purple-600',
      path: '/pharmacy-dashboard'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 to-slate-900 rounded-b-[3rem] mx-4 mt-4 mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative px-8 py-12 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              City Hospital
            </h1>
            <p className="text-xl text-blue-200 mb-2">ADVANCED HEALTHCARE MANAGEMENT SYSTEM</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Discharge Management Dashboard
            </h2>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto mb-8">
              Streamline your hospital discharge process with our AI-powered management system. 
              Select your role below to access your personalized dashboard and tools.
            </p>
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-medium">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI-POWERED DISCHARGE OPTIMIZATION
            </div>
          </div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {roles.map((role) => (
              <div key={role.id} className="group">
                <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                  <div className={`h-32 bg-gradient-to-br ${role.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative flex items-center justify-center h-full">
                      <span className="text-4xl">{role.icon}</span>
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/20 rounded-full"></div>
                    <div className="absolute -top-6 -left-6 w-24 h-24 bg-white/20 rounded-full"></div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                      {role.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                      {role.description}
                    </p>
                    <button 
                      onClick={() => navigate(role.path)}
                      className={`w-full ${role.buttonColor} text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg`}
                    >
                      ACCESS {role.title.split(' ')[0].toUpperCase()}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-12 bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-2">98%</div>
                <div className="text-blue-200 text-sm">Efficiency Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">2.5hr</div>
                <div className="text-blue-200 text-sm">Avg Discharge Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">1,250+</div>
                <div className="text-blue-200 text-sm">Patients Served</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-blue-200 text-sm">AI Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children, title, subtitle, userRole, bgGradient = "from-gray-50 to-gray-100" }) => {
  const navigate = useNavigate();

  const navigationItems = [
    { name: 'Dashboard', icon: '📊', active: true },
    { name: 'Patients', icon: '👥', active: false },
    { name: 'Schedule', icon: '📅', active: false },
    { name: 'Reports', icon: '📈', active: false },
    { name: 'Settings', icon: '⚙️', active: false },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient}`}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm">Back to Home</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                <p className="text-sm text-gray-500">{subtitle}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {userRole?.split(' ').map(n => n[0]).join('') || 'U'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{userRole}</p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
              
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 2L2 12v10h20V12L12 2z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm h-screen sticky top-0">
          <div className="p-6">
            <nav className="space-y-2">
              {navigationItems.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    item.active 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </a>
              ))}
            </nav>

            <div className="mt-8 p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white">
              <h4 className="font-semibold mb-2">Need Help?</h4>
              <p className="text-sm opacity-90 mb-3">Contact our support team for assistance</p>
              <button className="bg-white text-indigo-600 px-3 py-2 rounded-lg text-sm font-medium w-full">
                Get Support
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

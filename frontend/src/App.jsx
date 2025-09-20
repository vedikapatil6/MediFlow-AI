import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DoctorDashboard from './pages/DoctorDashboard';
import NurseDashboard from './pages/NurseDashboard';
// Import other dashboards as you create them

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/nurse-dashboard" element={<NurseDashboard />} />
        {/* Add other routes */}
      </Routes>
    </Router>
  );
}

export default App;

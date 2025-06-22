import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/app.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import Search from './pages/Search';
import Register from './pages/Register';
import Login from './pages/Login';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import ReceivedInterests from './pages/ReceivedInterests';
import UpgradePlan from './components/UpgradePlan';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFail from './pages/PaymentFail';
import MutualMatches from './pages/MutualMatches';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function AppWrapper() {
  const location = useLocation();
  const isPublicRoute = [
    '/', '/login', '/register', '/search'
  ].includes(location.pathname);

  return (
    <>
      {isPublicRoute && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/footer" element={<Footer />} />
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/received-interests" element={<ProtectedRoute><ReceivedInterests /></ProtectedRoute>} />
        <Route path="/mutual-matches" element={<MutualMatches />} />

        <Route path="/upgrade" element={<ProtectedRoute><UpgradePlan /></ProtectedRoute>} />
        {/* Payment Result */}
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-fail" element={<PaymentFail />} />

        {/* 404 fallback removed */}
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;

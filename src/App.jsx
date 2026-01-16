import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import TermsAndPolicy from './pages/TermsAndPolicy'
import RefundPolicy from './pages/RefundPolicy'
import Participants from './pages/Participants'
import Login from './pages/Login'
import Rules from './pages/Rules'
import Winners from './pages/Winners'
import Profile from './pages/Profile'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import OrganizerRegister from './pages/OrganizerRegister'
import CreateGiveaway from './pages/CreateGiveaway'
import OrganizerDashboard from './pages/OrganizerDashboard'
import NotFound from './pages/NotFound'
import GiveawayEntryForm from './pages/GiveawayEntryForm';
import PrivilegePage from './pages/PrivilegePage';
import AllUserEntries from './pages/AllUserEntries';
import { AdminRoute } from './context/AuthContext';
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { AuthProvider, ProtectedRoute } from './context/AuthContext'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/terms-and-policy" element={<TermsAndPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/participants" element={
            <ProtectedRoute>
              <Participants />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/winners" element={<Winners />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/organizer-register" element={<OrganizerRegister />} />
          <Route path="/create-giveaway" element={
            <ProtectedRoute>
              <CreateGiveaway />
            </ProtectedRoute>
          } />
          <Route path="/organizer-dashboard" element={
            <ProtectedRoute>
              <OrganizerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/enter-giveaway/:giveawayId" element={
            <ProtectedRoute>
              <GiveawayEntryForm />
            </ProtectedRoute>
          } />
          <Route path="/abhaya/privilege" element={
            <ProtectedRoute>
              <PrivilegePage />
            </ProtectedRoute>
          } />
          <Route path="/abhaya/privilege/:id" element={
            <ProtectedRoute>
              <PrivilegePage />
            </ProtectedRoute>
          } />
          <Route path="/abhaya/privilege/all" element={
            <AdminRoute>
              <AllUserEntries />
            </AdminRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  )
}

export default App

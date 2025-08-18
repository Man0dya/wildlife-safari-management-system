import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './components/Home'
import Awareness from './components/Awareness'
import SafariPackages from './components/SafariPackages'
import TravelPackagesPage from './pages/TravelPackagesPage'
import PackageDetailPage from './pages/PackageDetailPage'
import ContactUsPage from './pages/ContactUsPage'
import AboutUsPage from './pages/AboutUsPage'
import UserAccountPage from './pages/UserAccountPage'
import AdminPage from './pages/AdminPage'
import BookingPage from './pages/BookingPage'
import BookingSuccessPage from './pages/BookingSuccessPage'
import BookingCancelledPage from './pages/BookingCancelledPage'
import DriverDashboard from './pages/DriverDashboard'
import TourGuideDashboard from './pages/TourGuideDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import ProtectedStaffRoute from './components/ProtectedStaffRoute'
import './App.css'

function MainPage() {
  return (
    <div className="App">
      <Header />
      <Home />
      <Awareness />
      <SafariPackages />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/travel-packages" element={<TravelPackagesPage />} />
          <Route path="/package/:packageId" element={<PackageDetailPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/account" element={
            <ProtectedRoute>
              <UserAccountPage />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <AdminPage />
            </ProtectedAdminRoute>
          } />
          <Route path="/booking/:packageId" element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          } />
          <Route path="/booking-success" element={<BookingSuccessPage />} />
          <Route path="/booking-cancelled" element={<BookingCancelledPage />} />
          <Route path="/driver-dashboard" element={
            <ProtectedStaffRoute allowedRoles={['driver']}>
              <DriverDashboard />
            </ProtectedStaffRoute>
          } />
          <Route path="/tour-guide-dashboard" element={
            <ProtectedStaffRoute allowedRoles={['tour_guide']}>
              <TourGuideDashboard />
            </ProtectedStaffRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

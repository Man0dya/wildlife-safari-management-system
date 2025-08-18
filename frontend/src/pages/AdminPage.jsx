import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { packageApi, userApi, staffApi, safariRequestApi, bookingApi, reviewApi } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AddPackageModal from '../components/AddPackageModal';
import EditPackageModal from '../components/EditPackageModal';
import AddStaffModal from '../components/AddStaffModal';
import EditStaffModal from '../components/EditStaffModal';
import ContactMessages from '../components/ContactMessages';
import Attendance from '../components/Attendance';
import Payroll from '../components/Payroll';

const AdminPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [packages, setPackages] = useState([]);
  const [users, setUsers] = useState([]);
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [showEditPackage, setShowEditPackage] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [staff, setStaff] = useState([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [safariRequests, setSafariRequests] = useState([]);
  const [safariRequestsLoading, setSafariRequestsLoading] = useState(false);
  const [safariRequestStats, setSafariRequestStats] = useState(null);
  const [showSafariRequestModal, setShowSafariRequestModal] = useState(false);
  const [selectedSafariRequest, setSelectedSafariRequest] = useState(null);
  const [showEditStaff, setShowEditStaff] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Load data when tabs are selected
  useEffect(() => {
    if (activeTab === 'packages') {
      loadPackages();
    } else if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'staff') {
      loadStaff();
    } else if (activeTab === 'safari-requests') {
      loadSafariRequests();
    } else if (activeTab === 'bookings') {
      loadBookings();
    } else if (activeTab === 'reviews') {
      loadReviews();
    }
  }, [activeTab]);

  // Load initial data for dashboard
  useEffect(() => {
    loadUsers();
    loadStaff();
    loadBookings();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const packagesData = await packageApi.getAllPackages();
      setPackages(packagesData);
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePackageAdded = () => {
    loadPackages();
  };

  const handlePackageUpdated = () => {
    loadPackages();
  };

  const handleEditPackage = (pkg) => {
    setSelectedPackage(pkg);
    setShowEditPackage(true);
  };

  const handleDeletePackage = async (packageId) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await packageApi.deletePackage(packageId);
        loadPackages();
      } catch (error) {
        console.error('Error deleting package:', error);
        alert('Failed to delete package');
      }
    }
  };



  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const usersData = await userApi.getAllUsers();
      // Filter out admin users, show only customers (normal users)
      const customersOnly = usersData.filter(user => user.role === 'user');
      setUsers(customersOnly);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await userApi.deleteUser(userId);
        loadUsers();
        alert('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const loadStaff = async () => {
    setStaffLoading(true);
    try {
      const staffData = await staffApi.getAllStaff();
      setStaff(staffData);
    } catch (error) {
      console.error('Error loading staff:', error);
    } finally {
      setStaffLoading(false);
    }
  };

  const handleStaffAdded = () => {
    loadStaff();
  };

  const handleEditStaff = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowEditStaff(true);
  };

  const handleStaffUpdated = () => {
    loadStaff();
  };

  const handleDeleteStaff = async (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member? This action cannot be undone.')) {
      try {
        await staffApi.deleteStaff(staffId);
        loadStaff();
        alert('Staff member deleted successfully');
      } catch (error) {
        console.error('Error deleting staff:', error);
        alert(error.response?.data?.message || 'Failed to delete staff member');
      }
    }
  };



  const loadSafariRequests = async () => {
    setSafariRequestsLoading(true);
    try {
      const [requestsData, statsData] = await Promise.all([
        safariRequestApi.getAllSafariRequests(),
        safariRequestApi.getSafariRequestStats()
      ]);
      setSafariRequests(requestsData);
      setSafariRequestStats(statsData);
    } catch (error) {
      console.error('Error loading safari requests:', error);
    } finally {
      setSafariRequestsLoading(false);
    }
  };

  const handleViewSafariRequest = (request) => {
    setSelectedSafariRequest(request);
    setShowSafariRequestModal(true);
  };

  const handleApproveSafariRequest = async (requestId) => {
    try {
      await safariRequestApi.updateSafariRequestStatus(requestId, {
        status: 'approved',
        adminNotes: selectedSafariRequest.adminNotes || 'Request approved by admin'
      });
      
      // Update the local state
      setSafariRequests(prev => prev.map(req => 
        req._id === requestId 
          ? { ...req, status: 'approved' }
          : req
      ));
      
      // Update the selected request
      setSelectedSafariRequest(prev => ({ ...prev, status: 'approved' }));
      
      alert('Safari request approved successfully!');
    } catch (error) {
      console.error('Error approving safari request:', error);
      alert('Failed to approve safari request');
    }
  };

  const handleCloseSafariRequestModal = () => {
    setShowSafariRequestModal(false);
    setSelectedSafariRequest(null);
  };

  const handleDeleteSafariRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this safari request? This action cannot be undone.')) {
      try {
        await safariRequestApi.deleteSafariRequest(requestId);
        loadSafariRequests();
        alert('Safari request deleted successfully');
      } catch (error) {
        console.error('Error deleting safari request:', error);
        alert('Failed to delete safari request');
      }
    }
  };

  const loadBookings = async () => {
    setBookingsLoading(true);
    try {
      const bookingsData = await bookingApi.getAllBookings();
      console.log('Bookings API response:', bookingsData);
      
      // Note: getAllBookings returns { success: true, bookings: [...] }
      // while other APIs like getAllUsers return the array directly
      if (Array.isArray(bookingsData)) {
        setBookings(bookingsData);
      } else if (bookingsData && Array.isArray(bookingsData.bookings)) {
        // If the API returns an object with a bookings array
        setBookings(bookingsData.bookings);
      } else {
        console.warn('Unexpected bookings data format:', bookingsData);
        setBookings([]);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      setBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  const loadReviews = async () => {
    setReviewsLoading(true);
    try {
      const reviewsData = await reviewApi.getAllReviews();
      if (reviewsData.success) {
        setReviews(reviewsData.reviews);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      try {
        await reviewApi.deleteReview(reviewId);
        loadReviews();
        alert('Review deleted successfully');
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Failed to delete review');
      }
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await bookingApi.updateBookingStatus(bookingId, newStatus);
      loadBookings();
      setEditingBookingId(null);
      alert('Booking status updated successfully!');
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
    }
  };

  const startEditBookingStatus = (bookingId) => {
    setEditingBookingId(bookingId);
  };

  const cancelEditBookingStatus = () => {
    setEditingBookingId(null);
  };

  // Calculate dashboard stats from real data
  const dashboardStats = {
    totalUsers: users.length,
    totalBookings: Array.isArray(bookings) ? bookings.length : 0,
    totalRevenue: Array.isArray(bookings) ? bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0) : 0,
    activeStaff: staff.filter(s => s.isActive).length
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 font-abeze text-sm">Total Users</p>
              <p className="text-3xl font-abeze font-bold text-white">{dashboardStats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 font-abeze text-sm">Total Bookings</p>
              <p className="text-3xl font-abeze font-bold text-white">{dashboardStats.totalBookings}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-200 font-abeze text-sm">Total Revenue</p>
              <p className="text-3xl font-abeze font-bold text-white">LKR {dashboardStats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 font-abeze text-sm">Active Staff</p>
              <p className="text-3xl font-abeze font-bold text-white">{dashboardStats.activeStaff}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-abeze font-bold text-white mb-4">Recent Bookings</h3>
        {bookingsLoading ? (
          <div className="text-center py-8">
            <div className="text-gray-300 font-abeze">Loading recent bookings...</div>
          </div>
        ) : Array.isArray(bookings) && bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4 text-green-200 font-abeze">Customer</th>
                  <th className="text-left py-3 px-4 text-green-200 font-abeze">Package</th>
                  <th className="text-left py-3 px-4 text-green-200 font-abeze">Date</th>
                  <th className="text-left py-3 px-4 text-green-200 font-abeze">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((booking) => (
                  <tr key={booking._id} className="border-b border-white/10">
                    <td className="py-3 px-4 text-white font-abeze">
                      {booking.userId?.firstName} {booking.userId?.lastName}
                    </td>
                    <td className="py-3 px-4 text-white font-abeze">{booking.packageDetails?.title}</td>
                    <td className="py-3 px-4 text-white font-abeze">
                      {new Date(booking.bookingDetails?.startDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-abeze ${
                        booking.status === 'Payment Confirmed' || booking.status === 'Confirmed'
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-300 font-abeze">No bookings found.</div>
          </div>
        )}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-abeze font-bold text-white">Customer Management</h3>
        <div className="text-gray-300 font-abeze text-sm">
          Total Customers: {users.length}
        </div>
      </div>

      {/* Users List */}
      {usersLoading ? (
        <div className="text-center py-8">
          <div className="text-gray-300 font-abeze">Loading customers...</div>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-300 font-abeze">No customers found.</div>
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Name</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Email</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Phone</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Country</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Role</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Joined</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 text-white font-abeze">
                      <div className="flex items-center space-x-3">
                        {user.profilePicture ? (
                          <img 
                            src={user.profilePicture} 
                            alt={user.firstName} 
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                            <span className="text-green-400 text-sm font-abeze">
                              {user.firstName?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{user.firstName} {user.lastName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-white font-abeze">{user.email}</td>
                    <td className="py-4 px-6 text-white font-abeze">{user.phone || 'N/A'}</td>
                    <td className="py-4 px-6 text-white font-abeze">{user.country || 'N/A'}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-abeze ${
                        user.role === 'admin' 
                          ? 'bg-red-500/20 text-red-400' 
                          : user.role === 'staff'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-white font-abeze text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-xs font-abeze transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderStaff = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-abeze font-bold text-white">Staff Management</h3>
        <button
          onClick={() => setShowAddStaff(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-abeze font-medium transition-colors duration-300 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Staff</span>
        </button>
      </div>

      {/* Staff List */}
      {staffLoading ? (
        <div className="text-center py-8">
          <div className="text-gray-300 font-abeze">Loading staff...</div>
        </div>
      ) : staff.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-300 font-abeze">No staff members found.</div>
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Name</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Email</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Phone</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Role</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Specialization</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Experience</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Status</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((staffMember) => (
                  <tr key={staffMember._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 text-white font-abeze">
                      <div className="flex items-center space-x-3">
                        {staffMember.profilePicture?.url ? (
                          <img 
                            src={staffMember.profilePicture.url} 
                            alt={staffMember.firstName} 
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <span className="text-blue-400 text-sm font-abeze">
                              {staffMember.firstName?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{staffMember.firstName} {staffMember.lastName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-white font-abeze">{staffMember.email}</td>
                    <td className="py-4 px-6 text-white font-abeze">{staffMember.phone}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-abeze ${
                        staffMember.role === 'admin' 
                          ? 'bg-red-500/20 text-red-400' 
                          : staffMember.role === 'tour_guide'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {staffMember.role === 'tour_guide' ? 'Tour Guide' : staffMember.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-white font-abeze text-sm">
                      {staffMember.specialization || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-white font-abeze text-sm">
                      {staffMember.experience || 0} years
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-abeze ${
                        staffMember.isActive 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {staffMember.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditStaff(staffMember)}
                          className="px-3 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded text-xs font-abeze transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(staffMember._id)}
                          className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-xs font-abeze transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderSafariRequests = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-abeze font-bold text-white">Safari Requests</h3>
        <div className="text-sm text-gray-300 font-abeze">
          {safariRequestStats && (
            <span>
              Total: {safariRequestStats.total} | 
              Pending: {safariRequestStats.pending} | 
              Recent: {safariRequestStats.recent}
            </span>
          )}
        </div>
      </div>

      {/* Safari Requests List */}
      {safariRequestsLoading ? (
        <div className="text-center py-8">
          <div className="text-gray-300 font-abeze">Loading safari requests...</div>
        </div>
      ) : safariRequests.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-300 font-abeze">No safari requests found.</div>
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Customer</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Contact</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Dates</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Group Size</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Duration</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Budget</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Status</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Actions</th>
                </tr>
              </thead>
              <tbody>
                {safariRequests.map((request) => (
                  <tr key={request._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 text-white font-abeze">
                      <div>
                        <div className="font-medium">{request.name}</div>
                        <div className="text-sm text-gray-400">{request.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-white font-abeze text-sm">
                      {request.phone}
                    </td>
                    <td className="py-4 px-6 text-white font-abeze text-sm">
                      {request.preferredDates}
                    </td>
                    <td className="py-4 px-6 text-white font-abeze text-sm">
                      {request.groupSize}
                    </td>
                    <td className="py-4 px-6 text-white font-abeze text-sm">
                      {request.duration}
                    </td>
                    <td className="py-4 px-6 text-white font-abeze text-sm">
                      {request.budget || 'Not specified'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-abeze ${
                        request.status === 'pending' 
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : request.status === 'reviewed'
                          ? 'bg-blue-500/20 text-blue-400'
                          : request.status === 'approved'
                          ? 'bg-green-500/20 text-green-400'
                          : request.status === 'rejected'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewSafariRequest(request)}
                          className="px-3 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded text-xs font-abeze transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteSafariRequest(request._id)}
                          className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-xs font-abeze transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderPackages = () => (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-abeze font-bold text-white">Package Management</h3>
        <button
          onClick={() => setShowAddPackage(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-abeze font-medium transition-colors duration-300 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Package</span>
        </button>
      </div>

      {/* Packages List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-300 font-abeze">Loading packages...</div>
        </div>
      ) : packages.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-300 font-abeze">No packages found. Add your first package!</div>
        </div>
      ) : (
        <div className="grid gap-6">
          {packages.map((pkg) => (
            <div key={pkg._id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {/* Package Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                    {pkg.image?.url ? (
                      <img 
                        src={pkg.image.url} 
                        alt={pkg.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Package Details */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-abeze font-bold text-white">{pkg.title}</h4>
                      {pkg.isPopular && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-abeze">
                          Popular
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-abeze ${
                        pkg.isActive 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {pkg.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300 font-abeze">
                      <div>
                        <span className="text-gray-400">Category:</span> {pkg.category}
                      </div>
                      <div>
                        <span className="text-gray-400">Duration:</span> {pkg.duration}
                      </div>
                      <div>
                        <span className="text-gray-400">Price:</span> LKR {pkg.price?.toLocaleString()}
                      </div>
                      <div>
                        <span className="text-gray-400">Location:</span> {pkg.location}
                      </div>
                    </div>
                    
                    <p className="text-gray-300 font-abeze text-sm mt-2 line-clamp-2">
                      {pkg.description}
                    </p>
                  </div>
                </div>

                                 {/* Actions */}
                 <div className="flex items-center space-x-2">
                   <button
                     onClick={() => handleEditPackage(pkg)}
                     className="px-3 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded text-xs font-abeze transition-colors"
                   >
                     Edit
                   </button>
                   <button
                     onClick={() => handleDeletePackage(pkg._id)}
                     className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-xs font-abeze transition-colors"
                   >
                     Delete
                   </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-abeze font-bold text-white">Booking Management</h3>
        <div className="text-sm text-gray-300 font-abeze">
          Total Bookings: {Array.isArray(bookings) ? bookings.length : 0}
        </div>
      </div>

      {/* Bookings List */}
      {bookingsLoading ? (
        <div className="text-center py-8">
          <div className="text-gray-300 font-abeze">Loading bookings...</div>
        </div>
      ) : !Array.isArray(bookings) || bookings.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-300 font-abeze">No bookings found.</div>
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Customer</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Package</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Dates</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">People</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Total Price</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Status</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Payment</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 text-white font-abeze">
                      <div>
                        <div className="font-medium">
                          {booking.userId?.firstName} {booking.userId?.lastName}
                        </div>
                        <div className="text-sm text-gray-400">{booking.userId?.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-white font-abeze">
                      <div>
                        <div className="font-medium">{booking.packageDetails?.title}</div>
                        <div className="text-sm text-gray-400">{booking.packageDetails?.location}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-white font-abeze text-sm">
                      <div>
                        <div>Start: {new Date(booking.bookingDetails?.startDate).toLocaleDateString()}</div>
                        <div>End: {new Date(booking.bookingDetails?.endDate).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-white font-abeze text-sm">
                      {booking.bookingDetails?.numberOfPeople} people
                    </td>
                    <td className="py-4 px-6 text-white font-abeze">
                      LKR {booking.totalPrice?.toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-abeze ${
                        booking.status === 'Payment Confirmed' ? 'bg-green-500/20 text-green-400' :
                        booking.status === 'Confirmed' ? 'bg-blue-500/20 text-blue-400' :
                        booking.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' :
                        booking.status === 'Completed' ? 'bg-purple-500/20 text-purple-400' :
                        booking.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-abeze ${
                        booking.payment ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {booking.payment ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {editingBookingId === booking._id ? (
                          <div className="flex items-center space-x-2">
                            <select
                              className="px-3 py-1 bg-white/10 text-white border border-white/20 rounded text-xs font-abeze"
                              onChange={(e) => handleUpdateBookingStatus(booking._id, e.target.value)}
                            >
                              <option value="">Select Status</option>
                              <option value="Payment Confirmed">Payment Confirmed</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            <button
                              onClick={cancelEditBookingStatus}
                              className="px-3 py-1 bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 rounded text-xs font-abeze transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEditBookingStatus(booking._id)}
                            className="px-3 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded text-xs font-abeze transition-colors"
                          >
                            Update Status
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-abeze font-bold text-white">Review Management</h3>
        <div className="text-gray-300 font-abeze text-sm">
          Total Reviews: {reviews.length}
        </div>
      </div>

      {/* Reviews List */}
      {reviewsLoading ? (
        <div className="text-center py-8">
          <div className="text-gray-300 font-abeze">Loading reviews...</div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-300 font-abeze">No reviews found.</div>
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Customer</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Package</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Rating</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Title</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Review</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Date</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 text-white font-abeze">
                      <div>
                        <div className="font-medium">
                          {review.userId?.firstName} {review.userId?.lastName}
                        </div>
                        <div className="text-sm text-gray-400">{review.userId?.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-white font-abeze">
                      <div>
                        <div className="font-medium">{review.packageId?.title}</div>
                        <div className="text-sm text-gray-400">{review.packageId?.location}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-lg ${
                              star <= review.rating ? 'text-yellow-400' : 'text-gray-400'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="ml-2 text-sm text-white">{review.rating}/5</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-white font-abeze max-w-xs truncate">
                      {review.title}
                    </td>
                    <td className="py-4 px-6 text-white font-abeze max-w-xs">
                      <div className="truncate" title={review.review}>
                        {review.review}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-white font-abeze text-sm">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-abeze transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderReports = () => (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <h3 className="text-xl font-abeze font-bold text-white mb-4">Reports & Analytics</h3>
      <p className="text-gray-300 font-abeze">Reports and analytics functionality will be implemented here.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      
      {/* Main Content */}
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex justify-between items-center mb-4">
              <div></div> {/* Empty div for spacing */}
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-abeze font-medium transition-colors duration-300 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
            <h1 className="text-4xl md:text-5xl font-abeze font-bold text-white mb-4">
              Admin Dashboard
            </h1>
            <p className="text-gray-300 font-abeze text-lg">
              Welcome back, {user?.firstName} {user?.lastName}
            </p>
          </div>

          {/* Admin Content */}
          <div className="max-w-7xl mx-auto">
            {/* Navigation Tabs */}
                         <div className="flex flex-wrap gap-2 mb-8">
               {[
                 { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                 { id: 'users', label: 'Customers', icon: '👥' },
                 { id: 'staff', label: 'Staff Management', icon: '👨‍💼' },
                 { id: 'packages', label: 'Packages', icon: '🎒' },
                 { id: 'safari-requests', label: 'Safari Requests', icon: '🦁' },
                 { id: 'contact-messages', label: 'Contact Messages', icon: '💬' },
                 { id: 'bookings', label: 'Bookings', icon: '📅' },
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                 { id: 'attendance', label: 'Attendance', icon: '⏰' },
                 { id: 'payroll', label: 'Payroll', icon: '💰' },
=======
                 { id: 'reviews', label: 'Reviews', icon: '⭐' },
>>>>>>> Stashed changes
=======
                 { id: 'reviews', label: 'Reviews', icon: '⭐' },
>>>>>>> Stashed changes
                 { id: 'reports', label: 'Reports', icon: '📈' },
               ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-6 py-3 rounded-lg font-abeze font-medium transition-colors duration-300 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-96">
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'users' && renderUsers()}
              {activeTab === 'staff' && renderStaff()}
              {activeTab === 'packages' && renderPackages()}
              {activeTab === 'safari-requests' && renderSafariRequests()}
              {activeTab === 'contact-messages' && <ContactMessages />}
              {activeTab === 'bookings' && renderBookings()}
<<<<<<< Updated upstream
<<<<<<< Updated upstream
              {activeTab === 'attendance' && <Attendance />}
              {activeTab === 'payroll' && <Payroll />}
=======
              {activeTab === 'reviews' && renderReviews()}
>>>>>>> Stashed changes
=======
              {activeTab === 'reviews' && renderReviews()}
>>>>>>> Stashed changes
              {activeTab === 'reports' && renderReports()}
            </div>
          </div>
        </div>
      </div>

      <Footer />

             {/* Add Package Modal */}
       {showAddPackage && (
         <AddPackageModal 
           onClose={() => setShowAddPackage(false)}
           onPackageAdded={handlePackageAdded}
         />
       )}

       {/* Edit Package Modal */}
       {showEditPackage && selectedPackage && (
         <EditPackageModal 
           package={selectedPackage}
           onClose={() => {
             setShowEditPackage(false);
             setSelectedPackage(null);
           }}
           onPackageUpdated={handlePackageUpdated}
         />
       )}

       {/* Add Staff Modal */}
       {showAddStaff && (
         <AddStaffModal 
           onClose={() => setShowAddStaff(false)}
           onStaffAdded={handleStaffAdded}
         />
       )}

       {/* Edit Staff Modal */}
       {showEditStaff && selectedStaff && (
         <EditStaffModal 
           staff={selectedStaff}
           onClose={() => {
             setShowEditStaff(false);
             setSelectedStaff(null);
           }}
           onStaffUpdated={handleStaffUpdated}
         />
       )}

       {/* Safari Request Modal */}
       {showSafariRequestModal && selectedSafariRequest && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
           <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
             {/* Modal Header */}
             <div className="p-6 border-b border-gray-700">
               <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                   <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                     <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                     </svg>
                   </div>
                   <div>
                     <h2 className="text-2xl font-abeze font-bold text-white">Safari Request Details</h2>
                     <p className="text-gray-400 font-abeze">Request ID: {selectedSafariRequest._id}</p>
                   </div>
                 </div>
                 <button
                   onClick={handleCloseSafariRequestModal}
                   className="text-gray-400 hover:text-white transition-colors"
                 >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                 </button>
               </div>
             </div>

             {/* Modal Content */}
             <div className="p-6 space-y-6">
               {/* Status Badge */}
               <div className="flex items-center justify-between">
                 <span className={`px-4 py-2 rounded-full text-sm font-abeze font-medium ${
                   selectedSafariRequest.status === 'pending' 
                     ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                     : selectedSafariRequest.status === 'reviewed'
                     ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                     : selectedSafariRequest.status === 'approved'
                     ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                     : selectedSafariRequest.status === 'rejected'
                     ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                     : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                 }`}>
                   {selectedSafariRequest.status.charAt(0).toUpperCase() + selectedSafariRequest.status.slice(1)}
                 </span>
                 <span className="text-gray-400 font-abeze text-sm">
                   Submitted: {new Date(selectedSafariRequest.createdAt).toLocaleDateString()}
                 </span>
               </div>

               {/* Customer Information */}
               <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                 <h3 className="text-lg font-abeze font-bold text-white mb-4 flex items-center">
                   <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                   </svg>
                   Customer Information
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="text-gray-400 font-abeze text-sm">Name</label>
                     <p className="text-white font-abeze">{selectedSafariRequest.name}</p>
                   </div>
                   <div>
                     <label className="text-gray-400 font-abeze text-sm">Email</label>
                     <p className="text-white font-abeze">{selectedSafariRequest.email}</p>
                   </div>
                   <div>
                     <label className="text-gray-400 font-abeze text-sm">Phone</label>
                     <p className="text-white font-abeze">{selectedSafariRequest.phone}</p>
                   </div>
                 </div>
               </div>

               {/* Safari Details */}
               <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                 <h3 className="text-lg font-abeze font-bold text-white mb-4 flex items-center">
                   <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                   </svg>
                   Safari Details
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="text-gray-400 font-abeze text-sm">Preferred Dates</label>
                     <p className="text-white font-abeze">{selectedSafariRequest.preferredDates}</p>
                   </div>
                   <div>
                     <label className="text-gray-400 font-abeze text-sm">Group Size</label>
                     <p className="text-white font-abeze">{selectedSafariRequest.groupSize}</p>
                   </div>
                   <div>
                     <label className="text-gray-400 font-abeze text-sm">Duration</label>
                     <p className="text-white font-abeze">{selectedSafariRequest.duration}</p>
                   </div>
                   <div>
                     <label className="text-gray-400 font-abeze text-sm">Budget</label>
                     <p className="text-white font-abeze">{selectedSafariRequest.budget || 'Not specified'}</p>
                   </div>
                 </div>
               </div>

               {/* Additional Information */}
               <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                 <h3 className="text-lg font-abeze font-bold text-white mb-4 flex items-center">
                   <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                   Additional Information
                 </h3>
                 <div className="space-y-4">
                   <div>
                     <label className="text-gray-400 font-abeze text-sm">Preferred Locations</label>
                     <p className="text-white font-abeze">{selectedSafariRequest.preferredLocations || 'Not specified'}</p>
                   </div>
                   <div>
                     <label className="text-gray-400 font-abeze text-sm">Wildlife Interests</label>
                     <p className="text-white font-abeze">{selectedSafariRequest.wildlifeInterests || 'Not specified'}</p>
                   </div>
                   <div>
                     <label className="text-gray-400 font-abeze text-sm">Special Requirements</label>
                     <p className="text-white font-abeze">{selectedSafariRequest.specialRequirements || 'None'}</p>
                   </div>
                 </div>
               </div>

               {/* Admin Section */}
               <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                 <h3 className="text-lg font-abeze font-bold text-white mb-4 flex items-center">
                   <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                   Admin Information
                 </h3>
                 <div className="space-y-4">
                   <div>
                     <label className="text-gray-400 font-abeze text-sm">Estimated Price</label>
                     <p className="text-white font-abeze">
                       {selectedSafariRequest.estimatedPrice 
                         ? `LKR ${selectedSafariRequest.estimatedPrice.toLocaleString()}`
                         : 'Not estimated yet'
                       }
                     </p>
                   </div>
                   <div>
                     <label className="text-gray-400 font-abeze text-sm">Admin Notes</label>
                     <p className="text-white font-abeze">{selectedSafariRequest.adminNotes || 'No notes yet'}</p>
                   </div>
                 </div>
               </div>
             </div>

             {/* Modal Footer */}
             <div className="p-6 border-t border-gray-700 flex items-center justify-between">
               <div className="flex space-x-3">
                 <button
                   onClick={() => handleDeleteSafariRequest(selectedSafariRequest._id)}
                   className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-abeze font-medium transition-colors duration-300 flex items-center space-x-2"
                 >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                   </svg>
                   <span>Delete Request</span>
                 </button>
               </div>
               <div className="flex space-x-3">
                 <button
                   onClick={handleCloseSafariRequestModal}
                   className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-abeze font-medium transition-colors duration-300"
                 >
                   Close
                 </button>
                 {selectedSafariRequest.status !== 'approved' && (
                   <button
                     onClick={() => handleApproveSafariRequest(selectedSafariRequest._id)}
                     className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-abeze font-medium transition-colors duration-300 flex items-center space-x-2"
                   >
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                     </svg>
                     <span>Approve Request</span>
                   </button>
                 )}
               </div>
             </div>
           </div>
         </div>
       )}
    </div>
  );
};

export default AdminPage;

import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('auth_token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('auth_token');
  }
};

export const authApi = {
  async login(payload) {
    const { data } = await api.post('/api/auth/login', payload);
    return data;
  },
  async staffLogin(payload) {
    const { data } = await api.post('/api/auth/staff-login', payload);
    return data;
  },
  async register(payload) {
    const { data } = await api.post('/api/auth/register', payload);
    return data;
  },
  async updateProfile(payload) {
    const { data } = await api.put('/api/auth/profile', payload);
    return data;
  },
  async uploadProfilePicture(formData) {
    // Create a new axios instance for file upload to avoid header conflicts
    const uploadApi = axios.create({
      baseURL,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
    
    const { data } = await uploadApi.post('/api/auth/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};

export const packageApi = {
  async getAllPackages() {
    const { data } = await api.get('/api/packages');
    return data;
  },
  async getPackageById(id) {
    const { data } = await api.get(`/api/packages/${id}`);
    return data;
  },
  async createPackage(payload) {
    const { data } = await api.post('/api/packages', payload);
    return data;
  },
  async updatePackage(id, payload) {
    const { data } = await api.put(`/api/packages/${id}`, payload);
    return data;
  },
  async deletePackage(id) {
    const { data } = await api.delete(`/api/packages/${id}`);
    return data;
  },
  async uploadPackageImage(id, formData) {
    // Create a new axios instance for file upload to avoid header conflicts
    const uploadApi = axios.create({
      baseURL,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
    
    const { data } = await uploadApi.post(`/api/packages/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
  async togglePackageStatus(id) {
    const { data } = await api.patch(`/api/packages/${id}/toggle-status`);
    return data;
  },
};

export const contactMessageApi = {
  async createContactMessage(payload) {
    const { data } = await api.post('/api/contact-messages', payload);
    return data;
  },
  async getAllContactMessages(params = {}) {
    const { data } = await api.get('/api/contact-messages', { params });
    return data;
  },
  async getUserContactMessages(email, params = {}) {
    const { data } = await api.get(`/api/contact-messages/user/${email}`, { params });
    return data;
  },
  async getContactMessageById(id) {
    const { data } = await api.get(`/api/contact-messages/${id}`);
    return data;
  },
  async updateContactMessage(id, payload) {
    const { data } = await api.put(`/api/contact-messages/${id}`, payload);
    return data;
  },
  async deleteContactMessage(id) {
    const { data } = await api.delete(`/api/contact-messages/${id}`);
    return data;
  },
  async getContactMessageStats() {
    const { data } = await api.get('/api/contact-messages/stats');
    return data;
  },
};

export const userApi = {
  async getAllUsers() {
    const { data } = await api.get('/api/users');
    return data;
  },
  async getUserStats() {
    const { data } = await api.get('/api/users/stats');
    return data;
  },
  async deleteUser(id) {
    const { data } = await api.delete(`/api/users/${id}`);
    return data;
  },
};

export const staffApi = {
  async getAllStaff() {
    const { data } = await api.get('/api/staff');
    return data;
  },
  async getStaffById(id) {
    const { data } = await api.get(`/api/staff/${id}`);
    return data;
  },
  async createStaff(payload) {
    const { data } = await api.post('/api/staff', payload);
    return data;
  },
  async updateStaff(id, payload) {
    const { data } = await api.put(`/api/staff/${id}`, payload);
    return data;
  },
  async deleteStaff(id) {
    const { data } = await api.delete(`/api/staff/${id}`);
    return data;
  },
  async toggleStaffStatus(id) {
    const { data } = await api.patch(`/api/staff/${id}/toggle-status`);
    return data;
  },
  async staffLogin(payload) {
    const { data } = await api.post('/api/staff/login', payload);
    return data;
  },
  async uploadStaffProfilePicture(id, formData) {
    const uploadApi = axios.create({
      baseURL,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
    
    const { data } = await uploadApi.post(`/api/staff/${id}/profile-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};

export const safariRequestApi = {
  async getAllSafariRequests() {
    const { data } = await api.get('/api/safari-requests');
    return data;
  },
  async getSafariRequestById(id) {
    const { data } = await api.get(`/api/safari-requests/${id}`);
    return data;
  },
  async createSafariRequest(payload) {
    const { data } = await api.post('/api/safari-requests', payload);
    return data;
  },
  async updateSafariRequestStatus(id, payload) {
    const { data } = await api.patch(`/api/safari-requests/${id}/status`, payload);
    return data;
  },
  async deleteSafariRequest(id) {
    const { data } = await api.delete(`/api/safari-requests/${id}`);
    return data;
  },
  async getSafariRequestStats() {
    const { data } = await api.get('/api/safari-requests/stats');
    return data;
  },
};

export const bookingApi = {
  async createStripeCheckout(payload) {
    const { data } = await api.post('/api/bookings/stripe-checkout', payload);
    return data;
  },
  async verifyPayment(sessionId) {
    const { data } = await api.post('/api/bookings/verify-payment', { session_id: sessionId });
    return data;
  },
  async getUserBookings() {
    const { data } = await api.get('/api/bookings/user');
    return data;
  },
  async getAllBookings() {
    const { data } = await api.get('/api/bookings/all');
    return data;
  },
  async getBookingDetails(bookingId) {
    const { data } = await api.get(`/api/bookings/details/${bookingId}`);
    return data;
  },
  async updateBookingStatus(bookingId, status) {
    const { data } = await api.put(`/api/bookings/status/${bookingId}`, { status });
    return data;
  },
};

<<<<<<< Updated upstream
<<<<<<< Updated upstream
export const attendanceApi = {
  async getAllAttendance() {
    const { data } = await api.get('/api/attendance');
    return data;
  },
  async getAttendanceByStaff(staffId, startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const { data } = await api.get(`/api/attendance/staff/${staffId}?${params}`);
    return data;
  },
  async getAttendanceByDateRange(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const { data } = await api.get(`/api/attendance/date-range?${params}`);
    return data;
  },
  async getAttendanceStats(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const { data } = await api.get(`/api/attendance/stats?${params}`);
    return data;
  },
  async createAttendance(payload) {
    const { data } = await api.post('/api/attendance', payload);
    return data;
  },
  async bulkCreateAttendance(payload) {
    const { data } = await api.post('/api/attendance/bulk', payload);
    return data;
  },
  async updateAttendance(id, payload) {
    const { data } = await api.put(`/api/attendance/${id}`, payload);
    return data;
  },
  async deleteAttendance(id) {
    const { data } = await api.delete(`/api/attendance/${id}`);
    return data;
  },
  async checkIn(payload) {
    const { data } = await api.post('/api/attendance/check-in', payload);
    return data;
  },
  async checkOut(payload) {
    const { data } = await api.post('/api/attendance/check-out', payload);
    return data;
  },
  async getCurrentDayStatus(staffId) {
    const { data } = await api.get(`/api/attendance/current-day/${staffId}`);
    return data;
  },
  async getDailyReport(date) {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    const { data } = await api.get(`/api/attendance/daily-report?${params}`);
    return data;
  },
  async downloadDailyReportPDF(date) {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    const response = await api.get(`/api/attendance/daily-report-pdf?${params}`, {
      responseType: 'blob'
    });
    return response.data;
  },
};

export const payrollApi = {
  async getAllPayroll() {
    const { data } = await api.get('/api/payroll');
    return data;
  },
  async getPayrollByStaff(staffId, year) {
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    const { data } = await api.get(`/api/payroll/staff/${staffId}?${params}`);
    return data;
  },
  async getPayrollByMonth(month, year) {
    const { data } = await api.get(`/api/payroll/month/${month}/${year}`);
    return data;
  },
  async getPayrollStats(year) {
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    const { data } = await api.get(`/api/payroll/stats?${params}`);
    return data;
  },
  async generatePayroll(month, year) {
    const { data } = await api.post('/api/payroll/generate', { month, year });
    return data;
  },
  async createOrUpdatePayroll(payload) {
    const { data } = await api.post('/api/payroll/create', payload);
    return data;
  },
  async updatePayrollStatus(id, status, notes) {
    const { data } = await api.patch(`/api/payroll/${id}/status`, { status, notes });
    return data;
  },
  async recalculatePayroll(id) {
    const { data } = await api.post(`/api/payroll/${id}/recalculate`);
    return data;
  },
  async refreshPayrollForMonth(month, year) {
    const { data } = await api.post(`/api/payroll/refresh/${month}/${year}`);
    return data;
  },
  async deletePayroll(id) {
    const { data } = await api.delete(`/api/payroll/${id}`);
=======
=======
>>>>>>> Stashed changes
export const reviewApi = {
  async createReview(payload) {
    const { data } = await api.post('/api/reviews', payload);
    return data;
  },
  async createReviewWithImages(formData) {
    const uploadApi = axios.create({
      baseURL,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
    
    const { data } = await uploadApi.post('/api/reviews/with-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
  async getPackageReviews(packageId, params = {}) {
    const { data } = await api.get(`/api/reviews/package/${packageId}`, { params });
    return data;
  },
  async getUserReviews() {
    const { data } = await api.get('/api/reviews/user');
    return data;
  },
  async updateReview(reviewId, payload) {
    const { data } = await api.put(`/api/reviews/${reviewId}`, payload);
    return data;
  },
  async uploadReviewImages(reviewId, formData) {
    const uploadApi = axios.create({
      baseURL,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
    
    const { data } = await uploadApi.post(`/api/reviews/${reviewId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
  // Admin functions
  async getAllReviews(params = {}) {
    const { data } = await api.get('/api/reviews/admin/all', { params });
    return data;
  },
  async deleteReview(reviewId) {
    const { data } = await api.delete(`/api/reviews/admin/${reviewId}`);
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    return data;
  },
};



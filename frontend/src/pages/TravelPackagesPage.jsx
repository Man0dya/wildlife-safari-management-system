import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { packageApi, safariRequestApi } from '../services/api';

const TravelPackagesPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setRedirectPath, redirectAfterLogin } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestFormData, setRequestFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDates: '',
    groupSize: '',
    duration: '',
    budget: '',
    specialRequirements: '',
    preferredLocations: '',
    wildlifeInterests: ''
  });
  const [requestFormErrors, setRequestFormErrors] = useState({});
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const loginTriggerRef = useRef(null);

  const filters = ['All', 'Safari', 'Hiking', 'Photography', 'Birding', 'Adventure'];

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const packagesData = await packageApi.getAllPackages();
      setPackages(packagesData);
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPackages = activeFilter === 'All' 
    ? packages 
    : packages.filter(pkg => pkg.category === activeFilter);

  const handleBookNow = (packageId) => {
    if (!isAuthenticated) {
      // Set the redirect path to the booking page for this package
      setRedirectPath(`/booking/${packageId}`);
      // Trigger the login modal from header
      if (loginTriggerRef.current) {
        loginTriggerRef.current();
      }
      return;
    }
    navigate(`/booking/${packageId}`);
  };

  const handleRequestFormChange = (e) => {
    const { name, value } = e.target;
    setRequestFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (requestFormErrors[name]) {
      setRequestFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateRequestForm = () => {
    const newErrors = {};

    if (!requestFormData.name.trim()) newErrors.name = 'Name is required';
    if (!requestFormData.email.trim()) newErrors.email = 'Email is required';
    if (!requestFormData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!requestFormData.preferredDates.trim()) newErrors.preferredDates = 'Preferred dates are required';
    if (!requestFormData.groupSize.trim()) newErrors.groupSize = 'Group size is required';
    if (!requestFormData.duration.trim()) newErrors.duration = 'Duration is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (requestFormData.email && !emailRegex.test(requestFormData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setRequestFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestSafari = async (e) => {
    e.preventDefault();
    
    if (!validateRequestForm()) {
      return;
    }

    setIsSubmittingRequest(true);
    try {
      await safariRequestApi.createSafariRequest(requestFormData);
      alert('Safari request submitted successfully! We will contact you soon.');
      setRequestFormData({
        name: '',
        email: '',
        phone: '',
        preferredDates: '',
        groupSize: '',
        duration: '',
        budget: '',
        specialRequirements: '',
        preferredLocations: '',
        wildlifeInterests: ''
      });
      setShowRequestForm(false);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Failed to submit request. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Header triggerLogin={loginTriggerRef} />
      
      <div className="pt-20">
        <div className="container mx-auto px-6">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-abeze font-bold text-white mb-4">
              Safari <span className="text-green-400">Packages</span>
            </h1>
            <p className="text-gray-300 font-abeze text-lg max-w-3xl mx-auto">
              Discover the perfect wildlife adventure with our carefully curated safari packages across Sri Lanka's most pristine national parks.
            </p>
          </div>

          {/* Redirect Message */}
          {redirectAfterLogin && !isAuthenticated && (
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-4 mb-8">
              <div className="flex items-center justify-center space-x-3">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-400 font-abeze text-lg">
                  Please login to continue with your booking
                </p>
              </div>
            </div>
          )}

          {/* Filter Section */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-4">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-3 rounded-full font-abeze font-medium transition-all duration-300 ${
                    activeFilter === filter
                      ? 'bg-green-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Packages Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-300 font-abeze">Loading packages...</div>
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-300 font-abeze">No packages found for the selected category.</div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredPackages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-green-400/50 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="relative h-64 bg-gradient-to-br from-green-600/20 to-green-400/20">
                    {pkg.image?.url ? (
                      <img 
                        src={pkg.image.url} 
                        alt={pkg.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-abeze font-bold">
                        {pkg.duration}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs font-abeze">
                        {pkg.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-abeze font-bold text-white">
                        {pkg.title}
                      </h3>
                      {pkg.isPopular && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-abeze font-bold">
                          Popular
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-300 font-abeze text-sm mb-4 leading-relaxed">
                      {pkg.description}
                    </p>
                    
                    {/* Package Details */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                      {pkg.location && (
                        <div className="flex items-center space-x-1">
                          <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-gray-300 font-abeze">{pkg.location}</span>
                        </div>
                      )}
                      {pkg.maxGroupSize && (
                        <div className="flex items-center space-x-1">
                          <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="text-gray-300 font-abeze">Max {pkg.maxGroupSize} people</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Highlights */}
                    {pkg.highlights && pkg.highlights.length > 0 && (
                      <div className="space-y-3 mb-6">
                        <h4 className="text-green-400 font-abeze font-medium text-base">Highlights:</h4>
                        <div className="space-y-2">
                          {pkg.highlights.slice(0, 4).map((highlight, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                              </svg>
                              <span className="text-gray-300 font-abeze text-sm">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Features */}
                    {pkg.features && pkg.features.length > 0 && (
                      <div className="space-y-3 mb-6">
                        <h4 className="text-blue-400 font-abeze font-medium text-base">Features:</h4>
                        <div className="space-y-2">
                          {pkg.features.slice(0, 3).map((feature, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-gray-300 font-abeze text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <span className="text-3xl font-abeze font-bold text-green-400">LKR {pkg.price?.toLocaleString()}</span>
                        <span className="text-gray-400 font-abeze text-sm">/person</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleBookNow(pkg._id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-abeze font-bold transition-colors duration-300"
                      >
                        Book Now
                      </button>
                      <button 
                        onClick={() => navigate(`/package/${pkg._id}`)}
                        className="flex-1 bg-transparent border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white py-3 rounded-full font-abeze font-medium transition-all duration-300"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center mb-16">
            <div className="bg-gradient-to-r from-green-600/20 to-green-400/20 backdrop-blur-sm rounded-2xl p-8 border border-green-400/30">
              <h3 className="text-2xl font-abeze font-bold text-white mb-4">
                Can't Find the Perfect Package?
              </h3>
              <p className="text-gray-300 font-abeze mb-6 max-w-2xl mx-auto">
                Let us create a custom safari experience tailored to your preferences. Our expert team will design the perfect wildlife adventure just for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setShowRequestForm(!showRequestForm)}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-abeze font-bold transition-colors duration-300"
                >
                  {showRequestForm ? 'Hide Request Form' : 'Request Safari'}
                </button>
                <button className="bg-transparent border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white px-8 py-3 rounded-full font-abeze font-bold transition-all duration-300">
                  Contact Us
                </button>
              </div>
            </div>
          </div>

          {/* Request Safari Form */}
          {showRequestForm && (
            <div className="mb-16">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-abeze font-bold text-white mb-2">
                    Request Custom Safari
                  </h3>
                  <p className="text-gray-300 font-abeze">
                    Tell us about your dream safari and we'll create a personalized experience for you
                  </p>
                </div>

                <form onSubmit={handleRequestSafari} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h4 className="text-xl font-abeze font-bold text-white mb-4">Personal Information</h4>
                      
                      <div>
                        <label className="block text-white font-abeze font-medium mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={requestFormData.name}
                          onChange={handleRequestFormChange}
                          className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none transition-colors ${
                            requestFormErrors.name ? 'border-red-400' : 'border-white/20 focus:border-green-400'
                          }`}
                          placeholder="John Doe"
                        />
                        {requestFormErrors.name && (
                          <p className="text-red-400 text-sm mt-1 font-abeze">{requestFormErrors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-white font-abeze font-medium mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={requestFormData.email}
                          onChange={handleRequestFormChange}
                          className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none transition-colors ${
                            requestFormErrors.email ? 'border-red-400' : 'border-white/20 focus:border-green-400'
                          }`}
                          placeholder="john.doe@example.com"
                        />
                        {requestFormErrors.email && (
                          <p className="text-red-400 text-sm mt-1 font-abeze">{requestFormErrors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-white font-abeze font-medium mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={requestFormData.phone}
                          onChange={handleRequestFormChange}
                          className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none transition-colors ${
                            requestFormErrors.phone ? 'border-red-400' : 'border-white/20 focus:border-green-400'
                          }`}
                          placeholder="+94 71 123 4567"
                        />
                        {requestFormErrors.phone && (
                          <p className="text-red-400 text-sm mt-1 font-abeze">{requestFormErrors.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Safari Details */}
                    <div className="space-y-4">
                      <h4 className="text-xl font-abeze font-bold text-white mb-4">Safari Details</h4>
                      
                      <div>
                        <label className="block text-white font-abeze font-medium mb-2">
                          Preferred Dates *
                        </label>
                        <input
                          type="text"
                          name="preferredDates"
                          value={requestFormData.preferredDates}
                          onChange={handleRequestFormChange}
                          className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none transition-colors ${
                            requestFormErrors.preferredDates ? 'border-red-400' : 'border-white/20 focus:border-green-400'
                          }`}
                          placeholder="e.g., March 15-20, 2024"
                        />
                        {requestFormErrors.preferredDates && (
                          <p className="text-red-400 text-sm mt-1 font-abeze">{requestFormErrors.preferredDates}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-white font-abeze font-medium mb-2">
                          Group Size *
                        </label>
                        <input
                          type="text"
                          name="groupSize"
                          value={requestFormData.groupSize}
                          onChange={handleRequestFormChange}
                          className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none transition-colors ${
                            requestFormErrors.groupSize ? 'border-red-400' : 'border-white/20 focus:border-green-400'
                          }`}
                          placeholder="e.g., 4 adults, 2 children"
                        />
                        {requestFormErrors.groupSize && (
                          <p className="text-red-400 text-sm mt-1 font-abeze">{requestFormErrors.groupSize}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-white font-abeze font-medium mb-2">
                          Duration *
                        </label>
                        <input
                          type="text"
                          name="duration"
                          value={requestFormData.duration}
                          onChange={handleRequestFormChange}
                          className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none transition-colors ${
                            requestFormErrors.duration ? 'border-red-400' : 'border-white/20 focus:border-green-400'
                          }`}
                          placeholder="e.g., 5 days, 4 nights"
                        />
                        {requestFormErrors.duration && (
                          <p className="text-red-400 text-sm mt-1 font-abeze">{requestFormErrors.duration}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h4 className="text-xl font-abeze font-bold text-white mb-4">Additional Information</h4>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-abeze font-medium mb-2">
                          Budget Range
                        </label>
                        <input
                          type="text"
                          name="budget"
                          value={requestFormData.budget}
                          onChange={handleRequestFormChange}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                          placeholder="e.g., LKR 50,000 - 100,000 per person"
                        />
                      </div>

                      <div>
                        <label className="block text-white font-abeze font-medium mb-2">
                          Preferred Locations
                        </label>
                        <input
                          type="text"
                          name="preferredLocations"
                          value={requestFormData.preferredLocations}
                          onChange={handleRequestFormChange}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                          placeholder="e.g., Yala, Udawalawe, Wilpattu"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white font-abeze font-medium mb-2">
                        Wildlife Interests
                      </label>
                      <input
                        type="text"
                        name="wildlifeInterests"
                        value={requestFormData.wildlifeInterests}
                        onChange={handleRequestFormChange}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                        placeholder="e.g., Elephants, Leopards, Birds, Photography"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-abeze font-medium mb-2">
                        Special Requirements
                      </label>
                      <textarea
                        name="specialRequirements"
                        value={requestFormData.specialRequirements}
                        onChange={handleRequestFormChange}
                        rows="4"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors resize-none"
                        placeholder="Any special requirements, accessibility needs, dietary restrictions, or specific experiences you're looking for..."
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowRequestForm(false)}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-abeze font-medium transition-colors duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingRequest}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-abeze font-bold transition-colors duration-300"
                    >
                      {isSubmittingRequest ? 'Submitting...' : 'Submit Request'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TravelPackagesPage; 
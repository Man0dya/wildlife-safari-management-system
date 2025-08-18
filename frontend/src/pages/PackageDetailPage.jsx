import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { packageApi } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReviewsDisplay from '../components/ReviewsDisplay';

const PackageDetailPage = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, setRedirectPath } = useAuth();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPackageData();
  }, [packageId]);

  const loadPackageData = async () => {
    try {
      setLoading(true);
      const data = await packageApi.getPackageById(packageId);
      setPackageData(data);
    } catch (error) {
      console.error('Error loading package:', error);
      setError('Failed to load package details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      setRedirectPath(`/booking/${packageId}`);
      navigate('/travel-packages');
      return;
    }
    navigate(`/booking/${packageId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <Header />
        <div className="pt-20">
          <div className="container mx-auto px-6">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto"></div>
              <p className="text-gray-300 font-abeze text-lg mt-4">Loading package details...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <Header />
        <div className="pt-20">
          <div className="container mx-auto px-6">
            <div className="text-center py-20">
              <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-8 max-w-md mx-auto">
                <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h2 className="text-2xl font-abeze font-bold text-white mb-2">Package Not Found</h2>
                <p className="text-gray-300 font-abeze mb-6">{error || 'The package you are looking for does not exist.'}</p>
                <button
                  onClick={() => navigate('/travel-packages')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-abeze font-medium transition-colors duration-300"
                >
                  Back to Packages
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="flex items-center space-x-2 text-sm text-gray-400 font-abeze">
              <button
                onClick={() => navigate('/travel-packages')}
                className="hover:text-green-400 transition-colors"
              >
                Packages
              </button>
              <span>/</span>
              <span className="text-white">{packageData.title}</span>
            </nav>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Package Header */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <h1 className="text-4xl font-abeze font-bold text-white">{packageData.title}</h1>
                        {packageData.isPopular && (
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-abeze font-bold">
                            Popular
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-300 font-abeze mb-4">
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{packageData.duration}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{packageData.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>Max {packageData.maxGroupSize} people</span>
                        </div>
                      </div>

                      <p className="text-gray-300 font-abeze text-lg leading-relaxed">
                        {packageData.description}
                      </p>
                    </div>
                  </div>

                  {/* Package Image */}
                  <div className="relative h-80 bg-gradient-to-br from-green-600/20 to-green-400/20 rounded-xl overflow-hidden">
                    {packageData.image?.url ? (
                      <img 
                        src={packageData.image.url} 
                        alt={packageData.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-abeze font-bold">
                        {packageData.duration}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-black/50 text-white px-4 py-2 rounded-full text-sm font-abeze">
                        {packageData.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                {packageData.highlights && packageData.highlights.length > 0 && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <h2 className="text-2xl font-abeze font-bold text-white mb-6 flex items-center">
                      <svg className="w-6 h-6 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Package Highlights
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {packageData.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300 font-abeze">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features */}
                {packageData.features && packageData.features.length > 0 && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <h2 className="text-2xl font-abeze font-bold text-white mb-6 flex items-center">
                      <svg className="w-6 h-6 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      What's Included
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {packageData.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-300 font-abeze">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* What's Not Included */}
                {packageData.notIncluded && packageData.notIncluded.length > 0 && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <h2 className="text-2xl font-abeze font-bold text-white mb-6 flex items-center">
                      <svg className="w-6 h-6 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      What's Not Included
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {packageData.notIncluded.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="text-gray-300 font-abeze">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {packageData.requirements && packageData.requirements.length > 0 && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <h2 className="text-2xl font-abeze font-bold text-white mb-6 flex items-center">
                      <svg className="w-6 h-6 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Requirements & Notes
                    </h2>
                    <div className="space-y-3">
                      {packageData.requirements.map((requirement, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <span className="text-gray-300 font-abeze">{requirement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews Section */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <ReviewsDisplay packageId={packageId} showAll={false} />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Booking Card */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 sticky top-24">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-abeze font-bold text-green-400 mb-2">
                      LKR {packageData.price?.toLocaleString()}
                    </div>
                    <div className="text-gray-400 font-abeze">per person</div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 font-abeze">Difficulty:</span>
                      <span className="text-white font-abeze">{packageData.difficulty}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 font-abeze">Category:</span>
                      <span className="text-white font-abeze">{packageData.category}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 font-abeze">Max Group:</span>
                      <span className="text-white font-abeze">{packageData.maxGroupSize} people</span>
                    </div>
                    {packageData.rating > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 font-abeze">Rating:</span>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-sm ${
                                star <= packageData.rating ? 'text-yellow-400' : 'text-gray-400'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                          <span className="text-white font-abeze ml-2">({packageData.reviews})</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleBookNow}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-abeze font-bold text-lg transition-colors duration-300 mb-4"
                  >
                    Book Now
                  </button>

                  <button className="w-full bg-transparent border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white py-3 rounded-xl font-abeze font-medium transition-all duration-300">
                    Contact Us
                  </button>
                </div>

                {/* Quick Info */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-lg font-abeze font-bold text-white mb-4">Quick Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-300 font-abeze">Duration: {packageData.duration}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-300 font-abeze">Location: {packageData.location}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-gray-300 font-abeze">Group Size: Max {packageData.maxGroupSize}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PackageDetailPage;


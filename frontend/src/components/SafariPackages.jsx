import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { packageApi } from '../services/api';

const SafariPackages = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setRedirectPath } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const packagesData = await packageApi.getAllPackages();
      // Only show popular packages on the home page
      const popularPackages = packagesData.filter(pkg => pkg.isPopular).slice(0, 4);
      setPackages(popularPackages);
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToTravelPackages = () => {
    navigate('/travel-packages');
  };

  const handleBookNow = (packageId) => {
    if (!isAuthenticated) {
      // Set the redirect path to the booking page for this package
      setRedirectPath(`/booking/${packageId}`);
      // For now, navigate to travel packages page where they can login
      // This will be handled by the Header component's login modal
      navigate('/travel-packages');
      return;
    }
    navigate(`/booking/${packageId}`);
  };

  return (
    <section id="safaris" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-abeze font-bold text-white mb-4">
            Sri Lankan <span className="text-green-400">Wildlife Tours</span>
          </h2>
          <p className="text-gray-300 text-lg font-abeze max-w-2xl mx-auto">
            Discover the incredible biodiversity of Sri Lanka through our carefully curated wildlife experiences in the island's most pristine national parks
          </p>
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-300 font-abeze">Loading packages...</div>
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-300 font-abeze">No packages available at the moment.</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {packages.map((pkg) => (
              <div 
                key={pkg._id} 
                className={`relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300 hover:transform hover:scale-105 ${
                  pkg.isPopular ? 'ring-2 ring-green-400' : ''
                }`}
              >
                {/* Popular Badge */}
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-abeze font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Package Image */}
                <div className="w-full h-32 mb-4 rounded-lg overflow-hidden bg-gray-700">
                  {pkg.image?.url ? (
                    <img 
                      src={pkg.image.url} 
                      alt={pkg.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Package Title */}
                <h3 className="text-xl font-abeze font-bold text-white mb-2 text-center">
                  {pkg.title}
                </h3>

                {/* Duration */}
                <p className="text-green-400 font-abeze text-sm text-center mb-3">
                  {pkg.duration}
                </p>

                {/* Price */}
                <div className="text-center mb-4">
                  <span className="text-3xl font-abeze font-bold text-white">
                    LKR {pkg.price?.toLocaleString()}
                  </span>
                  <span className="text-gray-400 font-abeze text-sm"> per person</span>
                </div>

                {/* Description */}
                <p className="text-gray-300 font-abeze text-sm mb-6 text-center leading-relaxed">
                  {pkg.description}
                </p>

                {/* Features */}
                {pkg.features && pkg.features.length > 0 && (
                  <ul className="space-y-2 mb-6">
                    {pkg.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-300 font-abeze text-sm">
                        <span className="text-green-400 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                    {pkg.features.length > 3 && (
                      <li className="text-gray-400 font-abeze text-sm">
                        +{pkg.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleBookNow(pkg._id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-abeze font-medium transition-colors duration-300"
                  >
                    Book Now
                  </button>
                  <button 
                    onClick={() => navigate(`/package/${pkg._id}`)}
                    className="flex-1 bg-transparent border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white py-2 rounded-lg font-abeze font-medium transition-all duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* See More Packages Link */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-green-600/20 to-green-400/20 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30">
            <h3 className="text-2xl font-abeze font-bold text-white mb-4">
              Explore Our Complete Collection
            </h3>
            <p className="text-gray-300 font-abeze mb-6 max-w-2xl mx-auto">
              Discover more wildlife experiences including photography tours, bird watching, hiking adventures, and custom adventure packages.
            </p>
            <button 
              onClick={navigateToTravelPackages}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-abeze font-bold transition-colors duration-300"
            >
              See All Packages
            </button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-gray-300 font-abeze mb-6">
            Looking for a unique experience? We can create a custom wildlife tour tailored to your interests.
          </p>
          <button className="bg-transparent border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white px-8 py-3 rounded-full font-abeze font-medium transition-all duration-300">
            Custom Tour Request
          </button>
        </div>
      </div>
    </section>
  );
};

export default SafariPackages; 
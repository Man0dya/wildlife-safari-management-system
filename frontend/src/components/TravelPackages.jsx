import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TravelPackages = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setRedirectPath } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');

  const categories = [
    { id: 'all', name: 'All Packages' },
    { id: 'safari', name: 'Safari Tours' },
    { id: 'hiking', name: 'Hiking' },
    { id: 'photography', name: 'Photography' },
    { id: 'birding', name: 'Bird Watching' },
    { id: 'adventure', name: 'Adventure' }
  ];

  const durations = [
    { id: 'all', name: 'Any Duration' },
    { id: '1-day', name: '1 Day' },
    { id: '2-3-days', name: '2-3 Days' },
    { id: '4-7-days', name: '4-7 Days' },
    { id: '8+days', name: '8+ Days' }
  ];

  const priceRanges = [
    { id: 'all', name: 'Any Price' },
    { id: 'budget', name: 'Budget (Under LKR 25,000)' },
    { id: 'mid-range', name: 'Mid-Range (LKR 25,000 - 75,000)' },
    { id: 'luxury', name: 'Luxury (Over LKR 75,000)' }
  ];

  const packages = [
    {
      id: 1,
      title: "Yala National Park Safari",
      category: "safari",
      duration: "2-3-days",
      price: "LKR 45,000",
      originalPrice: "LKR 52,000",
      rating: 4.8,
      reviews: 127,
      description: "Experience Sri Lanka's most famous wildlife sanctuary, home to leopards, elephants, and diverse bird species.",
      highlights: ["Leopard sightings", "Elephant herds", "Bird watching", "Luxury tented camp"],
      image: "🐆",
      popular: true,
      discount: "15% OFF"
    },
    {
      id: 2,
      title: "Minneriya Elephant Gathering",
      category: "hiking",
      duration: "1-day",
      price: "LKR 25,000",
      originalPrice: "LKR 28,000",
      rating: 4.9,
      reviews: 89,
      description: "Witness the spectacular gathering of wild elephants at Minneriya National Park during the dry season.",
      highlights: ["Elephant gathering", "Expert guide", "Safari jeep", "Refreshments"],
      image: "🐘",
      discount: "10% OFF"
    },
    {
      id: 3,
      title: "Sinharaja Rainforest Trek",
      category: "adventure",
      duration: "4-7-days",
      price: "LKR 65,000",
      originalPrice: "LKR 70,000",
      rating: 4.7,
      reviews: 156,
      description: "Explore the UNESCO World Heritage rainforest with endemic birds, butterflies, and rare wildlife.",
      highlights: ["Rainforest trek", "Bird watching", "Eco-lodge", "Local cuisine"],
      image: "🌿",
      discount: "7% OFF"
    },
    {
      id: 4,
      title: "Wilpattu Leopard Safari",
      category: "safari",
      duration: "2-3-days",
      price: "LKR 55,000",
      originalPrice: "LKR 60,000",
      rating: 4.6,
      reviews: 94,
      description: "Track leopards in Sri Lanka's largest national park with pristine wilderness and ancient ruins.",
      highlights: ["Leopard tracking", "Wilderness camping", "Archaeological sites", "Sunset safari"],
      image: "🐆",
      discount: "8% OFF"
    },
    {
      id: 5,
      title: "Professional Wildlife Photography",
      category: "photography",
      duration: "4-7-days",
      price: "LKR 85,000",
      originalPrice: "LKR 95,000",
      rating: 4.9,
      reviews: 67,
      description: "Perfect your wildlife photography skills with professional photographers and prime locations.",
      highlights: ["Photo workshops", "Premium locations", "Equipment rental", "Editing sessions"],
      image: "📸",
      discount: "11% OFF"
    },
    {
      id: 6,
      title: "Bird Watching Paradise",
      category: "birding",
      duration: "4-7-days",
      price: "LKR 75,000",
      originalPrice: "LKR 82,000",
      rating: 4.8,
      reviews: 112,
      description: "Discover the diverse bird species of Sri Lanka with expert ornithologists and premium equipment.",
      highlights: ["Bird expert guide", "Optical equipment", "Multiple habitats", "Photography tips"],
      image: "🦜",
      discount: "9% OFF"
    },
    {
      id: 7,
      title: "Hiking Adventure",
      category: "hiking",
      duration: "8+days",
      price: "LKR 95,000",
      originalPrice: "LKR 110,000",
      rating: 4.9,
      reviews: 43,
      description: "Join our hiking adventures and explore the beautiful trails while experiencing Sri Lankan wildlife up close.",
      highlights: ["Hiking trails", "Mountain views", "Community engagement", "Accommodation"],
      image: "🏔️",
      discount: "14% OFF"
    },
    {
      id: 8,
      title: "Adventure Safari Combo",
      category: "adventure",
      duration: "4-7-days",
      price: "LKR 120,000",
      originalPrice: "LKR 135,000",
      rating: 4.7,
      reviews: 78,
      description: "Combine multiple national parks for the ultimate Sri Lankan wildlife adventure experience.",
      highlights: ["Multiple parks", "Adventure activities", "Luxury accommodation", "Expert guides"],
      image: "🏔️",
      discount: "11% OFF"
    }
  ];

  const filteredPackages = packages.filter(pkg => {
    const categoryMatch = selectedCategory === 'all' || pkg.category === selectedCategory;
    const durationMatch = selectedDuration === 'all' || pkg.duration === selectedDuration;
    const priceMatch = selectedPrice === 'all' || 
      (selectedPrice === 'budget' && parseInt(pkg.price.replace(/\D/g, '')) < 25000) ||
      (selectedPrice === 'mid-range' && parseInt(pkg.price.replace(/\D/g, '')) >= 25000 && parseInt(pkg.price.replace(/\D/g, '')) <= 75000) ||
      (selectedPrice === 'luxury' && parseInt(pkg.price.replace(/\D/g, '')) > 75000);
    
    return categoryMatch && durationMatch && priceMatch;
  });

  const handleBookNow = (packageId) => {
    if (!isAuthenticated) {
      // Set the redirect path to the booking page for this package
      setRedirectPath(`/booking/${packageId}`);
      // Navigate to travel packages page where they can login
      navigate('/travel-packages');
      return;
    }
    navigate(`/booking/${packageId}`);
  };

  return (
    <section id="travel-packages" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-6">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-abeze font-bold text-white mb-4">
            Travel <span className="text-green-400">Packages</span>
          </h1>
          <p className="text-gray-300 text-lg font-abeze max-w-3xl mx-auto">
            Discover our complete collection of Sri Lankan wildlife experiences. From day trips to extended adventures, 
            find the perfect safari package for your dream wildlife encounter.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-white font-abeze font-medium mb-3">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze focus:border-green-400 focus:outline-none transition-colors"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            {/* Duration Filter */}
            <div>
              <label className="block text-white font-abeze font-medium mb-3">Duration</label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze focus:border-green-400 focus:outline-none transition-colors"
              >
                {durations.map(duration => (
                  <option key={duration.id} value={duration.id}>{duration.name}</option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-white font-abeze font-medium mb-3">Price Range</label>
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze focus:border-green-400 focus:outline-none transition-colors"
              >
                {priceRanges.map(price => (
                  <option key={price.id} value={price.id}>{price.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-300 font-abeze">
            Showing {filteredPackages.length} of {packages.length} packages
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredPackages.map((pkg) => (
            <div 
              key={pkg.id}
              className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Discount Badge */}
              {pkg.discount && (
                <div className="absolute -top-3 left-4">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-abeze font-medium">
                    {pkg.discount}
                  </span>
                </div>
              )}

              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-abeze font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Package Icon */}
              <div className="text-6xl mb-4 text-center">
                {pkg.image}
              </div>

              {/* Package Title */}
              <h3 className="text-xl font-abeze font-bold text-white mb-2 text-center">
                {pkg.title}
              </h3>

              {/* Rating */}
              <div className="flex items-center justify-center mb-3">
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="text-white font-abeze font-medium">{pkg.rating}</span>
                  <span className="text-gray-400 font-abeze text-sm ml-1">({pkg.reviews})</span>
                </div>
              </div>

              {/* Price */}
              <div className="text-center mb-4">
                <span className="text-3xl font-abeze font-bold text-white">
                  {pkg.price}
                </span>
                {pkg.originalPrice && (
                  <span className="text-gray-400 font-abeze text-sm line-through ml-2">
                    {pkg.originalPrice}
                  </span>
                )}
                <span className="text-gray-400 font-abeze text-sm block">per person</span>
              </div>

              {/* Description */}
              <p className="text-gray-300 font-abeze text-sm mb-6 text-center leading-relaxed">
                {pkg.description}
              </p>

              {/* Highlights */}
              <ul className="space-y-2 mb-6">
                {pkg.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-center text-gray-300 font-abeze text-sm">
                    <span className="text-green-400 mr-2">✓</span>
                    {highlight}
                  </li>
                ))}
              </ul>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={() => handleBookNow(pkg.id)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-abeze font-medium transition-colors duration-300"
                >
                  Book Now
                </button>
                <button 
                  onClick={() => navigate(`/package/${pkg.id}`)}
                  className="w-full bg-transparent border border-green-400 text-green-400 hover:bg-green-400 hover:text-white py-2 rounded-lg font-abeze font-medium transition-all duration-300"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-abeze font-bold text-white mb-2">
              No packages found
            </h3>
            <p className="text-gray-300 font-abeze">
              Try adjusting your filters to find the perfect package for your wildlife adventure.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-green-600/20 to-green-400/20 backdrop-blur-sm rounded-2xl p-8 border border-green-400/30">
            <h3 className="text-2xl font-abeze font-bold text-white mb-4">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-gray-300 font-abeze mb-6 max-w-2xl mx-auto">
              We can create a custom wildlife experience tailored to your specific interests, group size, and travel dates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-abeze font-bold transition-colors duration-300">
                Request Custom Package
              </button>
              <button className="bg-transparent border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white px-8 py-3 rounded-full font-abeze font-bold transition-all duration-300">
                Contact Our Experts
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelPackages; 
import React, { useState, useEffect } from 'react';
import { reviewApi } from '../services/api';

const ReviewsDisplay = ({ packageId, showAll = false }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        
        const response = await reviewApi.getPackageReviews(packageId, { 
          page: 1, 
          limit: showAll ? 50 : 5 
        });
        
        if (response.success) {
          setReviews(response.reviews);
        } else {
          setError(response.message || 'Failed to load reviews');
        }
      } catch (err) {
        console.error('❌ Error fetching reviews:', err);
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    if (packageId) {
      fetchReviews();
    }
  }, [packageId, showAll]);

  // Auto-play slideshow for more than 1 review
  useEffect(() => {
    if (reviews.length <= 1 || isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % reviews.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [reviews.length, isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const handleImageError = (imageUrl) => {
    console.error('❌ Image failed to load:', imageUrl);
    setImageErrors(prev => ({
      ...prev,
      [imageUrl]: true
    }));
  };

  const handleImageLoad = (imageUrl) => {
    console.log('✅ Image loaded successfully:', imageUrl);
  };

  const getFallbackImage = () => {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIyMC45MTMgMTUwIDIzNy41IDEzMy40MTMgMjM3LjUgMTEyLjVDMjM3LjUgOTEuNTg3IDIyMC45MTMgNzUgMjAwIDc1QzE3OS4wODcgNzUgMTYyLjUgOTEuNTg3IDE2Mi41IDExMi41QzE2Mi41IDEzMy40MTMgMTc5LjA4NyAxNTAgMjAwIDE1MFoiIGZpbGw9IiM2QjcyOEQiLz4KPHBhdGggZD0iTTEwMCAyMjVDMTAwIDIwMC4wODcgMTQ1LjA4NyAxNzUgMjAwIDE3NUMyNTQuOTEzIDE3NSAzMDAgMjAwLjA4NyAzMDAgMjI1VjI1MEgxMDBWMjI1WiIgZmlsbD0iIzZCNzI4RCIvPgo8L3N2Zz4K';
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400 mx-auto"></div>
        <p className="text-gray-400 text-sm mt-2">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-400 text-sm">No reviews yet</p>
      </div>
    );
  }

  if (!showAll && reviews.length <= 5) {
    // Show all reviews if 5 or fewer
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-abeze font-semibold text-white mb-4">
          Recent Reviews ({reviews.length})
        </h3>
        {reviews.map((review) => (
          <div key={review._id} className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-abeze font-semibold text-sm">
                    {review.userId?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-sm ${
                          star <= review.rating ? 'text-yellow-400' : 'text-gray-400'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-white text-sm font-abeze">
                    {review.rating}/5
                  </span>
                </div>
                <h4 className="font-abeze font-semibold text-white text-sm mb-1">
                  {review.title}
                </h4>
                <p className="text-gray-300 text-sm mb-2 line-clamp-2">
                  {review.review}
                </p>
                
                {/* Review Images - Enhanced Display with Error Handling */}
                {review.images && review.images.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-2">
                      {review.images.map((image, imgIndex) => (
                        <div key={imgIndex} className="relative group">
                          <img
                            src={imageErrors[image.url] ? getFallbackImage() : image.url}
                            alt={`Review photo ${imgIndex + 1}`}
                            className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-all duration-300 shadow-md hover:shadow-lg border border-white/20"
                            onClick={() => openImageModal(image)}
                            title="Click to view full size"
                            onError={() => handleImageError(image.url)}
                            onLoad={() => handleImageLoad(image.url)}
                            crossOrigin="anonymous"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 font-abeze">
                      {review.images.length} photo{review.images.length !== 1 ? 's' : ''} • Click to enlarge
                    </p>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="font-abeze">
                    {review.userId?.firstName} {review.userId?.lastName}
                  </span>
                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Slideshow for more than 5 reviews
  return (
    <div className="relative">
      <h3 className="text-lg font-abeze font-semibold text-white mb-4">
        Recent Reviews ({reviews.length})
      </h3>
      
      <div className="relative bg-white/5 rounded-lg p-6 border border-white/10"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}>
        {/* Navigation Arrows */}
        {reviews.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors z-10"
              aria-label="Previous review"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors z-10"
              aria-label="Next review"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Current Review */}
        <div className="text-center">
          {/* Pause Indicator */}
          {isPaused && reviews.length > 1 && (
            <div className="absolute top-2 right-2 bg-yellow-500/80 text-white text-xs px-2 py-1 rounded-full font-abeze">
              Paused
            </div>
          )}
          
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-abeze font-semibold text-base">
                {reviews[currentSlide]?.userId?.firstName?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h4 className="font-abeze font-semibold text-white text-lg">
                {reviews[currentSlide]?.title}
              </h4>
              <p className="text-gray-300 text-sm">
                {reviews[currentSlide]?.userId?.firstName} {reviews[currentSlide]?.userId?.lastName}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-xl ${
                  star <= reviews[currentSlide]?.rating ? 'text-yellow-400' : 'text-gray-400'
                }`}
              >
                ★
              </span>
            ))}
            <span className="text-white text-sm font-abeze ml-2">
              {reviews[currentSlide]?.rating}/5
            </span>
          </div>

          <p className="text-gray-300 text-base mb-4 leading-relaxed">
            "{reviews[currentSlide]?.review}"
          </p>

          {/* Review Images - Enhanced Slideshow Display with Error Handling */}
          {reviews[currentSlide]?.images && reviews[currentSlide].images.length > 0 && (
            <div className="mb-4">
              <div className="flex justify-center flex-wrap gap-3">
                {reviews[currentSlide].images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageErrors[image.url] ? getFallbackImage() : image.url}
                      alt={`Review photo ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
                      onClick={() => openImageModal(image)}
                      title="Click to view full size"
                      onError={() => handleImageError(image.url)}
                      onLoad={() => handleImageLoad(image.url)}
                      crossOrigin="anonymous"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-2 font-abeze">
                {reviews[currentSlide].images.length} photo{reviews[currentSlide].images.length !== 1 ? 's' : ''} • Click to enlarge
              </p>
            </div>
          )}

          <p className="text-gray-400 text-sm font-abeze">
            {new Date(reviews[currentSlide]?.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Slide Indicators */}
        {reviews.length > 1 && (
          <div className="flex justify-center space-x-2 mt-6">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-green-400' : 'bg-white/30'
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={imageErrors[selectedImage.url] ? getFallbackImage() : selectedImage.url}
              alt="Review photo"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
              onError={() => handleImageError(selectedImage.url)}
              crossOrigin="anonymous"
            />
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
              aria-label="Close image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-abeze">
              Click outside to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsDisplay;

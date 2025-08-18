import React, { useState } from 'react';
import { reviewApi } from '../services/api';

const ReviewModal = ({ isOpen, onClose, booking, onReviewSubmitted }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    review: ''
  });
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.review.trim()) {
      newErrors.review = 'Review is required';
    }
    
    if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (formData.review.length > 1000) {
      newErrors.review = 'Review must be less than 1000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (images.length > 0) {
        // Create review with images
        const formDataWithImages = new FormData();
        formDataWithImages.append('bookingId', booking._id);
        formDataWithImages.append('rating', formData.rating);
        formDataWithImages.append('title', formData.title);
        formDataWithImages.append('review', formData.review);
        
        images.forEach((image, index) => {
          formDataWithImages.append('images', image);
        });
        
        // Debug: Log what's being sent
        console.log('FormData contents:');
        for (let [key, value] of formDataWithImages.entries()) {
          console.log(key, value);
        }
        
        await reviewApi.createReviewWithImages(formDataWithImages);
      } else {
        // Create review without images
        await reviewApi.createReview({
          bookingId: booking._id,
          rating: formData.rating,
          title: formData.title,
          review: formData.review
        });
      }
      
      onReviewSubmitted();
      onClose();
      
      // Reset form
      setFormData({
        rating: 5,
        title: '',
        review: ''
      });
      setImages([]);
      setErrors({});
      
    } catch (error) {
      console.error('Error submitting review:', error);
      
      // Show more detailed error message
      let errorMessage = 'Failed to submit review. Please try again.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      // Reset form
      setFormData({
        rating: 5,
        title: '',
        review: ''
      });
      setImages([]);
      setErrors({});
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-abeze font-bold text-gray-800">
            Add Your Review
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Package Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-abeze font-semibold text-gray-800 mb-2">
              {booking.packageDetails?.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {booking.packageDetails?.location} • {booking.packageDetails?.duration}
            </p>
            <p className="text-gray-600 text-sm">
              Completed on {new Date(booking.updatedAt).toLocaleDateString()}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-abeze font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className={`text-2xl transition-colors ${
                      star <= formData.rating
                        ? 'text-yellow-400 hover:text-yellow-500'
                        : 'text-gray-300 hover:text-gray-400'
                    }`}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {formData.rating} out of 5
                </span>
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-abeze font-medium text-gray-700 mb-2">
                Review Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                maxLength={100}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Summarize your experience in a few words"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.title.length}/100 characters
              </p>
            </div>

            {/* Review Text */}
            <div>
              <label htmlFor="review" className="block text-sm font-abeze font-medium text-gray-700 mb-2">
                Your Review *
              </label>
              <textarea
                id="review"
                name="review"
                value={formData.review}
                onChange={handleInputChange}
                rows={5}
                maxLength={1000}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.review ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Share your experience, what you enjoyed, and any suggestions..."
              />
              {errors.review && (
                <p className="mt-1 text-sm text-red-600">{errors.review}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.review.length}/1000 characters
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="images" className="block text-sm font-abeze font-medium text-gray-700 mb-2">
                Upload Photos (Optional)
              </label>
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                You can upload multiple images. Supported formats: JPG, PNG, GIF
              </p>
              {images.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-abeze font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-abeze font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;

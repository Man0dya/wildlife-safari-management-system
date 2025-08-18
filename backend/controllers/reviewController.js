import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Package from '../models/Package.js';
import localImageService from '../services/localImageService.js';

// Create a new review
const createReview = async (req, res) => {
  try {
    console.log('Review creation request received');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    // Handle both regular JSON and multipart form data
    let bookingId, rating, title, review;
    
    if (req.files && req.files.length > 0) {
      // Multipart form data - fields are in req.body as strings
      bookingId = req.body.bookingId;
      rating = parseInt(req.body.rating);
      title = req.body.title;
      review = req.body.review;
      
      console.log('Multipart form data parsed:', { bookingId, rating, title, review });
    } else {
      // Regular JSON request
      ({ bookingId, rating, title, review } = req.body);
      console.log('JSON data parsed:', { bookingId, rating, title, review });
    }

    const userId = req.user._id;

    // Validate required fields
    if (!bookingId || !rating || !title || !review) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: bookingId, rating, title, and review are required'
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if booking exists and belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only review your own bookings'
      });
    }

    // Check if booking is completed
    if (booking.status !== 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'You can only review completed bookings'
      });
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this booking'
      });
    }

    // Handle image uploads if files are present
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      try {
        console.log(`Processing ${req.files.length} image files`);
        
        // Upload images to ImgBB
        const imageBuffers = req.files.map(file => file.buffer);
        const filenames = req.files.map(file => file.originalname);

        const uploadResult = await localImageService.uploadMultipleImages(imageBuffers, filenames);
        
        if (uploadResult.success) {
          uploadedImages = uploadResult.images.map(img => ({
            url: img.url,
            deleteUrl: img.deleteUrl,
            id: img.id
          }));
          console.log(`Successfully uploaded ${uploadedImages.length} images`);
        }
      } catch (imageError) {
        console.error('Image upload error:', imageError);
        // Continue without images if upload fails
      }
    }

    // Create new review
    const newReview = new Review({
      userId,
      bookingId,
      packageId: booking.packageId,
      rating,
      title,
      review,
      images: uploadedImages
    });

    await newReview.save();

    // Update package rating and review count
    await updatePackageRating(booking.packageId);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: newReview
    });

  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

// Get reviews for a specific package
const getPackageReviews = async (req, res) => {
  try {
    const { packageId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ 
      packageId, 
      isActive: true 
    })
    .select('userId rating title review images createdAt isActive') // Explicitly select fields
    .populate('userId', 'firstName lastName profilePicture')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Review.countDocuments({ 
      packageId, 
      isActive: true 
    });

    res.json({
      success: true,
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get package reviews error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all reviews (for admin)
const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20, packageId, rating } = req.query;
    
    let filter = { isActive: true };
    if (packageId) filter.packageId = packageId;
    if (rating) filter.rating = parseInt(rating);

    const reviews = await Review.find(filter)
      .populate('userId', 'firstName lastName email')
      .populate('packageId', 'title location')
      .populate('bookingId', 'bookingDetails')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(filter);

    res.json({
      success: true,
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });

  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user's reviews
const getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const reviews = await Review.find({ userId })
      .populate('packageId', 'title location image')
      .populate('bookingId', 'bookingDetails')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews
    });

  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update review
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, review } = req.body;
    const userId = req.user._id;

    const reviewDoc = await Review.findById(reviewId);
    if (!reviewDoc) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (reviewDoc.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own reviews'
      });
    }

    reviewDoc.rating = rating;
    reviewDoc.title = title;
    reviewDoc.review = review;
    await reviewDoc.save();

    // Update package rating
    await updatePackageRating(reviewDoc.packageId);

    res.json({
      success: true,
      message: 'Review updated successfully',
      review: reviewDoc
    });

  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete review (admin only)
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await Review.findByIdAndDelete(reviewId);

    // Update package rating
    await updatePackageRating(review.packageId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Upload review images
const uploadReviewImages = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only upload images to your own reviews'
      });
    }

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded'
      });
    }

    // Upload images to ImgBB
    const imageBuffers = req.files.map(file => file.buffer);
    const filenames = req.files.map(file => file.originalname);

    const uploadResult = await localImageService.uploadMultipleImages(imageBuffers, filenames);
    
    if (uploadResult.success) {
      // Add new images to the review
      const newImages = uploadResult.images.map(img => ({
        url: img.url,
        deleteUrl: img.deleteUrl,
        id: img.id
      }));

      review.images = [...review.images, ...newImages];
      await review.save();

      res.json({
        success: true,
        message: 'Images uploaded successfully',
        images: newImages,
        review
      });
    } else {
      throw new Error('Failed to upload images');
    }

  } catch (error) {
    console.error('Upload review images error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload images'
    });
  }
};

// Helper function to update package rating
const updatePackageRating = async (packageId) => {
  try {
    const reviews = await Review.find({ 
      packageId, 
      isActive: true 
    });

    if (reviews.length === 0) {
      await Package.findByIdAndUpdate(packageId, {
        rating: 0,
        reviews: 0
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Package.findByIdAndUpdate(packageId, {
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      reviews: reviews.length
    });

    console.log(`Updated package ${packageId} rating to ${Math.round(averageRating * 10) / 10} with ${reviews.length} reviews`);

  } catch (error) {
    console.error('Update package rating error:', error);
    // Don't throw error here as it shouldn't break the review creation
  }
};

export {
  createReview,
  getPackageReviews,
  getAllReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  uploadReviewImages
};

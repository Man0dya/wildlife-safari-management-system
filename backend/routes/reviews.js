import express from 'express';
import { 
  createReview,
  getPackageReviews,
  getAllReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  uploadReviewImages
} from '../controllers/reviewController.js';
import { authenticateToken as auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/auth.js';
import { handleMultipartForm } from '../middleware/upload.js';

const reviewRouter = express.Router();

// Public routes
reviewRouter.get('/package/:packageId', getPackageReviews);

// User routes (require authentication)
reviewRouter.post('/', auth, createReview);
reviewRouter.post('/with-images', auth, handleMultipartForm('images', 5), createReview);
reviewRouter.get('/user', auth, getUserReviews);
reviewRouter.put('/:reviewId', auth, updateReview);
reviewRouter.post('/:reviewId/images', auth, handleMultipartForm('images', 5), uploadReviewImages);

// Admin routes (require admin role)
reviewRouter.get('/admin/all', auth, requireRole(['admin']), getAllReviews);
reviewRouter.delete('/admin/:reviewId', auth, requireRole(['admin']), deleteReview);

export default reviewRouter;

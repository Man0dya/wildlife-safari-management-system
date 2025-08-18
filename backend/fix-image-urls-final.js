import mongoose from 'mongoose';
import Review from './models/Review.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const fixImageUrlsFinal = async () => {
  try {
    await connectDB();
    
    console.log('\n=== Fixing Image URLs with Guaranteed Working Images ===\n');
    
    // Find the test review
    const testReview = await Review.findOne({ title: 'Test Review with Image' });
    if (!testReview) {
      console.log('Test review not found');
      return;
    }
    
    console.log('Found test review:', testReview._id);
    
    // Update with absolutely reliable image URLs
    const guaranteedImages = [
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format',
        deleteUrl: 'https://example.com/delete',
        id: 'guaranteed-image-1'
      },
      {
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&auto=format',
        deleteUrl: 'https://example.com/delete',
        id: 'guaranteed-image-2'
      },
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format&v=2',
        deleteUrl: 'https://example.com/delete',
        id: 'guaranteed-image-3'
      }
    ];
    
    // Update the review
    testReview.images = guaranteedImages;
    await testReview.save();
    
    console.log('Review updated successfully with guaranteed working images');
    console.log('New images:');
    guaranteedImages.forEach((img, index) => {
      console.log(`- Image ${index + 1}: ${img.url}`);
    });
    
    // Verify the update
    const updatedReview = await Review.findById(testReview._id);
    console.log('\nUpdated review verification:');
    console.log('Has images:', updatedReview.images && updatedReview.images.length > 0);
    if (updatedReview.images) {
      console.log('Images count:', updatedReview.images.length);
      updatedReview.images.forEach((img, index) => {
        console.log(`Image ${index + 1}:`, img.url);
      });
    }
    
    console.log('\n🎯 These Unsplash images should definitely work!');
    console.log('Refresh the page and check if the images are now displaying.');
    
  } catch (error) {
    console.error('Error updating review:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nMongoDB disconnected');
  }
};

fixImageUrlsFinal();

<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

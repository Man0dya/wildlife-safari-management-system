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

const checkAllReviewsImages = async () => {
  try {
    await connectDB();
    
    console.log('\n=== Checking All Reviews for Images ===\n');
    
    // Get all reviews
    const allReviews = await Review.find({}).sort({ createdAt: -1 });
    
    console.log(`📊 Total reviews in database: ${allReviews.length}`);
    
    let reviewsWithImages = 0;
    let totalImages = 0;
    
    allReviews.forEach((review, index) => {
      console.log(`\n--- Review ${index + 1} ---`);
      console.log(`ID: ${review._id}`);
      console.log(`Title: ${review.title}`);
      console.log(`Rating: ${review.rating}`);
      console.log(`Package ID: ${review.packageId}`);
      console.log(`Has images: ${review.images && review.images.length > 0 ? 'Yes' : 'No'}`);
      
      if (review.images && review.images.length > 0) {
        reviewsWithImages++;
        totalImages += review.images.length;
        console.log(`Images count: ${review.images.length}`);
        review.images.forEach((img, imgIndex) => {
          console.log(`  Image ${imgIndex + 1}:`);
          console.log(`    URL: ${img.url}`);
          console.log(`    ID: ${img.id}`);
          console.log(`    Delete URL: ${img.deleteUrl}`);
        });
      } else {
        console.log('Images: None');
      }
    });
    
    console.log('\n=== SUMMARY ===');
    console.log(`Total reviews: ${allReviews.length}`);
    console.log(`Reviews with images: ${reviewsWithImages}`);
    console.log(`Total images: ${totalImages}`);
    
    if (reviewsWithImages > 0) {
      console.log('\n🎯 To test images, navigate to a package with reviews that have images.');
      console.log('Check the browser console for image loading success/error messages.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nMongoDB disconnected');
  }
};

checkAllReviewsImages();



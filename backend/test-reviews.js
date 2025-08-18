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

const testReviews = async () => {
  try {
    await connectDB();
    
    console.log('\n=== Testing Reviews with Images ===\n');
    
    // Get all reviews
    const allReviews = await Review.find({}).lean();
    console.log(`Total reviews in database: ${allReviews.length}`);
    
    // Check reviews with images
    const reviewsWithImages = allReviews.filter(review => review.images && review.images.length > 0);
    console.log(`Reviews with images: ${reviewsWithImages.length}`);
    
    if (reviewsWithImages.length > 0) {
      console.log('\nFirst review with images:');
      console.log(JSON.stringify(reviewsWithImages[0], null, 2));
      
      console.log('\nAll reviews with images:');
      reviewsWithImages.forEach((review, index) => {
        console.log(`\nReview ${index + 1}:`);
        console.log(`- ID: ${review._id}`);
        console.log(`- Title: ${review.title}`);
        console.log(`- Images count: ${review.images.length}`);
        review.images.forEach((img, imgIndex) => {
          console.log(`  - Image ${imgIndex + 1}: ${img.url}`);
        });
      });
    } else {
      console.log('\nNo reviews with images found in the database.');
      console.log('This might be the issue - no reviews have been created with images yet.');
    }
    
    // Check a specific package if provided
    if (process.argv[2]) {
      const packageId = process.argv[2];
      console.log(`\n=== Checking reviews for package: ${packageId} ===`);
      
      const packageReviews = await Review.find({ packageId }).lean();
      console.log(`Reviews for package ${packageId}: ${packageReviews.length}`);
      
      if (packageReviews.length > 0) {
        packageReviews.forEach((review, index) => {
          console.log(`\nReview ${index + 1}:`);
          console.log(`- Title: ${review.title}`);
          console.log(`- Has images: ${review.images && review.images.length > 0 ? 'Yes' : 'No'}`);
          if (review.images && review.images.length > 0) {
            console.log(`- Images: ${review.images.length}`);
            review.images.forEach((img, imgIndex) => {
              console.log(`  - Image ${imgIndex + 1}: ${img.url}`);
            });
          }
        });
      }
    }
    
  } catch (error) {
    console.error('Error testing reviews:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nMongoDB disconnected');
  }
};

testReviews();


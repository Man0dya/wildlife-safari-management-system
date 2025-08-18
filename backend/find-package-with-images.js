import mongoose from 'mongoose';
import Review from './models/Review.js';
import Package from './models/Package.js';
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

const findPackageWithImages = async () => {
  try {
    await connectDB();
    
    console.log('\n=== Finding Package with Test Review Images ===\n');
    
    // Find the test review with images
    const testReview = await Review.findOne({ title: 'Test Review with Image' });
    if (!testReview) {
      console.log('❌ Test review not found');
      return;
    }
    
    console.log('✅ Test review found:', testReview._id);
    console.log('📝 Title:', testReview.title);
    console.log('📦 Package ID:', testReview.packageId);
    console.log('📸 Images count:', testReview.images ? testReview.images.length : 0);
    
    if (testReview.images && testReview.images.length > 0) {
      console.log('\n🖼️ Image details:');
      testReview.images.forEach((img, index) => {
        console.log(`  Image ${index + 1}: ${img.url}`);
      });
    }
    
    // Get package details
    const packageData = await Package.findById(testReview.packageId);
    if (packageData) {
      console.log('\n📦 Package Details:');
      console.log('  Title:', packageData.title);
      console.log('  Location:', packageData.location);
      console.log('  Price:', packageData.price);
      console.log('  Is Active:', packageData.isActive);
    }
    
    // Find all reviews for this package
    const packageReviews = await Review.find({ 
      packageId: testReview.packageId, 
      isActive: true 
    }).sort({ createdAt: -1 });
    
    console.log(`\n📊 Total reviews for this package: ${packageReviews.length}`);
    
    packageReviews.forEach((review, index) => {
      console.log(`\nReview ${index + 1}:`);
      console.log(`  ID: ${review._id}`);
      console.log(`  Title: ${review.title}`);
      console.log(`  Rating: ${review.rating}`);
      console.log(`  Has images: ${review.images && review.images.length > 0 ? 'Yes' : 'No'}`);
      if (review.images && review.images.length > 0) {
        console.log(`  Images: ${review.images.length}`);
        review.images.forEach((img, imgIndex) => {
          console.log(`    Image ${imgIndex + 1}: ${img.url}`);
        });
      }
    });
    
    console.log('\n🎯 To see the images:');
    console.log(`Navigate to: /package/${testReview.packageId}`);
    console.log('Or find the package with title:', packageData?.title);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nMongoDB disconnected');
  }
};

findPackageWithImages();

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

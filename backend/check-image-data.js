import mongoose from 'mongoose';
import Review from './models/Review.js';

async function checkImageData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/wildlife_safari');
    console.log('Connected to MongoDB');

    const reviews = await Review.find({}).populate('userId', 'firstName lastName').lean();
    
    console.log(`Found ${reviews.length} reviews`);
    console.log('='.repeat(50));
    
    reviews.forEach((review, index) => {
      console.log(`Review ${index + 1}:`);
      console.log('  ID:', review._id);
      console.log('  User:', review.userId?.firstName, review.userId?.lastName);
      console.log('  Images count:', review.images?.length || 0);
      
      if (review.images && review.images.length > 0) {
        review.images.forEach((img, imgIndex) => {
          console.log(`    Image ${imgIndex + 1}:`);
          console.log('      URL type:', typeof img.url);
          console.log('      URL length:', img.url ? img.url.length : 'null');
          
          if (img.url) {
            if (img.url.startsWith('data:')) {
              console.log('      URL is base64 data URL');
              console.log('      Data URL prefix:', img.url.substring(0, 50) + '...');
            } else {
              console.log('      URL is external link');
              console.log('      URL preview:', img.url.substring(0, 100) + '...');
            }
          } else {
            console.log('      URL is null or undefined');
          }
        });
      } else {
        console.log('  No images found');
      }
      console.log('');
    });

    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkImageData();

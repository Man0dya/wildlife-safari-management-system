import mongoose from 'mongoose';
import Review from './models/Review.js';

// Reliable external image URLs for testing
const externalImages = [
  {
    url: 'https://via.placeholder.com/200x200/4CAF61/FFFFFF?text=Green',
    filename: 'green-placeholder.png'
  },
  {
    url: 'https://via.placeholder.com/200x200/3B82FB/FFFFFF?text=Blue',
    filename: 'blue-placeholder.png'
  },
  {
    url: 'https://via.placeholder.com/200x200/FF693A/FFFFFF?text=Orange',
    filename: 'orange-placeholder.png'
  }
];

async function updateTestReview() {
  try {
    await mongoose.connect('mongodb://localhost:27017/wildlife_safari');
    console.log('Connected to MongoDB');

    // Find the test review (the one with "srdfbhvsdhshf" title)
    const testReview = await Review.findOne({ title: 'srdfbhvsdhshf' });
    
    if (!testReview) {
      console.log('❌ Test review not found');
      return;
    }

    console.log('Found test review:', testReview._id);
    console.log('Current images count:', testReview.images?.length || 0);

    // Update with external images
    testReview.images = externalImages;
    await testReview.save();

    console.log('✅ Updated test review with external image URLs');
    console.log('New images count:', testReview.images.length);
    
    // Verify the update
    const updatedReview = await Review.findById(testReview._id);
    console.log('Verification - Images count:', updatedReview.images?.length || 0);
    
    if (updatedReview.images && updatedReview.images.length > 0) {
      updatedReview.images.forEach((img, index) => {
        console.log(`Image ${index + 1}:`);
        console.log('  URL:', img.url);
        console.log('  Filename:', img.filename);
      });
    }

    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateTestReview();

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

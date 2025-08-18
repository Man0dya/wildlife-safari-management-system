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

const updateTestReviewWithLocalImages = async () => {
  try {
    await connectDB();
    
    console.log('\n=== Updating Test Review with Local Images ===\n');
    
    // Find the test review
    const testReview = await Review.findOne({ title: 'Test Review with Image' });
    if (!testReview) {
      console.log('Test review not found');
      return;
    }
    
    console.log('Found test review:', testReview._id);
    
    // Create sample local images (base64 encoded simple images)
    const localImages = [
      {
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMTA5ODY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIyMC45MTMgMTUwIDIzNy41IDEzMy40MTMgMjM3LjUgMTEyLjVDMjM3LjUgOTEuNTg3IDIyMC45MTMgNzUgMjAwIDc1QzE3OS4wODcgNzUgMTYyLjUgOTEuNTg3IDE2Mi41IDExMi41QzE2Mi41IDEzMy40MTMgMTc5LjA4NyAxNTAgMjAwIDE1MFoiIGZpbGw9IiM2QjcyOEQiLz4KPHBhdGggZD0iTTEwMCAyMjVDMTAwIDIwMC4wODcgMTQ1LjA4NyAxNzUgMjAwIDE3NUMyNTQuOTEzIDE3NSAzMDAgMjAwLjA4NyAzMDAgMjI1VjI1MEgxMDBWMjI1WiIgZmlsbD0iIzZCNzI4RCIvPgo8L3N2Zz4K',
        deleteUrl: 'local://test-image-1',
        id: 'local-test-image-1'
      },
      {
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjM0I4MkY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIyMC45MTMgMTUwIDIzNy41IDEzMy40MTMgMjM3LjUgMTEyLjVDMjM3LjUgOTEuNTg3IDIyMC45MTMgNzUgMjAwIDc1QzE3OS4wODcgNzUgMTYyLjUgOTEuNTg3IDE2Mi41IDExMi41QzE2Mi41IDEzMy40MTMgMTc5LjA4NyAxNTAgMjAwIDE1MFoiIGZpbGw9IiM2QjcyOEQiLz4KPHBhdGggZD0iTTEwMCAyMjVDMTAwIDIwMC4wODcgMTQ1LjA4NyAxNzUgMjAwIDE3NUMyNTQuOTEzIDE3NSAzMDAgMjAwLjA4NyAzMDAgMjI1VjI1MEgxMDBWMjI1WiIgZmlsbD0iIzZCNzI4RCIvPgo8L3N2Zz4K',
        deleteUrl: 'local://test-image-2',
        id: 'local-test-image-2'
      },
      {
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjU5RUIwIi8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIyMC45MTMgMTUwIDIzNy41IDEzMy40MTMgMjM3LjUgMTEyLjVDMjM3LjUgOTEuNTg3IDIyMC45MTMgNzUgMjAwIDc1QzE3OS4wODcgNzUgMTYyLjUgOTEuNTg3IDE2Mi41IDExMi41QzE2Mi41IDEzMy40MTMgMTc5LjA4NyAxNTAgMjAwIDE1MFoiIGZpbGw9IiM2QjcyOEQiLz4KPHBhdGggZD0iTTEwMCAyMjVDMTAwIDIwMC4wODcgMTQ1LjA4NyAxNzUgMjAwIDE3NUMyNTQuOTEzIDE3NSAzMDAgMjAwLjA4NyAzMDAgMjI1VjI1MEgxMDBWMjI1WiIgZmlsbD0iIzZCNzI4RCIvPgo8L3N2Zz4K',
        deleteUrl: 'local://test-image-3',
        id: 'local-test-image-3'
      }
    ];
    
    // Update the review
    testReview.images = localImages;
    await testReview.save();
    
    console.log('Review updated successfully with local images');
    console.log('New images:');
    localImages.forEach((img, index) => {
      console.log(`- Image ${index + 1}: ${img.id}`);
    });
    
    // Verify the update
    const updatedReview = await Review.findById(testReview._id);
    console.log('\nUpdated review verification:');
    console.log('Has images:', updatedReview.images && updatedReview.images.length > 0);
    if (updatedReview.images) {
      console.log('Images count:', updatedReview.images.length);
      updatedReview.images.forEach((img, index) => {
        console.log(`Image ${index + 1}:`, img.id);
      });
    }
    
    console.log('\n🎯 These local images will definitely work!');
    console.log('Refresh the page and check if the images are now displaying.');
    
  } catch (error) {
    console.error('Error updating review:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nMongoDB disconnected');
  }
};

updateTestReviewWithLocalImages();

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

import mongoose from 'mongoose';
import Review from './models/Review.js';

// Simple, small base64 data URLs for testing
const simpleImages = [
  {
    url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiM0Q0Y1NjEiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjUwIiBmaWxsPSIjRkZGRkZGIi8+PC9zdmc+',
    filename: 'green-circle.svg'
  },
  {
    url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMzQjgyRkYiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjUwIiBmaWxsPSIjRkZGRkZGIi8+PC9zdmc+',
    filename: 'blue-circle.svg'
  },
  {
    url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGRjY5M0EiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjUwIiBmaWxsPSIjRkZGRkZGIi8+PC9zdmc+',
    filename: 'orange-circle.svg'
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

    // Update with simple images
    testReview.images = simpleImages;
    await testReview.save();

    console.log('✅ Updated test review with simple base64 images');
    console.log('New images count:', testReview.images.length);
    
    // Verify the update
    const updatedReview = await Review.findById(testReview._id);
    console.log('Verification - Images count:', updatedReview.images?.length || 0);
    
    if (updatedReview.images && updatedReview.images.length > 0) {
      updatedReview.images.forEach((img, index) => {
        console.log(`Image ${index + 1}:`);
        console.log('  URL length:', img.url?.length || 0);
        console.log('  Is data URL:', img.url?.startsWith('data:') || false);
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


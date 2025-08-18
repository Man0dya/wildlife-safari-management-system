import axios from 'axios';

const IMGBB_API_KEY = process.env.IMGBB_API_KEY;
const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';

class ImgBBService {
  constructor() {
    if (!IMGBB_API_KEY) {
      console.warn('IMGBB_API_KEY not found in environment variables');
    }
  }

  async uploadImage(imageBuffer, filename) {
    try {
      if (!IMGBB_API_KEY) {
        throw new Error('ImgBB API key not configured');
      }

      // Convert buffer to base64
      const base64Image = imageBuffer.toString('base64');

      // For ImgBB, we need to send the data as form data with base64 string
      const formData = new URLSearchParams();
      formData.append('image', base64Image);
      formData.append('key', IMGBB_API_KEY);
      formData.append('name', filename || 'image');

      const response = await axios.post(IMGBB_API_URL, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 30000, // 30 second timeout
      });

      if (response.data.success) {
        return {
          success: true,
          url: response.data.data.url,
          deleteUrl: response.data.data.delete_url,
          id: response.data.data.id,
          thumbnail: response.data.data.thumb?.url || response.data.data.url,
        };
      } else {
        throw new Error(response.data.error?.message || 'ImgBB upload failed');
      }
    } catch (error) {
      console.error('ImgBB upload error:', error);
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }

  async uploadMultipleImages(imageBuffers, filenames) {
    try {
      const uploadPromises = imageBuffers.map((buffer, index) => 
        this.uploadImage(buffer, filenames[index] || `image_${index + 1}`)
      );

      const results = await Promise.all(uploadPromises);
      return {
        success: true,
        images: results
      };
    } catch (error) {
      console.error('Multiple image upload error:', error);
      throw new Error(`Multiple image upload failed: ${error.message}`);
    }
  }
}

export default new ImgBBService();

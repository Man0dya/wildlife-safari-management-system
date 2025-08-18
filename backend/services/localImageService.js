class LocalImageService {
  async uploadImage(imageBuffer, filename) {
    try {
      // Convert buffer to base64
      const base64Image = imageBuffer.toString('base64');
      const mimeType = this.getMimeType(filename);
      
      // Create data URL
      const dataUrl = `data:${mimeType};base64,${base64Image}`;
      
      return {
        success: true,
        url: dataUrl,
        deleteUrl: 'local://' + filename,
        id: 'local-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        thumbnail: dataUrl,
        filename: filename
      };
    } catch (error) {
      console.error('Local image upload error:', error);
      throw new Error(`Local image upload failed: ${error.message}`);
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
      console.error('Multiple local image upload error:', error);
      throw new Error(`Multiple local image upload failed: ${error.message}`);
    }
  }

  getMimeType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const mimeTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'bmp': 'image/bmp'
    };
    return mimeTypes[ext] || 'image/jpeg';
  }
}

export default new LocalImageService();



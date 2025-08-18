// Simple test to check base64 data URLs
const testBase64Data = [
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIyMC45MTMgMTUwIDIzNy41IDEzMy40MTMgMjM3LjUgMTEyLjVDMjM3LjUgOTEuNTg3IDIyMC45MTMgNzUgMjAwIDc1QzE3OS4wODcgNzUgMTYyLjUgOTEuNTg3IDE2Mi41IDExMi41QzE2Mi41IDEzMy40MTMgMTc5LjA4NyAxNTAgMjAwIDE1MFoiIGZpbGw9IiM2QjcyOEQiLz4KPHBhdGggZD0iTTEwMCAyMjVDMTAwIDIwMC4wODcgMTQ1LjA4NyAxNzUgMjAwIDE3NUMyNTQuOTEzIDE3NSAzMDAgMjAwLjA4NyAzMDAgMjI1VjI1MEgxMDBWMjI1WiIgZmlsbD0iIzZCNzI4RCIvPgo8L3N2Zz4K',
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMDA2NmNjIi8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIyMC45MTMgMTUwIDIzNy41IDEzMy40MTMgMjM3LjUgMTEyLjVDMjM3LjUgOTEuNTg3IDIyMC45MTMgNzUgMjAwIDc1QzE3OS4wODcgNzUgMTYyLjUgOTEuNTg3IDE2Mi41IDExMi41QzE2Mi41IDEzMy40MTMgMTc5LjA4NyAxNTAgMjAwIDE1MFoiIGZpbGw9IiM0MGE5ZmYiLz4KPHBhdGggZD0iTTEwMCAyMjVDMTAwIDIwMC4wODcgMTQ1LjA4NyAxNzUgMjAwIDE3NUMyNTQuOTEzIDE3NSAzMDAgMjAwLjA4NyAzMDAgMjI1VjI1MEgxMDBWMjI1WiIgZmlsbD0iIzQwYTlmZiIvPgo8L3N2Zz4K',
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZmY2YjM1Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIyMC45MTMgMTUwIDIzNy41IDEzMy40MTMgMjM3LjUgMTEyLjVDMjM3LjUgOTEuNTg3IDIyMC45MTMgNzUgMjAwIDc1QzE3OS4wODcgNzUgMTYyLjUgOTEuNTg3IDE2Mi41IDExMi41QzE2Mi41IDEzMy40MTMgMTc5LjA4NyAxNTAgMjAwIDE1MFoiIGZpbGw9IiNmZmE3MjgiLz4KPHBhdGggZD0iTTEwMCAyMjVDMTAwIDIwMC4wODcgMTQ1LjA4NyAxNzUgMjAwIDE3NUMyNTQuOTEzIDE3NSAzMDAgMjAwLjA4NyAzMDAgMjI1VjI1MEgxMDBWMjI1WiIgZmlsbD0iI2ZmYTcyOCIvPgo8L3N2Zz4K'
];

console.log('Testing base64 data URLs...');
testBase64Data.forEach((dataUrl, index) => {
  console.log(`\nTest ${index + 1}:`);
  console.log('Data URL length:', dataUrl.length);
  console.log('Starts with data:', dataUrl.startsWith('data:'));
  console.log('Contains base64:', dataUrl.includes('base64,'));
  
  // Try to decode the base64 part
  try {
    const base64Part = dataUrl.split(',')[1];
    const decoded = Buffer.from(base64Part, 'base64').toString('utf-8');
    console.log('Decoded SVG preview:', decoded.substring(0, 100) + '...');
    console.log('✅ Base64 is valid');
  } catch (error) {
    console.log('❌ Base64 decode error:', error.message);
  }
});

console.log('\nCreating a simple test HTML file...');
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Base64 Image Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .image-container { margin: 20px 0; }
        img { max-width: 200px; border: 1px solid #ccc; }
    </style>
</head>
<body>
    <h1>Base64 Image Test</h1>
    ${testBase64Data.map((dataUrl, index) => `
        <div class="image-container">
            <h3>Test Image ${index + 1}</h3>
            <img src="${dataUrl}" alt="Test ${index + 1}" onerror="console.error('Image ${index + 1} failed to load')" onload="console.log('Image ${index + 1} loaded successfully')">
            <p>Data URL length: ${dataUrl.length}</p>
        </div>
    `).join('')}
</body>
</html>
`;

import fs from 'fs';
fs.writeFileSync('test-base64-images.html', htmlContent);
console.log('✅ Test HTML file created: test-base64-images.html');

<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

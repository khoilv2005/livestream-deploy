// Test UploadThing configuration
console.log('=== UPLOADTHING TEST ===');

// Check environment variables
console.log('UPLOADTHING_SECRET:', process.env.UPLOADTHING_SECRET ? 'SET' : 'NOT SET');
console.log('UPLOADTHING_APP_ID:', process.env.UPLOADTHING_APP_ID ? 'SET' : 'NOT SET');

// Test upload endpoint
const testUpload = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/uploadthing', {
      method: 'GET'
    });
    console.log('Upload endpoint status:', response.status);
  } catch (error) {
    console.log('Upload endpoint error:', error.message);
  }
};

testUpload(); 
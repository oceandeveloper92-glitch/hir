const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:3005/api/employee/login', {
      email: 'kiran@hirinternational.com',
      password: 'admin123'
    });
    console.log('Login successful:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('Login failed:', error.response.status, error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testLogin();

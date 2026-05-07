const axios = require('axios');

async function testLoginFail() {
  try {
    const response = await axios.post('http://localhost:3005/api/employee/login', {
      email: 'kiran@hirinternational.com',
      password: 'wrongpassword'
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

testLoginFail();

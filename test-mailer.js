// Example: Test the mailer service
// Run this after deploying or in emulator

const axios = require('axios');

// Change this to your deployed URL or use localhost:5001 for emulator
const BASE_URL = 'http://localhost:5001/YOUR-PROJECT-ID/us-central1';

async function testHealthCheck() {
  console.log('Testing health check endpoint...');
  try {
    const response = await axios.get(`${BASE_URL}/healthCheck`);
    console.log('✅ Health check passed:', response.data);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }
}

async function testSendEmail() {
  console.log('\nTesting email send...');
  try {
    const response = await axios.post(`${BASE_URL}/sendEmail`, {
      to: 'test@example.com',
      subject: 'Test Email from Postfix Mailer',
      text: 'This is a test email sent from the Node.js Postfix mailer service.',
      html: '<h1>Test Email</h1><p>This is a <strong>test email</strong> sent from the Node.js Postfix mailer service.</p>'
    });
    console.log('✅ Email sent successfully:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('❌ Email failed:', error.response.data);
    } else {
      console.error('❌ Request failed:', error.message);
    }
  }
}

async function testInvalidData() {
  console.log('\nTesting invalid data handling...');
  try {
    const response = await axios.post(`${BASE_URL}/sendEmail`, {
      to: 'invalid-email',
      subject: '',
      text: ''
    });
    console.log('Response:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('✅ Invalid data properly handled:', error.response.data);
    } else {
      console.error('❌ Request failed:', error.message);
    }
  }
}

async function runTests() {
  console.log('=== Postfix Mailer Service Tests ===\n');
  await testHealthCheck();
  await testSendEmail();
  await testInvalidData();
  console.log('\n=== Tests Complete ===');
}

runTests();

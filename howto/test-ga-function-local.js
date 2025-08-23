#!/usr/bin/env node

/**
 * Local test script for the GA visits function
 * This tests the function logic without requiring Netlify CLI
 */

const fs = require('fs');
const path = require('path');

// Mock the Netlify function environment
process.env.GOOGLE_APPLICATION_CREDENTIALS = fs.readFileSync(
  path.join(__dirname, 'sigma-crawler-351008-cff379b5231b.json'), 
  'utf8'
);

// Set a test Property ID (you'll need to replace this with your actual Property ID)
process.env.GA4_PROPERTY_ID = '123456789'; // Replace with your actual Property ID

// Import the function logic
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

async function testGAFunction() {
  console.log('🧪 Testing Google Analytics Function Locally');
  console.log('==========================================');
  
  // Test 1: Check environment variables
  console.log('\n1. Environment Variables Check:');
  console.log('   GOOGLE_APPLICATION_CREDENTIALS exists:', !!process.env.GOOGLE_APPLICATION_CREDENTIALS);
  console.log('   GA4_PROPERTY_ID:', process.env.GA4_PROPERTY_ID);
  
  // Test 2: Initialize Analytics client
  console.log('\n2. Initializing Analytics Client:');
  let analyticsDataClient;
  
  try {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      console.log('   Using GOOGLE_APPLICATION_CREDENTIALS environment variable');
      const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
      console.log('   Successfully parsed credentials, client_email:', credentials.client_email);
      analyticsDataClient = new BetaAnalyticsDataClient({
        credentials: credentials
      });
      console.log('   ✅ Analytics client initialized successfully');
    } else {
      throw new Error('No Google Analytics credentials found');
    }
  } catch (error) {
    console.log('   ❌ Error initializing Analytics client:', error.message);
    return;
  }
  
  // Test 3: Test API call
  console.log('\n3. Testing API Call:');
  try {
    const propertyId = process.env.GA4_PROPERTY_ID || '123456789';
    console.log('   Using Property ID:', propertyId);
    
    // Test with a small date range first
    const [testResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '7daysAgo',
          endDate: 'today',
        },
      ],
      metrics: [
        {
          name: 'screenPageViews',
        },
      ],
    });
    
    console.log('   ✅ API call successful!');
    console.log('   Response:', JSON.stringify(testResponse, null, 2));
    
    const pageViews = testResponse.rows?.[0]?.metricValues?.[0]?.value || 0;
    console.log('   Page views (last 7 days):', pageViews);
    
  } catch (error) {
    console.log('   ❌ API call failed:', error.message);
    
    if (error.message.includes('Invalid property ID')) {
      console.log('\n💡 Property ID Issue:');
      console.log('   - You need to find your numeric Property ID in Google Analytics');
      console.log('   - Go to Admin → Property Settings → Property ID');
      console.log('   - It should be a number like 123456789');
      console.log('   - Update the GA4_PROPERTY_ID in this script');
    }
    
    if (error.message.includes('PERMISSION_DENIED')) {
      console.log('\n💡 Permission Issue:');
      console.log('   - The service account needs access to your GA4 property');
      console.log('   - Go to GA4 Admin → Property access management');
      console.log('   - Add the service account email as a user with Viewer permissions');
    }
  }
}

// Run the test
testGAFunction().catch(console.error); 
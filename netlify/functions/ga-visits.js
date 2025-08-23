const { BetaAnalyticsDataClient } = require('@google-analytics/data');

// Initialize the Analytics Data API client
let analyticsDataClient;

try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Use environment variable (preferred method)
    console.log('Using GOOGLE_APPLICATION_CREDENTIALS environment variable');
    try {
      const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
      console.log('Successfully parsed credentials, client_email:', credentials.client_email);
      analyticsDataClient = new BetaAnalyticsDataClient({
        credentials: credentials
      });
    } catch (parseError) {
      console.error('Error parsing GOOGLE_APPLICATION_CREDENTIALS:', parseError);
      throw new Error('Invalid JSON in GOOGLE_APPLICATION_CREDENTIALS: ' + parseError.message);
    }
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS_FILE) {
    // Use file path if specified
    console.log('Using GOOGLE_APPLICATION_CREDENTIALS_FILE:', process.env.GOOGLE_APPLICATION_CREDENTIALS_FILE);
    analyticsDataClient = new BetaAnalyticsDataClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS_FILE
    });
  } else {
    // No credentials available
    throw new Error('No Google Analytics credentials found. Please set GOOGLE_APPLICATION_CREDENTIALS environment variable.');
  }
} catch (error) {
  console.error('Error initializing Analytics client:', error);
  throw new Error('Failed to initialize Google Analytics client: ' + error.message);
}

exports.handler = async function(event, context) {
  // Debug environment variables
  console.log('Environment variables check:');
  console.log('GOOGLE_APPLICATION_CREDENTIALS exists:', !!process.env.GOOGLE_APPLICATION_CREDENTIALS);
  console.log('GOOGLE_APPLICATION_CREDENTIALS_FILE exists:', !!process.env.GOOGLE_APPLICATION_CREDENTIALS_FILE);
  
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // Your GA4 numeric Property ID (NOT the Measurement ID)
    // Replace this with your actual numeric Property ID from Google Analytics Admin
    const propertyId = process.env.GA4_PROPERTY_ID || '123456789'; // Replace with your actual Property ID
    
    console.log('Using Property ID:', propertyId);
    
    // Test multiple metrics to see what data is available
    console.log('Testing different metrics and date ranges...');
    
    // Test 1: Recent data (last 7 days)
    const [recentResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '7daysAgo',
          endDate: 'today',
        },
      ],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'totalUsers' },
        { name: 'sessions' },
      ],
    });
    
    console.log('Recent response:', JSON.stringify(recentResponse, null, 2));
    
    // Test 2: All time data
    const [totalResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '2020-01-01',
          endDate: 'today',
        },
      ],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'totalUsers' },
        { name: 'sessions' },
      ],
    });
    
    console.log('Total response:', JSON.stringify(totalResponse, null, 2));
    
    // Test 3: Try different date format
    const [todayResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: 'today',
          endDate: 'today',
        },
      ],
      metrics: [
        { name: 'screenPageViews' },
      ],
    });
    
    console.log('Today response:', JSON.stringify(todayResponse, null, 2));

    // Extract values with better error handling
    const recentPageViews = recentResponse.rows?.[0]?.metricValues?.[0]?.value || 0;
    const recentUsers = recentResponse.rows?.[0]?.metricValues?.[1]?.value || 0;
    const recentSessions = recentResponse.rows?.[0]?.metricValues?.[2]?.value || 0;
    
    const totalVisits = totalResponse.rows?.[0]?.metricValues?.[0]?.value || 0;
    const totalUsers = totalResponse.rows?.[0]?.metricValues?.[1]?.value || 0;
    const totalSessions = totalResponse.rows?.[0]?.metricValues?.[2]?.value || 0;
    
    const todayPageViews = todayResponse.rows?.[0]?.metricValues?.[0]?.value || 0;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        totalVisits: parseInt(totalVisits),
        totalUsers: parseInt(totalUsers),
        totalSessions: parseInt(totalSessions),
        recentPageViews: parseInt(recentPageViews),
        recentUsers: parseInt(recentUsers),
        recentSessions: parseInt(recentSessions),
        todayPageViews: parseInt(todayPageViews),
        debug: {
          propertyId: propertyId,
          hasRecentData: recentResponse.rows && recentResponse.rows.length > 0,
          hasTotalData: totalResponse.rows && totalResponse.rows.length > 0,
          hasTodayData: todayResponse.rows && todayResponse.rows.length > 0,
        },
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error('Error fetching GA data:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch analytics data',
        message: error.message,
      }),
    };
  }
}; 
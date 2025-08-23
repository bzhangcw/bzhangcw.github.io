const { BetaAnalyticsDataClient } = require('@google-analytics/data');

// Initialize the Analytics Data API client
let analyticsDataClient;

try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Use environment variable (preferred method)
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: credentials
    });
  } else {
    // Fallback to file (for local development)
    analyticsDataClient = new BetaAnalyticsDataClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS_FILE || 'service-account-key.json',
    });
  }
} catch (error) {
  console.error('Error initializing Analytics client:', error);
  throw new Error('Failed to initialize Google Analytics client: ' + error.message);
}

exports.handler = async function(event, context) {
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
    // Your GA4 property ID (from the G-XXXXXXXXXX format)
    const propertyId = 'G-H06CBKXSEK'.replace('G-', '');
    
    // Get total pageviews (all time)
    const [totalResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '2020-01-01', // Start from a reasonable date
          endDate: 'today',
        },
      ],
      metrics: [
        {
          name: 'screenPageViews',
        },
      ],
    });

    // Get last 30 days pageviews
    const [last30DaysResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      metrics: [
        {
          name: 'screenPageViews',
        },
      ],
    });

    const totalVisits = totalResponse.rows?.[0]?.metricValues?.[0]?.value || 0;
    const last30Days = last30DaysResponse.rows?.[0]?.metricValues?.[0]?.value || 0;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        totalVisits: parseInt(totalVisits),
        last30Days: parseInt(last30Days),
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
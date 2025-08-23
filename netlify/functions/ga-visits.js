const { BetaAnalyticsDataClient } = require('@google-analytics/data');

// Initialize the Analytics Data API client
const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || 'service-account-key.json',
});

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
# Google Analytics Integration Setup

This guide explains how to set up the Google Analytics integration for the footer visit counter.

## Prerequisites

1. A Google Analytics 4 (GA4) property
2. A Google Cloud Project
3. Netlify hosting (for serverless functions)

## Setup Steps

### 1. Create a Google Cloud Service Account

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Analytics Data API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Analytics Data API"
   - Click "Enable"

4. Create a service account:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Give it a name (e.g., "GA Analytics Service Account")
   - Click "Create and Continue"
   - Skip role assignment for now
   - Click "Done"

5. Create a key for the service account:
   - Click on the service account you just created
   - Go to the "Keys" tab
   - Click "Add Key" > "Create New Key"
   - Choose "JSON" format
   - Download the JSON file

### 2. Set up Google Analytics Permissions

1. In Google Analytics, go to "Admin" > "Property" > "Property access management"
2. Click the "+" button to add a new user
3. Add the service account email (found in the JSON file)
4. Give it "Viewer" permissions
5. Click "Add"

### 3. Configure Netlify Environment Variables

1. In your Netlify dashboard, go to your site settings
2. Navigate to "Environment variables"
3. Add the following variables:
   - `GOOGLE_APPLICATION_CREDENTIALS`: The contents of your service account JSON file (as a single line)
   - Or upload the JSON file and set the path

### 4. Install Dependencies

The Netlify function will automatically install dependencies when deployed, but you can also install them locally for testing:

```bash
cd netlify/functions
npm install
```

### 5. Test the Integration

1. Deploy your site to Netlify
2. The footer should now show the actual Google Analytics pageview count
3. Check the browser console for any errors
4. Verify the `/api/ga-visits` endpoint returns data

## Troubleshooting

### Common Issues

1. **"Failed to fetch analytics data" error**:
   - Check that the service account has proper permissions
   - Verify the GA4 property ID is correct
   - Ensure the Google Analytics Data API is enabled

2. **CORS errors**:
   - The function includes CORS headers, but check if your domain is properly configured

3. **Authentication errors**:
   - Verify the service account JSON is properly set in environment variables
   - Check that the service account has access to the GA4 property

### Testing Locally

To test the function locally with Netlify CLI:

```bash
npm install -g netlify-cli
netlify dev
```

## API Endpoint

The function creates an endpoint at `/api/ga-visits` that returns:

```json
{
  "totalVisits": 1234,
  "last30Days": 56,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Security Notes

- The service account should have minimal permissions (Viewer only)
- The API key is stored securely in Netlify environment variables
- The function includes rate limiting and error handling
- CORS is configured to allow requests from your domain

## Maintenance

- The function automatically refreshes data every 5 minutes
- Monitor Netlify function logs for any errors
- Consider setting up alerts for function failures
- Regularly review and rotate service account keys 
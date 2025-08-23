#!/bin/bash

# Helper script to get the JSON content for GOOGLE_APPLICATION_CREDENTIALS
# This will output the JSON content that should be used as the environment variable value

echo "=== Google Analytics Credentials Helper ==="
echo ""
echo "Copy the JSON content below and use it as the GOOGLE_APPLICATION_CREDENTIALS environment variable:"
echo ""
echo "=========================================="

# Read and output the JSON content
cat "$(dirname "$0")/sigma-crawler-351008-cff379b5231b.json"

echo ""
echo "=========================================="
echo ""
echo "Instructions:"
echo "1. Copy the JSON content above (everything between the lines)"
echo "2. Go to your Netlify dashboard"
echo "3. Navigate to Site Settings → Environment variables"
echo "4. Edit GOOGLE_APPLICATION_CREDENTIALS"
echo "5. Paste the JSON content (make sure it's all on one line)"
echo "6. Save the environment variable"
echo ""
echo "Note: The JSON content should start with '{' and end with '}'" 
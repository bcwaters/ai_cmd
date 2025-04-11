#!/bin/bash

# File: generate_sprite_sheet.sh

# Source environment variables (API key, etc.)
source .env

# Hard-code API key
API_KEY="your_api_key_here"  # Replace with your actual API key

# Use /tmp for output files
RESPONSE_FILE="/tmp/sprite_sheet_response.json"

echo "Testing basic curl functionality..."
# Simple test to Google
curl -s "https://www.google.com" 
GOOGLE_CURL_EXIT_CODE=$?

echo "Google curl test exit code: $GOOGLE_CURL_EXIT_CODE"
if [ $GOOGLE_CURL_EXIT_CODE -eq 0 ]; then
    echo "Basic curl test successful - connection to Google works"
    echo "Google response size: $(wc -c < /tmp/google_test.txt) bytes"
else
    echo "ERROR: Basic curl test failed. Network or curl configuration issue."
    exit 1
fi

# Create the JSON payload
PAYLOAD='{
  "prompt": "A 16 panel sprite sheet. top row is walking up, 2nd right is walking right, 3rd row is walking left, bottom row is walking down. The character has short red hair with a dinosaur hat. Do this in a pixelated style. 16 panels only. NES style.",
  "model": "grok-2-image",
  "response_format": "url",
  "n": 2
}'

echo "Starting XAI API request..."
echo "Using API key: ${API_KEY:0:5}..." # Only show first 5 chars for security

# Set verbose mode to see exactly what's happening
curl -v -X POST "https://api.xai.org/v1/images/generations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d "$PAYLOAD" > "$RESPONSE_FILE" 2>"curl_error.log"

API_CURL_EXIT_CODE=$?
echo "XAI API curl exit code: $API_CURL_EXIT_CODE"

# Check the error log
echo "curl error log:"
cat curl_error.log

# Check the response
echo "API response (if any):"
cat "$RESPONSE_FILE"

# Check if the API call was successful
if [ $API_CURL_EXIT_CODE -eq 0 ]; then
    echo "XAI API curl command succeeded, but check response for API errors"
    
    # Display the response (without depending on jq)
    echo "Response received:"
    cat "$RESPONSE_FILE"
    
    # Optionally download the images
    if [ "$1" == "--download" ]; then
        echo "Downloading images..."
        mkdir -p sprite_images
        
        # Extract URLs using grep and sed (no jq dependency)
        URLS=$(grep -o '"url":"[^"]*"' "$RESPONSE_FILE" | sed 's/"url":"//g' | sed 's/"//g')
        
        count=1
        for url in $URLS; do
            echo "Downloading image $count from: $url"
            curl -s "$url" -o "sprite_images/sprite_sheet_${count}.png"
            echo "Downloaded: sprite_images/sprite_sheet_${count}.png"
            ((count++))
        done
    fi
else
    echo "XAI API curl command failed with exit code $API_CURL_EXIT_CODE"
fi
#!/bin/bash

# Check if an argument was provided
if [ $# -eq 0 ]; then
    echo "Usage: ./grok \"your question or prompt here\""
    exit 1
fi

# Combine all arguments into a single string
prompt="$*"

# Run node with grok.js and the provided prompt
node grok.js "$prompt"
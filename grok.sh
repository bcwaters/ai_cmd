#!/bin/bash

# Greet the user
echo "  ____              _   _   ___    __    ___"
echo " / ___|_ __   __   | | / /|  _ \ / _ \  / __|  "
echo "| |  _  '__| / _ \ | |/ / | | | | | | || |       "
echo "| |_| | |   | |_| || |\ \\ | |_| | |_| || |__   "
echo " \____|_|    \___/ | | \ \\|____/ \___/  \___|  "
echo "                                      "
echo "This is GrokDOC. Request a readme on any subject."


echo "   "
echo ""



# Continuously receive prompts until "exit" is typed
while true; do
    # Prompt the user for input
    echo "   "
    read -p "Enter your question or prompt (type 'exit' to quit): " prompt

    # Check if the user wants to exit
    if [ "$prompt" == "exit" ]; then
        echo "Exiting..."
        break
    fi

    # Run node with grok.js and the provided prompt
    node --no-warnings grok.js "$prompt"
done
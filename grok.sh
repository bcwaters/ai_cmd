#!/bin/bash
cd /home/bcwaters/repo/grok_cmd/grok_cmd/
# Greet the user
echo "  ____              _   _   ___    __    ___"
echo " / ___|_ __  __   | | / /|  _ \ / _ \  / __|  "
echo "| |  _  '__|/ _ \ | |/ / | | | | | | || |       "
echo "| |_| | |  | |_| || |\ \\ | |_| | |_| || |__   "
echo " \____|_|   \___/ | | \ \\|____/ \___/  \___|  "
echo "                                      "
echo "This is GrokDOC. Request a readme on any subject."


echo "   "
echo ""



# Continuously receive prompts until "exit" is typed
while true; do
    # Prompt the user for input
    echo -e "\e[32mtype 'setContext' to set the context\e[0m" 
    echo -e "\e[34mtype 'new' to start a new conversation\e[0m"
    echo -e "\e[33mtype 'short' to get a short answer.\e[0m"
    echo -e "\e[31mtype 'exit' to quit\e[0m"

    echo ""

    read -p "enter you prompt: " prompt

    # Check if the user wants to exit
    if [ "$prompt" == "exit" ]; then
        echo -e "\e[31mExiting...\e[0m"
        break
    fi

    # Check if the user wants to set the context
    if [ "$prompt" == "setContext" ]; then
        echo -e "\e[32mSetting context...\e[0m"
        read -p "Enter the context: " context
        read -p "[context:$context] Enter your question or prompt (type 'exit' to quit): " prompt
        node --no-warnings /home/bcwaters/repo/grok_cmd/grok_cmd/grok.js "--setContext" "$context" "$prompt" 
    else
    if [ "$prompt" == "new" ]; then 
        # Run node with the absolute path to grok.js and the provided prompt
        node --no-warnings /home/bcwaters/repo/grok_cmd/grok_cmd/grok.js "--new" "$prompt"
    else
    if [ "$prompt" == "short" ]; then
        # Run node with the absolute path to grok.js and the provided prompt
        echo " " 
        echo -e "\e[33mHow many words max? 1 to 16000\e[0m"
        read -p "Enter the short value: " shortValue
        node --no-warnings /home/bcwaters/repo/grok_cmd/grok_cmd/grok.js "--short" "$shortValue" "$prompt"
    else
        # Run node with the absolute path to grok.js and the provided prompt
        node --no-warnings /home/bcwaters/repo/grok_cmd/grok_cmd/grok.js "$prompt"
    fi
    fi
    fi
    
done
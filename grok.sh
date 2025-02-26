#!/bin/bash
cd /home/bcwaters/repo/grok_cmd/grok_cmd/
# Greet the user
echo "  ____             _   _   ___    __    ___"
echo " / ___|_ __  __   | | / /|  _ \ / _ \  / __|  "
echo "| |  _  '__|/ _ \ | |/ / | | | | | | || |       "
echo "| |_| | |  | |_| || |\ \\ | |_| | |_| || |__   "
echo " \____|_|   \___/ | | \ \\|____/ \___/  \___|  "
echo "                                      "
echo "This is GrokDOC. Request a readme on any subject."


echo "   "
echo ""

# Function to display a spinner
spin() {
    local pid=$1
    local delay=0.1
    local spinchars='*~*-^*~*-'
    local spinchars2='---***'
    local i=0

    while ps -p $pid > /dev/null; do
        local temp2=${spinchars2:i%${#spinchars2}:1}
        local temp=${spinchars:i++%${#spinchars}:1}
        local temp3=${spinchars2:i%${#spinchars2}:1}
        
        
        if [ $((i%5)) -eq 0 ]; then
            echo -ne "\r$temp-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp3-$temp"
        elif [ $((i%5)) -eq 1 ]; then
            echo -ne "\r$temp-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp3-$temp"
        elif [ $((i%5)) -eq 2 ]; then
            echo -ne "\r$temp-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp3-$temp"
        elif [ $((i%5)) -eq 3 ]; then
            echo -ne "\r$temp-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp3-$temp"
        elif [ $((i%5)) -eq 4 ]; then
            echo -ne "\r$temp-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp3-$temp"
        fi
        sleep $delay
   
    done
    echo -ne "\r"  # Clear the spinner
}

# Continuously receive prompts until "exit" is typed
while true; do
    # Prompt the user for input
    echo -e "type \e[34msetContext\e[0m to set the context" 
    echo -e "type \e[32mnew\e[0m to start a new conversation"
    echo -e "type \e[33mshort\e[0m to get a short answer."
    echo -e "type \e[31mexit\e[0m to quit"

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
        node --no-warnings /home/bcwaters/repo/grok_cmd/grok_cmd/grok/grok.js "--setContext" "$context" "$prompt" &
        spin $!  # Start spinner while waiting for the node process
    else
    if [ "$prompt" == "new" ]; then 
        # Run node with the absolute path to grok.js and the provided prompt
        read -p "Enter your question or prompt (type 'exit' to quit): " prompt
        node --no-warnings /home/bcwaters/repo/grok_cmd/grok_cmd/grok/grok.js "--new" "$prompt" &
        spin $!  # Start spinner while waiting for the node process
    else
    if [ "$prompt" == "short" ]; then
        # Run node with the absolute path to grok.js and the provided prompt
        echo " " 
        echo -e "\e[33mHow many words max? 1 to 16000\e[0m"
        read -p "Enter the short value: " shortValue
        read -p "[short:$shortValue] Enter your question or prompt (type 'exit' to quit): " prompt
        node --no-warnings /home/bcwaters/repo/grok_cmd/grok_cmd/grok/grok.js "--short" "$shortValue" "$prompt" &
        spin $!  # Start spinner while waiting for the node process
    else
        # Run node with the absolute path to grok.js and the provided prompt
        node --no-warnings /home/bcwaters/repo/grok_cmd/grok_cmd/grok/grok.js "$prompt" &
        spin $!  # Start spinner while waiting for the node process
    fi
    fi
    fi
    
done
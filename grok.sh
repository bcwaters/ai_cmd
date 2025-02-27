#!/bin/bash
current_dir=/home/bcwaters/repo/ai_cmd/grok_cmd/
cd $current_dir
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
firstRun=true
while true; do
    if [ $firstRun = true ]; then

        # Declare variables for commands
        setContext="setContext"
        new="new"
        depth="depth"
        file=""
        flags=""
        displayContext=""
        displayNew=""
        displayDepth="--depth 500"
        displayFile=""
        source .grokRuntime
        firstRun=false
        displayContext=$contextState
        displayNew=$newState
        displayDepth=$depthState
        displayFile=$fileState
        echo -e "Loaded State: \e[34m[ $contextState]\e[0m \e[32m[ $newState]\e[0m \e[33m[ $depthState]\e[0m \e[35m[ $fileState]\e[0m"
    fi
    #GOTO here
    #branch feature added next    
    # Prompt the user for input
    echo -e "\e[30m--------------------------------\e[0m"
    echo -e "type \e[34msetContext\e[0m to set the context" 
    echo -e "type \e[32mnew\e[0m to start a new conversation"
    echo -e "type \e[33mdepth\e[0m set the context depth for better memory"
    echo -e "type \e[35mfile\e[0m to load a file"
    echo -e "type \e[31mexit\e[0m to quit"

    echo -e "\e[30m--------------------------------\e[0m"
    echo -e "current settings: \e[34m[ $displayContext]\e[0m \e[32m[ $displayNew]\e[0m \e[33m[ $displayDepth]\e[0m \e[35m[ $displayFile]\e[0m"
    echo -e "\e[30m--------------------------------\e[0m"
    read -p "enter you prompt: " prompt

    # Check if the user wants to exit
    if [ "$prompt" == "exit" ]; then
        echo -e "\e[31mExiting...\e[0m"
        break
    fi
    if [ "$prompt" == "file" ]; then
        echo -e "\e[35mLoading file...\e[0m"
        read -p "Enter the file path: " filePath
        flags="$flags --file $filePath"
        file=$filePath
        displayFile=$filePath
        continue
    fi

    # Check if the user wants to set the context
    if [ "$prompt" == "setContext" ]; then
        echo -e "\e[32mSetting context...\e[0m"
        read -p "Enter the context: " context
  
        #GOTO begining of loop
        context=$context
        flags="$flags --setContext $context"
        displayContext="$context"
        continue
        node --no-warnings $current_dir/grok/grok.js "--setContext" "$context" "$prompt" &
        spin $!  # Start spinner while waiting for the node process
    else
    if [ "$prompt" == "new" ]; then 
        # Run node with the absolute path to grok.js and the provided prompt

        new=$prompt
        flags="$flags --new" 
        displayNew="$new"
        continue
        node --no-warnings $current_dir/grok/grok.js "--new" "$prompt" &
        spin $!  # Start spinner while waiting for the node process
    else
    if [ "$prompt" == "depth" ]; then
        # Run node with the absolute path to grok.js and the provided prompt
        echo " " 
        echo -e "\e[33mHow many words stored in context memory? 1 to 10000\e[0m"
        read -p "Enter the depth value(default 500): " depthValue

        depth=$depthValue
        flags="$flags --depth $depthValue"
        displayDepth="$depthValue"
        continue
        node --no-warnings $current_dir/grok/grok.js "--depth" "$depthValue" "$prompt" &
        spin $!  # Start spinner while waiting for the node process
    else
        echo "grokking..."
        # Run node with the absolute path to grok.js and the provided prompt
        node --no-warnings $current_dir/grok/grok.js $flags "PROMPT" "$prompt" &
        spin $!  # Start spinner while waiting for the node process
    fi
    fi
    fi
    firstRun=true

    
done
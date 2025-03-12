#!/bin/bash
clear
# Get the directory of the script, resolving any symbolic links
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

# Change to the directory of the script
cd "$SCRIPT_DIR"
current_dir=$(pwd)



OS=$(uname -s)

startup=true;
    echo -ne "\033]0;AI_CMD\007"
if [ "$OS" = "Linux" ]; then
    
    source ./shell_helpers/.colors_linux
elif [ true = true ]; then
    # ASSUME APPLE
    source ./shell_helpers/.mac_colors
fi

# Define the width of the box
width=25

# Function to draw a horizontal border ─
draw_border() {
    echo -en "\n$color_background_black$color_red* $color_yellow* $color_green* $color_blue* $color_magenta* $color_cyan* $color_white* $color_red*$color_reset PROCESSED $color_yellow* $color_green* $color_blue*$color_reset SETTING $color_magenta* $color_cyan* $color_yellow* $color_green* $color_blue* $color_magenta* $color_cyan* $color_white*$color_background_reset $color_background_reset"
}
draw_border_inner(){
    echo -en "\n$color_background_black├$(printf  '─%.0s' {1..55})┤$color_background_reset"
}

draw_border_green() {
   echo -en "\n$color_background_green$(printf  '─%.0s' {1..55})$color_background_reset"
}

draw_border_bottom() {
    echo -en "\n$color_background_black╰$(printf '─%.0s' {1..55})╯$color_background_reset"
}
draw_border_top() {
    echo -en "\n$color_background_black╭$(printf '─%.0s' {1..55})╮$color_background_reset"
}




source ./shell_helpers/.ai_cmd_banner


spin() {
    local pid=$1
    local delay=0.1
    local spinchars='*~*-^*~*-'
    local spinchars2='---***'
    local i=5
    local singleSpin=${2:-false}  # Default to false for continuous spinning

    if [ "$singleSpin" = true ]; then
        # Spin just once
        local temp2=${spinchars2:i%${#spinchars2}:1}
            local temp=${spinchars:i++%${#spinchars}:1}
            local temp3=${spinchars2:i%${#spinchars2}:1}
            


            
    else
        # Continuous spinning
        while ps -p $pid > /dev/null; do
            local temp2=${spinchars2:i%${#spinchars2}:1}
            local temp=${spinchars:i++%${#spinchars}:1}
            local temp3=${spinchars2:i%${#spinchars2}:1}
            
            if [ $((i%5)) -eq 0 ]; then
                echo -ne "\r$color_white---$temp-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp3-$temp---"
            elif [ $((i%5)) -eq 1 ]; then
                echo -ne "\r$color_red_light---$temp-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp3-$temp---"
            elif [ $((i%5)) -eq 2 ]; then
                echo -ne "\r$color_yellow_light---$temp-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp3-$temp---"
            elif [ $((i%5)) -eq 3 ]; then
                echo -ne "\r$color_blue_light---$temp-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp3-$temp---"
            elif [ $((i%5)) -eq 4 ]; then
                echo -ne "\r$color_green_light---$temp-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp3--$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp2-$temp3-$temp3-$temp---"
            fi
            sleep $delay
        done
        echo -ne "\r"  # Clear the spinner
    fi
}

display_menu() {
    echo -en "$color_yellow"
    draw_border_top 
    echo -e "$color_yellow"
    echo -e  "${color_yellow}│    ${color_yellow}     ┏┓ ┳   ┏┓ ┳┳┓ ┳┓    ┳┳┓ ┏┓ ┳┓ ┳ ┳             │${color_reset}"
    echo -e  "${color_yellow}│    ${color_yellow}     ┣┫ ┃   ┃  ┃┃┃ ┃┃    ┃┃┃ ┣  ┃┃ ┃ ┃             │${color_reset}"
    echo -en  "${color_yellow}│    ${color_yellow}     ┛┗ ┻   ┗┛ ┛ ┗ ┻┛    ┛ ┗ ┗┛ ┛┗ ┗-┛             │"
    draw_border_bottom

    echo -en "\n$color_background_reset${color_reset} ${color_blue}context\e[0m use a response id to continue a conversation" 
    echo -en "$color_reset \n ${color_green}new\e[0m to start a new conversation"
    echo -en "$color_reset \n ${color_yellow}depth\e[0m to set the context depth for better memory"
    echo -en "$color_reset \n ${color_cyan}role\e[0m select which role the ai assumes"
    echo -en "$color_reset \n ${color_blue}treeMode\e[0m branches out for a more researched response"
    echo -en "$color_reset \n ${color_magenta}file\e[0m to load a file"
    echo -en "$color_reset \n ${color_green}paste\e[0m$color_background_reset to paste from clipboard"
    echo -en "$color_reset \n ${color_blue}${color_background_grok}save\e[0m$color_background_reset to save the current context to local folder"
    echo -en "$color_reset \n ${color_blue}${color_background_grok}open\e[0m$color_background_reset view readmes you have saved"
    echo -en "$color_reset \n ${color_yellow}${color_background_grok}review\e[0m$color_background_reset to review edit the edit the response in vim"
    echo -en "$color_reset \n ${color_red}exit\e[0m$color_background_reset to quit or press ctrl+c"
   




}

# Function to display a spinner with user input
display_spinner_with_input() {
    local prompt_text="${1:--------------------}"
    
    # Create a named pipe for communication
    FIFO="/tmp/grok_fifo_$$"
    [ -e "$FIFO" ] && rm "$FIFO"
    mkfifo "$FIFO"
    
    # Start a background process that reads from the pipe
    cat "$FIFO" > /dev/null &
    wait_pid=$!
    
    # Start the spinner with the PID of the background process
    spin $wait_pid &
    spinner_pid=$!
    
    # Wait for user input
    read -p "$prompt_text"
    finalPrompt=$prompt
    # Send data to the pipe to terminate the background process
    echo "done" > "$FIFO"
    
    # Clean up
    wait $wait_pid 2>/dev/null  # Wait for the background process to finish
    kill $spinner_pid 2>/dev/null  # Stop the spinner
    rm -f "$FIFO"  # Remove the named pipe
    spin $! true
}

# Continuously receive prompts until "exit" is typed
firstRun=true
while true; do
    if [ $firstRun = true ]; then

        # Declare variables for commands
        pasteText=""
        context="context"
        new="new"
        depth="depth"
        file=""
        flags=""  # flags should be set by depth flag, new flag, file flag, and specialty flag just before execution to allow multiple updating of flags between rens
        displayContext=" "
        displaySpecialty=""
        displayNew=""
        displayDepth="--depth 500"
        displayFile=" "
        treeMode=false
        source ./shell_helpers/.grokRuntime
        firstRun=false
        displayTreeMode=""
        displayContext=$contextState
        displayNew=$newState
        displayDepth=$depthState
        displayFile=$fileState
        displaySpecialty=$specialtyState
    fi
    currentSettingText="Current Settings: \e[32m[$displayNew] \e[33m[$displayDepth] \e[35m[$displayFile] \e[36m[$displaySpecialty] $color_blue[$displayTreeMode]$color_yellow"
    # Pad with spaces to ensure proper width
    padding=$(printf '%*s' $((40 - ${#currentSettingText})) '')
    currentSettingText="${currentSettingText}"
    
    currentContextText="Current Context ID: \e[32m$displayContext$color_yellow"
    # Pad with spaces to ensure proper width
    padding=$(printf '%*s' $((82 - ${#currentContextText})) '')
    currentContextText="${currentContextText}"
    
    echo -e "$color_yellow"
    draw_border_top
    echo -e "\n$color_yellow│ ${currentContextText}$color_background_reset$color_yellow\e[0m"
    echo -en "${color_background_reset}${color_yellow}│ ${currentSettingText}$color_background_reset$color_yellow                          "
    draw_border_inner
    echo -en "\n│${color_reset}  * Type ${color_green}menu$color_reset to see the options for the settings * $color_background_reset${color_yellow}$color_background_reset   │" 
    draw_border_bottom
  

    echo -e "${color_background_black}${color_yellow}\nenter your prompt:                                     ${color_background_reset}${color_reset}" 
    read -p "" prompt

    
    if [ "$prompt" == "menu" ]; then
    echo -e "\r"
        display_menu
        continue
    fi
    # Check if the user wants to exit

    if [ "$prompt" == "codeReviewMode" ]; then
        
        flags="$flags --codeReviewMode"
        draw_border
        continue
    fi

      if [ "$prompt" == "mockMode" ]; then
        
        flags="$flags --mockMode"
        draw_border
        continue
    fi

    if [ "$prompt" == "visionMode" ]; then
        read -p "Enter the file path to the images: " visionModeDirectory
        flags="$flags --visionMode $visionModeDirectory"
        draw_border
        continue
    fi

    if [ "$prompt" == "indexLookupMode" ]; then
        flags="$flags --indexLookupMode"
        draw_border
        continue
    fi


    if [ "$prompt" == "exit" ]; then
        echo -e "$color_red_light Exiting...\e[0m"
        break
    fi
    if [ "$prompt" == "save" ]; then
        read -p "Enter the name of the readme: " readmeName
        cp ./grok/context/html/markdown/${contextState}.md ./user_saved_readmes/${readmeName}-${contextState}.md
        draw_border
        echo -e "$color_green_light Readme saved as ${readmeName}-${contextState}.md\e[0m"
        draw_border
        continue
    fi
    if [ "$prompt" == "open" ]; then
        open ./user_saved_readmes
        draw_border
        continue
    fi
    if [ "$prompt" == "browserMode" ]; then
        terminalMode=""
        draw_border
        continue
    fi
    if [ "$prompt" == "review" ]; then
        vim ./grok/context/history/markdown/currentChat.md
        draw_border
        continue
    fi
    if [ "$prompt" == "terminalMode" ]; then
        terminalMode="terminalMode"
        draw_border
        continue
    fi
    if [ "$prompt" == "paste" ]; then
        echo -e "Contents $color_background_green pasted\e[0m, they will be include in the prompt" 
        pasteText=$(xclip -selection clipboard -o)
        draw_border_green
        echo -e "$color_green $pasteText\e[0m"
        draw_border_green

      
        continue
    fi
    if [ "$prompt" == "treeMode" ]; then
        treeMode=true
        displayTreeMode=tree
        echo -e "$color_background_blue_light Tree mode: Dynamic Prompt Generation\e[0m"
        flags="$flags --treeMode"
        draw_border
        continue
    fi
    if [ "$prompt" == "role" ]; then
        echo -e "$color_cyan_light roles available: software, teaching, writing\e[0m" #TODO: this can be abstracted to recieve a sentence and then pass it to the profile help me to: write code, write a readme, write a blog post etc.
        read -p "Enter the role: " specialty
        specialty=$specialty
        displaySpecialty=$specialty
        flags="$flags --specialty $specialty"
        draw_border
        continue
    fi
    if [ "$prompt" == "file" ]; then
        echo -e "$color_magenta_light Loading file...\e[0m"
        read -p "Enter the file path: " filePath
        flags="$flags --file $filePath"
        file=$filePath
        displayFile=$filePath
        draw_border
        continue
    fi

    # Check if the user wants to set the context
    if [ "$prompt" == "context" ]; then
        echo -e "$color_green_light Setting context...\e[0m"
        read -p "Enter the context: " context
  
        #GOTO begining of loop
        context=$context
        flags="$flags --context $context"
        displayContext="$context"
        draw_border
        continue

    else
    if [ "$prompt" == "new" ]; then 
        # Run node with the absolute path to grok.js and the provided prompt

        new=$prompt
        flags="$flags --new" 
        displayNew="$new"
        draw_border
        continue

    else
    if [ "$prompt" == "depth" ]; then
        # Run node with the absolute path to grok.js and the provided prompt
        echo " " 
        echo -e "$color_yellow_light How many words stored in context memory? 1 to 10000\e[0m"
        read -p "Enter the depth value(default 500): " depthValue

        depth=$depthValue
        flags="$flags --depth $depthValue"
        displayDepth="$depthValue"
        draw_border
        continue

    else if [ "$terminalMode" == "terminalMode" ]; then     

        flags="$flags terminalMode"
    fi
        echo "grokking..."
        # Run node with the absolute path to grok.js and the provided prompt
        node --no-warnings $current_dir/grok/grok.js $flags "PROMPT" "$pasteText$prompt" &
        spin $!  # Start spinner while waiting for the node process
    fi
    fi
    fi

    firstRun=true

    
done
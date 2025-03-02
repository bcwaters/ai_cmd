#!/bin/bash
clear
# Get the directory of the script, resolving any symbolic links
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

# Change to the directory of the script
cd "$SCRIPT_DIR"
current_dir=$(pwd)



startup=true;
    echo -ne "\033]0;AI_CMD\007"
if [ "$OS" = "Linux" ]; then
    
    source ./linux_colors.sh
elif [ true = true ]; then
    # ASSUME APPLE
    source ./mac_colors.sh
fi


source ./shell_helpers/.colors_linux
# Define the width of the box
width=25

# Function to draw a horizontal border
draw_border() {
    echo -en "\n$color_background_black$(printf -- '-%.0s' {1..55})$color_background_reset"
}
draw_border_green() {
   echo -en "\n$color_background_green$(printf -- '-%.0s' {1..55})$color_background_reset"
}








# Greet the user
echo -e  "${color_background_grok}${color_yellow_dark}┌──────────────────────────────────────────────────────┐${color_reset}"
echo -e  "${color_background_grok}${color_yellow_dark}|    ____             _   _  ____   ___    ___         |${color_reset}"
echo -e  "${color_background_grok}${color_yellow_dark}|   / ___|_ __  __   | | / /|  _ \ / _ \  / __|        |${color_reset}"
echo -e  "${color_background_grok}${color_yellow_dark}|  | |  _  '__|/ _ \ | |/ / | | | | | | || |           |${color_reset}"
echo -e  "${color_background_grok}${color_yellow_dark}|  | |_| | |  | |_| || |\ \\ | |_| | |_| || |__         |${color_reset}"
echo -e  "${color_background_grok}${color_yellow_dark}|   \____|_|   \___/ |_| \_\\|____/ \___/  \___|        |${color_reset}"
echo -e  "${color_background_grok}${color_yellow_dark}└──────────────────────────────────────────────────────┘${color_reset}"
echo -e  "${color_yellow}   This is GrokDOC. Request a readme on any subject.${color_reset}"
# Function to display a spinner
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
        setContext="setContext"
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
        displayTreeMode=" "
        displayContext=$contextState
        displayNew=$newState
        displayDepth=$depthState
        displayFile=$fileState
        displaySpecialty=$specialtyState
    

  
            #echo -en "${color_background_black}${color_yellow}---------------------------------------------------$background_color_reset\n" 

            # Call the function instead of the inline code
            #display_spinner_with_input "-------------------------"
        
     

       # echo -e "Loaded State: \e[34m[ $contextState]\e[0m \e[32m[ $newState]\e[0m \e[33m[ $depthState]\e[0m \e[35m[ $fileState]\e[0m \e[36m[ $specialtyState]\e[0m"
    fi
                   # echo -e "$color_background_black"
                    #echo -e "$color_background_black"

    #GOTO here
    #branch feature added next    
    # Prompt the user for input
    echo -en "$color_yellow\n-----------------------AI_CMD--------------------------$color_background_reset"
    echo -en "\n$color_background_reset    current settings: $color_bluelight[$displayContext] \e[32m[ $displayNew] \e[33m[ $displayDepth] \e[35m[ $displayFile] \e[36m[ $displaySpecialty] $color_blue[$displayTreeMode]$color_background_reset$color_yellow    $color_background_reset"
    draw_border
  
    echo -en "$color_background_reset$color_blue \n type $color_blue setContext\e[0m to set the ai_cmd's memory to a previous conversation" 
    echo -en "$color_green \n type $color_green new\e[0m to start a new conversation"
    echo -en "$color_yellow \n type $color_yellow depth\e[0m to set the context depth for better memory"
    echo -en "$color_cyan \n type $color_cyan role\e[0m select which role the ai assumes"
    echo -en "$color_blue \n type $color_blue treeMode\e[0m to generate a set of organized documents from the prompt"
    echo -en "$color_magenta \n type $color_magenta file\e[0m to load a file"
    echo -en "$color_green \n type $color_green ${color_background_dark_grey}paste\e[0m$color_background_reset to paste from clipboard"
    echo -en "$color_blue \n type $color_cyan ${color_background_dark_grey}save\e[0m$color_background_reset to save the current context to local folder"
    echo -en "$color_blue \n type $color_cyan ${color_background_dark_grey}open\e[0m$color_background_reset to open the saved the saved readmes in file explorer"
    echo -en "$color_yellow \n type $color_yellow ${color_background_dark_grey}review\e[0m$color_background_reset to review edit the edit the response in vim"
    echo -en "$color_red \n type $color_red exit\e[0m$color_background_reset to quit or press ctrl+c"
    draw_border

    echo -e "${color_background_black}${color_yellow}\nenter your prompt:                                     ${color_background_reset}${color_reset}" 
    read -p "" prompt


    # Check if the user wants to exit


    if [ "$prompt" == "exit" ]; then
        echo -e "$color_red_light Exiting...\e[0m"
        break
    fi
    if [ "$prompt" == "save" ]; then
        read -p "Enter the name of the readme: " readmeName
        cp ./grok/context/html/markdown/${setContextState}.md ./user_saved_readmes/${readmeName}-${setContextState}.md
        continue
    fi
    if [ "$prompt" == "open" ]; then
        open ./user_saved_readmes
        continue
    fi
    if [ "$prompt" == "browserMode" ]; then
        terminalMode=""
        continue
    fi
    if [ "$prompt" == "review" ]; then
        vim ./grok/context/history/markdown/currentChat.md
        continue
    fi
    if [ "$prompt" == "terminalMode" ]; then
        terminalMode="terminalMode"
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
        continue
    fi
    if [ "$prompt" == "role" ]; then
        echo -e "$color_cyan_light roles available: software, teaching, writing\e[0m" #TODO: this can be abstracted to recieve a sentence and then pass it to the profile help me to: write code, write a readme, write a blog post etc.
        read -p "Enter the role: " specialty
        specialty=$specialty
        displaySpecialty=$specialty
        flags="$flags --specialty $specialty"
        continue
    fi
    if [ "$prompt" == "file" ]; then
        echo -e "$color_magenta_light Loading file...\e[0m"
        read -p "Enter the file path: " filePath
        flags="$flags --file $filePath"
        file=$filePath
        displayFile=$filePath
        continue
    fi

    # Check if the user wants to set the context
    if [ "$prompt" == "setContext" ]; then
        echo -e "$color_green_light Setting context...\e[0m"
        read -p "Enter the context: " context
  
        #GOTO begining of loop
        context=$context
        flags="$flags --setContext $context"
        displayContext="$context"
        continue

    else
    if [ "$prompt" == "new" ]; then 
        # Run node with the absolute path to grok.js and the provided prompt

        new=$prompt
        flags="$flags --new" 
        displayNew="$new"
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
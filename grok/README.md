# grok_cmd
query grok API and generate a simple readme in the browser. context the prior conversations is sent along each message.


## how to run
first clone this repository 

next run ```npm install```

now to query grok run ```./grok.sh "your prompt" ```



## future features
  After the first prompt generate a list of suggesting prompts that can be clicked to load into the prompt.

  recieve a current direcrty option to decide where docs are saved.

  save pure readme files before processing

  create a flag for verbose logging and clean logging

  improve the history storage approach

  send as a facebook message from html

 
  more robust cmd options
  ! BIG IDEA ! the runtime can set all the arguments and the js script loads them from the .grokRuntime file. this make the argument parsing so much easier.

    -doc mode.  keep writing the doc . this appends the final prompt to say up the the document and retun the full reposnse. Imagine the html generates a next link which anticipates the next prompt based of the headings of the current response. really good for lists.  ie give me a list of 5 cities.  next would go into city 1, then next goes into city 2 etc.  all by chaining prompts.  Perhaps the next button indicates to switch from the eefault profile to a crawler profile.
   
  sticky mode.  the context is sticky to the prompt.  the context is not updated for the next prompt.
    --update mode.  appends additional profile user prompts
    dynamic context setting.
     set root context for quick switching
     an example would be branch: generate a readme doc for the prompt but do not update the context for the next prompt

    clear context.  clear the context for the current prompt this can be done directly from the shell script.
    when displaying the context id display the parent context and any current children

    a file option to load a file form the specified path the user givesj
    image mode to switch models
    a flag to switch the model

  Encapulate system prompt in a file and load it.
     allow for different profiles

  Further refinement on grok response output.

  Paste files into prompt, or refer to them for js to load into the prompt. can i access vim while grok is running?

  output the directory tree structure of the current context in relation to the prompt history

  add marked css for a modern look of the markdown

  implement a crawler that has options to prompt for more info on the heading. simply click and type. the markdown will be the way to create the file structure.

  cursor rule for debugging: That fixed it.  The jpeg is encoding. If possible can you generate a readme doc which gives an overview of our troubleshotting process for casting uint8

  improve the context file structure to be more robust. KEYWORDS HEADINGS PROMPTS USESRPROFILE 


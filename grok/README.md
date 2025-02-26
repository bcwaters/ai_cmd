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

  update CMD prompt to show current flags selected
  
  more robust cmd options
    -doc mode.  keep writing the doc . this appends the final prompt to say up the the document and retun the full reposne
    --update mode.  appends additional profile user prompts
    dynamic context setting.
     set root context for quick switching
     an example would be branch: generate a readme doc for the prompt but do not update the context for the next prompt
    The cmd should list the last 3 promprts and there ids.
    set context depth: default of 1 but it can be increased at the cost of larger api calls.
    when displaying the context id display the parent context and any current children
    set the context hirtory length
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


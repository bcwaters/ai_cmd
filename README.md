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

  improve the history storage approach

  send as a facebook message
  
  more robust cmd options
    dynamic context setting.
     set root context for quick switching
     an example would be branch: generate a readme doc for the prompt but do not update the context for the next prompt
    The cmd should list the last 3 promprts and there ids.
    set context depth: default of 1 but it can be increased at the cost of larger api calls.
    when displaying the context id display the parent context and any current children
    set the context hirtory length

  Encapulate system prompt in a file and load it.
     allow for different profiles

  Further refinement on grok response output.



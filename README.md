# grok_cmd
query grok API and generate a simple readme in the browser. context the prior conversations is sent along each message.


## how to run
first clone this repository 

next run ```npm install```

update the `PLACEHOLDER.env` file to `.env` and edit the file to use your own api key.

now to query grok run ```./grok.sh ```


TODO NOT IMPLEMENTED... set up automatic link to shell file
global install with :
  - ``` npm link ```
  - ``` npm install -g ```



NOTE: If you context info is tracked it can be fixed with ``` git update-index --assume-unchanged .grokRuntime grok/con
text/context.data grok/context/context.history gro
k/context/currentChat/currentChat.html grok/contex
t/currentChat/currentChat.json grok/context/curren
tChat/summary.json```


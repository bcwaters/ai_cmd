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



NOTE: If you context info is tracked it can be fixed with 
``` 
 git update-index --skip .grokRuntime
 git update-index --skip grok/context/context.data grok/context/context.history
 git update-index --skip grok/context/context.data grok/context/currentChat/currentChat.html
 git update-index --skip grok/context/context.data grok/context/currentChat/currentChat.json
 git update-index --skip grok/context/context.data grok/context/currentChat/summary.json
 ```


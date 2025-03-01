# ai_cmd
LLMs can be viewed as a latent space of knowledge.  Given the correct prompt almost any knowledge can be extracted for less than 10kb.  This is a RAG approach to traversing the latent space. 

A static html page with nested html of child prompts can be used to explore the llm latent space.  This tree can go as far down as you would request it.  It automatically loads in the browser after each question. Until the approach is refined this can be view as an ephemeral index of the llm.  With a nice VECTOR store the indexing can be cached for prompts with a high match. 

In the terminal it is can be used as reference docs. No browser needed. Just ask for the snippet of info and reciev it. 



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


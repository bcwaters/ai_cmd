# Context Directory Structure

This directory stores all the information needed for engineering prompts and managing chat history.

## Directory Overview

- **context** - Stores all information needed to engineer the prompt
- **currentChat** - Stores the current chat for easy viewing
- **history** - Stores the history of responses to review old prompts
  * **fullCompletion** - Stores the full completion of the response
  * **response** - A filesystem copy from current chat to history   
  `cp currentChat/currentChatResponse history/responseId/${responseID}`

## Directory Structure

```
context/
├─── currentChat/
|    |
|    |─── currentChat.json
|    |─── currentChat.md
|    |─── currentChat.html
|    └─── currentChatResponse/
|         |─── markdown/
|         |    ├─── id1.md
|         |    ├─── id2.md
|         |    └─── id3.md
|         └─── html/
|         |    ├─── id1.html
|         |    ├─── id2.html
|         |    └─── id3.html
|         └─── static_html_page.html 
|
|─── history/
|    |─── fullCompletion/
|    |    |── id0.json
|    |    |── id1.json
|    |    |── id2.json
|    |    └── id3.json
|    |
|    |─── responses/
|    |    └── responseId/
|    |        |─── markdown/
|    |        |    ├─── id1.md
|    |        |    ├─── id2.md
|    |        |    └─── id3.md
|    |        └─── html/
|    |        |    ├─── id1.html
|    |        |    ├─── id2.html
|    |        |    └─── id3.html
|    |        └─── {parentID}_children 
|    |             |─── static_html_page.html 
|    |             └─── children/
|    |                  |─── child1.html
|    |                  |─── child2.html
|    |                  └─── child3.html
|    |
├─── context.data
├─── context.json
└─── README.md
```
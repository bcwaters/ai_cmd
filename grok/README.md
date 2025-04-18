# NOTES

## terms to ponder  
  prompt expansion  
  latent knowledge space  
  meta response

## future features  

  - create landing page

  - create processing for search bar form

  - I need extensive error handling. LLMs sometime don't return the format i want and it's easier to retry than force the llm in a box
  - implement history to store the jsons to a suitable database for more efficient retrieval

  - design web server to create directories for profiles.  Have  more intelligent handling of branching requests

  - create unit tests to cover all the different states of the cmd arguments

  - refactor prompt profiles to inherit from a base class

  - expand file mode to recieve a directory and process all files in the directory  
      * allow file filtering for code only

  - refine tree mode for more specific branch prompts and avoid overgeneralizing the subject, keep it on topic in relation to the parent.

  - Latex should be parsed after markdown

  - setup github docker registry for image after the build file no longer hardcodes .env. This means to running the docker image requires a command to replace image .env with user
 
 - design readable results for tree mode if in the terminal

 - past prompts should be included in the context as a seperate system prompt.

- tree mode should have a more inteeligent follow up question. there sections keywords can be intergated into the prompt

- AMMORTIZZE file reads for context history
- !important: the markdown parser will be replaced later. The priniciple remains the same. Serve pure html generated by readmes and templates on the backend.
- Template html needs to be improved for tree mode. There should be a parent home link that can be clicked to return to the home page.
- When a page is marked as parent headings should be linked to their children.
- After the first prompt generate a list of suggesting prompts that can be clicked to load into the prompt.
- Children should have a tell me more link for each heading to allow easy prompt expansion
- Save a webpage to browser cahce for the user, or upcharge for hosting it for them... these are so small i wonder if a db can safely save 100kb html files  
- Recieve a current direcrty option to decide where docs are saved.
- Save pure readme files before processing
- Create a flag for verbose logging and clean logging
- Improve the history storage approach
- Send as a facebook message from html
- Create a docker image to allow others to try this out easier
- More robust cmd options
- ! BIG IDEA ! the runtime can set all the arguments and the js script loads them from the .grokRuntime file. this make the argument parsing so much easier.
- Profile prompt improvements:
  - Always site sources (When provide information add a link to source the information)
  - Language tutor (From time to time add a note on how to say it in a different language)
  - Limit tree mode list lengths to prevent excessive branching
- Organize directory structure for history and context
- Refactor helper functions in grok.js to be more useful, I may pass around a state class to all functions to reference.
- Tree mode can be more intelligent:
  - Increase depth when list has nested lists
  - Sticky mode. the context is sticky to the prompt. the context is not updated for the next prompt.
  - Update mode. appends additional profile user prompts

  - Set root context for quick switching
  - An example would be branch: generate a readme doc for the prompt but do not update the context for the next prompt
  - When displaying the context id display the parent context and any current children

- Image mode to switch models
- A flag to switch the model
- More... type more to get a full list of options
- Encapulate system prompt in a file and load it.
- Allow for different profiles
- Further refinement on grok response output.
- Paste files into prompt, or refer to them for js to load into the prompt. can i access vim while grok is running?
- Output the directory tree structure of the current context in relation to the prompt history

- Implement a crawler that has options to prompt for more info on the heading. simply click and type. the markdown will be the way to create the file structure.

- Improve the context file structure to be more robust. KEYWORDS HEADINGS PROMPTS USESRPROFILE 

CLAUDE CODE NOTES
I like the usage of background colors to make the starting text
I also like the colored '-' for borders

How is the terminal breaker line dynamic to window size

It would be nice to output results to different mediumns.
    - slack: runs slack.sh to output resuts to a chat
    - facebook: runs facebook.sh to output results to a facebook post or message

## Local LLM Values
- Replace context files with calls to a local LLM
- Flow:
  * User prompts server
  * Send entire context (including built-up history) to local LLM
  * Local LLM processes tokens and returns semantically accurate word list
  * Augment original prompt with semantic list
  * Send augmented prompt to OpenAI
  * Process response (potential opportunity for fine-tuning)
  * Repeat

## Planned Architecture
- **NGINX**: Serve static HTML files generated from prompts
- **Vector Store**: Cache popular prompts and prime results with compressed semantic context
- **JavaScript Runtime**: Node.js (plan to replace with Bun)
- **LLM Service**: OpenAI API (unless self-hosting an LLM)

## UI/UX Ideas
- Implement spinner and countdown timer for better user experience

## xAI Notes
- xai has a subpar API relative to competitors with the first mover advantage.
- Structured input less consistent
- Responses update not available
- certain fields like max_tokens are not available to fine tune request

## Claude Code notes
I like the usage of background colors to make the starting text more readable.
I also like the colored '-' for borders

How is the terminal breaker line dynamic to window size

How do they login with a shell cript to browser? is it polling an enpoint to check for confirmation?


    
##### NOTE: If you context info is tracked it can be fixed with 
```
 git update-index --skip .grokRuntime
 git update-index --skip grok/context/context.data grok/context/context.history
 git update-index --skip grok/context/context.data grok/context/currentChat/currentChat.html
 git update-index --skip grok/context/context.data grok/context/currentChat/currentChat.json
 git update-index --skip grok/context/context.data grok/context/currentChat/summary.json
 ```

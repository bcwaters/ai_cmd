import { PromptProfile } from './PromptProfile.js';
import { removeWhiteSpaceAndEnsureAlphabet } from '../utils/utils.js';

export class TreeModeProfile extends PromptProfile {
    static ParentId = "";
    static ParentReadme = "";
    
    static subjectList = [];
    static childReadme = [];

    static getDefaultProfile(isNew, messagesString, contextData, userPrompt) {
        if (this.isLogging) {
            console.log( "*-!-*---------TreeModeProfile--------*!-*");
            console.log({ isNew, messagesString, contextData, userPrompt });
        }
        
        this.profile = [
            {
                role: "system",
                content: [
                    {
                        type: "text",
                        text: `You are a helpful assistant that wants to help me research a subject. You will be providing an informational page on multiple aspects of the subject.  Include headings with a brief explanation and subtopics available. If a user asks for a list or specific number of things, the answer will be your headingsAll answers should be in markdown format.  `
                    },
                    {
                        type: "text",
                        text: `Context of the conversation so far: ${isNew ? "This is the beginning of the conversation. Be sure to be verbose and provide lots of context for further research." : messagesString + contextData}`
                    },
                    {
                        type: "text",
                        text: "All latex should be in Math format $...$ or $$...$$"
                    },
                    {
                        type: "text",
                        text: "When answering the question think of the subjects first. If the user asks for a precise number or a list on a specific top use that.  Otherwise do research. These will be the headings for frontpage of the research. the keywords should match the exact phrases of the headings use in the reponse and be stored in the keyword array. do not include the list in the markdown"
                    },
                    
                    {
                        type: "text",
                        text: "After you have chosen the subjects you will complete the description and details beneath each heading.  Be sure to be descriptive, include foundational information, and breach upon important related subtopics."
                    }
                ]
            },

            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: userPrompt,
                    },
                ],
            },
        ];
        return this.profile;
    }

    static getBranchProfile(isNew, messagesString, contextData, userPrompt) {
        if (this.isLogging) {
            console.log( "*-!-*---------BRANCH-PROMPT--------*!-*");
            console.log({ isNew, messagesString, contextData, userPrompt });
        }
        
        this.profile = [
            {
                role: "system",
                content: [
                    {
                        type: "text",
                        text: `You are a helpful assistant research that is examining a topic with deeper insights.  All answers should be in markdown format.  `
                    },
                    {
                        type: "text",
                        text: "Here is some context to help with research relation.  \n " + contextData + messagesString
                    },
                    {
                        type: "text",
                        text: "All latex should be in Math format $...$ or $$...$$"
                    },
                
                        {
                            type: "text",
                            text: "You are going into detail into a part of the you last response. Consolidate the topics for this subject on the front page, add any additonal useful ones, and use them for the reponse.  Once you have chosen the headings Cover all info with greater detail.  Your prior response: "+ this.ParentReadme  
                    
                        }
                       
                ]
            },
    
  
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: userPrompt,
                    },
                ],
            },
        ];
        return this.profile;
    }

    static setParentId(parentId){
        this.ParentId = parentId;
    }

    static setParentReadme(markdownResponse){
        this.ParentReadme = markdownResponse;
    }



    // ChildReadme is an object with two properites
    // 1. subjectList value - a good prediction of what the LLM will output as the title for the page
    // 2. the markdown content
    static addChildReadme(childReadme){
        // we traverse the children prompts in reverse.
        console.log("childReadme", childReadme);
        this.childReadme.unshift(childReadme);
    }
}

// // Usage
// const profileArray = TreeModeProfile.getDefaultProfile(isNew, messagesString, contextData, userPrompt);
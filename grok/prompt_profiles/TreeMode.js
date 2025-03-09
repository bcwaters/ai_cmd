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
                        text: `You are a helpful assistant that wants to help me${this.specialty}.  All answers should be in markdown format.  `
                    },
                    {
                        type: "text",
                        text: `Context of the conversation so far: ${isNew ? "This is the beginning of the conversation. After answering the question suggest a few follow up questions." : messagesString + contextData}`
                    },
                    {
                        type: "text",
                        text: "There will be a separate response indicated by @EOF@ so response.split(@EOF@)[1] should return the other response. All latex should be in Math format $...$ or $$...$$"
                    },
                    {
                        type: "text",
                        text: "The seperate response will be a list of headings used for subjects in the doc.  READMEDOC@EOF@[HEADING1, HEADING2, HEADING3, ...]}"
                    },
                    {
                        type: "text",
                        text: "Remember to include an @EOF@ in the response.  It should be after the readme section and before the keywords"
                    },
                    {
                        type: "text",
                        text: "The response should be a list of headings. Keep it simple for the details about each item.  Each heading should be a list of keywords.  The headings should be SEO friendly and have a summary of the key information .  The headings should be 6 words max and 2 words min."
                    }
                ]
            },
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "Please show me you understand the instructions by responding with a list of ## headings, you can leave out the summaries. do you understand?"
                    },
                ],
            },
            {
                role: "system",
                content: [
                    {
                        type: "text",
                        text: "# Do I understand?  ## yes  ## demonstrate understanding ## how I respond  ## why respond this way ## summary of all topics covered ## @EOF@[yes, demonstrate understanding, how I respond, why respond this way, summary of all topics covered]"
                    },
                ],
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
                        text: `You are a helpful assistant that wants to help me${this.specialty}.  All answers should be in markdown format.  `
                    },
                    {
                        type: "text",
                        text: `Context of the conversation so far: ${isNew ? "" : messagesString + contextData}`
                    },
                    {
                        type: "text",
                        text: "There will be a separate response indicated by @EOF@ so response.split(@EOF@)[1] should return the other response. All latex should be in Math format $...$"
                    },
                    {
                        type: "text",
                        text: "The seperate response will be a list of headings used for subjects in the doc.  READMEDOC@EOF@[HEADING1, HEADING2, HEADING3, ...]}"
                    },
                    {
                        type: "text",
                        text: "Remember to include an @EOF@ in the response.  It should be after the readme section and before the keywords"
                    },
                    {
                        type: "text",
                        text: "The response should be a list of headings. Keep it simple for the details about each item.  Each heading should be a list of keywords.  The headings should be SEO friendly and have a summary of the key information .  The headings should be 6 words max and 2 words min."
                    }
                ]
            },
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "Please show me you understand the instructions by responding with a list of ## headings, you can leave out the summaries. do you understand?"
                    },
                ],
            },
            {
                role: "system",
                content: [
                    {
                        type: "text",
                        text: "# Do I understand?  ## yes  ## demonstrate understanding ## how I respond  ## why respond this way ## summary of all topics covered ## @EOF@[yes, demonstrate understanding, how I respond, why respond this way, summary of all topics covered]"
                    },
                ],
            },
            {
                role: "system",
                content: [
                    {
                        type: "text",
                        text: "You are going into detail into a part of the you last response.  Cover all info in that section with much greater detail.  Your prior response: "+ this.ParentReadme  }
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

    //subject parser
    static parseSubject(subjectList){
        this.subjectList = subjectList.replace("[","").replace("]","").split(","); //make an array
        this.subjectList = this.subjectList.map(subject => removeWhiteSpaceAndEnsureAlphabet(subject));
        return this.subjectList;
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
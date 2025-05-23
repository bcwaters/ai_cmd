import { PromptProfile } from './PromptProfile.js';

export class CodeReviewPromptProfile extends PromptProfile {
    static isLogging = false;
    static specialty = " ";  //user can set this to "write code" or "write a readme" or "write a blog post" etc.
    static files = [];

    static setSpecialty(specialty) {
        if (specialty == "software") {
            this.specialty = "write software. It should be clean, modern, and follow best practices.  inline comments for what each line of code does.";
        } else if (specialty == "teaching") {
            this.specialty = " develop a lesson plan. I am a teacher and want to collaborate.";
        } else if (specialty == "writing") {
            this.specialty = " write elegantly. creativity is key.";
        }else{
            this.specialty = "to do" + specialty;
        }
    }

    static getDefaultProfile(isNew, messagesString, contextData, userPrompt) {
        if (this.isLogging) {
            console.log({ isNew, messagesString, contextData, userPrompt });
        }
        
        let filePrompt = this._prepareFilePrompt();
        
        console.log("writing code review profile");
        this.specialty = 
            "review code"+
            "Suggest improvements and fix any issues such as typos, syntax errors, outdated approaches. "+
            "Each file with suggestions should show the suggestions. Make sure suggestions have a description before the code block. In its own code block.  Be thorough in your explanation for the suggestion and link to relevant documentation when available for major packages used."
        
        let systemRoleDefinePrompt = `You are a helpful assistant that wants to help me ${this.specialty}.  All answers should be in markdown format.`;
       
        isNew=true; //clear context for code reviews
        let contextPrimePrompt = `Context of the conversation so far: ${isNew ? "This is the beginning of the conversation. After answering the question suggest a few follow up questions." : messagesString + contextData}`; 
        
        let eofStructurePrompt = "There will be a separate response indicated by @EOF@ so response.split(@EOF@)[1] should return the other response. All latex should be in Math format $...$ or $$...$$"+
        "The seperate response will be 500 characters max and 400 character min. it will be a list of keywords which capture the key information provided. SEO style  READMEDOC@EOF@KEYWORDS"+
        "Remember to include an @EOF@ in the response.  It should be after the readme section and before the keywords";
        this.profile = [
            {
                role: "system",
                content: [
                    {
                        type: "text",
                        text: systemRoleDefinePrompt
                    },
                    {
                        type: "text",
                        text: contextPrimePrompt
                    },
                    {
                        type: "text",
                        text: eofStructurePrompt
                    },

                    
                    ]
            },
            
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "Please show me you understand the instructions by responding with one word. do you understand?"
                    },
                ],
            },
            {
                role: "system",
                content: [
                    {
                        type: "text",
                        text: "# yes@EOF@[understanding, ReadmeFormat, delimiter,]"
                    },
                ],
            },
        ];

        //add any files for context
        if(filePrompt != ""){
            this.profile.push(filePrompt);
        }

        //add the user prompt
        this.profile.push(
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: userPrompt,
                    },
                ],
            },
        );
        
        return this.profile;
    }

    static addFile(fileContent){
        if(fileContent.length > 0){ 
            for(let file of fileContent){
                this.files.push(file);
            }
        }
    }
}

// // Usage
// const profileArray = CodeReviewPromptProfile.getDefaultProfile(isNew, messagesString, contextData, userPrompt);
export class PromptProfile {
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
        let includedFiles = [];

        if(this.files.length > 0){
            console.log("-----------------------------this.files", this.files);
            for( let file of this.files){
                includedFiles.push(
                    {
                    type: "text",
                    text: file
                }
                
            );
            }
        }

        let filePrompt = "";
      if(includedFiles.length > 0){
            filePrompt = 
            {
                role: "system",
                content: includedFiles
            }
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
                        text: "There will be a separate response indicated by @EOF@ so response.split(@EOF@)[1] should return the other response"
                    },
                    {
                        type: "text",
                        text: "The seperate response will be 500 characters max and 400 character min. it will be a list of keywords which capture the key information provided. SEO style  READMEDOC@EOF@KEYWORDS"
                    },
                    {
                        type: "text",
                        text: "Remember to include an @EOF@ in the response.  It should be after the readme section and before the keywords"
                    }
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
       if(filePrompt!=""){
            this.profile.push(filePrompt);
        }
        return this.profile;
    }

    static addFile(fileContent){
 this.files.push(fileContent);
    }
}

// // Usage
// const profileArray = PromptProfile.getDefaultProfile(isNew, messagesString, contextData, userPrompt);
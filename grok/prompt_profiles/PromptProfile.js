import { z } from "zod";

export class PromptProfile {
    static isLogging = false;
    static short = false;
    static specialty = " ";  //user can set this to "write code" or "write a readme" or "write a blog post" etc.
    static files = [];

    static setSpecialty(specialty) {
        if (specialty == "software") {
            this.specialty = "write software. It should be clean, modern, and follow best practices.  inline comments for what each line of code does.";
        } else if (specialty == "teaching") {
            this.specialty = " develop a lesson plan. I am a teacher and want to collaborate.";
        } else if (specialty == "writing") {
            this.specialty = " write elegantly. creativity is key.";
        } else {
            this.specialty = "to do" + specialty;
        }
    }

    static getDefaultProfile(isNew, messagesString, contextData, userPrompt) {
        if (this.isLogging) {
            console.log("getDefaultProfile");
            console.log({ isNew, messagesString, contextData, userPrompt });
        }
        
        let filePrompt = this._prepareFilePrompt();
        
        this.profile = [
            {
                role: "system",
                content: [
                    {
                        type: "text",
                        text: `You are a helpful assistant that wants to help me${this.specialty}.  All responses should be in markdown format.`
                    },
                    {
                        type: "text",
                        text: `Context of the conversation so far: ${isNew ? "This is the beginning of the conversation. After answering the question suggest a few follow up questions." : messagesString + contextData}`
                    },

                    {
                        type: "text",
                        text: "For keywords include all relevant context. Anticpate related topics within the keywords also. it will be a list of keywords which capture the key information provided. SEO style. the keywords are metadata for the response {markdown: string, keywords: [string...]}"
                    },
                    {
                        type: "text",
                        text: "All latex should be in Math format $...$ or $$...$$"
                    }
                ]
            },
            
      
          
        ];

        //add any files for context
        if(filePrompt != ""){
            this.profile.push(filePrompt);
        }

        if(this.short){
            this.profile.push({
                role: "system",
                content: [{type: "text", text: "Please response in a short and concise manner.  When asked programming question return mostly code snippets and minimal text. Answer should be less than 280 tokens.  Always ensure the last token sent makes this a valid json object."}]
            });
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

    static _prepareFilePrompt() {
        let includedFiles = [];
        let filePrompt = "";

        if(this.files.length > 0){
            for(let file of this.files){
                includedFiles.push({
                    type: "text",
                    text: file.fileName + "\n" + file.content
                });
            }
        }

        if(includedFiles.length > 0){
            filePrompt = {
                role: "system",
                content: includedFiles
            };
        }

        return filePrompt;
    }

    static addFile(fileContent){
        if(fileContent.length > 0){ 
            for(let file of fileContent){
                this.files.push(file);
            }
        }
    }

    static getSchema(){
        return z.object({
            markdown: z.string().describe("The markdown content to display to the user"),
            keywords: z.array(z.string()).describe("Keywords extracted from the response")
        });

 
    }

    static getIndexLookupSchema(){
        return z.object({
           
            pages: z.array(z.number()).describe("The pages of the book that are relevant. Only the page numbers are needed. No other text.")
        });
    }
}

// // Usage
// const profileArray = PromptProfile.getDefaultProfile(isNew, messagesString, contextData, userPrompt);
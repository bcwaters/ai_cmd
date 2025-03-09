import fs from 'fs';

export class VisionDescribe {
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
        } else {
            this.specialty = "to do" + specialty;
        }
    }

    static getDefaultProfile(isNew, messagesString, contextData, userPrompt) {
        if (this.isLogging) {
            console.log({ isNew, messagesString, contextData, userPrompt });
        }
        
        let filePrompt = this._prepareFilePrompt();
        
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
                        text: "Remember to include an @EOF@ in the response.  It should be after the readme section and before the keywords. All latex should be in Math format $...$"
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
        ];

        //add any files for context
        if(filePrompt != ""){
            this.profile.push(filePrompt);
        }

        let image_path = "./grok/images/image.jpg";
        let imageUrl = this.base64_encode_image(image_path);
        //add the user prompt
        this.profile.push(
            {
                role: "user",
                content: [
                    {
                        type: "image_url",
                        image_url: {
                            url: "data:image/jpg;base64," + imageUrl,
                            detail: "high",
                        },
                    },
                    {"type": "text", "text": userPrompt},
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

    static base64_encode_image(image_path){
        return fs.readFileSync(image_path).toString('base64');
    }
}


/*

  messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpg;base64,{base64_encode_image(image_path)}",
                        "detail": "high",
                    },
                },
                {"type": "text", "text": prompt},
            ],
        }
    ]
*/
// // Usage
// const profileArray = PromptProfile.getDefaultProfile(isNew, messagesString, contextData, userPrompt);
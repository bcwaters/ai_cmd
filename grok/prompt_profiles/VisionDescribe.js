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

    static getDefaultProfile(isNew, messagesString, contextData, userPromptRequest) {
        if (this.isLogging) {
            console.log( isNew, messagesString, contextData, userPromptRequest.dynamicPrompt );
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

       

        let image_path = userPromptRequest.filePath;
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
                    {"type": "text", "text": userPromptRequest.dynamicPrompt},
                ],
            },
        );
        
        return this.profile;
    }

  


    


    static getJsonProfile(isNew, messagesString, contextData, userPromptRequest) {
        if (this.isLogging) {
            console.log( isNew, messagesString, contextData, userPromptRequest.dynamicPrompt );
        }
        
        
        

        //TODO  specialize the return format once the while loop is subdivided into different modes
        this.profile = [
            {
                role: "system",
                content: [
                    {
                        type: "text",
                        text: `You are a data structuring expert.  Examine an image of a page and convert any tables into JSON, returning each table in a code block. All other information in the image can be represented in markdown as descriptions and auxilary information.`
                    },
                    {
                        type: "text",
                        text: "Here is some context from the previous image: " + messagesString + contextData
                    },
                    {
                        type: "text",
                        text: "The format for your response should have a descriptive title, the tables, and then any other information. Example: ## Character Sheets \n ### Tables \n```json \n{}```` ### markdown for other info"
                    },
                    {
                        type: "text",
                        text: "Include a json for everytable in the image.  Have an extensive markdown section for any other information in the image. Do not leave out any data."
                    },

           
                ]
            },
            
    
        ];

        console.log("fileapth:" , userPromptRequest.filePath);
        let image_path = userPromptRequest.filePath;
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
                    {"type": "text", "text": userPromptRequest.dynamicPrompt},
                ],
            },
        );
        
        return this.profile;
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
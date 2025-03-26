import fs from 'fs';
import { PromptProfile } from './PromptProfile.js';

export class ImageGenerationPromptProfile extends PromptProfile {
    static isLogging = false;
    static specialty = " ";  //user can set this to "write code" or "write a readme" or "write a blog post" etc.
    static files = [];


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

  


    


    static createImageFromImage(isNew, messagesString, contextData, userPromptRequest) {
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
                        text: `You are an expert at reimagining images.  You will be given an image and a prompt.  You will then create a new image based on image in a new style.  The form of the image and layout should be the same but the style should be updated to the prompt.`
                    },
     
                    {
                        type: "text",
                        text: "Always respond with the image in base64 format.  Do not include any other text in your response."
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
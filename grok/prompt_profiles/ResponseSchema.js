import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

const responseSchema = z.object({
  
    properties: {
        markdown: z.string().describe("The markdown content to display to the user"),
        keywords: z.array(z.string()).describe("Keywords extracted from the response")
    },
    required: ["markdown", "keywords"]
});

const schema = () => {
    return zodToJsonSchema(responseSchema, "response" );
}

export default schema;
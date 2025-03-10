import pdf from 'pdf-parse';
import fs from 'fs';

async function pdfPagesToText(pdfPath) {
    // Read the PDF file
    const dataBuffer = fs.readFileSync(pdfPath);
    
    // Options for parsing individual pages
    const options = {
        pagerender: function(pageData) {
            return pageData.getTextContent()
                .then(function(textContent) {
                    let text = '';
                    for (let item of textContent.items) {
                        text += item.str + ' ';
                    }
                    return text;
                });
        }
    };

    // Parse the PDF file
    const pdfData = await pdf(dataBuffer, options);
    
    // Get the number of pages
    const numPages = pdfData.numpages;
    
    // Array to store text from each page
    const pageTexts = [];
    
    // Process each page individually
    for (let i = 1; i <= numPages; i++) {
        const pageOptions = {
            ...options,
            max: i,  // Only process up to this page
            min: i   // Start processing from this page
        };
        
        const pageData = await pdf(dataBuffer, pageOptions);
        pageTexts.push(pageData.text.trim());
    }
    
    return pageTexts;
}

export default pdfPagesToText;
const fluffWords = [ "this", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to", "from", "by", "with", "of"];
//rename function.
export function cleanString(string) {


   // let fluffWordsRegex = new RegExp(fluffWords.join("|"), "g");
  
     //string = string.replace(fluffWordsRegex, "");

     //handle negations
     //word stemming reduction


    return string.replaceAll("```json", "")
    .replaceAll("```", "")
    .replaceAll(" ", "")
    .replaceAll("\n", "")
    .replaceAll("\\", "")
    .replaceAll("'", "")
    .replaceAll("\"", "")
    .replaceAll(":", "")
    .replaceAll(",", "")
    .replaceAll(".", "")
    .replaceAll("-", "")
    .replaceAll("_", "")
    .replaceAll("*", "")
    .replaceAll("`", "")
    .replaceAll("~", "")
    .replaceAll("^", "")
    .replaceAll("=", "")
    .replaceAll("(", "")
    .replaceAll(")", "")
    .replaceAll("[", "")
    .replaceAll("]", "")
    .replaceAll("{", "")
    .replaceAll("}", "")
    .replaceAll(";", "")
    .replaceAll(":", "")
    .toLowerCase();         //Perhaps there is better mapping this way since models are trained with lower case. perhaps the api does this anyways
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function removeWhiteSpaceAndEnsureAlphabet(string){
    let regexWhitespace = /^\s+/;
    let regexAlphabetStart = /^[a-zA-Z0-9]/;
    let regexNotAlphabetAll = /[^a-zA-Z0-9\s]/;
    string = string.replace(regexWhitespace, '')
    string = string.replaceAll("\\n", " ");
    string = string.replaceAll("\"", "");
    string = string.replaceAll("'", "");
    string = string.trim();
    string = string.replace(regexNotAlphabetAll, "");

    while(!regexAlphabetStart.test(string)){
        console.log("string being cleaned", string);
        string = string.substring(1);
    }

    if(string.length>100){
        string = string.substring(0, 100);
    }
    
    return string;
}
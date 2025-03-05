const fluffWords = [ "this", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to", "from", "by", "with", "of"];
//rename function.
export function minimizeTokens(string) {
    // Remove all non-alphanumeric characters (except spaces initially)
    let regexAlphabet = /[^a-zA-Z0-9\s]/g;
    string = string.replace(regexAlphabet, "");
    
    // Remove all spaces and convert to lowercase
    return string.replaceAll(" ", "").toLowerCase();
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

    while(!regexAlphabetStart.test(string) && string.length > 0){
        console.log("string being cleaned", string);
        string = string.substring(1);
    }

    if(string.length>100){
        string = string.substring(0, 100);
    }
    
    return string;
}
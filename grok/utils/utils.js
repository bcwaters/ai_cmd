//rename function.
export function cleanString(string) {
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
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
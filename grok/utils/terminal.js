class terminal {
    static debugLogger = false;
    constructor() {
     
    }
    
    static log(...args) {
        console.log(...args);
    }
    static error(...args) {
        console.error(...args);
    }
    static warn(...args) {
        console.warn(...args);
    }
    static info(...args) {
        console.info(...args);
    }
    static debug(...args) {
        if (this.debugLogger) {
            console.log(...args);
        }
    }

    static logDivider = "*---------------------------------------------------------------*";
    // Define ANSI color codes
    static colors = {
        reset: "\x1b[0m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        purple: "\x1b[35m",
        cyan: "\x1b[36m",
        // context: "\x1b34m",
        // new: "\x1b[32m",  //ARGCOLORS
        // depth: "\x1b33m",           
        // file: "\x1b35m",
        // specialty: "\x1b36m",
        // treeMode: "\x1b44m"
      };
    
}

export default terminal;
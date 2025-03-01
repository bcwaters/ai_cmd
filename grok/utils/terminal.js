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

    static logDivider = "\x1b[33m*--------------------------------------------------------------- *\x1b[0m";
    // Define ANSI color codes
    static colors = {
        reset: "\x1b[0m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        purple: "\x1b[35m",
        cyan: "\x1b[36m",
        black: "\x1b[30m",
        white: "\x1b[37m",
        lightGray: "\x1b[90m",
        darkGray: "\x1b[97m",
        lightRed: "\x1b[91m",
        lightGreen: "\x1b[92m",
        lightYellow: "\x1b[93m",
        lightBlue: "\x1b[94m",
        lightPurple: "\x1b[95m",
        lightCyan: "\x1b[96m",
        darkRed: "\x1b[31m",
        darkGreen: "\x1b[32m",
        darkYellow: "\x1b[33m",
        darkBlue: "\x1b[34m",
        darkPurple: "\x1b[35m",
        darkCyan: "\x1b[36m",
        // context: "\x1b34m",
        // new: "\x1b[32m",  //ARGCOLORS
        // depth: "\x1b33m",           
        // file: "\x1b35m",
        // specialty: "\x1b36m",
        // treeMode: "\x1b44m"
      };

      static getDividerWithMessage(message, color){
        let messageColor = this.colors.yellow;
        if (color){
            messageColor = color;
        }
        //100
        let dividerLength = this.logDivider.length;
        //10
        let messageLength = message.length;
        //90
        let remainingLength = dividerLength - messageLength;
        //45
        let center = Math.floor(remainingLength / 2);
        //TODO make this work for even and odd numbers of remainingLength
        let divider = this.logDivider.slice(0, center) + message + this.logDivider.slice(center + messageLength)+ "\n";
        return `${messageColor}${divider}${this.colors.reset}`;
      }
    
}

export default terminal;
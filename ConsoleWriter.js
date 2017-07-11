var ConsoleWriter = function(message, clearCurrentLine) {
    if (process.stdout && process.stdout.clearLine) {
        if (clearCurrentLine) {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write(message);
        } else {
            console.log(message);
        }
    } else {
        //Fallback
        console.log(message);
    }
}

module.exports = ConsoleWriter;
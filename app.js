const EventEmitter = require("events");

const Logger = require("./logger");
const logger = new Logger();

// Register a Listener
logger.on("messageLogged", (user) => console.log(`Welcome, ${user}`));

logger.log("message");

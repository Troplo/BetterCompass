const debug = require("debug")("CompassSM");

module.exports = (modulename) => {
    return (message) => {
        debug(`[${modulename}]`, message);
    }
}
const debug = require("./debug")("Error");

exports.StatusCodeError = class StatusCodeError extends Error {
	constructor(code) {
		const message = `Invalid status code ${code}`;
		debug(message);
		super(message);
		this.message = message;
		this.name = 'StatusCodeError';
		this.statusCode = code;
	}
}
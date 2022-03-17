const debug = require("./debug")("Auth");
const request = require("request");
const cheerio = require("cheerio");
const StatusCodeError = require("./error").StatusCodeError;

class User {
	constructor(body) {
		this.username = body.match(/Compass.organisationUserSussiId = "(\w+)";/)[1];
		this.id = parseInt(body.match(/Compass.organisationUserId = (\d+);/)[1]);
	}
}

module.exports = class Auth {
	constructor(url, username = "", password = "", options = {}) {
		debug("Initialising");
		this.username = username;
		this.password = password;

		options.baseUrl = url;
		options.method = "GET";
		options.headers = {
			// Spoof Chrome 54
			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/;q=0.8",
			"Accept-Language": "en-US,en;q=0.8",
			"Connection": "keep-alive",
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36"
		};
		options.jar = true;

		this.request = request.defaults(options);
	}

	async initialise() {
		await this.reauth();
	}

	async reauth() {
		debug("Authenticating");
		// Start with a blank cookie jar
		let j = request.jar();
		// Overide current cookie jar with blank one
		this.request = this.request.defaults({
			jar: j
		});

		// Get the login page
		// Retrieves a session cookie
		debug("Getting session cookie");
		let $login;
		try {
			let [body] = await this.get("/login.aspx", {
				qs: {
					"sessionstate": "disabled"
				}
			});

			$login = cheerio.load(body);
		} catch(e) {
			debug("Error getting session cookie");
			throw e;
		}

		// Log in
		// Get an auth cookie
		debug("Getting auth cookie");
		try {
			let [body, res] = await this.get("/login.aspx", {
				method: "POST",
				headers: {
					"Cache-Control": "max-age=0"
				},
				qs: {
					"sessionstate": "disabled"
				},
				form: {
					__VIEWSTATE: $login("#__VIEWSTATE").val(),
					username: this.username,
					password: this.password,
					button1: "Sign in",
					__VIEWSTATEGENERATOR: $login("#__VIEWSTATEGENERATOR").val()
				},
				maxRedirects: 0,
				intendedStatusCode: 302
			});
			console.log(body, res)
			debug("Authenticated");
		} catch(e) {
			debug("Error getting auth cookie");
			throw e;
		}

		// Get user info
		debug("Getting user info");
		try {
			let [body] = await this.get("/");

			this.user = new User(body);
			debug("Got user info");
		} catch(e) {
			debug("Error getting user info");
			throw e;
		}
	}

	async_request(options = {}) {
		return new Promise((resolve, reject) => {
			this.request(options, (err, res, body) => {
				if (err) {
					reject(err);
				} else {
					resolve([body, res]);
				}
			});
		});
	}

	async get(path = "", options = {}) {
		options.uri = path;
		const intendedStatusCode = options.intendedStatusCode || 200;

		debug(`Requesting ${path}, expecting status ${intendedStatusCode}`);

		let body, res;
		// eslint-disable-next-line no-useless-catch
		try {
			[body, res] = await this.async_request(options);

			if (res.statusCode !== intendedStatusCode) {
				// Request yielded unexpected result
				// Try to reauth
				debug("Request failed, trying reauth");
				await this.reauth();
				// Try again
				debug(`Retrying request to ${path}`);
				[body, res] = await this.async_request(options);
				if (res.statusCode !== intendedStatusCode) {
					throw new StatusCodeError(res.statusCode);
				}
			}
			debug("Request successful");
			return [body, res];
		} catch(e) {
			throw e;
		}
	}
}
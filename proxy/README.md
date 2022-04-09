# BetterCompass Proxy & Backend

The BetterCompass proxy uses Sequelize for database storage, and proxies all
requests to compass.education with the selected school, if none is provided, it
will default to devices.compass.education.

The BetterCompass frontend automatically sends this information for you.

The Compass instance can be passed to the proxy in 2 ways:

- `compassInstance: "compass-instance-name"`: A header in the request.
- `?compassInstance=compass-instance-name`: A querystring parameter in the
  request, useful for downloads and other requests that cannot use the header.
- `?forceInstance=compass-instance-name`: A querystring parameter in the
  request, deprecated.

The proxy validates the instance name to ensure that it resolves to
compass.education, and not a foreign domain, however it doesn't validate whether
the school exists, and allows for \*.compass.education, validating it will be
too slow unless cached, however this isn't much of a problem, it also doesn't
support legacy jdlf.com.au hostnames, but those are unlikely to be used anymore.

## Setup instructions

- Run `yarn install` to install the dependencies.
- Configure the MariaDB database connection in `config/config.json` using the
  example template `config/config.example.json`.
- Configure `.env` with the template `.env.example`, a WEATHER_API_KEY is
  optional, and can be found by registering an OpenWeatherMap account, the
  HOSTNAME is the hostname for your instance of BetterCompass, for example:
  localhost, or compass.troplo.com, this is for the CORS policy, RELEASE can
  either be dev, or beta, dev will show features that may be incomplete, you
  shouldn't use this for a production environment.
- Run `sequelize db:migrate` to create the database tables.
- Run `sequelize db:seed` to seed required information to the database.
- Run `yarn serve` to start the proxy with nodemon which automatically restarts
  on file-change for development.
- Run `yarn start` or `node .` to start the proxy in production.
- BetterCompass Proxy runs on port 23994.

## Other information

- The `CompassAPIKey` header is used for Compass' GraphQL server (currently only
  used for Compass Discussions), it is not required for authentication on the
  REST API, Cookie-based authentication is used instead.

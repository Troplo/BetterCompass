# BetterCompass Proxy & Backend

The BetterCompass proxy uses Sequelize for database storage, and proxies all
requests to compass.education with the selected school, if none is provided, it
will default to devices.compass.education.

The BetterCompass frontend automatically sends this information for you.

Proxy headers & query strings:

- `compassInstance: "compass-instance-name"`: A header in the request for
  sending the proxy instance, the proxy will proxy
  compass-instance-name.compass.education in this example.
- `?compassInstance=compass-instance-name`: A querystring parameter in the
  request, useful for downloads and other requests that cannot use the header.
- `compassUserId: 123`: A header in the request for sending the proxy user id,
  this is used for authentication on the backend to validate the user, as it is
  required by the Compass API.
- `compassSchoolId: "compass.instance.name"`: A header in the request for
  sending the Compass School ID, this is used for cookie authentication, it is
  generally the domain of the school.

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

- The `CompassAPIKey` header is used for Compass' GraphQL server currently only
  used for Compass Discussions on Compass' API, however, it can be used for
  authentication on BetterCompass' APIs such as GET /api/v1/user
- Cookie authentication can bypass the requirement for the `CompassAPIKey`
  header, however it is sent in all requests as a fallback.

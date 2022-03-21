console.log("Initializing")
let express = require('express')
let app = express()
//Middle-ware
let bodyParser = require('body-parser')
let os = require('os')
let axios = require('axios')
const { createProxyMiddleware } = require('http-proxy-middleware');
const cookieParser = require("cookie-parser");
app.use(cookieParser())
if(process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}
const compassRouter = function(req) {
    const instance = req.header("compassInstance") || req.query.forceInstance || "devices"
    console.log("Instance: " + instance)
    // this is to avoid the ability to proxy non Compass sites through the proxy.
    if(instance.match(/^[a-zA-Z0-9-]+$/)) {
        return "https://" + instance + ".compass.education"
    } else {
        console.log("Test failed: " + "https://" + instance + ".compass.education")
        return "https://devices.compass.education"
    }
}

app.get("/api/v1/weather", (req, res) => {
    try {
        axios.get("http://ip-api.com/json/" + req.ip).then((response1) => {
            console.log(response1.data)
            axios.get("https://api.openweathermap.org/data/2.5/weather?lat=" + response1.data.lat + "&lon=" + response1.data.lon + "&appid=cc89e60155163ce2bbd7a7a5e3ca413b&units=metric")
                .then(response2 => {
                    res.send(response2.data)
                })
                .catch(error => {
                    res.send(error.response.data)
                })
        })
    } catch (e) {
        res.status(500).send(e)
    }
})

app.all("/api/*", (req, res) => {
    res.status(404).json({
        message: "This is reserved, and cannot be proxied through Compass."
    })
})

app.use(function(req, res, next) {
    res.cookie('cpssid_' + req.header("compassSchoolId"), req.cookies["cpssid_" + req.header("compassSchoolId")],
        { expires: new Date(253402300000000), httpOnly: true, secure: true });
    res.cookie('ASP.NET_SessionId', req.cookies["ASP.NET_SessionId"],
        { expires: new Date(253402300000000), httpOnly: true, secure: true });
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));
    next();
});

app.use('/', createProxyMiddleware({
    target: "devices.compass.education",
    router: compassRouter,
    changeOrigin: true,
    cookieDomainRewrite: process.env.HOSTNAME,
    pathRewrite: {
        [`^/json_placeholder`]: '',
    },
}));

app.use(bodyParser.json({ limit: '5mb' }))
app.use(bodyParser.urlencoded({ extended: true }))
console.log(os.hostname())

if(process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'production') {
    app.use(require('morgan')('dev'))
}

function main () {
    let server = app.listen(23994, () => {
        console.log('Initialized')
        console.log('Listening on port 0.0.0.0:' + 23994)

        app.locals.appStarted = true
        app.emit('appStarted')
    })

}
if(process.env.NODE_ENV === 'test') {

} else {
    main()
}
module.exports = app
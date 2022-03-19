console.log("Initializing")
let express = require('express')
let app = express()
//Middle-ware
let bodyParser = require('body-parser')
let os = require('os')
const { createProxyMiddleware } = require('http-proxy-middleware');
if(process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}
const compassRouter = function(req) {
    const instance = req.header("compassInstance") || req.query.forceInstance || "devices"
    console.log("Instance: " + instance)
    return "https://" + instance + ".compass.education";
}

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));
    next();
});

app.use('/', createProxyMiddleware({
    target: "devices.compass.education",
    router: compassRouter,
    changeOrigin: true,
    cookieDomainRewrite: "localhost",
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
    let server = app.listen(3001, () => {
        console.log('Initialized')
        console.log('Listening on port 0.0.0.0:' + 3001)

        app.locals.appStarted = true
        app.emit('appStarted')
    })

}
if(process.env.NODE_ENV === 'test') {
} else {
    main()
}
module.exports = app
const express = require("express");
const router = express.Router();
const Errors = require("../lib/errors.js");
const auth = require("../lib/authorize.js");

router.get("/", auth, (req, res) => {
    try {
        res.json(req.user)
    } catch (e) {
        throw Errors.unknown
    }
});

module.exports = router;
const express = require('express')
const db = require('../db')
const router = express.Router()
const fs = require('fs')
// const port = 80
const bodyParser = require("body-parser");
const cors = require("cors")
const cookieParser = require('cookie-parser')

router.use(cors())
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use('/js', express.static('js'))
router.use(cookieParser())

router.get('/patient', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname + "/../html/registerpatient.html"));
    } catch (err) {
        console.log(err);
    }
});
router.get('/staff', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname + "/../html/registerstaff.html"));
    } catch (err) {
        console.log(err);
    }
});

module.exports = router
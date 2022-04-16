const express = require('express')
const router = express.Router()
const db = require('../db')
const app = express()
const fs = require('fs')
const path = require('path')
const cookieParser = require('cookie-parser')
router.use(cookieParser())

router.get('/', async (req, res) => {
    try{
        if(req.cookies['pat_id']){
            res.sendFile(path.join(__dirname + "/../html/patientportal.html"));
        } else if(req.cookies['doc_id']) {
            res.sendFile(path.join(__dirname + "/../html/doctorportal.html"));
        } else if(req.cookies['staff_id']) {
            res.sendFile(path.join(__dirname + "/../html/staffportal.html"));
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router
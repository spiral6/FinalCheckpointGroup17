const express = require('express')
const db = require('./db')
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

router.get('/', async (req, res) => {
    try {
   
        if(req.cookies['pat_id'] || req.cookies['doc_id'] || req.cookies['staff_id']){
            res.redirect('../portal');
        } else if(req.cookies['admin']){
            res.redirect('../admin');
        } else {
            res.sendFile(path.join(__dirname + "/../html/index.html"));
        }
    
    } catch (err) {
        console.log(err);
    }
});

router.post('/', async (req, res) => {
    try {
        // some sort of session creation here
        // set cookies here
    
        if(req.cookies['pat_id'] || req.cookies['doc_id'] || req.cookies['staff_id']){
            res.redirect('../portal');
        } else if(req.cookies['admin']){
            res.redirect('../admin');
        } else {
            res.sendFile(path.join(__dirname + "/../html/index.html"));
        }
    
    } catch (err) {
        console.log(err);
    }
});

router.post('/patient', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname + "/../html/patientlogin.html"));
    } catch (err) {
        console.log(err);
    }
});
router.post('/staff', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname + "/../html/stafflogin.html"));
    } catch (err) {
        console.log(err);
    }
});
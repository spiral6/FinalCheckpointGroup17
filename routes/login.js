const express = require('express')
const db = require('../db')
const router = express.Router()
const fs = require('fs')
// const port = 80
const bodyParser = require("body-parser");
const cors = require("cors")
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
            request.session.loggedin = false;
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
        const email= req.body.user_email;
        const password = req.body.user_password;

        console.log(req.body);
        console.log(email);
        console.log(password);

        const result = await db.pool.query("SELECT * FROM UserTable WHERE user_email=? AND user_password=?;",[
            email,
            password
        ]);

        console.log(result[0])
        if(result[0]) {
            res.cookie('user_id',result[0].user_id)
    
            if(result[0].staff_id){
                const doctor_check = await db.pool.query("SELECT * FROM StaffTable WHERE staff_id=?;",[
                    result[0].staff_id
                ]);
                if(doctor_check[0].staff_occupation === "DOCTOR"){
                    console.log("Logged in as a Doctor.")
                    res.cookie('doc_id',result[0].staff_id)
                } else {
                    console.log("Logged in as a Staff.")
                    res.cookie('staff_id',result[0].staff_id)
                    res.cookie('staff_occupation', doctor_check[0].staff_occupation)
                }
            } 
            else if(result[0].pat_id){
                console.log("Logged in as a Patient.")
                res.cookie('pat_id',result[0].pat_id)
            }
            
            req.session.loggedin = true;
            res.sendStatus(200)
        } else {
            console.log("Login unsuccessful.")
            req.session.loggedin = false;
            res.sendStatus(403)
        }
    
    } catch (err) {
        console.log(err);
    }
});

router.get('/patient', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname + "/../html/patientlogin.html"));
    } catch (err) {
        console.log(err);
    }
});
router.get('/staff', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname + "/../html/stafflogin.html"));
    } catch (err) {
        console.log(err);
    }
});

module.exports = router
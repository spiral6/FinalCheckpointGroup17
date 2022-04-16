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
        const email= req.body.email;
        const password = req.body.password;

        const result = await db.pool.query("SELECT * FROM UserTable WHERE user_email=?;",[
            email
        ]);

        const password_check = await bcrypt.compare(password, result[0].password)
        if(password_check){
            res.cookie('user_id',result[0].pat_id)

            if(result[0].staff_id){
                const doctor_check = await db.pool.query("SELECT * FROM StaffTable WHERE staff_id=? AND staff_occupation='DOCTOR';",[
                    result[0].staff_id
                ]);
                if(doctor_check){
                    res.cookie('doc_id',result[0].staff_id)
                } else {
                    res.cookie('staff_id',result[0].staff_id)
                }
            } else if(result[0].pat_id){
                res.cookie('pat_id',result[0].user_id)
            }
        }

        request.session.loggedin = true;
        res.redirect('/');
    
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
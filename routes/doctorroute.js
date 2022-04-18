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
        if(req.cookies['pat_id'] || req.cookies['doc_id'] || req.cookies['staff_id']){
            res.redirect('/portal');
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            res.sendFile(path.join(__dirname + "/../html/staff/stafflogin.html"));
        }
    } catch (err) {
        console.log(err);
    }
})

router.get('/findpatient', async (req, res) => {
    try{
        if(req.cookies['doc_id']){
            res.sendFile(path.join(__dirname + "/../html/doctor/doctorfindpatient.html"));
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.log(err);
    }
})

router.get('/viewpayroll', async (req, res) => {
    try{
        if(req.cookies['doc_id']){
            res.sendFile(path.join(__dirname + "/../html/doctor/doctorviewpayroll.html"));
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.log(err);
    }
})

router.get('/viewschedule', async (req, res) => {
    try{
        if(req.cookies['doc_id']){
            res.sendFile(path.join(__dirname + "/../html/doctor/doctorviewschedule.html"));
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.log(err);
    }
})

router.get('/createprescription', async (req, res) => {
    try{
        if(req.cookies['doc_id']){
            res.sendFile(path.join(__dirname + "/../html/doctor/doctorcreateprescription.html"));
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.log(err);
    }
})

router.get('/createprescription', async (req, res) => {
    try{
        if(req.cookies['doc_id']){
            res.sendFile(path.join(__dirname + "/../html/doctor/doctorcreateprescription.html"));
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.log(err);
    }
})

router.get('/viewprofile', async (req, res) => {
    try{
        if(req.cookies['doc_id']){
            res.sendFile(path.join(__dirname + "/../html/doctor/doctorviewprofile.html"));
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.log(err);
    }
})

router.get('/editprofile', async (req, res) => {
    try{
        if(req.cookies['doc_id']){
            res.sendFile(path.join(__dirname + "/../html/doctor/doctoreditprofile.html"));
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.log(err);
    }
})

// Search for patient
router.get('/db/findPatient', async (req, res) => {
    try {
        // console.log(req.query.q);
        let searchName = "%" + req.query.q + "%";
        const result = await db.pool.query("SELECT pat_id, pat_name, pat_email, pat_phone FROM PatientTable WHERE pat_name LIKE ? ORDER BY pat_name ASC;",[searchName]);
        
        // console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
    }
})

// Get patient information
router.get('/db/patientInfo', async (req, res) => {
    try {
        // console.log(req.query)
        const result = await db.pool.query("SELECT * FROM PatientTable WHERE pat_id=?;",[req.query.pat_id]);
        
        // console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
    }
})

// Add patient record
router.put('/db/patientRecord', async (req, res) => {
    try {
        const result = await db.pool.query("INSERT INTO RecordsTable(rec_treatment,rec_admit,rec_leave,pat_id) VALUES(?,?,?,?);",[
            req.body.rec_treatment,
            req.body.rec_admit,
            req.body.rec_leave,
            req.body.pat_id
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
    }
})

// View patient records
router.get('/db/patientRecord', async (req, res) => {
    try {
        const result = await db.pool.query("SELECT rec_treatment,rec_admit,rec_leave FROM RecordsTable WHERE pat_id=?;",[
            req.body.pat_id
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
    }
})

// Create prescription
router.put('/db/prescription', async (req, res) => {
    try {
        const result = await db.pool.query("INSERT INTO PrescriptionTable(med_name,rx_start,rx_end,rx_desc,pat_id,doc_id) VALUES(?,?,?,?,?,?);",[
            req.body.med_name,
            req.body.rx_start,
            req.body.rx_end,
            req.body.rx_desc,
            req.body.pat_id,
            req.cookies['doc_id']
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        /* 
        if err_msg.contains("allergy") {
            //Have error handling for this. Most likely just a warning and no data entered.
        }
        */ 
        console.error(err);
    }
})

// View appointments
router.get('/db/appointment', async (req, res) => {
    try {
        const result = await db.pool.query("SELECT app_id,app_time,LocationTable.loc_name,PatientTable.pat_name FROM (((AppointmentTable INNER JOIN LocationTable ON AppointmentTable.loc_id=LocationTable.loc_id) INNER JOIN StaffTable ON AppointmentTable.doc_id=StaffTable.staff_id) INNER JOIN PatientTable ON AppointmentTable.pat_id=PatientTable.pat_id) WHERE doc_id=?;",[
            req.cookies['doc_id']
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
    }
})

// View payroll
router.get('/db/payroll', async (req, res) => {
    try {
        const result = await db.pool.query("SELECT staff_name, staff_salary FROM StaffTable WHERE staff_id=?",[
            req.cookies['doc_id']
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
    }
})

// View schedule
router.get('/db/schedule', async (req, res) => {
    try {
        const result = await db.pool.query("SELECT StaffTable.staff_name,schedule_workday,LocationTable.loc_name FROM ((ScheduleTable INNER JOIN LocationTable ON ScheduleTable.loc_id=LocationTable.loc_id) INNER JOIN StaffTable ON ScheduleTable.staff_id=StaffTable.staff_id) WHERE ScheduleTable.staff_id=?;",[
            req.cookies['doc_id']
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
    }
})

// Cancel appointment
router.put('/db/appointment', async (req, res) => {
    try {
        const result = await db.pool.query("UPDATE AppointmentTable SET app_cancelled=1 WHERE doc_id=? AND app_id=?;",[
            req.cookies['doc_id'],
            req.body.app_id
        ]);
        
        // Send email to patient after success.

        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
    }
})

module.exports = router
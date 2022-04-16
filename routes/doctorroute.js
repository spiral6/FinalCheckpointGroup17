const express = require('express')
const router = express.Router()
const db = require('../db')
const app = express()
const fs = require('fs')
const path = require('path')
const cookieParser = require('cookie-parser')
router.use(cookieParser())

// Search for patient
router.get('/db/findPatient', async (req, res) => {
    try {
        let searchName = "%" + req.query.doctor + "%";
        const result = await db.pool.query("SELECT pat_name, pat_email, pat_phone FROM PatientTable WHERE pat_name LIKE ? ORDER BY staff_name ASC;",[searchName]);
        // console.log('Getting doctor_table data: ');
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
    }
})

// Get patient information
router.get('/db/patientInfo', async (req, res) => {
    try {
        const result = await db.pool.query("SELECT pat_name,pat_sex,pat_email,pat_phone,pat_DoB,pat_height,pat_weight,pat_allergy,pat_insurance,pat_address FROM PatientTable WHERE pat_id=?;",[req.body.pat_id]);
        // console.log('Getting doctor_table data: ');
        console.log(result);
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
        // console.log('Getting doctor_table data: ');
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
        // console.log('Getting doctor_table data: ');
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
        // console.log('Getting doctor_table data: ');
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
        // console.log('Getting doctor_table data: ');
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
        // console.log('Getting doctor_table data: ');
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
    }
})

module.exports = router
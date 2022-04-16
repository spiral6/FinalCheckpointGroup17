const express = require('express')
const router = express.Router()
const db = require('../db')
const app = express()
const fs = require('fs')
const path = require('path')
const cookieParser = require('cookie-parser')
router.use(cookieParser())

// Find doctor
router.get('/db/findDoctor', async (req, res) => {
    try {
        let searchName = "%" + req.query.doctor + "%";
        const result = await db.pool.query("SELECT staff_name, staff_email, staff_phone FROM StaffTable WHERE staff_occupation=\"DOCTOR\" AND staff_name LIKE ? ORDER BY staff_name ASC;",[searchName]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.log(err);
    }
})

// List clinics
router.get('/db/clinic', async (req, res) => {
    try {
        const result = await db.pool.query("SELECT loc_address, loc_name, loc_dep FROM LocationTable;",[]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.log(err);
    }
})

// Edit profile info
router.put('/db/clinic', async (req, res) => {
    try {
        const result = await db.pool.query("UPDATE PatientTable SET pat_name=?, pat_sex=?, pat_phone=?, pat_insurance=?, pat_address=? WHERE pat_id=?;",[
            req.body.pat_name,
            req.body.pat_sex,
            req.body.pat_phone,
            req.body.pat_insurance,
            req.body.pat_address,
            req.cookies['pat_id']
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.log(err);
    }
})

// View appointments
router.get('/db/appointment', async (req, res) => {
    try {
        const result = await db.pool.query("SELECT app_id,app_time,LocationTable.loc_name,StaffTable.staff_name FROM (((AppointmentTable INNER JOIN LocationTable ON AppointmentTable.loc_id=LocationTable.loc_id) INNER JOIN StaffTable ON AppointmentTable.doc_id=StaffTable.staff_id) INNER JOIN PatientTable ON AppointmentTable.pat_id=PatientTable.pat_id) WHERE pat_id=?;",[
            req.cookies['pat_id']
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
    }
})

// Create appointment
router.put('/db/appointment', async (req, res) => {
    try {
        const result = await db.pool.query("INSERT INTO AppointmentTable(app_source,app_time,loc_id,doc_id,pat_id) VALUES('Web',?,(SELECT loc_id FROM LocationTable WHERE loc_name=?),(SELECT staff_id FROM StaffTable WHERE staff_name=? AND staff_occupation='DOCTOR'),?);",[
            req.body.app_time,
            req.body.loc_name,
            req.body.staff_name,
            req.cookies['pat_id']
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.log(err);
    }
})

// Cancel appointment
router.put('/db/appointment', async (req, res) => {
    try {
        const result = await db.pool.query("UPDATE PatientTable SET pat_name=?, pat_sex=?, pat_phone=?, pat_insurance=?, pat_address=? WHERE pat_id=?;",[
            req.body.pat_name,
            req.body.pat_sex,
            req.body.pat_phone,
            req.body.pat_insurance,
            req.body.pat_address,
            req.cookies['pat_id']
        ]);
        
        // Send email to doctor after success.

        console.log(result);
        res.send(result);
    } catch (err) {
        console.log(err);
    }
})

module.exports = router
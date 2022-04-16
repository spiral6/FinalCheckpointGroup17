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
        // console.log('Getting doctor_table data: ');
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
        // console.log('Getting doctor_table data: ');
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
        // console.log('Getting doctor_table data: ');
        console.log(result);
        res.send(result);
    } catch (err) {
        console.log(err);
    }
})

module.exports = router
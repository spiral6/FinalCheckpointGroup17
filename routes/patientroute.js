const express = require('express')
const router = express.Router()
const db = require('../db')
const app = express()
const fs = require('fs')
const path = require('path')

// Find doctor
router.get('/db/findDoctor', async (req, res) => {
    try {
        let searchName = "%" + req.query.doctor + "%";
        const result = await db.pool.query("SELECT staff_name, staff_email, staff_phone FROM StaffTable WHERE staff_occupation=\"DOCTOR\" AND staff_name LIKE ? ORDER BY staff_name ASC;",[searchName]);
        // console.log('Getting doctor_table data: ');
        console.log(result);
        res.send(result);
    } catch (err) {
        throw err;
    }
})

module.exports = router
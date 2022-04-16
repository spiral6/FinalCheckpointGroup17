const express = require('express')
const router = express.Router()
const db = require('../db')
const app = express()
const fs = require('fs')
const path = require('path')

router.get('/', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname + "/../html/admin/doctoradmin.html"));
    } catch (err) {
        console.log(err);
    }
});

router.get('/select', async (req, res) => {
    try {
        const result = await db.pool.query("SELECT * from StaffTable WHERE staff_occupation='DOCTOR'");
        // console.log('Getting doctor_table data: ');
        console.log(result);
        res.send(result);
    } catch (err) {
        console.log(err);
    }
})

module.exports = router
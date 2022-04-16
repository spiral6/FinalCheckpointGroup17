const express = require('express')
const router = express.Router()
const db = require('../../db')
const app = express()
const fs = require('fs')
const path = require('path')

router.get('/', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname + "/../html/stafftable.html"));
    } catch (err) {
        console.log(err);
    }
});

router.get('/db/desc', async (req, res) => {
    try {
        const result = await db.pool.query("DESCRIBE StaffTable");
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.log(err);
    }
})

router.get('/db/select', async (req, res) => {
    try {
        const result = await db.pool.query("SELECT * from StaffTable");
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.log(err);
    }
})

// Also not implementing input sanitation of any sort. - Shamee
// 
router.put('/db/insert', async (req, res) => {
    console.log("req obj");
    console.log(req.body);
    console.log("end req obj");
    try {
        const result = await db.pool.query("REPLACE INTO StaffTable(staff_name, staff_sex, staff_email, staff_phone, loc_id, staff_workdays, staff_salary) VALUES(?, ?, ?, ?, ?, ?, ?)", [req.body.staff_name, req.body.staff_sex, req.body.staff_email, req.body.staff_phone, req.body.loc_id, req.body.staff_workdays, req.body.staff_salary]);


        console.log(result);
        const json = JSON.stringify(result, (key, value) =>
            typeof value === "bigint" ? value.toString() + "n" : value
        );
        res.send(json);
    } catch (err) {
        console.log(err);
    }
})

module.exports = router
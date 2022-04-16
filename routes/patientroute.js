const express = require('express')
const router = express.Router()
const db = require('../db')
const app = express()
const fs = require('fs')
const path = require('path');

router.get('/', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname + "/../html/patienttable.html"));
    } catch (err) {
        throw err;
    }
});

router.get('/db/desc', async (req, res) => {
    try {
        const result = await db.pool.query("DESCRIBE patienttable");
        // console.log('Describing doctor_table: ');
        console.log(result);
        res.send(result);
    } catch (err) {
        throw err;
    }
})

router.get('/db/select', async (req, res) => {
    try {
        const result = await db.pool.query("SELECT * from patienttable");
        // console.log('Getting doctor_table data: ');
        console.log(result);
        res.send(result);
    } catch (err) {
        throw err;
    }
})

// Also not implementing input sanitation of any sort. - Shamee
// 
router.put('/db/insert', async (req, res) => {
    console.log("req obj");
    console.log(req.body);
    console.log("end req obj");
    try {
        const result = await db.pool.query("REPLACE INTO patienttable(pat_name, pat_sex,pat_email,pat_phone,pat_DoB,pat_height,pat_weight,pat_insurance,pat_address) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", [req.body.pat_name,req.body.pat_sex,req.body.pat_email,req.body.pat_phone,req.body.pat_DoB,req.body.pat_height,req.body.pat_weight, req.body.pat_insurance, req.body.pat_address]);
        // console.log('Putting record into doctor_table: ');
        // console.log(req);
        console.log(result);
        const json = JSON.stringify(result, (key, value) =>
            typeof value === "bigint" ? value.toString() + "n" : value
        );
        res.send(json);
    } catch (err) {
        throw err;
    }
})

// For the sake of this checkpoint, we're not doing POST. - Shamee
//
// router.post('/db/insert', async (req, res) => {
//     try {
//         const result = await db.pool.query("DESCRIBE patienttable");
//         res.send(result);
//     } catch (err) {
//         throw err;
//     }
// })

module.exports = router
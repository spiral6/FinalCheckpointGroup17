const express = require('express')
const router = express.Router()
const db = require('../../db')
const app = express()
const fs = require('fs')
const path = require('path')

router.get('/', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname + "/../html/patienttable.html"));
    } catch (err) {
                console.error(err);
        res.status(500).send(err);
    }
});

router.get('/desc', async (req, res) => {
    try {
        const result = await db.pool.query("DESCRIBE PatientTable");
        
        console.log(result);
        res.send(result);
    } catch (err) {
                console.error(err);
        res.status(500).send(err);
    }
})

router.get('/select', async (req, res) => {
    try {
        const result = await db.pool.query("SELECT * from PatientTable");
        
        console.log(result);
        res.send(result);
    } catch (err) {
                console.error(err);
        res.status(500).send(err);
    }
})

// Also not implementing input sanitation of any sort. - Shamee
// 
router.put('/insert', async (req, res) => {
    console.log("req obj");
    console.log(req.body);
    console.log("end req obj");
    try {
        const result = await db.pool.query("REPLACE INTO PatientTable(pat_name,pat_sex,pat_email,pat_phone,pat_DoB,pat_height,pat_weight,pat_insurance,pat_address) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", 
        [req.body.pat_name,
            req.body.pat_sex,
            req.body.pat_email,
            req.body.pat_phone,
            req.body.pat_DoB,
            req.body.pat_height,
            req.body.pat_weight, 
            req.body.pat_insurance, 
            req.body.pat_address]
        );


        console.log(result);
        const json = JSON.stringify(result, (key, value) =>
            typeof value === "bigint" ? value.toString() + "n" : value
        );
        res.send(json);
    } catch (err) {
                console.error(err);
        res.status(500).send(err);
    }
})

module.exports = router
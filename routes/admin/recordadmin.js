const express = require('express')
const router = express.Router()
const db = require('../db')
const app = express()
const fs = require('fs')
const path = require('path')


router.get('/', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname + "/../html/recordtable.html"));
    } catch (err) {
        console.log(err);
    }
});

router.get('/db/desc', async (req, res) => {
    try {
        const result = await db.pool.query("DESCRIBE RecordTable");
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.log(err);
    }
})

router.get('/db/select', async (req, res) => {
    try {
        const result = await db.pool.query("SELECT * from RecordTable");
        
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
        const result = await db.pool.query("REPLACE INTO RecordTable(rec_treatment, rec_admit, rec_leave) VALUES(?, ?, ?, ?)", [req.body.rec_treatment, req.body.rec_admit, req.body.rec_leave]);


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
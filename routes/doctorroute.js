const express = require('express')
const router = express.Router()
const db = require('../db')
const app = express()
const fs = require('fs')
const path = require('path');

router.get('/', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname + "/../html/doctortable.html"));
    } catch (err) {
        throw err;
    }
});

router.get('/db/desc', async (req, res) => {
    try {
        const result = await db.pool.query("DESCRIBE doctortable");
        // console.log('Describing doctor_table: ');
        console.log(result);
        res.send(result);
    } catch (err) {
        throw err;
    }
})

router.get('/db/select', async (req, res) => {
    try {
        const result = await db.pool.query("SELECT * from doctortable");
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
        const result = await db.pool.query("REPLACE INTO doctortable(doc_id, staff_id, doc_specialty, doc_perms) VALUES(?, ?, ?, ?)", [req.body.doctor_id, req.body.staff_id, req.body.doc_specialty, req.body.doc_perms]);
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
//         const result = await db.pool.query("DESCRIBE doctortable");
//         res.send(result);
//     } catch (err) {
//         throw err;
//     }
// })

module.exports = router
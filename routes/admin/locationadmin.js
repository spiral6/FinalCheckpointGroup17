const express = require('express')
const router = express.Router()
const db = require('../../db')
const app = express()
const fs = require('fs')
const path = require('path')


router.get('/', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname + "/../html/locationtable.html"));
    } catch (err) {
                console.error(err);
        res.status(500).send(err);
    }
});

router.get('/db/desc', async (req, res) => {
    try {
        const result = await db.pool.query("DESCRIBE LocationTable");
        
        console.log(result);
        res.send(result);
    } catch (err) {
                console.error(err);
        res.status(500).send(err);
    }
})

router.get('/db/select', async (req, res) => {
    try {
        const result = await db.pool.query("SELECT * from LocationTable");
        
        console.log(result);
        res.send(result);
    } catch (err) {
                console.error(err);
        res.status(500).send(err);
    }
})

// Also not implementing input sanitation of any sort. - Shamee
// 
router.put('/db/insert', async (req, res) => {
    console.log("req obj");
    console.log(req.body);
    console.log("end req obj");
    try {
        const result = await db.pool.query("REPLACE INTO LocationTable(loc_id, loc_city, loc_name, loc_dep) VALUES(?, ?, ?, ?)", [req.body.loc_id, req.body.loc_city, req.body.loc_name, req.body.loc_dep]);


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
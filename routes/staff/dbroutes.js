const express = require('express')
const router = express.Router()
const db = require('../../db')
const app = express()
const fs = require('fs')
const path = require('path')
const cookieParser = require('cookie-parser')
const { response } = require('express')
router.use(cookieParser())

// View staff
router.get('/staff', async (req, res) => {
    try {
        const result = await db.pool.query(`SELECT 
        * 
        FROM 
        StaffTable;`);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

// Create staff
router.put('/staff', async (req, res) => {
    try {
        const result = await db.pool.query(`INSERT INTO StaffTable(staff_name,staff_sex,staff_email,staff_phone,staff_DoB,staff_occupation,doc_specialty,doc_perms,staff_address)
        VALUES(?,?,?,?,?,?,?,?,?)`,[
            req.body.staff_name,
            req.body.staff_sex,
            req.body.staff_email,
            req.body.staff_phone,
            req.body.staff_DoB,
            req.body.staff_occupation,
            req.body.doc_specialty,
            req.body.doc_perms,
            req.body.staff_address,
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

// Update staff
router.post('/staff', async (req, res) => {
    try {
        const result = await db.pool.query(`UPDATE StaffTable
        SET staff_name=?,
        staff_sex=?,
        staff_email=?,
        staff_phone=?,
        staff_DoB=?,
        staff_occupation=?,
        doc_specialty=?,
        doc_perms=?,
        staff_address=?
        WHERE
        staff_id=?`,[
            req.body.staff_name,
            req.body.staff_sex,
            req.body.staff_email,
            req.body.staff_phone,
            req.body.staff_DoB,
            req.body.staff_occupation,
            req.body.doc_specialty,
            req.body.doc_perms,
            req.body.staff_address,
            req.body.staff_id
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

// Delete staff
router.delete('/staff', async (req, res) => {
    try {
        const result = await db.pool.query(`DELETE 
        FROM 
        StaffTable 
        WHERE 
        staff_id=?`, [
            req.body.staff_id
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

// View patient
router.get('/patient', async (req, res) => {
    try {
        const result = await db.pool.query(`SELECT 
        * 
        FROM 
        PatientTable`);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

// Create patient
router.put('/patient', async (req, res) => {
    try {
        const result = await db.pool.query(`INSERT INTO PatientTable(pat_name,pat_sex,pat_email,pat_phone,pat_DoB,pat_allergy,pat_insurance,pat_address,pat_pcp)
        VALUES(?,?,?,?,?,?,?,?,?)`,[
            req.body.pat_name,
            req.body.pat_sex,
            req.body.pat_email,
            req.body.pat_phone,
            req.body.pat_DoB,
            req.body.pat_allergy,
            req.body.pat_insurance,
            req.body.pat_address,
            req.body.pat_pcp,
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

// Update patient
router.post('/patient', async (req, res) => {
    try {
        const result = await db.pool.query(`UPDATE PatientTable
        SET pat_name=?,
        pat_sex=?,
        pat_email=?,
        pat_phone=?,
        pat_DoB=?,
        pat_allergy=?,
        pat_insurance=?,
        pat_address=?,
        pat_pcp=?
        WHERE
        pat_id=?`,[
            req.body.pat_name,
            req.body.pat_sex,
            req.body.pat_email,
            req.body.pat_phone,
            req.body.pat_DoB,
            req.body.pat_allergy,
            req.body.pat_insurance,
            req.body.pat_address,
            req.body.pat_pcp,
            req.body.pat_id
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

// Delete patient
router.delete('/patient', async (req, res) => {
    try {
        const result = await db.pool.query(`DELETE 
        FROM 
        PatientTable 
        WHERE 
        pat_id=?`, [
            req.body.pat_id
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

// View clinics
router.get('/clinic', async (req, res) => {
    try {
        const result = await db.pool.query(`SELECT 
        * 
        FROM 
        LocationTable`);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

// Update clinic
router.post('/clinic', async (req, res) => {
    try {
        const result = await db.pool.query(`UPDATE LocationTable
        SET loc_name=?,
        loc_dep=?,
        loc_address=?
        WHERE
        loc_id=?`,[
            req.body.loc_name,
            req.body.loc_dep,
            req.body.loc_address,
            req.body.loc_id
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

// Create clinic
router.put('/clinic', async (req, res) => {
    try {
        const result = await db.pool.query(`INSERT INTO LocationTable(loc_name,loc_dep,loc_address)
        VALUES(?,?,?)`,[
            req.body.loc_name,
            req.body.loc_dep,
            req.body.loc_address,
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

// Delete clinic
router.delete('/clinic', async (req, res) => {
    try {
        const result = await db.pool.query(`DELETE 
        FROM 
        LocationTable 
        WHERE 
        loc_id=?`,[
            req.body.loc_id
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

// Report 2
router.get('/report2', async (req, res) => {
    try {
        const result = await db.pool.query(``,
        [
            req.body.date_start,
            req.body.date_end
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

// Report 3
router.get('/report3', async (req, res) => {
    try {
        const result = await db.pool.query(``,
        [
            req.body.date_start,
            req.body.date_end
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

module.exports = router
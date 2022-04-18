const express = require('express')
const router = express.Router()
const db = require('../db')
const app = express()
const fs = require('fs')
const path = require('path')
const cookieParser = require('cookie-parser')
router.use(cookieParser())

router.get('/', async (req, res) => {
    try{
        if(req.cookies['pat_id'] || req.cookies['doc_id'] || req.cookies['staff_id']){
            res.redirect('/portal');
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            res.sendFile(path.join(__dirname + "/../html/patient/patientlogin.html"));
        }
    } catch (err) {
        console.log(err);
    }
})

router.get('/signup', async (req, res) => {
    try{
        if(req.cookies['pat_id'] || req.cookies['doc_id'] || req.cookies['staff_id']){
            res.redirect('/portal');
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            res.sendFile(path.join(__dirname + "/../html/patient/registerpatient.html"));
        }
    } catch (err) {
        console.log(err);
    }
})


router.post('/signup', async (req, res) => {
    try {
        const connection = await db.pool.getConnection();
        try {
            await connection.beginTransaction();

            try {
                console.log(req.body);
                await connection.batch("INSERT INTO UserTable(user_email, user_password) VALUES(?,?)",[
                    req.body.user_email,
                    req.body.user_password
                ]);
                await connection.batch("INSERT INTO PatientTable(pat_name,pat_email,pat_sex,pat_phone,pat_DoB) VALUES(?,?,?,?,?)",[
                    req.body.pat_name,
                    req.body.user_email,
                    req.body.pat_sex,
                    req.body.pat_phone,
                    req.body.pat_DoB
                ]);
                const pat_id_check = await connection.query("SELECT pat_id FROM PatientTable WHERE pat_email=?",[req.body.user_email]);

                if(pat_id_check) {
                    console.log(pat_id_check[0]);
                    pat_id = pat_id_check[0]['pat_id'];
                    await connection.batch("UPDATE UserTable SET pat_id=? WHERE user_email=?",[
                        pat_id,
                        req.body.user_email
                    ]);
                    await connection.commit();
                } else {
                    throw 'Cannot find patient ID for insertion!';
                }
                // await connection.batch("INSERT INTO UserTable(pat_id) VALUES(?) WHERE pat_email=?",[
                //     pat_id,
                //     req.body.user_email
                // ]);

                // await connection.commit();

                res.sendStatus(200);
            } catch (err){
                console.error("Error loading data, reverting changes: ", err);
                await connection.rollback();
                res.status(400).send(err);
            }
        }
        catch (err) {
            console.err(err);
        }
    } catch (err) {
        console.log(err);
    }
})

router.get('/myappointments', async (req, res) => {
    try{
        if(req.cookies['doc_id'] || req.cookies['staff_id']){
            res.redirect('/portal');
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            res.sendFile(path.join(__dirname + "/../html/patient/myappointments.html"));
        }
    } catch (err) {
        console.log(err);
    }
})

router.get('/findclinic', async (req, res) => {
    try{
        if(req.cookies['doc_id'] || req.cookies['staff_id']){
            res.redirect('/portal');
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            res.sendFile(path.join(__dirname + "/../html/patient/findclinic.html"));
        }
    } catch (err) {
        console.log(err);
    }
})

router.get('/finddoctor', async (req, res) => {
    try{
        if(req.cookies['doc_id'] || req.cookies['staff_id']){
            res.redirect('/portal');
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            res.sendFile(path.join(__dirname + "/../html/patient/finddoctor.html"));
        }
    } catch (err) {
        console.log(err);
    }
})

// Find doctor
router.get('/db/findDoctor', async (req, res) => {
    try {
        let searchName = "%" + req.query.doctor + "%";
        const result = await db.pool.query("SELECT staff_name, staff_email, staff_phone FROM StaffTable WHERE staff_occupation=\"DOCTOR\" AND staff_name LIKE ? ORDER BY staff_name ASC;",[searchName]);
        
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
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.log(err);
    }
})

// View appointments
router.get('/db/appointment', async (req, res) => {
    try {
        const result = await db.pool.query("SELECT app_id,app_time,LocationTable.loc_name,StaffTable.staff_name FROM (((AppointmentTable INNER JOIN LocationTable ON AppointmentTable.loc_id=LocationTable.loc_id) INNER JOIN StaffTable ON AppointmentTable.doc_id=StaffTable.staff_id) INNER JOIN PatientTable ON AppointmentTable.pat_id=PatientTable.pat_id) WHERE pat_id=?;",[
            req.cookies['pat_id']
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
    }
})

// Create appointment
router.put('/db/appointment', async (req, res) => {
    try {
        const result = await db.pool.query("INSERT INTO AppointmentTable(app_source,app_time,loc_id,doc_id,pat_id) VALUES('Web',?,(SELECT loc_id FROM LocationTable WHERE loc_name=?),(SELECT staff_id FROM StaffTable WHERE staff_name=? AND staff_occupation='DOCTOR'),?);",[
            req.body.app_time,
            req.body.loc_name,
            req.body.staff_name,
            req.cookies['pat_id']
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.log(err);
    }
})

// Cancel appointment
router.put('/db/appointment', async (req, res) => {
    try {
        const result = await db.pool.query("UPDATE PatientTable SET pat_name=?, pat_sex=?, pat_phone=?, pat_insurance=?, pat_address=? WHERE pat_id=?;",[
            req.body.pat_name,
            req.body.pat_sex,
            req.body.pat_phone,
            req.body.pat_insurance,
            req.body.pat_address,
            req.cookies['pat_id']
        ]);
        
        // Send email to doctor after success.

        console.log(result);
        res.send(result);
    } catch (err) {
        console.log(err);
    }
})

module.exports = router
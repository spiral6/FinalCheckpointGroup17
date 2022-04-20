const express = require('express')
const router = express.Router()
const db = require('../../db')
const app = express()
const fs = require('fs')
const path = require('path')
const cookieParser = require('cookie-parser')
router.use(cookieParser())

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
                    console.error(err);
        res.status(500).send(err);
        }
    } catch (err) {
                console.error(err);
        res.status(500).send(err);
    }
})

// Find doctor
router.get('/findDoctor', async (req, res) => {
    try {
        console.log(req.query.doctor);
        let searchName = "%" + req.query.doctor + "%";
        const result = await db.pool.query("SELECT staff_name, staff_email, staff_phone FROM StaffTable WHERE staff_occupation=\"DOCTOR\" AND staff_name LIKE ? ORDER BY staff_name ASC;",[searchName]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
                console.error(err);
        res.status(500).send(err);
    }
})

// List clinics
router.get('/clinic', async (req, res) => {
    try {
        const result = await db.pool.query("SELECT loc_city, loc_name, loc_dep FROM LocationTable;");
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

// Edit profile info
router.put('/profile', async (req, res) => {
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
                console.error(err);
        res.status(500).send(err);
    }
})

// View appointments
router.get('/appointment', async (req, res) => {
    try {
        const result = await db.pool.query("SELECT app_id,app_time,LocationTable.loc_name,StaffTable.staff_name FROM (((AppointmentTable INNER JOIN LocationTable ON AppointmentTable.loc_id=LocationTable.loc_id) INNER JOIN StaffTable ON AppointmentTable.doc_id=StaffTable.staff_id) INNER JOIN PatientTable ON AppointmentTable.pat_id=PatientTable.pat_id) WHERE PatientTable.pat_id=?;",[
            req.cookies['pat_id']
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

// Create appointment
router.put('/appointment', async (req, res) => {
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
                console.error(err);
        res.status(500).send(err);
    }
})

// Cancel appointment
router.put('/appointment', async (req, res) => {
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
                console.error(err);
        res.status(500).send(err);
    }
})

module.exports = router
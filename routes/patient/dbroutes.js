const express = require('express')
const router = express.Router()
const db = require('../../db')
const app = express()
const fs = require('fs')
const path = require('path')
const cookieParser = require('cookie-parser')
const { response } = require('express')
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
        // console.log(req.query.doctor);
        // let searchName = "%" + req.query.doctor + "%";
        const result = await db.pool.query(`SELECT staff_name, staff_email, staff_phone 
        FROM StaffTable 
        WHERE staff_occupation=\"DOCTOR\" AND 
        staff_name=?;`,[req.query.staff_name]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
                console.error(err);
        res.status(500).send(err);
    }
})

// Get doctor
router.get('/getDoctor', async (req, res) => {
    try {
        // console.log(req.query.doctor);
        // let searchName = "%" + req.query.doctor + "%";
        const result = await db.pool.query(`SELECT staff_name
        FROM StaffTable 
        WHERE staff_occupation=\"DOCTOR\";`,[]);
        
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
        const result = await db.pool.query("SELECT loc_city, loc_name, loc_dep, loc_address FROM LocationTable;");
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

// Get profile info
router.get('/profile', async (req, res) => {
    try {
        const result = await db.pool.query("SELECT * FROM PatientTable INNER JOIN StaffTable ON PatientTable.pat_pcp=StaffTable.staff_id WHERE pat_id=?;",[
            req.cookies['pat_id']
        ]);
        
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
        let user_passwordArr = [];
        let addPasswordToQueryString = '';
        if(req.body.user_password){
            addPasswordToQueryString = ', UserTable.user_password=?';
            user_passwordArr = [req.body.user_password];
        }
        let payload = [
            req.body.pat_phone,
            req.body.pat_insurance,
            req.body.pat_address,
            req.body.pat_email,
            req.body.pat_email].concat(user_passwordArr,[req.cookies['pat_id']]);

        console.log(payload);
        
        const result = await db.pool.query(`
        UPDATE PatientTable, UserTable
        SET PatientTable.pat_phone=?, 
        PatientTable.pat_insurance=?, 
        PatientTable.pat_address=?, 
        PatientTable.pat_email=?, 
        UserTable.user_email=?` + addPasswordToQueryString + 
        `WHERE PatientTable.pat_id = UserTable.pat_id 
        AND PatientTable.pat_id=?;`,payload);
        
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
        const result = await db.pool.query(`SELECT 
        app_id,app_status,app_time,LocationTable.loc_name,StaffTable.staff_name 
        FROM 
        (((AppointmentTable 
            INNER JOIN LocationTable ON AppointmentTable.loc_id=LocationTable.loc_id) 
            INNER JOIN StaffTable ON AppointmentTable.doc_id=StaffTable.staff_id) 
            INNER JOIN PatientTable ON AppointmentTable.pat_id=PatientTable.pat_id) 
        WHERE PatientTable.pat_id=?;`,[
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
router.get('/lastappointment', async (req, res) => {
    try {
        const result = await db.pool.query("SELECT * FROM AppointmentTable WHERE app_id=LAST_INSERT_ID();");
        
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
        const result = await db.pool.query(`
        INSERT INTO AppointmentTable(app_source,app_time,loc_id,doc_id,pat_id) 
        VALUES(
            'Web',
            ?,
            (SELECT loc_id FROM LocationTable WHERE loc_name=?),
            (SELECT staff_id FROM StaffTable WHERE staff_name=? AND staff_occupation='DOCTOR'),
            ?
            );`,[
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
router.delete('/appointment', async (req, res) => {
    try {
        const result = await db.pool.query("DELETE FROM AppointmentTable WHERE app_id=?;",[
            req.body.app_id
        ]);
        
        // Send email to doctor after success.

        console.log(result);
        res.send(result);
    } catch (err) {
                console.error(err);
        res.status(500).send(err);
    }
})

// Get Doctor Schedule
router.get('/doctorschedule', async (req, res) => {
    try {
        const result = await db.pool.query(`SELECT LocationTable.loc_name, LocationTable.loc_address,
        GROUP_CONCAT(schedule_workday ORDER BY FIELD(schedule_workday, "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN") ASC) 
        AS weekdays FROM ScheduleTable
        INNER JOIN LocationTable ON ScheduleTable.loc_id = LocationTable.loc_id
        WHERE staff_id=(SELECT staff_id FROM StaffTable WHERE staff_name=?) 
        GROUP BY ScheduleTable.loc_id;`,[
            req.query.staff_name
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

module.exports = router
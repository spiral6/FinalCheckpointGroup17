const express = require('express')
const router = express.Router()
const db = require('../../db')
const app = express()
const fs = require('fs')
const path = require('path')
const cookieParser = require('cookie-parser')
router.use(cookieParser())

// Search for patient
router.get('/findPatient', async (req, res) => {
    try {
        // console.log(req.query.q);
        let searchName = "%" + req.query.q + "%";
        const result = await db.pool.query("SELECT pat_id, pat_name, pat_email, pat_phone FROM PatientTable WHERE pat_name LIKE ? ORDER BY pat_name ASC;",[searchName]);
        
        // console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

// Get patient information
router.get('/patientInfo', async (req, res) => {
    try {
        // console.log(req.query)
        const result = await db.pool.query("SELECT * FROM PatientTable WHERE pat_id=?;",[req.query.pat_id]);
        
        // console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

// Add patient record
router.put('/patientRecord', async (req, res) => {
    try {
        const result = await db.pool.query("INSERT INTO RecordsTable(rec_treatment,rec_admit,rec_leave,pat_id) VALUES(?,?,?,?);",[
            req.body.rec_treatment,
            req.body.rec_admit,
            req.body.rec_leave,
            req.body.pat_id
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

// View patient records
router.get('/patientRecord', async (req, res) => {
    try {
        const result = await db.pool.query("SELECT rec_treatment,rec_admit,rec_leave FROM RecordTable WHERE pat_id=?;",[
            req.query.pat_id
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

// Create prescription
router.put('/prescription', async (req, res) => {
    try {
        let payload = [
            req.body.med_name,
            req.body.rx_start,
            req.body.rx_end,
            req.body.rx_desc,
            req.body.rx_amount,
            req.body.rx_strength,
            req.body.pat_name,
            req.cookies['doc_id']
        ];
        if(req.body.rx_id){
            payload = [req.body.rx_id].concat(payload);
        }
        console.log(payload);
        const result = await db.pool.query(`
        REPLACE INTO PrescriptionTable(${req.body.rx_id ? 'rx_id,' : ''}med_name,rx_start,rx_end,rx_desc,rx_amount,rx_strength,pat_id,doc_id)
        VALUES(
            ${req.body.rx_id ? '?,' : ''}
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            (SELECT pat_id FROM PatientTable WHERE pat_name=?),
            ?
           )
        `,payload);
        
        // console.log(result);
        res.send(result);
    } catch (err) {
        /* 
        if err_msg.contains("allergy") {
            //Have error handling for this. Most likely just a warning and no data entered.
        }
        */ 
        console.error(err);
        res.status(500).send(err);
    }
})

// Get prescription
router.get('/prescription', async (req, res) => {
    try {
        const result = await db.pool.query(`
        Select rx_id,med_name,rx_strength,rx_amount,rx_start,rx_end,rx_desc,PatientTable.pat_name,doc_id FROM PrescriptionTable
        INNER JOIN PatientTable ON PrescriptionTable.pat_id = PatientTable.pat_id
        WHERE doc_id=?
        `,[
            req.cookies['doc_id']
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        /* 
        if err_msg.contains("allergy") {
            //Have error handling for this. Most likely just a warning and no data entered.
        }
        */ 
        console.error(err);
        res.status(500).send(err);
    }
})

// Delete prescription
router.delete('/prescription', async (req, res) => {
    try {
        let payload = [

        ];
        if(req.body.rx_id){
            payload = [req.body.rx_id].concat(payload);
        }
        console.log(payload);
        const result = await db.pool.query(`DELETE FROM PrescriptionTable where rx_id=?`,
        payload);
        
        // console.log(result);
        res.send(result);
    } catch (err) {
        /* 
        if err_msg.contains("allergy") {
            //Have error handling for this. Most likely just a warning and no data entered.
        }
        */ 
        console.error(err);
        res.status(500).send(err);
    }
})

// View appointments
router.get('/appointment', async (req, res) => {
    try {
        const result = await db.pool.query(`SELECT app_id,app_time,LocationTable.loc_name,PatientTable.pat_name,app_source
        FROM (((AppointmentTable 
                INNER JOIN LocationTable ON AppointmentTable.loc_id=LocationTable.loc_id) 
               INNER JOIN StaffTable ON AppointmentTable.doc_id=StaffTable.staff_id) 
              INNER JOIN PatientTable ON AppointmentTable.pat_id=PatientTable.pat_id) 
        WHERE doc_id=?`,[
            req.cookies['doc_id']
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
        const result = await db.pool.query("DELETE FROM AppointmentTable WHERE doc_id=? AND app_id=?;",[
            req.cookies['doc_id'],
            req.body.app_id
        ]);
        
        // Send email to patient after success.

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
        console.log(req.body);
        const result = await db.pool.query(`INSERT INTO AppointmentTable(pat_id,app_source,app_time,loc_id,doc_id)
        VALUES(
            (SELECT pat_id FROM PatientTable WHERE pat_name=?),
            ?,
            ?,
            (SELECT loc_id FROM LocationTable WHERE loc_name=?),
            ?
        )`,[
            req.body.pat_name,
            req.body.app_source,
            req.body.app_time,
            req.body.loc_name,
            req.cookies['doc_id']
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

// View payroll
router.get('/payroll', async (req, res) => {
    try {
        const result = await db.pool.query("SELECT staff_name, staff_salary FROM StaffTable WHERE staff_id=?",[
            req.cookies['doc_id']
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

// View schedule
router.get('/schedule', async (req, res) => {
    try {
        const result = await db.pool.query(`SELECT StaffTable.staff_name, loc_name,
        GROUP_CONCAT(schedule_workday ORDER BY FIELD(schedule_workday, "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN") ASC) AS Weekdays
        FROM ScheduleTable 
        INNER JOIN LocationTable ON ScheduleTable.loc_id = LocationTable.loc_id
        INNER JOIN StaffTable ON ScheduleTable.staff_id = StaffTable.staff_id
        WHERE StaffTable.staff_id=?
        GROUP BY ScheduleTable.staff_id, loc_name
        ;`,[
            req.cookies['doc_id']
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

module.exports = router
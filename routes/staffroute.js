const express = require('express')
const router = express.Router()
const db = require('../db')
const app = express()
const fs = require('fs')
const path = require('path')
const cookieParser = require('cookie-parser')
router.use(cookieParser())

// Edit Doctor
router.put('/db/appointment', async (req, res) => {
    try {
        // TODO: Needs major check to see if this implementation even works.
        const secretary_check = await db.pool.query("SELECT staff_name FROM StaffTable WHERE staff_id=? AND staff_occupation='SECRETARY'",[
            req.cookies['staff_id']
        ]);
        if(secretary_check.result > 0){    
            const result = await db.pool.query("INSERT INTO AppointmentTable(app_source,app_time,loc_id,doc_id,pat_id) VALUES(?,?,(SELECT loc_id FROM LocationTable WHERE loc_name=?),(SELECT staff_id FROM StaffTable WHERE staff_name=? AND staff_occupation='DOCTOR'),?);",[
                req.body.app_source,
                req.body.app_time,
                req.body.loc_name,
                req.body.staff_id,
                req.body.pat_id
            ]);
            console.log(result);
            res.send(result);
        } else {
            res.send(secretary_check);
        }
    } catch (err) {
        console.log(err);
    }
})

// Create appointment
router.put('/db/appointment', async (req, res) => {
    try {
        const result = await db.pool.query("INSERT INTO AppointmentTable(app_source,app_time,loc_id,doc_id,pat_id) VALUES(?,?,(SELECT loc_id FROM LocationTable WHERE loc_name=?),(SELECT staff_id FROM StaffTable WHERE staff_name=? AND staff_occupation='DOCTOR'),?);",[
            req.body.app_source,
            req.body.app_time,
            req.body.loc_name,
            req.body.staff_id,
            req.body.pat_id
        ]);
        
        console.log(result);
        res.send(result);
    } catch (err) {
        console.log(err);
    }
})

// View self schedule
router.get('/db/schedule', async (req, res) => {
    try{
        const result = await db.pool.query("SELECT StaffTable.staff_name,schedule_workday,LocationTable.loc_name FROM ((ScheduleTable INNER JOIN LocationTable ON ScheduleTable.loc_id=LocationTable.loc_id) INNER JOIN StaffTable ON ScheduleTable.staff_id=StaffTable.staff_id) WHERE ScheduleTable.staff_id=?;",[
            req.cookies['staff_id']
        ]);

        console.log(result);
        res.send(result);
    } catch (err) {
        console.log(err);
    }
})

// View all schedules (only for hospital admin)
router.get('/db/schedule', async (req, res) => {
    try{
        const result = await db.pool.query("SELECT StaffTable.staff_name,schedule_workday,LocationTable.loc_name FROM ((ScheduleTable INNER JOIN LocationTable ON ScheduleTable.loc_id=LocationTable.loc_id) INNER JOIN StaffTable ON ScheduleTable.staff_id=StaffTable.staff_id);",[
        ]);

        console.log(result);
        res.send(result);
    } catch (err) {
        console.log(err);
    }
})

// View all doctor schedules (only for secretary/hospital admin)
router.get('/db/schedule', async (req, res) => {
    try{
        const result = await db.pool.query("SELECT StaffTable.staff_name,schedule_workday,LocationTable.loc_name FROM ((ScheduleTable INNER JOIN LocationTable ON ScheduleTable.loc_id=LocationTable.loc_id) INNER JOIN StaffTable ON ScheduleTable.staff_id=StaffTable.staff_id) WHERE StaffTable.staff_occupation='DOCTOR';",[
        ]);

        console.log(result);
        res.send(result);
    } catch (err) {
        console.log(err);
    }
})

// View specific person schedule (only for hospital admin)
router.get('/db/schedule', async (req, res) => {
    try{
        const result = await db.pool.query("SELECT StaffTable.staff_name,schedule_workday,LocationTable.loc_name FROM ((ScheduleTable INNER JOIN LocationTable ON ScheduleTable.loc_id=LocationTable.loc_id) INNER JOIN StaffTable ON ScheduleTable.staff_id=StaffTable.staff_id) WHERE StaffTable.staff_id=?';",[
            req.body.staff_id
        ]);

        console.log(result);
        res.send(result);
    } catch (err) {
        console.log(err);
    }
})

module.exports = router
const express = require('express')
const router = express.Router()
const db = require('../db')
const app = express()
const fs = require('fs')
const path = require('path')
const cookieParser = require('cookie-parser')
router.use(cookieParser())

const doctoradmin = require('./admin/doctoradmin')
const appointmentadmin = require('./admin/appointmentadmin')
const locationadmin = require('./admin/locationadmin')
const medicineadmin = require('./admin/medicineadmin')
const patientadmin = require('./admin/patientadmin')
const recordadmin = require('./admin/recordadmin')
const staffadmin = require('./admin/staffadmin')
router.use('/doctor', doctoradmin)
router.use('/appointment', appointmentadmin)
router.use('/location', locationadmin)
router.use('/medicine', medicineadmin)
router.use('/patient', patientadmin)
router.use('/record', recordadmin)
router.use('/staff', staffadmin)
router.get('/', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname + "/../html/admin/index.html"));
    } catch (err) {
                console.error(err);
        res.status(500).send(err);
    }
});

module.exports = router
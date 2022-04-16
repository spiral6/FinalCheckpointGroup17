const express = require('express')
const db = require('./db')
const app = express()
const fs = require('fs')
// const port = 80
const bodyParser = require("body-parser");
const cors = require("cors")

const doctorroute = require('./routes/doctorroute')
const patientroute = require('./routes/patientroute')
const staffroute = require('./routes/staffroute')
const adminroute = require('./routes/admin.js')
app.use('/doctor', doctorroute)
app.use('/patient', patientroute)
app.use('/staff', staffroute)
app.use('/admin', adminroute)

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/js', express.static('js'))

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});

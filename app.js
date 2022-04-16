const express = require('express')
const db = require('./db')
const app = express()
const fs = require('fs')
const port = 3000
const bodyParser = require("body-parser");
const cors = require("cors")

const doctorroute = require('./routes/doctorroute')
const appointmenttable = require('./routes/appointmentroute')
const locationtable = require('./routes/locationroute')
const medicinetable = require('./routes/medicineroute')
const patienttable = require('./routes/patientroute')
const recordtable = require('./routes/recordroute')
const stafftable = require('./routes/staffroute')

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// const sql_stmt1 = fs.readFile('')

// // GET
// app.get('/tasks', async (req, res) => {
//     try {
//         const result = await db.pool.query("select * from tasks");
//         res.send(result);
//     } catch (err) {
//         throw err;
//     }
// });

app.use('/js', express.static('js'))

app.use('/doctor', doctorroute)
app.use('/appointment', appointmenttable)
app.use('/location', locationtable)
app.use('/medicine', medicinetable)
app.use('/patient', patienttable)
app.use('/record', recordtable)
app.use('/staff', stafftable)

// GET
app.get('/test', async (req, res) => {
    try {
        const result = await db.pool.query("DESCRIBE doctortable");
        // console.log(result);
        // console.log(result[0]);
        result.forEach(function(column) {
            console.log(column);
        });
        res.send(result);
    } catch (err) {
        throw err;
    }
});

// // POST
// app.post('/tasks', async (req, res) => {
//     let task = req.body;
//     try {
//         const result = await db.pool.query("insert into tasks (description) values (?)", [task.description]);
//         res.send(result);
//     } catch (err) {
//         throw err;
//     }
// });
 
// app.put('/tasks', async (req, res) => {
//     let task = req.body;
//     try {
//         const result = await db.pool.query("update tasks set description = ?, completed = ? where id = ?", [task.description, task.completed, task.id]);
//         res.send(result);
//     } catch (err) {
//         throw err;
//     } 
// });
 
// app.delete('/tasks', async (req, res) => {
//     let id = req.query.id;
//     try {
//         const result = await db.pool.query("delete from tasks where id = ?", [id]);
//         res.send(result);
//     } catch (err) {
//         throw err;
//     } 
// });
 
app.listen(port, () => console.log(`Listening on port ${port}`));
BigInt.prototype.toJSON = function() { return this.toString() }
const express = require('express')
const db = require('./db')
const app = express()
const fs = require('fs')
// const port = 80
const bodyParser = require("body-parser");
const cors = require("cors")
const cookieParser = require('cookie-parser')
const session = require('express-session')
const path = require('path')

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/js', express.static('js'))
app.use('/img', express.static('img'))
app.use('/css', express.static('css'))
app.use(cookieParser())
app.use(session({
	secret: 'testsecret',
	resave: true,
	saveUninitialized: true
}));

const doctorroute = require('./routes/doctor/doctorroute')
const patientroute = require('./routes/patient/patientroute')
const staffroute = require('./routes/staff/staffroute')
const adminroute = require('./routes/admin.js')
const portal = require('./routes/portal')
const login = require('./routes/login')
app.use('/doctor', doctorroute)
app.use('/patient', patientroute)
app.use('/staff', staffroute)
app.use('/admin', adminroute)
app.use('/portal', portal)
app.use('/login', login)

app.get('/', async (req, res) => {
    try {
        // some sort of session creation here
        // set cookies here
    
        // DEBUG
        // console.log("testing get request to root page");
        // console.log(req.cookies);

        if(req.cookies['pat_id'] || req.cookies['doc_id'] || req.cookies['staff_id']){
            res.redirect('/portal');
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            console.log(__dirname + "/html/")
            res.sendFile(path.join(__dirname + "/html/index.html"));
        }
    
    } catch (err) {
                console.error(err);
        res.status(500).send(err);
    }
});

app.get('/resetpass', async (req, res) => {
    try {

        res.sendFile(path.join(__dirname + "/html/resetpass.html"));
    
    } catch (err) {
                console.error(err);
        res.status(500).send(err);
    }
});

app.post('/logout', async (req, res) => {
    try {
        // some sort of session creation here
        // set cookies here
        req.session.destroy((err) => {
            if(req.cookies['user_id']){
                res.clearCookie('user_id');
            }
            if(req.cookies['pat_id']){
                res.clearCookie('pat_id');
            }
            if(req.cookies['doc_id']){
                res.clearCookie('doc_id');
            }
            if(req.cookies['staff_id']){
                res.clearCookie('staff_id');
            }
            if(req.cookies['staff_occupation']){
                res.clearCookie('staff_occupation');
            }
            res.sendStatus(200);
        })
    } catch (err) {
                console.error(err);
        res.status(500).send(err);
        res.sendStatus(403);
    }

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});

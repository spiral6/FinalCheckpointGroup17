const express = require('express')
const db = require('./db')
const app = express()
const fs = require('fs')
// const port = 80
const bodyParser = require("body-parser");
const cors = require("cors")
const cookieParser = require('cookie-parser')

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/js', express.static('js'))
app.use(cookieParser())
app.use(session({
	secret: 'testsecret',
	resave: true,
	saveUninitialized: true
}));

const doctorroute = require('./routes/doctorroute')
const patientroute = require('./routes/patientroute')
const staffroute = require('./routes/staffroute')
const adminroute = require('./routes/admin.js')
const portal = require('./routes/portal')
const login = require('./routes/login')
const register = require('./routes/register');
const router = require('./routes/login');
app.use('/doctor', doctorroute)
app.use('/patient', patientroute)
app.use('/staff', staffroute)
app.use('/admin', adminroute)
app.use('/portal', portal)
app.use('/login', login)
app.use('/register', register)

router.get('/', async (req, res) => {
    try {
        // some sort of session creation here
        // set cookies here
    
        if(req.cookies['pat_id'] || req.cookies['doc_id'] || req.cookies['staff_id']){
            res.redirect('/portal');
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            res.sendFile(path.join(__dirname + "/../html/index.html"));
        }
    
    } catch (err) {
        console.log(err);
    }
});

router.post('/logout', async (req, res) => {
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
            req.end();
            // TODO: improve with an actual sign out page. -- Shamee
            res.send("You have been signed out.");
            // res.redirect('/') // will always fire after session is destroyed
        })
    } catch (err) {
        console.log(err);
    }

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});

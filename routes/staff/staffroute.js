const express = require('express')
const router = express.Router()
const db = require('../../db')
const app = express()
const fs = require('fs')
const path = require('path')
const cookieParser = require('cookie-parser')
router.use(cookieParser())
const dbroutes = require('./dbroutes');

router.use('/db', dbroutes)

router.get('/', async (req, res) => {
    try{
        if(req.cookies['pat_id'] || req.cookies['doc_id'] || req.cookies['staff_id']){
            res.redirect('/portal');
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            res.sendFile(path.join(__dirname + "/../../html/staff/stafflogin.html"));
        }
    } catch (err) {
                console.error(err);
        res.status(500).send(err);
    }
})

router.get('/editpatientinfo', async (req, res) => {
    try{
        if(req.cookies['staff_id']){
            res.sendFile(path.join(__dirname + "/../../html/staff/staffeditpatientinfo.html"));
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    } catch (err) {
                console.error(err);
        res.status(500).send(err);
    }
})

router.get('/editstaffinfo', async (req, res) => {
    try{
        if(req.cookies['staff_id']){
            res.sendFile(path.join(__dirname + "/../../html/staff/staffeditstaffinfo.html"));
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    } catch (err) {
                console.error(err);
        res.status(500).send(err);
    }
})

router.get('/editclinicinfo', async (req, res) => {
    try{
        if(req.cookies['staff_id']){
            res.sendFile(path.join(__dirname + "/../../html/staff/staffeditclinicinfo.html"));
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    } catch (err) {
                console.error(err);
        res.status(500).send(err);
    }
})

router.get('/generatereport', async (req, res) => {
    try{
        if(req.cookies['staff_id']){
            res.sendFile(path.join(__dirname + "/../../html/staff/staffgeneratereport.html"));
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    } catch (err) {
                console.error(err);
        res.status(500).send(err);
    }
})

// router.get('/editprofile', async (req, res) => {
//     try{
//         if(req.cookies['staff_id']){
//             res.sendFile(path.join(__dirname + "/../html/staff/staffeditprofile.html"));
//         } else if(req.cookies['admin']){
//             res.redirect('/admin');
//         } else {
//             res.redirect('/');
//         }
//     } catch (err) {
//                 console.error(err);
//         res.status(500).send(err);
//     }
// })

module.exports = router
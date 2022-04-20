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
        console.log(err);
    }
})

router.get('/findpatient', async (req, res) => {
    try{
        if(req.cookies['doc_id']){
            res.sendFile(path.join(__dirname + "/../../html/doctor/doctorfindpatient.html"));
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.log(err);
    }
})

router.get('/viewpayroll', async (req, res) => {
    try{
        if(req.cookies['doc_id']){
            res.sendFile(path.join(__dirname + "/../../html/doctor/doctorviewpayroll.html"));
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.log(err);
    }
})

router.get('/assigntreatment', async (req, res) => {
    try{
        if(req.cookies['doc_id']){
            res.sendFile(path.join(__dirname + "/../../html/doctor/assigntreatment.html"));
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.log(err);
    }
})

router.get('/patientrecord', async (req, res) => {
    try{
        if(req.cookies['doc_id']){
            res.sendFile(path.join(__dirname + "/../../html/doctor/doctorpatientrecord.html"));
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.log(err);
    }
})

router.get('/viewschedule', async (req, res) => {
    try{
        if(req.cookies['doc_id']){
            res.sendFile(path.join(__dirname + "/../../html/doctor/doctorviewschedule.html"));
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.log(err);
    }
})

router.get('/createprescription', async (req, res) => {
    try{
        if(req.cookies['doc_id']){
            res.sendFile(path.join(__dirname + "/../../html/doctor/doctorcreateaprescriptionpage.html")); //ourclinic.com/doctor/createprescription
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.log(err);
    }
})

router.get('/viewprofile', async (req, res) => {
    try{
        if(req.cookies['doc_id']){
            res.sendFile(path.join(__dirname + "/../../html/doctor/doctorviewprofile.html"));
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.log(err);
    }
})

router.get('/editprofile', async (req, res) => {
    try{
        if(req.cookies['doc_id']){
            res.sendFile(path.join(__dirname + "/../../html/doctor/doctoreditprofile.html"));
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.log(err);
    }
})



module.exports = router
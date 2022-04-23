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
            res.sendFile(path.join(__dirname + "/../../html/login.html"));
        }
    } catch (err) {
                console.error(err);
        res.status(500).send(err);
    }
})

router.get('/signup', async (req, res) => {
    try{
        if(req.cookies['pat_id'] || req.cookies['doc_id'] || req.cookies['staff_id']){
            res.redirect('/portal');
        } else if(req.cookies['admin']){
            res.redirect('/admin');
        } else {
            res.sendFile(path.join(__dirname + "/../../html/patient/registerpatient.html"));
        }
    } catch (err) {
                console.error(err);
        res.status(500).send(err);
    }
})




router.get('/myappointments', async (req, res) => {
    try{
        if(req.cookies['pat_id']){
            res.sendFile(path.join(__dirname + "/../../html/patient/patientmyappointments.html"));
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

router.get('/findclinic', async (req, res) => {
    try{
        if(req.cookies['pat_id']){
            res.sendFile(path.join(__dirname + "/../../html/patient/patientfindclinic.html"));
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

router.get('/finddoctor', async (req, res) => {
    try{
        if(req.cookies['pat_id']){
            res.sendFile(path.join(__dirname + "/../../html/patient/patientfinddoctor.html"));
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

router.get('/viewprofile', async (req, res) => {
    try{
        if(req.cookies['pat_id']){
            res.sendFile(path.join(__dirname + "/../../html/patient/patientviewprofile.html"));
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

router.get('/editprofile', async (req, res) => {
    try{
        if(req.cookies['pat_id']){
            res.sendFile(path.join(__dirname + "/../../html/patient/patienteditprofile.html"));
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

module.exports = router
import { Router } from 'express';
import Cryptr from 'cryptr';

import sgMail from '@sendgrid/mail';
import User from '../models/user';
import Doctor from '../models/doctor';
import Article from '../models/articles';
import Diagnosis from '../models/diagnosis';

require('dotenv').config();

const router = Router();
const cryptr = new Cryptr(process.env.SECRET_CRYPTO);

sgMail.setApiKey(process.env.SENDMAIL_API_KEY);

const newEmail = (to, surname, diagnosisId, diagnosis, username) => ({
  to,
  from: 'afyabora.noreply@gmail.com',
  subject: 'AfyaBora diagnosis approval request',
  text: `Dear Dr. ${surname},`,
  html: `
        <p>Dear Dr.${surname},</p>
        <h1 style="font-weight:100;text-align:center;">Afya Bora Patient Diagnosis Doctor Approval</h1>
        <br/>
        <div style="text-align:center;">
        <p>\tIn order to improve data integrity,as a doctor, you are required to validate that you have diagnosed <strong>${username}</strong>  with <strong>${diagnosis} </strong> by simply clicking on the link below</p>
       <br/>
        <a href="${process.env.HOSTING_URL}/api/diagnosis/${diagnosisId}/validate">
        <button style="padding:15px;width:250px;background:skyblue;color:#ffffff;border:none">Validate</button>
        </a>
        </div>
        `,
});

// Get a user by id
router.get('/user/:id', (req, res) => {
  User.findOne({ _id: req.params.id }).then((user) => {
    if (user) {
      res.status(200).json({
        user,
      });
    } else {
      res.status(404).json({
        msg: 'User not found',
      });
    }
  }).catch((err) => {
    res.status(500).json({
      msg: err,
    });
  });
});

// Update user details
router.put('/user/:id?', (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { weight: req.query.weight, height: req.query.height } },
  ).then((user) => {
    res.status(200).json(user);
  }).catch((err) => {
    res.status(500).json({
      msg: 'Error updating this user',
      error: err,
    });
  });
});

// Add a new diagnosis
router.post('/user/:id/diagnosis', (req, res) => {
  User.findById(req.params.id).then((user) => {
    if (user) {
      const newDiagnosis = new Diagnosis({
        userId: req.params.id,
        diagnosis: cryptr.encrypt(req.body.diagnosis),
        symptoms: cryptr.encrypt(req.body.symptoms),
        dosage: cryptr.encrypt(req.body.dosage),
        center: cryptr.encrypt(req.body.center),
        date: new Date(),
        doctorNationalId: req.body.doctorNationalId,
        confirmed: false,
      });
      newDiagnosis.save()
        .then((newRecord) => {
          Doctor.findOne({ nationalId: newRecord.doctorNationalId }).then((doctor) => {
            sgMail.send(newEmail(doctor.email, doctor.surname, newRecord.id, req.body.diagnosis, user.firstName));
          });
          res.status(200).json({});
        }).catch((err) => {
          res.status(500).json({
            msg: 'Error',
            error: err,
          });
        });
    } else {
      res.status(404).json({
        msg: 'User not found',
      });
    }
  }).catch((err) => {
    res.status(500).json({
      msg: 'Error',
      error: err,
    });
  });
});

// Validate a diagnosis
router.get('/diagnosis/:diagnosis/validate', (req, res) => {
  Diagnosis.findByIdAndUpdate(req.params.diagnosis,
    { $set: { confirmed: true } }).then(() => {
    res.render('This diagnosis has been validated');
  }).catch(() => {
    res.redirect('http://google.com');
  });
});

// Fetch a user's record
router.get('/user/:id/diagnosis', (req, res) => {
  Diagnosis.find({
    $and:
        [{ userId: req.params.id }, { confirmed: true }],
  }, {
    _id: 0, __v: 0, userId: 0, symptoms: 0, doctorNationalId: 0, confirmed: 0,
  }).then((record) => {
    record.forEach((part, index) => {
      record[index].diagnosis = cryptr.decrypt(record[index].diagnosis);
      record[index].dosage = cryptr.decrypt(record[index].dosage);
      record[index].center = cryptr.decrypt(record[index].center);
    });
    res.status(200).json({ record });
  }).catch((err) => {
    res.status(500).json({
      error: err,
    });
  });
});

// Register a doctor
router.post('/doctor', (req, res) => {
  new Doctor({
    surname: req.body.surname,
    email: req.body.email,
    nationalId: req.body.nationalId,
  }).save().then((doctor) => {
    res.status(200).json({
      msg: 'Doctor added',
      data: doctor,
    });
  }).catch((err) => {
    res.status(500).json(err);
  });
});

// Fetch all doctors
router.get('/doctor', (req, res) => {
  Doctor.find({}, { _id: 0, __v: 0 }).then((doctors) => {
    res.status(200).json({
      data: doctors,
    });
  });
});

// Fetch all articles
router.get('/article', (req, res) => {
  Article.find({}, { __v: 0, _id: 0 }).then((articles) => {
    res.status(200).json({ articles });
  }).catch((err) => {
    res.status(500).json({ err });
  });
});

// Add new article
router.post('/article', (req, res) => {
  new Article({
    title: req.body.title,
    url: req.body.url,
    thumb: req.body.thumb,
  }).save().then((newArticle) => {
    res.status(200).json({
      msg: 'Article added',
      data: newArticle,
    });
  }).catch((err) => {
    res.status(500).json({ err });
  });
});

export default router;

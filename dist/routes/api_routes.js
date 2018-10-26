'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _cryptr = require('cryptr');

var _cryptr2 = _interopRequireDefault(_cryptr);

var _mail = require('@sendgrid/mail');

var _mail2 = _interopRequireDefault(_mail);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _doctor = require('../models/doctor');

var _doctor2 = _interopRequireDefault(_doctor);

var _articles = require('../models/articles');

var _articles2 = _interopRequireDefault(_articles);

var _diagnosis = require('../models/diagnosis');

var _diagnosis2 = _interopRequireDefault(_diagnosis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

var router = (0, _express.Router)();
var cryptr = new _cryptr2.default(process.env.SECRET_CRYPTO);

_mail2.default.setApiKey(process.env.SENDMAIL_API_KEY);

var newEmail = function newEmail(to, surname, diagnosisId, diagnosis, username) {
  return {
    to: to,
    from: 'afyabora.noreply@gmail.com',
    subject: 'AfyaBora diagnosis approval request',
    text: 'Dear Dr. ' + surname + ',',
    html: '\n        <p>Dear Dr.' + surname + ',</p>\n        <h1 style="font-weight:100;text-align:center;">Afya Bora Patient Diagnosis Doctor Approval</h1>\n        <br/>\n        <div style="text-align:center;">\n        <p>\tIn order to improve data integrity,as a doctor, you are required to validate that you have diagnosed <strong>' + username + '</strong>  with <strong>' + diagnosis + ' </strong> by simply clicking on the link below</p>\n       <br/>\n        <a href="' + process.env.HOSTING_URL + '/api/diagnosis/' + diagnosisId + '/validate">\n        <button style="padding:15px;width:250px;background:skyblue;color:#ffffff;border:none">Validate</button>\n        </a>\n        </div>\n        '
  };
};

// Get a user by id
router.get('/user/:id', function (req, res) {
  _user2.default.findOne({ _id: req.params.id }).then(function (user) {
    if (user) {
      res.status(200).json({
        user: user
      });
    } else {
      res.status(404).json({
        msg: 'User not found'
      });
    }
  }).catch(function (err) {
    res.status(500).json({
      msg: err
    });
  });
});

// Update user details
router.put('/user/:id?', function (req, res) {
  _user2.default.findOneAndUpdate({ _id: req.params.id }, { $set: { weight: req.query.weight, height: req.query.height } }).then(function (user) {
    res.status(200).json(user);
  }).catch(function (err) {
    res.status(500).json({
      msg: 'Error updating this user',
      error: err
    });
  });
});

// Add a new diagnosis
router.post('/user/:id/diagnosis', function (req, res) {
  _user2.default.findById(req.params.id).then(function (user) {
    if (user) {
      var newDiagnosis = new _diagnosis2.default({
        userId: req.params.id,
        diagnosis: cryptr.encrypt(req.body.diagnosis),
        symptoms: cryptr.encrypt(req.body.symptoms),
        dosage: cryptr.encrypt(req.body.dosage),
        center: cryptr.encrypt(req.body.center),
        date: new Date(),
        doctorNationalId: req.body.doctorNationalId,
        confirmed: false
      });
      newDiagnosis.save().then(function (newRecord) {
        _doctor2.default.findOne({ nationalId: newRecord.doctorNationalId }).then(function (doctor) {
          _mail2.default.send(newEmail(doctor.email, doctor.surname, newRecord.id, req.body.diagnosis, user.firstName));
        });
        res.status(200).json({});
      }).catch(function (err) {
        res.status(500).json({
          msg: 'Error',
          error: err
        });
      });
    } else {
      res.status(404).json({
        msg: 'User not found'
      });
    }
  }).catch(function (err) {
    res.status(500).json({
      msg: 'Error',
      error: err
    });
  });
});

// Validate a diagnosis
router.get('/diagnosis/:diagnosis/validate', function (req, res) {
  _diagnosis2.default.findByIdAndUpdate(req.params.diagnosis, { $set: { confirmed: true } }).then(function () {
    res.render('This diagnosis has been validated');
  }).catch(function () {
    res.redirect('http://google.com');
  });
});

// Fetch a user's record
router.get('/user/:id/diagnosis', function (req, res) {
  _diagnosis2.default.find({
    $and: [{ userId: req.params.id }, { confirmed: true }]
  }, {
    _id: 0, __v: 0, userId: 0, symptoms: 0, doctorNationalId: 0, confirmed: 0
  }).then(function (record) {
    record.forEach(function (part, index) {
      record[index].diagnosis = cryptr.decrypt(record[index].diagnosis);
      record[index].dosage = cryptr.decrypt(record[index].dosage);
      record[index].center = cryptr.decrypt(record[index].center);
    });
    res.status(200).json({ record: record });
  }).catch(function (err) {
    res.status(500).json({
      error: err
    });
  });
});

// Register a doctor
router.post('/doctor', function (req, res) {
  new _doctor2.default({
    surname: req.body.surname,
    email: req.body.email,
    nationalId: req.body.nationalId
  }).save().then(function (doctor) {
    res.status(200).json({
      msg: 'Doctor added',
      data: doctor
    });
  }).catch(function (err) {
    res.status(500).json(err);
  });
});

// Fetch all doctors
router.get('/doctor', function (req, res) {
  _doctor2.default.find({}, { _id: 0, __v: 0 }).then(function (doctors) {
    res.status(200).json({
      data: doctors
    });
  });
});

// Fetch all articles
router.get('/article', function (req, res) {
  _articles2.default.find({}, { __v: 0, _id: 0 }).then(function (articles) {
    res.status(200).json({ articles: articles });
  }).catch(function (err) {
    res.status(500).json({ err: err });
  });
});

// Add new article
router.post('/article', function (req, res) {
  new _articles2.default({
    title: req.body.title,
    url: req.body.url,
    thumb: req.body.thumb
  }).save().then(function (newArticle) {
    res.status(200).json({
      msg: 'Article added',
      data: newArticle
    });
  }).catch(function (err) {
    res.status(500).json({ err: err });
  });
});

exports.default = router;
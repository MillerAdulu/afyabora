'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express.Router)();

router.post('/login', function (req, res) {
  _user2.default.findOne({ email: req.body.email }).then(function (user) {
    _bcrypt2.default.compare(req.body.password, user.password).then(function (status) {
      if (!status) {
        res.status(205).json({
          msg: 'Incorrect login credentials'
        });
      }
      if (status) {
        res.status(200).json({
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            nationalID: user.nationalId,
            insuarance: user.insuarance,
            gender: user.gender,
            weight: user.weight,
            height: user.height
          }
        });
      }
    });
  }).catch(function (err) {
    res.status(500).json(err);
  });
});

// New user

router.post('/user', function (req, res) {
  _bcrypt2.default.hash(req.body.password, 12).then(function (hashedPassword) {
    _user2.default.findOne({ email: req.body.email }).then(function (user) {
      if (!user) {
        new _user2.default({
          password: hashedPassword,
          email: req.body.email,
          mobile: req.body.mobile,
          nationalId: req.body.nationalId,
          insuarance: req.body.insuarance,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          gender: req.body.gender,
          weight: parseFloat(req.body.weight),
          height: parseFloat(req.body.height),
          bloodGroup: req.body.bloodGroup
        }).save().then(function (newUser, err) {
          if (err) res.status(500).json(err);
          res.status(200).json({
            user: {
              id: newUser._id,
              email: newUser.email,
              firstName: newUser.firstName,
              lastName: newUser.lastName,
              nationalID: newUser.nationalID,
              insuarance: newUser.insuarance,
              gender: newUser.gender,
              weight: newUser.weight,
              height: newUser.height
            }
          });
        }).catch(function (err) {
          res.status(500).json({ msg: err });
        });
      } else {
        res.status(500).json({ msg: 'This user already exists' });
      }
    });
  });
});

exports.default = router;
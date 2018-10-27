import { Router } from 'express';
import bcrypt from 'bcrypt';
import UserModel from '../models/user';

const router = Router();

router.post('/login', (req, res) => {
  UserModel.findOne({ email: req.body.email }).then((user) => {
    bcrypt.compare(req.body.password, user.password).then((status) => {
      if (!status) {
        res.status(404).json({
          msg: 'Incorrect login credentials',
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
            height: user.height,
          },
        });
      }
    });
  }).catch((err) => {
    res.status(500).json(err);
  });
});

// New user

router.post('/user', (req, res) => {
  bcrypt.hash(req.body.password, 12).then((hashedPassword) => {
    UserModel.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        new UserModel({
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
          bloodGroup: req.body.bloodGroup,
        }).save().then((newUser, err) => {
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
              height: newUser.height,
            },
          });
        }).catch((err) => {
          res.status(500).json({ msg: err });
        });
      } else {
        res.status(500).json({ msg: 'This user already exists' });
      }
    });
  });
});

export default router;

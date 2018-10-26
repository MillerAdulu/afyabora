'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userSchema = new _mongoose2.default.Schema({
  password: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String },
  nationalId: { type: String },
  insuarance: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  gender: { type: String },
  weight: { type: Number },
  height: { type: Number }
});

exports.default = _mongoose2.default.model('User', userSchema);
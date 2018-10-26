'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var doctorSchema = new _mongoose2.default.Schema({
  surname: { type: String },
  email: { type: String },
  nationalId: { type: String, unique: true }
});

exports.default = _mongoose2.default.model('Doctor', doctorSchema);
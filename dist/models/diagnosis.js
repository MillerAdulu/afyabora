'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var diagnosisSchema = new _mongoose2.default.Schema({
  userId: { type: String, required: true },
  diagnosis: { type: String, required: true },
  symptoms: { type: String, required: true },
  dosage: { type: String, required: true },
  center: { type: String, required: true },
  date: { type: Date, required: true },
  doctorNationalId: { type: String, required: true },
  confirmed: { type: Boolean, required: true }
});

exports.default = _mongoose2.default.model('Diagnosis', diagnosisSchema);
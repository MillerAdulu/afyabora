'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _api_routes = require('./routes/api_routes');

var _api_routes2 = _interopRequireDefault(_api_routes);

var _auth_routes = require('./routes/auth_routes');

var _auth_routes2 = _interopRequireDefault(_auth_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

var app = (0, _express2.default)();
var port = process.env.PORT || 3000;

_mongoose2.default.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true }).then(function () {
  console.log('Successfully connected to database!');
}).catch(function (err) {
  console.log('Unable to connect to database: ' + err);
});

app.use(_express2.default.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use('/auth', _auth_routes2.default);
app.use('/api', _api_routes2.default);

app.get('/', function (req, res) {
  res.json('Welcome Home!');
});

app.listen(port, function () {
  console.log('Listening on port ' + port);
});
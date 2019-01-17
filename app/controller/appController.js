'use strict';

var Pasien = require('../model/appModel.js');

var response = require('../../res.js');

exports.searchRM = function(req, res) {
  Pasien.getPasienByRM(req.query.key, function(err, values) {
    if (err)
      res.send(err);

    response.ok(values, res);

  });
};

exports.searchNama = function(req, res) {
  Pasien.getPasienByNama(req.query.key, function(err, values) {
    if (err)
      res.send(err);

    response.ok(values, res);

  });
};

exports.searchPasienDaftar = function(req, res) {
  Pasien.getPasienDaftar(req.query.key, function(err, values) {
    

    if (err)
      res.send(err);

    response.ok(values, res);

  });
};

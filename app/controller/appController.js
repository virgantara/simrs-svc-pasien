'use strict';

var Pasien = require('../model/appModel.js');

var response = require('../../res.js');

exports.getRekapKunjungan = function(req, res) {
  Pasien.getRekapKunjungan(req.query.startdate, req.query.enddate, function(err, values) {
    if (err)
      res.send(err);

    response.ok(values, res);

  });
};

exports.updateTagihanObat = function(req, res) {
  Pasien.updateTagihanObat(req.body, function(err, values) {
    if (err)
      res.send(err);

    response.ok(values, res);

  });
};

exports.getListPasien = function(req, res) {
  Pasien.getListPasien(req.query.limit, req.query.page, function(err, values) {
    if (err)
      res.send(err);

    response.ok(values, res);

  });
};

exports.updateTagihan = function(req, res) {
  Pasien.updateTagihan(req.body, function(err, values) {
    if (err)
      res.send(err);

    response.ok(values, res);

  });
};

exports.syncObatInap = function(req, res) {
  var values = [
    [req.body.id_rawat_inap,req.body.kode_alkes,req.body.keterangan,req.body.nilai,req.body.id_dokter]
  ];

  Pasien.syncObatInap(req.body.keterangan, values, function(err, values) {
    

    if (err)
      res.send(err);

    response.ok(values, res);

  });
};


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

exports.searchPasienDaftarInap = function(req, res) {
  Pasien.getPasienDaftarInap(req.query.key, function(err, values) {
    

    if (err)
      res.send(err);

    response.ok(values, res);

  });
};

exports.searchPasienDaftarRM = function(req, res) {
  Pasien.getPasienDaftarRM(req.query.key, function(err, values) {
    

    if (err)
      res.send(err);

    response.ok(values, res);

  });
};

exports.searchPasienDaftarInapRM = function(req, res) {
  Pasien.getPasienDaftarInapRM(req.query.key, function(err, values) {
    

    if (err)
      res.send(err);

    response.ok(values, res);

  });
};

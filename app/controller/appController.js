'use strict';

var Pasien = require('../model/appModel.js');

var response = require('../../res.js');

exports.searchLike = function(req, res) {
  Pasien.getPasienLike(req.query.key, function(err, values) {
    if (err)
      res.send(err);

    response.ok(values, res);

  });
};

'user strict';
var sql = require('../../db.js');

var unique = require("array-unique").immutable;
// var async = require('async');
// var await = require('await');
var Promise = require('promise');

//Task object constructor
var Pasien = function(task){
   
};

function getPasienByRM(key,callback){

    var txt = "SELECT NoMedrec, NAMA, ALAMAT, TGLLAHIR, AGAMA, JENSKEL, Desa FROM a_pasien";
        txt += " WHERE NoMedrec = ?;";
    sql.query(txt,[key],function(err, res){
        if(err)
            callback(err,null);
        else
            callback(null, res);
    });
}


function getPasienByNama(key,callback){

    var txt = "SELECT NoMedrec, NAMA, ALAMAT, TGLLAHIR, AGAMA, JENSKEL, Desa FROM a_pasien";
        txt += " WHERE NAMA LIKE ? OR NoMedrec = ? LIMIT 20;";
    sql.query(txt,['%'+key+'%',key],function(err, res){
        if(err)
            callback(err,null);
        else
            callback(null, res);
    });
}

function getPasienDaftar(key,callback){

    var txt = "SELECT p.NoMedrec, NAMA, ALAMAT, TGLLAHIR, AGAMA, JENSKEL, Desa, r.TGLDAFTAR, r.JamDaftar as jam, g.KodeGol, g.NamaGol, r.NODAFTAR";
        txt += ", u.KodeUnit, u.NamaUnit, u.unit_tipe  ";
        txt += " FROM a_pasien p";
        txt += " JOIN b_pendaftaran r ON p.NoMedrec=r.NoMedrec ";
        txt += " JOIN a_golpasien g ON g.KodeGol=r.KodeGol ";
        txt += " JOIN b_pendaftaran_rjalan rj ON r.NODAFTAR = rj.NoDaftar";
        txt += " JOIN a_unit u ON rj.KodePoli=u.KodeUnit ";
        txt += " WHERE p.NAMA LIKE ? OR r.NoMedrec = ? ORDER BY r.TGLDAFTAR DESC LIMIT 1 ;";
    sql.query(txt,['%'+key+'%',key],function(err, res){
        if(err)
            callback(err,null);
        else
            callback(null, res);
    });
}

function getPasienDaftarRawatInap(key,callback){

    var txt = "SELECT p.NoMedrec, NAMA, ALAMAT, TGLLAHIR, AGAMA, JENSKEL, Desa, r.TGLDAFTAR, r.JamDaftar as jam, g.KodeGol, g.NamaGol, r.NODAFTAR";
        txt += ", dk.id_kamar as KodeUnit, dk.nama_kamar as NamaUnit  ";
        txt += " FROM a_pasien p";
        txt += " JOIN b_pendaftaran r ON p.NoMedrec=r.NoMedrec ";
        txt += " JOIN a_golpasien g ON g.KodeGol=r.KodeGol ";
        txt += " JOIN tr_rawat_inap ri ON r.NODAFTAR = ri.kode_rawat";
        txt += " JOIN dm_kamar dk ON dk.id_kamar = ri.kamar_id ";
        txt += " WHERE p.NAMA LIKE ? OR r.NoMedrec = ? ORDER BY r.TGLDAFTAR DESC LIMIT 20 ;";
    sql.query(txt,['%'+key+'%',key],function(err, res){
        if(err)
            callback(err,null);
        else
            callback(null, res);
    });
}


Pasien.getPasienByRM = getPasienByRM;
Pasien.getPasienByNama = getPasienByNama;
Pasien.getPasienDaftar = getPasienDaftar;


module.exports= Pasien;
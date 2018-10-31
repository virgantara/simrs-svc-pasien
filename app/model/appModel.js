'user strict';
var sql = require('../../db.js');

var unique = require("array-unique").immutable;
// var async = require('async');
// var await = require('await');
var Promise = require('promise');

//Task object constructor
var Pasien = function(task){
   
};

function getPasienLike(key,callback){

    var txt = "SELECT NoMedrec, NAMA, ALAMAT, TGLLAHIR, AGAMA, JENSKEL, Desa FROM a_pasien";
        txt += " WHERE NoMedrec LIKE '%?%' OR NAMA LIKE '%?%';";
    sql.query(txt,[key, key],function(err, res){
        if(err)
            callback(err,null);
        else
            callback(null, res);
    });
}

function exec(key, result){
    getPasienLike(key,function(err, hasil) {

        let promiseMain = new Promise((resolve, reject)=>{
            
            resolve(hasil);
        });

        
    });
}


Pasien.getPasienLike = function getPasienBy(key, result) {
    exec(key, result); 
};


module.exports= Pasien;
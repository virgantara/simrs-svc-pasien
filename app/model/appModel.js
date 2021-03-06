'user strict';
var sql = require('../../db.js');

var unique = require("array-unique").immutable;
// var async = require('async');
// var await = require('await');
var Promise = require('promise');
var moment = require('moment');
//Task object constructor
var Pasien = function(task){
   
};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

function getTopTenPenyakit(tahun, callback){
    let p = new Promise(function(resolve, reject){
        var txt = "SELECT d.kode, d.deskripsi as des, p.jumlah as jml FROM m_dtd d ";
        txt += " JOIN dash_penyakit p ON p.dtd_id = d.kode ";
        txt += " WHERE p.tahun = ? ";
        txt += " ORDER BY p.jumlah DESC LIMIT 10;";
        sql.query(txt,[tahun],function(err, res){
            if(err)
                reject(err);
            else
                resolve(res);
        });
    });

    p.then(result =>{
        callback(null,result);
    })
    .catch(err=>{
        console.log(err);
        callback(err,null);
    });
    
}

function getListUnit(tipe,bulan, tahun, callback){
    let p = new Promise(function(resolve, reject){
        var txt = "SELECT DISTINCT(u.KodeUnit),u.NamaUnit FROM a_unit u ";
        txt += " JOIN dash_kunjungan_tahunan_unit p ON p.unit_id = u.KodeUnit ";
        txt += " JOIN b_pendaftaran_rjalan bj ON bj.KodePoli = u.KodeUnit ";
        txt += " JOIN b_pendaftaran b ON bj.NoDaftar = b.NODAFTAR ";
        txt += " WHERE p.bulan = ? and p.tahun = ? AND u.unit_tipe = ?  ";
        txt += " ORDER BY u.NamaUnit ;";
        sql.query(txt,[bulan, tahun, tipe],function(err, res){
            if(err)
                reject(err);
            else
                resolve(res);
        });
    });

    p.then(result =>{
        callback(null,result);
    })
    .catch(err=>{
        console.log(err);
        callback(err,null);
    });
    
}

function getSexUsiaGolTanggal(tipe, key, sd,ed, callback){

    var list = [];

    let p = new Promise(function(resolve, reject){
        var txt = "select p.`range`, p.JENSKEL as jk, sum(p.`count`) as `count` from";
            txt += "(select x.`range`,y.`JENSKEL`,y.`umurthn`,";
            txt += "  y.`count` from( ";
            txt += "    select '0-5' as `range`,5 as `upper` ,0 as `lower` ";
            txt += "    union all  ";
            txt += "    select '06-11' as `range`,11 as `upper` ,6 as `lower` ";
            txt += "    union all  ";
            txt += "    select '12-16' as `range`,16 as `upper` ,12 as `lower` ";
            txt += "    union all  ";
            txt += "    select '17-25' as `range`,25 as `upper` ,17 as `lower` ";
            txt += "    union all  ";
            txt += "    select '26-35' as `range`,35 as `upper` ,26 as `lower` ";
            txt += "    union all  ";
            txt += "    select '36-45' as `range`,45 as `upper` ,36 as `lower` ";
            txt += "    union all  ";
            txt += "    select '46-55' as `range`,55 as `upper` ,46 as `lower` ";
            txt += "    union all  ";
            txt += "    select '56-65' as `range`,65 as `upper` ,56 as `lower` ";
            txt += "    union all  ";
            txt += "    select '66-keatas' as `range`,120 as `upper` ,65 as `lower` ";
            txt += "  )x ";
            txt += "  left join( ";
            txt += "    select ";
            txt += "    p.JENSKEL, ";
            txt += "    count(*) as `count`, ";
            txt += "    b.umurthn from b_pendaftaran b  ";
            txt += "    JOIN a_pasien p ON p.NoMedrec = b.NoMedrec ";
            if(tipe == 'gol'){
                txt += " WHERE b.KodeGol= ? ";
            }

            else if(tipe == 'poli'){
                txt += " JOIN b_pendaftaran_rjalan rj ON rj.NoDaftar = b.NODAFTAR ";
                txt += " WHERE rj.KodePoli = ? ";
            }
            
            txt += " AND b.TGLDAFTAR BETWEEN ? AND ? AND  (p.JENSKEL = 'P' OR p.JENSKEL = 'L') ";
            txt += "    group by b.umurthn,p.JENSKEL ";
            txt += "  )y ";
            txt += "  on y.umurthn >= x.`lower` and y.umurthn <= x.`upper` ";
            txt += ")p ";
            txt += "group by p.`range`,p.JENSKEL";

        sql.query(txt,[key, sd, ed],function(err, res){
            if(err)
                reject(err);
            else
                resolve(res);
        });
    });

    p.then(result =>{
        callback(null,result);
    })
    .catch(err=>{
        console.log(err);
        callback(err,null);
    });
}

function countKunjunganGolongan5tahun(kode_gol,callback){

    var list = [];

    let p = new Promise(function(resolve, reject){
        var txt = "select tahun, sum(jumlah) as jumlah from dash_kunjungan_tahunan   ";
            txt += " where gol_id = ? group by tahun order by tahun DESC limit 5 ;";
        sql.query(txt,[kode_gol],function(err, res){
            if(err)
                reject(err);
            else
                resolve(res);
        });
    });

    p.then(result =>{
        var len = result.length, i, j, stop;

        for (i=0; i < len; i++){
            for (j=0, stop=len-i; j < stop; j++){

                if (result[j+1] && (result[j].tahun > result[j+1].tahun)){
                    var temp = result[j];
                    result[j] = result[j+1];
                    result[j+1] = temp;


                }

                if(i==len -1 && j==stop -1)
                    callback(null,result);
            }
        }
        
    })
    .catch(err=>{
        console.log(err);
        callback(err,null);
    });
    
}

function getListGolonganLastfive(callback){

    var list = [];
    
    let pmain = new Promise(function(resolve, reject){
        let listTahun = [];
        let yearnow = eval(moment().format('Y'));
        for(i=yearnow-4;i<=yearnow;i++){
            listTahun.push(i);

            if(i==yearnow)
                resolve(listTahun);
        }
    });
    pmain
    .then(result=>{
        var txt = "SELECT DISTINCT(g.KodeGol), g.NamaGol FROM dash_kunjungan_tahunan d ";
            txt += " JOIN  a_golpasien g ON d.gol_id = g.KodeGol WHERE tahun IN (?) ";
            txt += " ORDER BY g.NamaGol ;";
        sql.query(txt,[result],function(err, res){
            if(err){
                console.log(err);
                callback(err,null);
            }
            else{
                callback(null,res);
            }
        });


    })
   
    .catch(err=>{
        console.log(err);
        callback(err,null);
    });
    
}

function getListGolongan(tahun,kode, callback){

    var list = [];

    let p = new Promise(function(resolve, reject){
        var txt = "SELECT DISTINCT(g.KodeGol), g.NamaGol FROM dash_kunjungan_tahunan d ";
            txt += " JOIN  a_golpasien g ON d.gol_id = g.KodeGol ";
            txt += " WHERE d.tahun = ? ";
        
        var params = [tahun];

        if(kode){
            txt += " AND g.KodeGol = ? ";
            params = [tahun, kode];
        }

        txt += " ORDER BY g.NamaGol ;";
        sql.query(txt,params,function(err, res){
            if(err)
                reject(err);
            else
                resolve(res);
        });
    });

    p.then(result =>{
        callback(null,result);
    })
    .catch(err=>{
        console.log(err);
        callback(err,null);
    });
    
}

function countKunjunganGolonganByKode(kode_gol, tahun,callback){

    var list = [];

    let p = new Promise(function(resolve, reject){
        var txt = "SELECT gol_id, bulan, jumlah FROM dash_kunjungan_tahunan d ";
            txt += " WHERE d.gol_id = ? AND tahun = ? ORDER BY bulan ;"
        sql.query(txt,[kode_gol,tahun],function(err, res){
            if(err)
                reject(err);
            else
                resolve(res);
        });
    });

    p.then(result =>{
        callback(null,result);
    })
    .catch(err=>{
        console.log(err);
        callback(err,null);
    });
    
}

function getKunjunganGolongan(startdate, enddate,callback){

    var list = [];

    let p = new Promise(function(resolve, reject){
        var txt = "SELECT g.KodeGol, g.NamaGol, count(NODAFTAR) as Total FROM a_golpasien g ";
            txt += " JOIN b_pendaftaran b ON b.KodeGol = g.KodeGol ";
            txt += " WHERE b.TGLDAFTAR BETWEEN ? AND ? ";
            txt += " GROUP BY g.KodeGol, g.NamaGol ORDER BY Total DESC  ;";
        sql.query(txt,[startdate, enddate],function(err, res){
            if(err)
                reject(err);
            else
                resolve(res);
        });
    });

    p.then(result =>{
        callback(null,result);
    })
    .catch(err=>{
        console.log(err);
        callback(err,null);
    });
    
}


function getRekapKunjunganRawatInap(startdate, enddate,callback){

    var list = [];

    let p = new Promise(function(resolve, reject){
        var txt = "SELECT * FROM dm_kamar_master ORDER BY nama_kamar ";
        sql.query(txt,[],function(err, res){
            if(err)
                reject(err);
            else
                resolve(res);
        });
    });

    p.then(result =>{
        var i = 0;
        for(var idx=0;idx < result.length;idx++){

            let tmp = result[idx];
            
            var txt = "SELECT SUM(total) as total FROM (SELECT (select count(id_rawat_inap) ";
                txt += "FROM tr_rawat_inap where kamar_id = id_kamar AND tanggal_masuk BETWEEN ? AND ?) ";
                txt += "as total FROM dm_kamar WHERE kamar_master_id = ?) as t;";
            sql.query(txt,[startdate, enddate,tmp.id],function(err, res){
                if(err)
                    callback(err,null);
                else{
                    var obj = new Object;
                    obj.NamaUnit = tmp.nama_kamar;
                    obj.Total = res[0].total;

                    if(res[0].total > 0)                    
                        list.push(obj);

                    if(i >= result.length - 1){
                        callback(null,list);
                    }
                    i++;
                }
            });
        }
    })
    .catch(err=>{
        console.log(err);
        callback(err,null);
    });
    
}


function getRekapKunjungan(startdate, enddate,callback){

    var list = [];

    let p = new Promise(function(resolve, reject){
        var txt = "SELECT * FROM a_unit WHERE unit_tipe = 2 ORDER BY NamaUnit ;";
        sql.query(txt,[],function(err, res){
            if(err)
                reject(err);
            else
                resolve(res);
        });
    });

    p.then(result =>{
        
        var i = 0;

        for(var idx=0;idx < result.length;idx++){
            let tmp = result[idx];
            var txt = "SELECT COUNT(*) as total FROM b_pendaftaran_rjalan bj ";
                txt += " JOIN b_pendaftaran b ON bj.NoDaftar = b.NODAFTAR ";
                txt += " WHERE bj.KodePoli = ? AND b.TGLDAFTAR BETWEEN ? AND ? ;"

            sql.query(txt,[tmp.KodeUnit, startdate, enddate],function(err, res){
                if(err)
                    callback(err,null);
                else
                {

                    var obj = new Object;
                    obj.KodeUnit = tmp.KodeUnit;
                    obj.NamaUnit = tmp.NamaUnit;
                    obj.Total = res[0].total;
                    if(res[0].total > 0)
                        list.push(obj);
                    if(i >= result.length - 1){
                        callback(null,list);
                    }

                    i++;
                }
            });
        }
    })
    .catch(err=>{
        console.log(err);
        callback(err,null);
    });
    
}


function getDiseases(startdate, enddate,callback){
    var sd = startdate + ' 00:00:01';
    var ed = enddate + ' 23:59:59';
    var txt = "SELECT c.kode_icd, i.dtd_kode FROM b_pendaftaran_coding c WHERE ";
        txt += " JOIN m_icd i ON i.kode = c.kode_icd ";
        txt += " c.created_at BETWEEN ? AND ?;";
    sql.query(txt,[sd, ed],function(err, res){
        if(err){
            callback(err,null);
        }
        else{

            callback(null, res);
        }
    });
}

function updateTagihanObat(params,callback){
    let p = getTagihanObat(params);
    p.then(res=>{
        if(res.length > 0){
            let idri = res[0].id_rawat_inap;
            let terbayar = params.terbayar;
            return editTagihanObatAlkes(idri, terbayar,params.status_bayar)
        }

        else
            return null;
        
        
    })
    .then(res=>{
        return editTagihanObat(params);
    })
    .then(res => {
        callback(null,res);
    })
    .catch(err => {
        console.log(err);
        callback(err, null);
    });
}

function getTagihanObat(params){
    return new Promise((resolve,reject)=>{
        var txt = "SELECT id, id_rawat_inap, nilai FROM tr_rawat_inap_alkes_obat WHERE keterangan = ?; ";
                
        sql.query(txt,[params.kode_trx],function(err, res){
            if(err)
                reject(err);
            else{
                resolve(res);
            }
        });
        
    });
}

function editTagihanObatAlkes(idri, nilai, status_bayar){
    return new Promise((resolve,reject)=>{
        var txt ="";
        if(status_bayar == 0)
            txt += "UPDATE tr_rawat_inap_alkes SET biaya_irna = biaya_irna + "+nilai+" WHERE id_rawat_inap = ? AND id_alkes = 1; ";
        else
            txt += "UPDATE tr_rawat_inap_alkes SET biaya_irna = biaya_irna - "+nilai+" WHERE id_rawat_inap = ? AND id_alkes = 1; ";
                
        sql.query(txt,[idri],function(err, res){
            if(err)
                reject(err);
            else{
                resolve(res);
            }
        });
       
    });
}

function editTagihanObat(params){
    return new Promise((resolve,reject)=>{
        var txt = "UPDATE tr_rawat_inap_alkes_obat SET nilai = ? WHERE keterangan = ?; ";
        let nilai = params.status_bayar == 1 ? 0 : params.terbayar;
        sql.query(txt,[nilai, params.kode_trx],function(err, res){
            if(err)
                reject(err);
            else{
                resolve(res);
            }
        });
        
    });
}

function getListPasien(limit,page ,callback){
    let offset = eval(page) ? (eval(page) - 1) * eval(limit) : 0;
    var txt = "SELECT NoMedrec as custid, NAMA as nama, ALAMAT as alamat, JENSKEL as jk FROM a_pasien ORDER BY NoMedrec LIMIT "+limit+" OFFSET "+offset;
    
    sql.query(txt,[],function(err, res){
        if(err)
            callback(err,null);
        else{
            callback(null,res);
        }
    });
}

function updateTagihan(params,callback){

    let p = editTagihanPoli(params);
    p.then(res => {

        callback(null,res);
    })
    .catch(err => {
        console.log(err);
        callback(err, null);
    });
}

function editTagihanPoli(params){
    return new Promise((resolve,reject)=>{
        
        sql.getConnection(function(err,conn){
                       
            conn.beginTransaction(function(err){
                
                var txt = "UPDATE tr_rawat_jalan_tindakan SET status_bayar = ? WHERE kode_trx = ?; ";
                conn.query(txt,[params.status_bayar, params.kode_trx],function(err, res){
                    if(err){
                        conn.rollback(function(){
                            reject(err);    
                        });   
                    }

                    conn.commit(function(err){
                        if(err){
                            conn.rollback(function(){
                                reject(err);    
                            });   
                        }

                        resolve(res);
                        
                    });
                });    
            });
        });
    });
}


function selectResep(kode_trx){
    return new Promise((resolve, reject)=>{
         var txt = "SELECT * FROM tr_rawat_inap_alkes_obat";
            txt += " WHERE keterangan = ?;";
        sql.query(txt,[kode_trx],function(err, res){
            if(err)
                reject(err);
            else{
                resolve(res);
            }
        });
    });
}

function selectResepTotal(id_rawat_inap,total){
    return new Promise((resolve, reject)=>{
         var txt = "SELECT count(*) as jumlah FROM tr_rawat_inap_alkes";
            txt += " WHERE id_rawat_inap = ? AND id_alkes = 1;";
        sql.query(txt,[id_rawat_inap],function(err, res){
            if(err)
                reject(err);
            else{
                let result = [res[0].jumlah];
                result.push(total);

                resolve(result);
            }
        });
    });
}

function insertResep(values){
    return new Promise((resolve, reject)=>{
        var txt = "INSERT INTO tr_rawat_inap_alkes_obat (id_rawat_inap, kode_alkes, keterangan, nilai, id_dokter) ";
            txt += " VALUES ?;";
        let id_rawat_inap = values[0][0];
        sql.query(txt,[values],function(err, res){
            if(err)
                reject(err);
            else{
                resolve(res);
            }
        });
    });
}

function updateResep(nilai, kode_trx){
    return new Promise((resolve, reject)=>{
        var txt = "UPDATE tr_rawat_inap_alkes_obat SET nilai = ? ";
            txt += " WHERE keterangan = ?;";
        // let id_rawat_inap = values[0][0];
        sql.query(txt,[nilai,kode_trx],function(err, res){
            if(err)
                reject(err);
            else{
               resolve(res);
            }
        });
    });
}

function insertResepTotal(id_rawat_inap, total){
    return new Promise((resolve, reject)=>{
        var txt = "INSERT INTO tr_rawat_inap_alkes (id_alkes, id_rawat_inap, biaya_irna, jumlah_tindakan) ";
            txt += " VALUES (1,?,?,1);";
        sql.query(txt,[id_rawat_inap, total],function(err, res){
            if(err)
                reject(err);
            else{
                
                resolve(res);
            }
        });
    });
}

function updateResepTotal(id_rawat_inap, total){
    return new Promise((resolve, reject)=>{
        var txt = "UPDATE tr_rawat_inap_alkes SET biaya_irna = ? ";
            txt += " WHERE id_rawat_inap = ? AND id_alkes = 1 ;";
        // let id_rawat_inap = values[0][0];
        sql.query(txt,[total,id_rawat_inap],function(err, res){
            if(err)
                reject(err);
            else{

                resolve(res);
            }
        });
    });
}

function sumTotalResep(id_rawat_inap){
    return new Promise((resolve, reject)=>{
        var txt = "SELECT SUM(nilai) as total FROM tr_rawat_inap_alkes_obat ";
            txt += " WHERE id_rawat_inap = ?;";
        
        sql.query(txt,[id_rawat_inap],function(err, res){
            if(err)
                reject(err);
            else{
                resolve(res[0].total);
            }
        });
        
    });
}

function syncObatInap(kode_trx, values,callback){
    selectResep(kode_trx)
    .then(res=>{

        if(res.length == 0){
            return insertResep(values);
        }

        else{
            return updateResep(values[0][3],kode_trx);
        }
    })
    .then(res => {
        let id_rawat_inap = values[0][0];
        return sumTotalResep(id_rawat_inap); 
    })
    .then(res =>{
        let id_rawat_inap = values[0][0];
        return selectResepTotal(id_rawat_inap, res);
    })
    .then(res =>{

        let id_rawat_inap = values[0][0];

        if(res[0] == 0){

            return insertResepTotal(id_rawat_inap,res[1]);
        }

        else{
            return updateResepTotal(id_rawat_inap,res[1]);
        }
    })
    .then(res =>{
        callback(null,res);
    });
}

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


function getPasienDaftarRM(key,callback){

    var txt = "SELECT p.NoMedrec, NAMA, ALAMAT, TGLLAHIR, AGAMA, JENSKEL, Desa, r.TGLDAFTAR, r.JamDaftar as jam, g.KodeGol, g.NamaGol, r.NODAFTAR";
        txt += ", u.KodeUnit, u.NamaUnit, u.unit_tipe  ";
        txt += " FROM a_pasien p";
        txt += " JOIN b_pendaftaran r ON p.NoMedrec=r.NoMedrec ";
        txt += " JOIN a_golpasien g ON g.KodeGol=r.KodeGol ";
        txt += " JOIN b_pendaftaran_rjalan rj ON r.NODAFTAR = rj.NoDaftar";
        txt += " JOIN a_unit u ON rj.KodePoli=u.KodeUnit ";
        txt += " WHERE r.NoMedrec = ? ORDER BY r.TGLDAFTAR DESC LIMIT 1 ;";
    sql.query(txt,[key],function(err, res){
        if(err)
            callback(err,null);
        else{
            callback(null, res);
        }
    });
}

function getPasienDaftarRawatInapRM(key,callback){

    var txt = "SELECT p.NoMedrec, NAMA, ALAMAT, TGLLAHIR, AGAMA, JENSKEL, Desa, r.tanggal_masuk as TGLDAFTAR, r.jam_masuk as jam, g.KodeGol, g.NamaGol, r.kode_rawat as NODAFTAR";
        txt += ", dk.id_kamar as KodeUnit, dk.nama_kamar as NamaUnit, d.id_dokter, d.nama_dokter, r.id_rawat_inap ";
        txt += " FROM a_pasien p";
        txt += " JOIN tr_rawat_inap r ON p.NoMedrec=r.pasien_id ";
        txt += " LEFT JOIN dm_dokter d ON r.dokter_id=d.id_dokter ";
        txt += " JOIN a_golpasien g ON g.KodeGol=r.jenis_pasien ";
        txt += " JOIN dm_kamar dk ON dk.id_kamar = r.kamar_id ";
        txt += " WHERE p.NoMedrec = ? AND status_inap <> 2 ORDER BY r.datetime_masuk DESC LIMIT 10;";
    sql.query(txt,[key],function(err, res){
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

    var txt = "SELECT p.NoMedrec, NAMA, ALAMAT, TGLLAHIR, AGAMA, JENSKEL, Desa, r.tanggal_masuk as TGLDAFTAR, r.jam_masuk as jam, g.KodeGol, g.NamaGol, r.kode_rawat as NODAFTAR";
        txt += ", dk.id_kamar as KodeUnit, dk.nama_kamar as NamaUnit, d.id_dokter, d.nama_dokter, r.id_rawat_inap ";
        txt += " FROM a_pasien p";
        txt += " JOIN tr_rawat_inap r ON p.NoMedrec=r.pasien_id ";
        txt += " LEFT JOIN dm_dokter d ON r.dokter_id=d.id_dokter ";
        txt += " JOIN a_golpasien g ON g.KodeGol=r.jenis_pasien ";
        txt += " JOIN dm_kamar dk ON dk.id_kamar = r.kamar_id ";
        txt += " WHERE (p.NAMA LIKE ? OR r.pasien_id = ?) AND status_inap <> 2 ORDER BY r.datetime_masuk DESC LIMIT 10;";
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
Pasien.getPasienDaftarInap = getPasienDaftarRawatInap;
Pasien.getPasienDaftarRM = getPasienDaftarRM;
Pasien.getPasienDaftarInapRM = getPasienDaftarRawatInapRM;
Pasien.syncObatInap = syncObatInap;
Pasien.updateTagihan = updateTagihan;
Pasien.getListPasien = getListPasien;
Pasien.updateTagihanObat = updateTagihanObat;
Pasien.getRekapKunjungan = getRekapKunjungan;
Pasien.getRekapKunjunganRawatInap = getRekapKunjunganRawatInap;
Pasien.getKunjunganGolongan = getKunjunganGolongan;
Pasien.countKunjunganGolonganByKode = countKunjunganGolonganByKode;
Pasien.countKunjunganGolongan5tahun = countKunjunganGolongan5tahun;
Pasien.getListGolongan = getListGolongan;
Pasien.getListGolonganLastfive = getListGolonganLastfive;
Pasien.getSexUsiaGolTanggal = getSexUsiaGolTanggal;
Pasien.getListUnit = getListUnit;
Pasien.getTopTenPenyakit = getTopTenPenyakit;

module.exports= Pasien;
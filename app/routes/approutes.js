'use strict';
module.exports = function(app) {
  var todoList = require('../controller/appController');

  app.route('/poli/rekap/kunjungan')
    .get(todoList.getRekapKunjungan);

  app.route('/obat/tagihan/update')
    .post(todoList.updateTagihanObat);

  app.route('/simrs/poli/update')
    .post(todoList.updateTagihan);

  // todoList Routes
  app.route('/pasien/rm')
    .get(todoList.searchRM);

  app.route('/pasien/nama')
    .get(todoList.searchNama);

  app.route('/pasien/list')
    .get(todoList.getListPasien);

  app.route('/p/daftar')
    .get(todoList.searchPasienDaftar);

  app.route('/p/daftar/inap')
    .get(todoList.searchPasienDaftarInap);

  app.route('/p/daftar/rm')
    .get(todoList.searchPasienDaftarRM);

  app.route('/p/daftar/inap/rm')
    .get(todoList.searchPasienDaftarInapRM);

  app.route('/p/obat/inap')
    .post(todoList.syncObatInap);
    // .post(todoList.create_a_task);
   
  // app.route('/tasks/:taskId')
  //   .get(todoList.read_a_task)
  //   .put(todoList.update_a_task)
  //   .delete(todoList.delete_a_task);
};
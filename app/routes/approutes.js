'use strict';
module.exports = function(app) {
  var todoList = require('../controller/appController');

  // todoList Routes
  app.route('/pasien/like')
    .get(todoList.searchLike);
    // .post(todoList.create_a_task);
   
  // app.route('/tasks/:taskId')
  //   .get(todoList.read_a_task)
  //   .put(todoList.update_a_task)
  //   .delete(todoList.delete_a_task);
};
var rethinkdb = require('rethinkdb');
var db = require('./db');
var pollObject = new db();

module.exports = function(socket) {
  pollObject.connectToDb(function(err,connection) {
  if(err) {
    return callback(true,"Error connecting to database");
  }
  // Look over this line carefully.
  // we are invoking changes() function on poll table.
  // On every change it will give us data.
  rethinkdb.table('poll').changes().run(connection,function(err,cursor) {
    if(err) {
      console.log(err);
    }
    // We are scrolling over the cursor data and broadcasting the changes using socket.
    cursor.each(function(err,row) {
      console.log(JSON.stringify(row));
      if(Object.keys(row).length > 0) {
        socket.broadcast.emit("changeFeed",{"id" : row.new_val.id, "polls" : row.new_val.polls});
      }
    });
  });
  });
};

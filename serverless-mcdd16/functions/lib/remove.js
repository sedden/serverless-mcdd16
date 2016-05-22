var dynamo = require('./dynamo');

var uuid = require('uuid');

module.exports.respond = function(event, callback) {

  // delete
  var params = {
    TableName: dynamo.tableName,
    Key: {
      id: event.id
    }
  };

  return dynamo.doc.delete(params, callback);
};

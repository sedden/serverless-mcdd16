var dynamo = require('./dynamo');

var uuid = require('uuid');

module.exports.respond = function(event, callback) {

  // query
  var params = {
    TableName: dynamo.tableName,
    Key: {
      id: event.id
    }
  };
  return dynamo.doc.get(params, function (error, data) {
    if (error) {
      callback(error);
    } else {
      var newData = { 'person': data.Item };
      callback(error, newData);
    }
  });

};

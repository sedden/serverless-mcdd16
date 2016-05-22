var dynamo = require('./dynamo');

var uuid = require('uuid');

module.exports.respond = function(event, callback) {

  // query
  var params = {
    TableName: dynamo.tableName
  };
  return dynamo.doc.scan(params, function (error, data) {
    if (error) {
      callback(error);
    } else {
      var newData = { 'persons': data.Items };
      callback(error, newData);
    }
  });

};

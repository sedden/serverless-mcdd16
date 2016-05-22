var dynamo = require('./dynamo');

var uuid = require('uuid');

module.exports.respond = function(event, callback) {

  var data = event.person;
  data.id = event.id;
  data.lastModified = new Date().getTime();

  // insert
  var params = {
    TableName: dynamo.tableName,
    Item: data
  };
  return dynamo.doc.put(params, function (error, data) {
    if (error) {
      callback(error);
    } else {
      var newData = { 'person': params.Item };
      callback(error, newData);
    }
  });

};

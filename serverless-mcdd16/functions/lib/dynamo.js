var AWS = require('aws-sdk');

var dynamoDb = new AWS.DynamoDB({});
module.exports.doc = new AWS.DynamoDB.DocumentClient({ service: dynamoDb });
module.exports.tableName = process.env.SERVERLESS_PROJECT + '-persons-' + process.env.SERVERLESS_STAGE;

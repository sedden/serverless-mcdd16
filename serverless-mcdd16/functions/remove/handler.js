'use strict';

var lib = require('../lib/remove');

module.exports.handler = function(event, context) {
  return lib.respond(event, function(error, response) {
    return context.done(error, response);
  });
};

var chai = require('chai');

<% if (factories) { %>
var factories = require('chai-factories');
chai.use(factories);
require("fs").readdirSync("./test/factories").forEach(function(file) {
  require("./factories/" + file);
});
<% } %>

module.exports.libRequire = function(path){
  return require((process.env.LIB_FOR_TESTS_DIR || '../lib') + '/' + path);
};

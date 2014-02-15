var restify = require('restify');
<% if (includeConfig) { %> var config = require('config'); <% } %>

var server = restify.createServer({
  version: '1.0.0',
  name: '<%= projectName  %>'
});

// Handles annoying user agents (curl)
server.pre(restify.pre.userAgentConnection());

// Use the common stuff you probably want
server.use(restify.acceptParser(server.acceptable));
server.use(restify.dateParser());
server.use(restify.authorizationParser());
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.use(restify.bodyParser());

require('./routes')(server);

server.listen((process.env.PORT || 8080), function onListen() {
  console.log('listening at %s', server.url); 
});

module.exports = function routes(server) {

  server.get('/hello', function(req, res, next) {
    res.send('hello');
    return next();
  });

};

'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var spawn = require('child_process').spawn;
var chiselUtil = require('../app/util');

var LibGenerator = module.exports = function LibGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.Base.apply(this, arguments);

  console.log(chiselUtil.chisel);
  console.log('You called the lib subgenerator with the argument ' + this.name + '.');

  this.on('end', function () {
    console.log(chalk.yellow('Adding and installing dependencies: '));

    var npm = spawn('npm', ['install','--save-dev', '--color', 'always', 'mocha', 'grunt']);
    npm.stdout.pipe(process.stdout, {end: false});
    npm.stderr.pipe(process.stderr, {end: false});
    npm.on('exit', function (code) {
      console.log('child process exited with code ' + code);
    });
    //this.installDependencies({ skipInstall: options['skip-install'] });
  });
};

util.inherits(LibGenerator, yeoman.generators.Base);

LibGenerator.prototype.files = function files() {
  this.copy('somefile.js', 'somefile.js');
};

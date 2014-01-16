'use strict';
var util = require('util');
var chisel = require('../chisel/chisel');
var path = require('path');
var yeoman = require('yeoman-generator');
var _ = require('lodash');
var _s = require('underscore.string');
var npm = require('npm');
var chalk = require('chalk');
var spawn = require('child_process').spawn;


var ChiselGenerator = module.exports = function ChiselGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.dependencies = [];
  this.devDependencies = [
    'grunt', 
    'grunt-cli', 
    'grunt-contrib-watch', 
    'grunt-notify', 
    'grunt-env', 
    'grunt-contrib-clean'
  ];

  this.on('end', function () {
    chisel.npmInstall(this.devDependencies, true);
    if (this.dependencies.length > 0) {
      chisel.npmInstall(this.dependencies, false);
    }
    //this.installDependencies({ skipInstall: options['skip-install'] });
  }.bind(this));

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(ChiselGenerator, yeoman.generators.Base);

ChiselGenerator.prototype.setup = function() {
  var cb = this.async();
  
  npm.load(function(err, npm){
    this.authorName = npm.config.get('init.author.name');
    this.authorEmail = npm.config.get('init.author.email');
    this.authorUrl = npm.config.get('init.author.url');
    cb();
  }.bind(this));

};

ChiselGenerator.prototype.askFor = function askFor() {

  var validateName = function(input) {
    if (input === '' || typeof input !== 'string') {
      return 'Input required.';
    } else if (input.match(/^[a-zA-Z0-9_\.-]*$/) == null) {
      return 'Invalid name. Characters allowed: [a-zA-Z0-9_.-]';
    } else {
      return true;
    }
  };

  var validateRequired = function(input) {
    if (input === '' || typeof input !== 'string') {
      return 'Input required';
    }
    return true;
  };

  var cb = this.async();

  console.log(chisel.banner);
  if (!_s.isBlank(this.authorName)) {
    console.log(chalk.green('Hello ') + chalk.cyan(this.authorName) + chalk.green(', welcome to Chisel!\n'));
  }

  var prompts = [{
    type: 'input',
    name: 'projectName',
    message: 'Project name',
    validate: validateName,
    default: path.basename(process.cwd())
  }, {
    name: 'description',
    message: 'Project description',
    validate: validateRequired
  }, {
    name: 'version',
    message: 'Version',
    default: '0.0.0'
  }, {
    type: 'confrm',
    name: 'privateRepo',
    message: 'Private repo?',
    default: true
  },{
    name: 'authorName',
    message: 'Author name',
    default: this.authorName
  }, {
    name: 'authorEmail',
    message: 'Author email',
    default: this.authorEmail
  }, {
    name: 'authorUrl',
    message: 'Author url',
    default: this.authorUrl
  }, {
    type: 'list',
    name: 'projectType',
    message: 'What type of project is this?',
    choices: ['library', 'express', 'restify']
  }, {
    type: 'input',
    name: 'entryPoint',
    message: 'Entry point filename',
    default: function(answers){
      return answers.projectName + '.js';         
    },
    when: function(answers) {
      if (answers.projectType === 'library') {
        return true;
      };
      return false;
    }
  }, {
    type: 'confirm',
    name: 'includeConfig',
    message: 'Include configuration?',
    default: true
  }, {
    type: 'confirm',
    name: 'factories',
    message: 'Include factories in testing?',
    default: true
  }];

  this.prompt(prompts, function (answers) {
    this.projectName = answers.projectName;
    this.description = answers.description;
    this.version = answers.version;
    this.privateRepo = answers.privateRepo;
    this.entryPoint = answers.entryPoint;
    this.includeConfig = answers.includeConfig;
    this.factories = answers.factories;
    this.testScript = '';
    this.projectType = answers.projectType;
    if (_s.isBlank(answers.authorName)) {
      this.author = '';
    } else {
      var a = [answers.authorName];
      if (!_s.isBlank(answers.authorEmail)) {
        a.push('<'+answers.authorEmail+'>');
      }
      if(!_s.isBlank(answers.authorUrl)) {
        a.push('('+answers.authorUrl+')');
      }
      this.author = a.join(' ');
    }

    cb();
  }.bind(this));

};

ChiselGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('gitignore', '.gitignore');
  this.template('_Gruntfile.coffee', 'Gruntfile.coffee');
  this.template('_package.json', 'package.json');
  this.template('_README.md', 'README.md');
};

ChiselGenerator.prototype.express = function express() {
  if (this.projectType == 'express') {

  }
};

ChiselGenerator.prototype.resitfy = function restify() {
  if (this.projectType == 'restify') {
    console.log(chalk.yellow('Generating a restify project.\n'));
    this.dependencies.push('restify');
    this.mkdir('lib');
    this.template('_restify.js', 'lib/server.js');
    this.template('_restifyroutes.js', 'lib/routes.js');
  }
};

ChiselGenerator.prototype.library = function library() {
  if (this.projectType === 'library') {
    console.log(chalk.yellow('Generating a library project.\n'));
    this.mkdir('lib');
    this.template('_library.js', 'lib/' + this.entryPoint);
  }
};

ChiselGenerator.prototype.conf = function conf() {
  if (this.includeConfig) {
    this.dependencies.push('config');
    this.mkdir('config');
    this.write('config/default.coffee', '');
  }
};

ChiselGenerator.prototype.test = function test() {
  var deps = [
    'mocha',
    'chai',
    'grunt-mocha-test',
    'grunt-contrib-jshint',
    'grunt-istanbul',
    'grunt-istanbul-coverage',
  ];
  this.mkdir('test');
  this.template('test/_example.test.js', 'test/example.test.js');
  this.template('test/_test-helper.js', 'test/test-helper.js');

  if (this.factories) {
    deps.push('chai-factories');
    this.mkdir('test/factories');
    this.copy('test/factories/example-factory.js', 'test/factories/example-factory.js');
  }
  this.devDependencies = this.devDependencies.concat(deps);

};

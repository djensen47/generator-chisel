var testHelper = require('./test-helper');

var chai = require('chai');
var should = chai.should();
var nock = require('nock');
var libRequire = testHelper.libRequire;

var <%= _(entryPoint).strLeft('.js').camelize() %> = libRequire('<%= _(entryPoint).strLeft(".js") %>');

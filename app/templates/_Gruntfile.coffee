path = require('path')

module.exports = (grunt) ->
  'use strict'

  buildDir = './build/'
  lcovInstrumentDir = './build/instrument/'
  lcovReportDir = './build/coverage/'
  srcLibForTestsDir = path.resolve(__dirname, 'lib/')
  lcovLibForTestsDir = path.resolve(__dirname, lcovInstrumentDir, 'lib')

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    clean:
      coverage: [lcovInstrumentDir, lcovReportDir]
      all: buildDir

    env:
      default:
        LIB_FOR_TESTS_DIR: srcLibForTestsDir
      test:
        NODE_ENV: 'testing'
      coverage:
        LIB_FOR_TESTS_DIR: lcovLibForTestsDir

    mochaTest:
      options:
        reporter: 'spec'
      src: ['test/**/*.js', '!test/factories/**/*.js']

    jshint:
      options:
        globals:
          console: true
          module: true
      uses_defaults: ['lib/**/*.js']
      with_overrides:
        options:
          expr: true
        files:
          src: ['test/**/*.js']

    watch:
      files: ['Gruntfile.coffee', 'test/**/*.js', 'lib/**/*.js']
      tasks: ['cover']

    instrument:
      files: './lib/**/*.js'
      options:
        basePath : lcovInstrumentDir

    storeCoverage:
      options:
        dir: lcovReportDir
    
    makeReport:
      src: lcovReportDir + 'coverage.json'
      options:
        reporters:
          lcov:
            dir: lcovReportDir
          text: true

    coverage:
      options:
        dir: lcovReportDir
        root: ''
        thresholds:
          'statements': 90
          'branches': 90
          'lines': 90
          'functions': 90

  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-env')
  grunt.loadNpmTasks('grunt-mocha-test')
  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-istanbul')
  grunt.loadNpmTasks('grunt-istanbul-coverage')
  grunt.loadNpmTasks('grunt-notify')

  grunt.registerTask 'test', ['env:test', 'jshint', 'mochaTest']

  grunt.registerTask 'cover', [
    'clean:coverage',
    'env:coverage',
    'instrument',
    'test',
    'storeCoverage',
    'makeReport',
    'coverage'
  ]

  grunt.registerTask 'default', ['cover']

#  grunt.registerMultiTask 'coverme', 'istanbul code coverage', () ->
#    done = this.async()
#    console.log grunt.file.expand(this.filesSrc)
#    options =
#      cmd: 'node_modules/.bin/istanbul'
#      args: [
#        'cover',
#        'node_modules/.bin/_mocha',
#        '--',
#        '-R', 'spec'
#      ]

#    grunt.util.spawn options, (error, result, code) ->
#      if result && result.stderr
#        process.stderr.write(result.stderr)

#      if result && result.stdout
#        grunt.log.writeln(result.stdout)

#      done(error)

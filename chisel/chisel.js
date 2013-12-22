var chalk = require('chalk');
var spawn = require('child_process').spawn;
var _ = require('lodash');

var oldChisel = 
'\n  _____ _     _          _   ' + 
'\n /  __ \\ |   (_)        | | ' +
'\n | /  \\/ |__  _ ___  ___| | ' +
'\n | |   | \'_ \\| / __|/ _ \\ | ' +
'\n | \\__/\\ | | | \\__ \\  __/ | ' +
'\n  \\____/_| |_|_|___/\\___|_| ' +
'';

var banner = 
'\n                       '+chalk.yellow(' ____')+
'\n                       '+chalk.yellow('(_  _)')+
'\n                       '+chalk.yellow('  ||')+
chalk.white('\n  _____ _     _        ')+chalk.yellow(' /__\\')+
chalk.white('\n /  __ \\ |   (_)        ')+chalk.gray('|  |')+
chalk.white('\n | /  \\/ |__  _ ___  ___')+chalk.gray('|  |')+
chalk.white('\n | |   | \'_ \\| / __|/ _ \\  ')+chalk.gray('|')+
chalk.white('\n | \\__/\\ | | | \\__ \\  __/  ')+chalk.gray('|')+
chalk.white('\n  \\____/_| |_|_|___/\\___')+chalk.gray('|  |')+
//chalk.gray('\n                        |  |')+
chalk.gray('\n                        \\__/')+
'\n';

module.exports.banner = banner;

module.exports.npmInstall = function(deps, isDev) {
  var save = '--save';
  if (isDev) {
    save = '--save-dev';
  }
  var params = _.union(['install', '--color', 'always', save], deps);
  var npm = spawn('npm', params);
  npm.stdout.pipe(process.stdout, {end: false});
  npm.stderr.pipe(process.stderr, {end: false});
  npm.on('exit', function (code) {
    if (code != 0) {
      console.log(chalk.red('npm exited with code: ') + code);
    }
  });
};

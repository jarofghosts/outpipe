var parse = require('shell-quote').parse;
var exec = require('child_process').exec;
var path = require('path');
var echo = process.execPath + ' ' + path.join(__dirname, 'bin/echo');

module.exports = function (str, opts) {
    var parts = parse(str);
    for (var i = 0; i < parts.length; i++) {
        if (parts[i].op) break;
    }
    if (i === parts.length) {
        str = echo + ' > ' + str;
    }
    else {
        if (parts[parts.length-1].op === '|') {
            str += echo;
        }
        if (parts[0].op === '|') {
            str = echo + str;
        }
        if (parts[0].op === '>') {
            str = echo + str;
        }
    }
    var p = exec(str, opts);
    p.stderr.pipe(process.stderr, { end: false });
    p.stdout.pipe(process.stdout, { end: false });
    p.once('exit', function (code) { p.stdin.emit('exit', code) });
    return p.stdin;
};

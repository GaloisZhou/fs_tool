"use strict";

var fs = require('fs');
var path = require('path');
global.config = null;


var fileService = require('./module/service/fileService');

const _rootDir = process.argv[2];
let _isFile = process.argv[3];
let _names = new Set();
for (let _i = 4; ; _i++) {
    let _name = process.argv[_i];
    if (_name) {
        _names.add(_name);
    } else {
        break;
    }
}

console.log('directory: ', _rootDir);
console.log('isFile', _isFile);
console.log('file/directory names', Array.from(_names));

if (new Set(['--help', '-h']).has(_rootDir)) {
    displayHelp();
} else if (!fileService.isDir(_rootDir)) {
    console.error('error: bad directory: ', _rootDir || '');
    console.log();
    displayHelp();
} else if (!(new Set(['-f', '-d']).has(_isFile))) {
    console.error('error: bad options: ', _isFile || '');
    console.log();
    displayHelp();
} else if (_names.size <= 0) {
    console.error('error: at least has one file/directory name');
    console.log();
    displayHelp();
} else {
    _isFile = _isFile == '-f' ? true : false;
    _names = Array.from(_names);
    console.log('====================================================');
    readAndRemove(_rootDir, _isFile, _names);
}

function displayHelp() {
    console.log('Remove file or directory tool.');
    console.log();
    console.log('Usage: node fs_remove.js [directory] [options] [name...]');
    console.log();
    console.log('Options:');
    // console.log('  ', '-h, --help', '\t', 'help');
    console.log('  ', '-f', '\t', 'remove file');
    console.log('  ', '-d', '\t', 'remove directory');
    console.log();
    console.log('Example:');
    console.log('node fs_remove.js /Users/galois/projects/galois/fs_test -f *.iml *.class *.idea');
    console.log('node fs_remove.js /Users/galois/projects/galois/fs_test -d node_modules');
}

function readAndRemove(dir, isFile, names) {
    fs.readdir(dir, function (err, files) {
        if (files) {
            files.forEach(fileName => {
                let _fPath = path.join(dir, fileName);
                if (fileService.isDir(_fPath)) {
                    if (!isFile && fileService.checkRemove(fileName, names)) {
                        console.log('###>> remove dir >> ', _fPath, ' by ', names);
                        fileService.remove(_fPath, isFile);
                    } else {
                        readAndRemove(_fPath, isFile, names);
                    }
                } else {
                    if (isFile && fileService.checkRemove(fileName, names)) {
                        console.log('===>> remove file >> ', _fPath, ' by ', names);
                        fileService.remove(_fPath, isFile);
                    }
                }
            });
        }
    });
}


// node fs_remove.js /Users/galois/projects/galois/fs_test -f *.iml *.class *.idea
// node fs_remove.js /Users/galois/projects/galois/fs_test -d node_modules




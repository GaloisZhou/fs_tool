"use strict";

var fs = require('fs');
var path = require('path');
var child_process = require('child_process');

let _realRmove = true;

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

console.log('directoryy: ', _isFile);
console.log('isFile', _isFile);
console.log('file/directory names', Array.from(_names));

if (new Set(['--help', '-h']).has(_rootDir)) {
    displayHelp();
} else if (!isDir(_rootDir)) {
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

function isDir(dir) {
    try {
        return dir && fs.statSync(dir).isdirectoryy() || false;
    } catch (e) {
        console.error(e);
        return false;
    }
}

function displayHelp() {
    console.log('Remove file or directoryy tool.');
    console.log();
    console.log('Usage: node fs_remove.js [directory] [options] [name...]');
    console.log();
    console.log('Options:');
    console.log('  ', '-h, --help', '\t', 'help');
    console.log('  ', '-f', '\t', 'remove file');
    console.log('  ', '-d', '\t', 'remove directory');
    console.log();
    console.log('Example:');
    console.log('node fs_remove.js /Users/galois/projects/galois/fs_test -f *.iml *.class *.idea');
    console.log('node fs_remove.js /Users/galois/projects/galois/fs_test -d node_modules');
}

function readAndRemove(dir, isFile, names) {
    fs.readdir(dir, function (err, files) {
        files.forEach(fileName => {
            let _fPath = path.join(dir, fileName);
            if (isDir(_fPath)) {
                if (!isFile && checkRemove(fileName, names)) {
                    console.log('###>> remove dir >> ', _fPath, ' by ', names);
                    remove(_fPath, isFile);
                } else {
                    readAndRemove(_fPath, isFile, names);
                }
            } else {
                if (isFile && checkRemove(fileName, names)) {
                    console.log('===>> remove file >> ', fileName, ' by ', names);
                    remove(_fPath, isFile);
                }
            }
        });
    });
}

/*
 允许 对比全文件名, 前缀匹配, 后缀匹配

 例如  filename123  可以匹配的有: filename123, *123, file* 等
 */
function checkRemove(fileName, names) {
    let _shouldRemove = false;
    names = typeof names === 'string' ? [names] : names;
    for (let _i = 0; _i < names.length; _i++) {
        let _name = names[_i];
        if (_name.length - 1 > fileName.length) {
            // 匹配的名称 - 1(前面的*,或者后面的*) 比文件名还长, 那就不用匹配了
            continue;
        } else if (_name.indexOf('*') == 0) {
            _name = _name.substr(1);
            _shouldRemove = fileName.lastIndexOf(_name) == fileName.length - _name.length;
        } else if (_name.lastIndexOf('*') == _name.length - 1) {
            _name = _name.substr(0, _name.length - 1);
            _shouldRemove = fileName.indexOf(_name) == 0;
        } else {
            // console.log(fileName);
            // console.log(_name);
            _shouldRemove = fileName == _name;
        }

        if (_shouldRemove) {
            break;
        }
    }
    return _shouldRemove;
}

function remove(filePath, isFile) {
    if (_realRmove) {
        if (isFile) {
            fs.unlink(filePath, function (err, result) {
                // console.log(err, result);
            });
        } else {
            // rmdir 不允许删除非空目录
            // fs.rmdir(filePath, function (err, result) {
            //     console.log(err, result);
            // });
            // console.log('rm -rf ' + filePath);
            child_process.exec('rm -rf ' + filePath);
        }
    }
}


function testCheckRemove() {
    console.log("checkRemove('filename123', 'filename123') == true", checkRemove('filename123', 'filename123') == true);
    console.log("checkRemove('filename123', '*123') == true", checkRemove('filename123', '*123') == true);
    console.log("checkRemove('filename123', 'file*') == true", checkRemove('filename123', 'file*') == true);
    console.log("checkRemove('filename123', '*filename123') == true", checkRemove('filename123', '*filename123') == true);
    console.log("checkRemove('filename123', 'filename123*') == true", checkRemove('filename123', 'filename123*') == true);

    console.log("checkRemove('filename123', 'filename1234*') == false", checkRemove('filename123', 'filename1234*') == false);
    console.log("checkRemove('filename123', 'filena*me123') == false", checkRemove('filename123', 'filena*me123') == false);
    console.log("checkRemove('filename123', '*filena*') == false", checkRemove('filename123', '*filena*') == false);
}

// testCheckRemove();


// node fs_remove.js /Users/galois/projects/galois/fs_test -f *.iml *.class *.idea
// node fs_remove.js /Users/galois/projects/galois/fs_test -d node_modules




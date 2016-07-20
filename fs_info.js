"use strict";

var fs = require('fs');
var path = require('path');

global.config = require('./module/conf/config');
var mongoUtil = require('./module/utils/mongoDbUtils');

var fileService;

const _rootDir = process.argv[2];

if (!_rootDir) {
    console.error('error: bad directory');
    console.log();
    displayHelp();
    return;
}

mongoUtil.init(config.mongoDb)(function (err, db) {
    global.db = db;

    fileService = require('./module/service/fileService');

    readAndSave(_rootDir);

});

var index = 0;
function readAndSave(dir) {
    fs.readdir(dir, function (err, files) {
        if (files) {
            files.forEach(file => {
                let _filePath = path.join(dir, file);
                fs.stat(_filePath, function (err, fileInfo) {
                    if (fileInfo) {
                        if (fileInfo.isDirectory()) {
                            readAndSave(_filePath)
                        } else {
                            fileService.saveFileInfo(dir, file, fileInfo);
                            index++;
                            // console.log('index=', index);
                        }
                    }
                });
            });
        }
    });
}


function displayHelp() {
    console.log('Collect file info.');
    console.log();
    console.log('Usage: node fs_info.js [directory]');
    console.log();
    console.log('Example:');
    console.log('');
    console.log('');
}


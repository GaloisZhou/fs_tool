"use strict";

var fs = require('fs');
var path = require('path');
var co = require('co');

global.config = require('./module/conf/config');
var mongoUtil = require('./module/utils/mongoDbUtils');

var oneTimeLength = process.argv[2] || 5;
var processLength = process.argv[3] || 5;

oneTimeLength = parseInt(oneTimeLength) || 5;
processLength = parseInt(processLength) || 5;

console.log('并发数量:\t', oneTimeLength);
console.log('单次处理数量:\t', processLength);

var fileService;

mongoUtil.init(config.mongoDb)(function (err, db) {
    global.db = db;

    fileService = require('./module/service/fileService');

    co(function*() {
        let _duplicateFiles = yield fileService.findDuplicate();
        // console.log(_duplicateFiles);
        if (_duplicateFiles) {
            for (let _i = 0; _i < _duplicateFiles.length; _i++) {
                let _df = _duplicateFiles[_i];
                let _ids = _df._ids;
                _ids.splice(0, 1);

                console.log(_df._ids, _ids);
                
                yield fileService.removeFileAndDb(_ids);
                break;
            }
        }
    });
});
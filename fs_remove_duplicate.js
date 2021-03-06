"use strict";

var fs = require('fs');
var path = require('path');
var co = require('co');

global.config = require('./module/conf/config');
var mongoUtil = require('./module/utils/mongoDbUtils');

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

                try {
                    yield fileService.removeFileAndDb(_ids);
                } catch (e) {
                    console.error(e);
                }
            }
        }

        console.log('finish');
    });
});
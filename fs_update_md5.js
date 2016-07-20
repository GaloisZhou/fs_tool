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
        let _count = yield fileService.count();
        let _times = Math.ceil(_count / (oneTimeLength * processLength));

        console.log('_count: \t', _count);
        console.log('_times: \t', _times);

        for (let _t = 0; _t < _times; _t++) {
            console.log('time: \t\t', _t);
            console.time('time_' + _t);
            let _updateList = [];
            try {
                for (let _l = oneTimeLength * _t; _l < oneTimeLength * (_t + 1); _l++) {
                    console.log('start - length: \t', _l * processLength, processLength);
                    _updateList.push(fileService.updateMd5(_l * processLength, processLength));
                    if (_l >= _count) {
                        break;
                    }
                }
                yield _updateList;
            } catch (e) {
                console.error(e);
            }
            console.timeEnd('time_' + _t);
        }

        console.log('finish count: ', _count);
    });
});
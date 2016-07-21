"use strict";

var fs = require('fs');
var path = require('path');
var co = require('co');

global.config = require('./module/conf/config');
var mongoUtil = require('./module/utils/mongoDbUtils');
var dateUtils = require('./module/utils/dateUtils');

var writeDir = '/Users/galois/projects/tmp/files/';

var fileService;

mongoUtil.init(config.mongoDb)(function (err, db) {
    global.db = db;

    fileService = require('./module/service/fileService');

    co(function*() {
        let _query = {dir: /\/media\/galois\/Galois\_1T\_NTFS_2\/照片\/青\-all\-\-\-\-\-\-\-\-重要/};
        let _oldestFile = yield fileService.findOne(_query, {sort: {mtime: 1}});
        let _newestFile = yield fileService.findOne(_query, {sort: {mtime: -1}});

        let _oldestDate = new Date(dateUtils.dateFormat(new Date(_oldestFile.mtime), 'yyyy-MM-dd 00:00:00'));
        let _newestDate = new Date(dateUtils.dateFormat(new Date(_newestFile.mtime), 'yyyy-MM-dd 00:00:00'));

        console.log(_oldestDate);
        console.log(_newestDate);

        let _days = (_newestDate.getTime() - _oldestDate.getTime()) / dateUtils.oneDay;

        let _hasDataDayLen = 0;

        for (let _i = 0; _i < _days; _i++) {
            let _dayTimestamp = _oldestDate.getTime() + dateUtils.oneDay * _i;

            let _dayQuery = {mtime: {$gte: _dayTimestamp, $lt: _dayTimestamp + dateUtils.oneDay}}
            let _count = yield fileService.count(_dayQuery);

            if (_count) {
                console.log(new Date(_dayTimestamp));
                _hasDataDayLen++;
                console.log('==========================>>>>>>>>', _count, _hasDataDayLen);

                yield fileService.moveFileByDay(writeDir, _dayTimestamp, _dayQuery);

            }

            break;

        }

        // console.log('_oldestFile', _oldestFile);
        // console.log('_newestFile', _newestFile);
        console.log('finish');
    });
});

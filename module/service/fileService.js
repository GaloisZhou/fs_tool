"use strict";

var service = {};

module.exports = service;


var fs = require('fs');
var path = require('path');
var child_process = require('child_process');

var md5 = require('md5');

var fileDao = require('../dao/fileDao');
var dateUtils = require('../utils/dateUtils');

service.isDir = function (dir) {
    try {
        return dir && fs.statSync(dir).isDirectory() || false;
    } catch (e) {
        console.error('isDIr, error: ', e);
        return false;
    }
};


service.remove = function (filePath, isFile) {
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
};

/*
 判断是否要删除
 允许 对比全文件名, 前缀匹配, 后缀匹配

 例如  filename123  可以匹配的有: filename123, *123, file* 等
 */
service.checkRemove = function (fileName, names) {
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
};

service.extension = function (fileName) {
    let _extension = fileName && fileName.split('.') || '';
    if (_extension && _extension.length > 0) {
        _extension = _extension[_extension.length - 1];
    } else {
        _extension = '';
    }
    return _extension.toLowerCase();
};

service.saveFileInfo = function (dir, file, fileInfo, cb) {
    let _fileInfo = {
        dir: dir,
        name: file,
        size: fileInfo.size,
        atime: fileInfo.atime.getTime(),
        mtime: fileInfo.mtime.getTime(),
        ctime: fileInfo.ctime.getTime(),
        birthtime: fileInfo.birthtime.getTime(),
        extension: service.extension(file),

        atimeStr: dateUtils.dateFormat(fileInfo.atime, 'yyyy-MM-dd hh:mm:ss'),
        mtimeStr: dateUtils.dateFormat(fileInfo.mtime, 'yyyy-MM-dd hh:mm:ss'),
        ctimeStr: dateUtils.dateFormat(fileInfo.ctime, 'yyyy-MM-dd hh:mm:ss'),
        birthtimeStr: dateUtils.dateFormat(fileInfo.birthtime, 'yyyy-MM-dd hh:mm:ss'),
    };

    fileDao.updateOne(
        {dir: _fileInfo.dir, name: _fileInfo.name},
        _fileInfo,
        {upsert: true}
    )(cb || function (err, result) {
            console.log(err, result);
        });

    // fs.readFile(_filePath, function (err, data) {
    //     if (data) {
    //         _fileInfo.md5 = md5(data);
    //     }
    //     fileDao.updateOne(
    //         {dir: _fileInfo.dir, name: _fileInfo.name},
    //         _fileInfo,
    //         {upsert: true}
    //     )(function (err, result) {
    //         console.log('upsert result: ', err, result);
    //     });
    // });
};

service.count = function*() {
    return yield fileDao.count({});
};

service.updateMd5 = function*(start, length) {
    let _fileInfos = yield fileDao.find({}, {update_timestamp: 1}, start, length, {dir: 1, name: 1})
    for (let _i = 0; _i < _fileInfos.length; _i++) {
        try {
            let _fi = _fileInfos[_i];
            let _id = _fi._id;
            let _dir = _fi.dir;
            let _name = _fi.name;
            let _filePath = path.join(_dir, _name);
            let _fileData = yield service.readFileSync(_filePath);
            let _md5 = md5(_fileData);
            console.log('update: \t', _id);
            yield fileDao.updateOne({_id: _id}, {md5: _md5});
        } catch (e) {
            console.error(e);
        }
    }
};


service.readFileSync = function (filePath) {
    return function (cb) {
        fs.readFile(filePath, cb);
    }
};

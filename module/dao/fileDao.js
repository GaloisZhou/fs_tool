"use strict";

var Dao = require('../utils/mongoDbUtils').Dao;

// console.log('config>>>>>', config);
// console.log('db >>>>>>>> ', db);
if (config) {
    console.log('init db');
    
    module.exports = new Dao(config.mongoDb.collections.file, db);
}


let _demo = {
    _id: '',

    dir: '', // 目录
    name: '', // 名字
    size: '', // 大小
    atime: '', // Access Time 最近访问时间
    mtime: '', // Modified: Time Time when file data last modified. 最后修改时间
    ctime: '', // Change Time: Time when file status was last changed (inode data modification) 最后状态修改时间
    birthtime: '', // Birth Time: Time of file creation.
    extension: '', // extension name: 扩展名
    md5: '', // 文件内容生成 md5
    md5Count: '', //

    atimeStr: '',
    mtimeStr: '',
    ctimeStr: '',
    birthtimeStr: '',

    image: {
        width: '',
        height: '',
    },

    update_timestamp: '',
};

// 如果文件被复制粘贴了,  mtime 就是最老的时间
// 例如 手机中的照片被拷贝到电脑上,就只能依照 mtime 来判断照片时间,因为照片一直没有修改,所以相对来说 mtime 和最初的时间最接近
// 其他时间都是拷贝时间(or 更靠后了)

// db.admin_user.insert({ username: 'galois', password: 'galois' });
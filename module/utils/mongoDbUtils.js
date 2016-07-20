"use strict";

let mongodb = require('mongodb'),
    MongoClient = mongodb.MongoClient,
    Collection = mongodb.Collection,
    ObjectId = mongodb.ObjectID;

/**
 * 初始化数据库
 * @param mongoDbConfig
 mongoDbConfig = {
   host: '',
   port: 27017,
   db: '',
   username: '',
   7: ''
 }
 * @returns db
 */
function _init(mongoDbConfig) {
    return function (cb) {
        var db;
        let mongoDbUrl = 'mongodb://' + mongoDbConfig.host + ':' + mongoDbConfig.port + '/' + mongoDbConfig.db;
        console.log(mongoDbUrl);
        MongoClient.connect(mongoDbUrl, function (err, dbClient) {
            db = dbClient;
            console.log('|----------------- connect mongoDb ------ mongoDbUrl ------------------|');
            console.log(mongoDbUrl);
            let username = mongoDbConfig.username;
            let password = mongoDbConfig.password;
            if (username && password) {
                db.authenticate(username, password, function (err, result) {
                    console.log('=============== mongodb authenticate result =====================');
                    console.log(err);
                    console.log(result);

                    if (result) {
                        cb && cb(null, db);
                    } else {
                        cb && cb('MongoError: authenticate error');
                    }
                });
            } else {
                cb && cb(null, db);
            }
        });
    }
};

class Dao {
    constructor(collectionName, db) {
        this.collectionName = collectionName;
        this.db = db;
        this.c;
    }


    get collection() {
        if (!this.c && this.db) {
            this.c = this.db.collection(this.collectionName);
        }
        return this.c
    }

    _id(id) {
        return id && typeof id === 'string' ? ObjectId(id) : id;
    }

    /**
     * find
     *
     * @param query
     * @param sort
     * @param skip
     * @param limit
     * @returns {Function}
     */
    find(query, sort, skip, limit, fields) {
        let c = this.collection;
        return function (cb) {
            let cursor = c.find(query || {}, fields || {});
            sort ? cursor.sort(sort) : '';
            skip || skip === 0 ? cursor.skip(parseInt(skip) || 0) : '';
            limit ? cursor.limit(limit) : '';
            cursor.toArray(cb);
        };
    }

    /**
     * findOne
     *
     * @param options
     * @param options
     options = {
        sort: {},
        fields: {},
        skip: {},
    }
     * @returns {Function}
     */


    findOne(query, options) {
        let c = this.collection;
        return function (cb) {
            c.findOne(query || {}, options || {}, cb);
        }
    }

    /**
     * insert
     *
     * @param docs
     * @param options
     options = {
       w: -1/0/1/2+,
       wtimeout: ,
     }
     * @returns {Function}
     {
        result: { ok: 1, n: 1 },
        ops: [ { projectId: '56d8eedba3f3caae03e0286d',
            attachmentIds: [],
            status: 'not_start',
            version: 'v1.0',
            moduleId: '56d8eedba3f3caae03e0286b',
            type: 'test',
            priority: 'critical',
            name: '3123',
            creatorId: '56d8e84b361ea61c0395ab4f',
            evaluateHour: 0,
            actualHour: 0,
            remainderHour: 0,
            create_timestamp: 1461824671984,
            update_timestamp: 1461824671984,
            _id: 5721ac9f80d784ca09020197 } ],
        insertedCount: 1,
        insertedIds: [ 5721ac9f80d784ca09020197 ] }

     { ok: true, insertedIds: [ 577a23089a805a83261df438 ] }
     */
    insert(docs, options) {
        let c = this.collection;
        return function (cb) {
            if (docs) {
                options = options ? options : {w: 1};
                options.w || options === 0 ? '' : options.w = 1;

                if (docs instanceof Array) {
                    for (var i in docs) {
                        docs[i].create_timestamp = Date.now();
                        docs[i].update_timestamp = Date.now();
                    }
                    c.insert(docs, options, function (err, result) {
                        let _isOk = result && result.result && result.result.ok;
                        _isOk = _isOk == 1 ? true : false;
                        let _insertedIds = result && result.insertedIds || [];
                        cb && cb(err, {ok: _isOk, insertedIds: _insertedIds});
                    });
                } else {
                    docs.create_timestamp = Date.now();
                    docs.update_timestamp = Date.now();
                    c.insert(docs, options, function (err, result) {
                        let _isOk = result && result.result && result.result.ok;
                        _isOk = _isOk == 1 ? true : false;
                        let _insertedIds = result && result.insertedIds || [];
                        cb && cb(err, {ok: _isOk, insertedIds: _insertedIds});
                    });
                }
            } else {
                cb('docs is null');
            }
        }
    }

    /**
     * remove
     *
     * @param selector
     * @param options
     options = {
       w: -1/0/1/2+,
       wtimeout: ,
     }
     * @returns {Function}
     */
    remove(filter, options) {
        let c = this.collection;
        return function (cb) {
            options = options ? options : {w: 1};
            options.w || options === 0 ? '' : options.w = 1;
            c.remove(filter || {}, options, function (err, result) {
                if (result && result.result && result.result.ok) {
                    cb && cb(null, true);
                } else {
                    cb && cb(err, false);
                }
            });
        }
    }

    /**
     * updateOne
     *
     * @param filter
     * @param doc
     * @param options
     options = {
       upsert: false, // true: 如果有满足条件的就更新， 没有就插入
       w: -1/0/1/2+,
       wtimeout: , // milliseconds
     }
     * @returns {Function}
     */
    updateOne(filter, doc, options) {
        let c = this.collection;
        return function (cb) {
            cb = cb ? cb : function () {
            };
            if (doc) {
                delete doc['_id'];
                //doc.create_timestamp = doc.create_timestamp ? doc.create_timestamp : Date.now();
                doc.update_timestamp = Date.now();

                options = options ? options : {w: 1};
                options.w || options === 0 ? '' : options.w = 1;
                options.multi = false;

                c.update(filter || {}, {$set: doc}, options, function (err, result) {
                    if (result && result.result && result.result.ok) {
                        cb && cb(null, true);
                    } else {
                        cb && cb(err, false);
                    }
                });
            } else {
                console.log('update object is null');
                cb && cb('update object is null');
            }
        }
    }

    /**
     * updateMany
     *
     * @param filter
     * @param doc
     * @param options
     options = {
       upsert: false, // true: 如果有满足条件的就更新， 没有就插入
       w: -1/0/1/2+,
       wtimeout: ,
     }
     * @returns {Function}
     */
    updateMany(filter, doc, options) {
        let c = this.collection;
        return function (cb) {
            cb = cb ? cb : function () {
            };
            if (doc) {
                delete doc['_id'];
                //doc.create_timestamp = doc.create_timestamp ? doc.create_timestamp : Date.now();
                doc.update_timestamp = Date.now();

                options = options ? options : {w: 1};
                options.w || options === 0 ? '' : options.w = 1;
                options.multi = true;

                c.update(filter || {}, {$set: doc}, options, function (err, result) {
                    if (result && result.result && result.result.ok) {
                        cb && cb(null, true);
                    } else {
                        cb && cb(err, false);
                    }
                });
            } else {
                console.log('update object is null');
                cb && cb('update object is null');
            }
        };
    }

    /**
     * 手动处理update 对象, 需要手动添加 $set, $inc ...
     * @param filter
     * @param docs
     * @param options
     options = {
       upsert: false, // true: 如果有满足条件的就更新， 没有就插入
       multi: false, // true 更新所有匹配的
       w: -1/0/1/2+,
       wtimeout: ,
     }
     * @returns {Function}
     */
    updateManual(filter, docs, options) {
        let c = this.collection;
        return function (cb) {
            cb = cb || function () {
                };
            if (docs) {
                options = options ? options : {w: 1};
                options.w || options === 0 ? '' : options.w = 1;

                if (docs instanceof Array) {
                    for (var i in docs) {
                        delete docs[i]['_id'];
                        docs[i].update_timestamp = Date.now()
                    }
                    options.multi = true;
                    c.update(filter || {}, docs, options, function (err, result) {
                        if (result && result.result && result.result.ok) {
                            cb && cb(null, true);
                        } else {
                            cb && cb(err, false);
                        }
                    })
                } else {
                    delete docs['_id'];
                    c.update(filter || {}, docs, options, function (err, result) {
                        if (result && result.result && result.result.ok) {
                            cb && cb(null, true);
                        } else {
                            cb && cb(err, false);
                        }
                    })
                }
            } else {
                cb && cb('update object is null');
            }
        }
    }

    /**
     * count
     *
     * @param query
     * @returns {Function}
     */
    count(query) {
        let c = this.collection;
        return function (cb) {
            c.count(query || {}, {}, cb);
        }
    }

    /**
     * distinct
     *
     * @param key
     * @param query
     * @returns {*}
     */
    distinct(key, query) {
        let c = this.collection;
        return function (cb) {
            c.distinct(key, query || {}, cb)
        }
    }

}
;


module.exports.init = _init;
module.exports.Dao = Dao;

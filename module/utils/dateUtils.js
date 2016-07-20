"use strict";

var util = {};

module.exports = util;

util.oneSecond = 1000;
util.oneMinute = util.oneSecond * 60;
util.oneHour = util.oneMinute * 60;
util.oneDay = util.oneHour * 24;

util.weekName = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
util.weekNameSundayFirst = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

util.todayTimestamp = function () {
    return new Date(util.dateFormat(new Date(), 'yyyy-MM-dd 00:00:00')).getTime();
};

/**
 *
 * @param date
 * @param formatStr
 * @returns {XML|string|*}
 */
util.dateFormat = function (date, formatStr) {
    formatStr = formatStr.replace('yyyy', date.getFullYear());
    formatStr = formatStr.replace('yy', util.twoNumStr(date.getYear()));
    formatStr = formatStr.replace('MM', util.twoNumStr(date.getMonth() + 1));
    formatStr = formatStr.replace('dd', util.twoNumStr(date.getDate()));
    formatStr = formatStr.replace('hh', util.twoNumStr(date.getHours()));
    formatStr = formatStr.replace('mm', util.twoNumStr(date.getMinutes()));
    formatStr = formatStr.replace('ss', util.twoNumStr(date.getSeconds()));
    formatStr = formatStr.replace('sm', date.getMilliseconds());
    return formatStr;
};


/*
 'dd天hh小时mm分钟ss秒ms毫秒'
 */
/**
 * 毫秒数转换成其他单位
 * @param ms
 * @param formatStr
 * @returns {XML|string|*}
 */
util.formatTime = function (ms, formatStr) {
    let day = Math.floor(ms / (1000 * 60 * 60 * 24));
    let hour = Math.floor(ms / (1000 * 60 * 60)) % 24;
    let minute = Math.floor(ms / (1000 * 60)) % 60;
    let second = Math.floor(ms / 1000) % 60;
    let millisecond = ms % 1000;
    formatStr = formatStr.replace('dd', day);
    formatStr = formatStr.replace('hh', hour);
    formatStr = formatStr.replace('mm', minute);
    formatStr = formatStr.replace('ss', second);
    formatStr = formatStr.replace('ms', millisecond);
    return formatStr;
};

/**
 *
 * @param timestamp
 * @returns {number}
 */
util.dayInWeek = function (timestamp) {
    let _date = new Date(timestamp);
    return _date.getDay() === 0 ? 7 : _date.getDay();
};

/**
 *
 * @param timestamp
 * @returns {Date}
 */
util.firstDayInMonth = function (timestamp) {
    return new Date(util.dateFormat(new Date(timestamp), 'yyyy-MM-01 00:00:00'));
};

/**
 *
 * @param timestamp
 * @returns {Date}
 */
util.lastDayInMonth = function (timestamp) {
    let _date = new Date(timestamp);
    let _month = util.dayLengthInMonth(_date.getFullYear(), _date.getMonth() + 1);
    return new Date(util.dateFormat(new Date(timestamp), 'yyyy-MM-' + _month + ' 00:00:00'));
};

util.dayLengthInMonth = function (year, month) {
    let _months = {
        1: 31,
        2: 28,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31
    };
    if (month === 2) {
        if (year % 400 === 0 || (year % 100 != 0 && year % 4 == 0)) {
            return 29;
        } else {
            return 28;
        }
    } else {
        return _months[month];
    }
};

util.toLogString = function (timestamp) {
    return util.dateFormat(new Date(timestamp), 'yyyy-MM-dd hh:mm:ss');
};

util.twoNumStr = function (num) {
    return num < 10 ? '0' + num : num;
};



'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var doc = window.document;
var dEl = doc.documentElement;
// 定义 viewport 的 meta
var mEl = doc.querySelector('meta[name="viewport"]');
// 指定 flexible 的 meta
var fEl = doc.querySelector('meta[name="flexible"]');
// 像素比 Device Pixel Ratio
var dpr = 0;
// 缩放比例
var scale = 0;
// 计时器
var tid;
/**提供给外部的调用对象 */
var flexible = {};
function log(msg) {
    console.log("%c[Flexible]", "color: cyan;", msg);
}
/**缓存宽度标记 */
var Stigma = "";
var WINDOW_WIDTH_KEY = "WINDOW_WIDTH";
/**
 * 生成当前项目的特征 key
 * @param key 标识
 */
function buildStigma(key, raw) {
    Stigma = "FLEXIBLE_" + (raw ? key : typeof (window.btoa) === "function" ? btoa(key) : key) + "_" + WINDOW_WIDTH_KEY;
}
/**设置 meta */
function setMetaAttr() {
    if (mEl) {
        log("将根据设置了 viewport 的 meta 标签来设置缩放比例");
        var match = mEl.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
        if (match) {
            scale = parseFloat(match[1]);
            dpr = parseInt(String(1 / scale), 10);
        }
    }
    else if (fEl) {
        log("将根据设置了 flexible 的 meta 标签来设置缩放比例");
        var content = fEl.getAttribute("content");
        if (content) {
            var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
            var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
            if (initialDpr) {
                dpr = parseFloat(initialDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));
            }
            if (maximumDpr) {
                dpr = parseFloat(maximumDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));
            }
        }
    }
    if (!dpr && !scale) {
        var isIPhone = window.navigator.appVersion.match(/iphone/gi);
        var devicePixelRatio = window.devicePixelRatio;
        if (isIPhone) {
            // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
            if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
                dpr = 3;
            }
            else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
                dpr = 2;
            }
            else {
                dpr = 1;
            }
        }
        else {
            // 其他设备下，仍旧使用1倍的方案
            dpr = 1;
        }
        scale = 1 / dpr;
    }
    dEl.setAttribute("data-dpr", String(dpr));
    if (!mEl) {
        mEl = doc.createElement("meta");
        mEl.setAttribute("name", "viewport");
        mEl.setAttribute("content", ("initial-scale=" + scale + ", maximum-scale=" + scale + ", minimum-scale=" + scale + ", user-scalable=no"));
        if (dEl.firstElementChild) {
            dEl.firstElementChild.appendChild(mEl);
        }
        else {
            var wrap = doc.createElement("div");
            wrap.appendChild(mEl);
            doc.write(wrap.innerHTML);
        }
    }
}
/**更新页面字体大小 */
function refreshRem() {
    var width = dEl.getBoundingClientRect().width;
    if (localStorage) {
        if (width) {
            localStorage.setItem(Stigma, String(width));
        }
        else {
            width = Number(localStorage.getItem(Stigma));
        }
    }
    if (width / dpr > 540) {
        width = 540 * dpr;
    }
    var rem = width / 10;
    dEl.style.fontSize = rem + "px";
    //某些安卓机会对设置的 font-size 自动乘以一个系数导致页面偏大
    var effectSize = parseFloat(getComputedStyle(dEl).fontSize);
    if (effectSize != rem) {
        dEl.style.fontSize = (rem * rem / effectSize) + "px";
    }
    flexible.rem = rem;
}
/**设置相关事件监听逻辑 */
function setEventListener() {
    window.addEventListener("resize", function () {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
    }, false);
    window.addEventListener("pageshow", function (e) {
        if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);
    if (doc.readyState === "complete") {
        doc.body.style.fontSize = (12 * dpr) + "px";
    }
    else {
        doc.addEventListener("DOMContentLoaded", function () {
            doc.body.style.fontSize = (12 * dpr) + "px";
        }, false);
    }
}
/**
 * 初始化
 * @param s 项目标识，用于防止同域下的项目互相覆盖
 * @param raw 是否将标识直接用于生成模块特征
 */
function init(s, raw) {
    if ( raw === void 0 ) raw = false;
    buildStigma(s || window.location.host, raw);
    setMetaAttr();
    setEventListener();
    refreshRem();
    /**更新对外调用对象 */
    flexible.dpr = dpr;
    flexible.refreshRem = refreshRem;
    flexible.rem2px = function (d) {
        var val = parseFloat(d) * this.rem;
        if (typeof d === "string" && d.match(/rem$/)) {
            val += "px";
        }
        return val;
    };
    flexible.px2rem = function (d) {
        var val = parseFloat(d) / this.rem;
        if (typeof d === "string" && d.match(/px$/)) {
            val += "rem";
        }
        return val;
    };
}

exports.default = init;
exports.flexible = flexible;
//# sourceMappingURL=index.js.map

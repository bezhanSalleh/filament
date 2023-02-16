function noop() {}
var uid = (function () {
    let id = 0
    return function () {
        return id++
    }
})()
function isNullOrUndef(value) {
    return value === null || typeof value == 'undefined'
}
function isArray(value) {
    if (Array.isArray && Array.isArray(value)) return !0
    let type = Object.prototype.toString.call(value)
    return type.slice(0, 7) === '[object' && type.slice(-6) === 'Array]'
}
function isObject(value) {
    return (
        value !== null &&
        Object.prototype.toString.call(value) === '[object Object]'
    )
}
var isNumberFinite = (value) =>
    (typeof value == 'number' || value instanceof Number) && isFinite(+value)
function finiteOrDefault(value, defaultValue) {
    return isNumberFinite(value) ? value : defaultValue
}
function valueOrDefault(value, defaultValue) {
    return typeof value == 'undefined' ? defaultValue : value
}
var toPercentage = (value, dimension) =>
        typeof value == 'string' && value.endsWith('%')
            ? parseFloat(value) / 100
            : value / dimension,
    toDimension = (value, dimension) =>
        typeof value == 'string' && value.endsWith('%')
            ? (parseFloat(value) / 100) * dimension
            : +value
function callback(fn, args, thisArg) {
    if (fn && typeof fn.call == 'function') return fn.apply(thisArg, args)
}
function each(loopable, fn, thisArg, reverse) {
    let i, len, keys
    if (isArray(loopable))
        if (((len = loopable.length), reverse))
            for (i = len - 1; i >= 0; i--) fn.call(thisArg, loopable[i], i)
        else for (i = 0; i < len; i++) fn.call(thisArg, loopable[i], i)
    else if (isObject(loopable))
        for (
            keys = Object.keys(loopable), len = keys.length, i = 0;
            i < len;
            i++
        )
            fn.call(thisArg, loopable[keys[i]], keys[i])
}
function _elementsEqual(a0, a1) {
    let i, ilen, v0, v1
    if (!a0 || !a1 || a0.length !== a1.length) return !1
    for (i = 0, ilen = a0.length; i < ilen; ++i)
        if (
            ((v0 = a0[i]),
            (v1 = a1[i]),
            v0.datasetIndex !== v1.datasetIndex || v0.index !== v1.index)
        )
            return !1
    return !0
}
function clone$1(source) {
    if (isArray(source)) return source.map(clone$1)
    if (isObject(source)) {
        let target = Object.create(null),
            keys = Object.keys(source),
            klen = keys.length,
            k = 0
        for (; k < klen; ++k) target[keys[k]] = clone$1(source[keys[k]])
        return target
    }
    return source
}
function isValidKey(key) {
    return ['__proto__', 'prototype', 'constructor'].indexOf(key) === -1
}
function _merger(key, target, source, options) {
    if (!isValidKey(key)) return
    let tval = target[key],
        sval = source[key]
    isObject(tval) && isObject(sval)
        ? merge(tval, sval, options)
        : (target[key] = clone$1(sval))
}
function merge(target, source, options) {
    let sources = isArray(source) ? source : [source],
        ilen = sources.length
    if (!isObject(target)) return target
    options = options || {}
    let merger = options.merger || _merger
    for (let i = 0; i < ilen; ++i) {
        if (((source = sources[i]), !isObject(source))) continue
        let keys = Object.keys(source)
        for (let k = 0, klen = keys.length; k < klen; ++k)
            merger(keys[k], target, source, options)
    }
    return target
}
function mergeIf(target, source) {
    return merge(target, source, { merger: _mergerIf })
}
function _mergerIf(key, target, source) {
    if (!isValidKey(key)) return
    let tval = target[key],
        sval = source[key]
    isObject(tval) && isObject(sval)
        ? mergeIf(tval, sval)
        : Object.prototype.hasOwnProperty.call(target, key) ||
          (target[key] = clone$1(sval))
}
var keyResolvers = { '': (v) => v, x: (o) => o.x, y: (o) => o.y }
function resolveObjectKey(obj, key) {
    return (keyResolvers[key] || (keyResolvers[key] = _getKeyResolver(key)))(
        obj,
    )
}
function _getKeyResolver(key) {
    let keys = _splitKey(key)
    return (obj) => {
        for (let k of keys) {
            if (k === '') break
            obj = obj && obj[k]
        }
        return obj
    }
}
function _splitKey(key) {
    let parts = key.split('.'),
        keys = [],
        tmp = ''
    for (let part of parts)
        (tmp += part),
            tmp.endsWith('\\')
                ? (tmp = tmp.slice(0, -1) + '.')
                : (keys.push(tmp), (tmp = ''))
    return keys
}
function _capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}
var defined = (value) => typeof value != 'undefined',
    isFunction = (value) => typeof value == 'function',
    setsEqual = (a, b) => {
        if (a.size !== b.size) return !1
        for (let item of a) if (!b.has(item)) return !1
        return !0
    }
function _isClickEvent(e) {
    return (
        e.type === 'mouseup' || e.type === 'click' || e.type === 'contextmenu'
    )
}
var PI = Math.PI,
    TAU = 2 * PI,
    PITAU = TAU + PI,
    INFINITY = Number.POSITIVE_INFINITY,
    RAD_PER_DEG = PI / 180,
    HALF_PI = PI / 2,
    QUARTER_PI = PI / 4,
    TWO_THIRDS_PI = (PI * 2) / 3,
    log10 = Math.log10,
    sign = Math.sign
function niceNum(range) {
    let roundedRange = Math.round(range)
    range = almostEquals(range, roundedRange, range / 1e3)
        ? roundedRange
        : range
    let niceRange = Math.pow(10, Math.floor(log10(range))),
        fraction = range / niceRange
    return (
        (fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10) *
        niceRange
    )
}
function _factorize(value) {
    let result = [],
        sqrt = Math.sqrt(value),
        i
    for (i = 1; i < sqrt; i++)
        value % i == 0 && (result.push(i), result.push(value / i))
    return (
        sqrt === (sqrt | 0) && result.push(sqrt),
        result.sort((a, b) => a - b).pop(),
        result
    )
}
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n)
}
function almostEquals(x, y, epsilon) {
    return Math.abs(x - y) < epsilon
}
function almostWhole(x, epsilon) {
    let rounded = Math.round(x)
    return rounded - epsilon <= x && rounded + epsilon >= x
}
function _setMinAndMaxByKey(array, target, property) {
    let i, ilen, value
    for (i = 0, ilen = array.length; i < ilen; i++)
        (value = array[i][property]),
            isNaN(value) ||
                ((target.min = Math.min(target.min, value)),
                (target.max = Math.max(target.max, value)))
}
function toRadians(degrees) {
    return degrees * (PI / 180)
}
function toDegrees(radians) {
    return radians * (180 / PI)
}
function _decimalPlaces(x) {
    if (!isNumberFinite(x)) return
    let e = 1,
        p = 0
    for (; Math.round(x * e) / e !== x; ) (e *= 10), p++
    return p
}
function getAngleFromPoint(centrePoint, anglePoint) {
    let distanceFromXCenter = anglePoint.x - centrePoint.x,
        distanceFromYCenter = anglePoint.y - centrePoint.y,
        radialDistanceFromCenter = Math.sqrt(
            distanceFromXCenter * distanceFromXCenter +
                distanceFromYCenter * distanceFromYCenter,
        ),
        angle = Math.atan2(distanceFromYCenter, distanceFromXCenter)
    return (
        angle < -0.5 * PI && (angle += TAU),
        { angle, distance: radialDistanceFromCenter }
    )
}
function distanceBetweenPoints(pt1, pt2) {
    return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2))
}
function _angleDiff(a, b) {
    return ((a - b + PITAU) % TAU) - PI
}
function _normalizeAngle(a) {
    return ((a % TAU) + TAU) % TAU
}
function _angleBetween(angle, start, end, sameAngleIsFullCircle) {
    let a = _normalizeAngle(angle),
        s = _normalizeAngle(start),
        e = _normalizeAngle(end),
        angleToStart = _normalizeAngle(s - a),
        angleToEnd = _normalizeAngle(e - a),
        startToAngle = _normalizeAngle(a - s),
        endToAngle = _normalizeAngle(a - e)
    return (
        a === s ||
        a === e ||
        (sameAngleIsFullCircle && s === e) ||
        (angleToStart > angleToEnd && startToAngle < endToAngle)
    )
}
function _limitValue(value, min, max) {
    return Math.max(min, Math.min(max, value))
}
function _int16Range(value) {
    return _limitValue(value, -32768, 32767)
}
function _isBetween(value, start, end, epsilon = 1e-6) {
    return (
        value >= Math.min(start, end) - epsilon &&
        value <= Math.max(start, end) + epsilon
    )
}
function _lookup(table, value, cmp) {
    cmp = cmp || ((index2) => table[index2] < value)
    let hi = table.length - 1,
        lo = 0,
        mid
    for (; hi - lo > 1; )
        (mid = (lo + hi) >> 1), cmp(mid) ? (lo = mid) : (hi = mid)
    return { lo, hi }
}
var _lookupByKey = (table, key, value, last) =>
        _lookup(
            table,
            value,
            last
                ? (index2) => table[index2][key] <= value
                : (index2) => table[index2][key] < value,
        ),
    _rlookupByKey = (table, key, value) =>
        _lookup(table, value, (index2) => table[index2][key] >= value)
function _filterBetween(values, min, max) {
    let start = 0,
        end = values.length
    for (; start < end && values[start] < min; ) start++
    for (; end > start && values[end - 1] > max; ) end--
    return start > 0 || end < values.length ? values.slice(start, end) : values
}
var arrayEvents = ['push', 'pop', 'shift', 'splice', 'unshift']
function listenArrayEvents(array, listener) {
    if (array._chartjs) {
        array._chartjs.listeners.push(listener)
        return
    }
    Object.defineProperty(array, '_chartjs', {
        configurable: !0,
        enumerable: !1,
        value: { listeners: [listener] },
    }),
        arrayEvents.forEach((key) => {
            let method = '_onData' + _capitalize(key),
                base = array[key]
            Object.defineProperty(array, key, {
                configurable: !0,
                enumerable: !1,
                value(...args) {
                    let res = base.apply(this, args)
                    return (
                        array._chartjs.listeners.forEach((object) => {
                            typeof object[method] == 'function' &&
                                object[method](...args)
                        }),
                        res
                    )
                },
            })
        })
}
function unlistenArrayEvents(array, listener) {
    let stub = array._chartjs
    if (!stub) return
    let listeners = stub.listeners,
        index2 = listeners.indexOf(listener)
    index2 !== -1 && listeners.splice(index2, 1),
        !(listeners.length > 0) &&
            (arrayEvents.forEach((key) => {
                delete array[key]
            }),
            delete array._chartjs)
}
function _arrayUnique(items) {
    let set2 = new Set(),
        i,
        ilen
    for (i = 0, ilen = items.length; i < ilen; ++i) set2.add(items[i])
    return set2.size === ilen ? items : Array.from(set2)
}
var requestAnimFrame = (function () {
    return typeof window == 'undefined'
        ? function (callback2) {
              return callback2()
          }
        : window.requestAnimationFrame
})()
function throttled(fn, thisArg, updateFn) {
    let updateArgs = updateFn || ((args2) => Array.prototype.slice.call(args2)),
        ticking = !1,
        args = []
    return function (...rest) {
        ;(args = updateArgs(rest)),
            ticking ||
                ((ticking = !0),
                requestAnimFrame.call(window, () => {
                    ;(ticking = !1), fn.apply(thisArg, args)
                }))
    }
}
function debounce(fn, delay) {
    let timeout
    return function (...args) {
        return (
            delay
                ? (clearTimeout(timeout),
                  (timeout = setTimeout(fn, delay, args)))
                : fn.apply(this, args),
            delay
        )
    }
}
var _toLeftRightCenter = (align) =>
        align === 'start' ? 'left' : align === 'end' ? 'right' : 'center',
    _alignStartEnd = (align, start, end) =>
        align === 'start' ? start : align === 'end' ? end : (start + end) / 2,
    _textX = (align, left, right, rtl) =>
        align === (rtl ? 'left' : 'right')
            ? right
            : align === 'center'
            ? (left + right) / 2
            : left
function _getStartAndCountOfVisiblePoints(meta, points, animationsDisabled) {
    let pointCount = points.length,
        start = 0,
        count = pointCount
    if (meta._sorted) {
        let { iScale, _parsed } = meta,
            axis = iScale.axis,
            { min, max, minDefined, maxDefined } = iScale.getUserBounds()
        minDefined &&
            (start = _limitValue(
                Math.min(
                    _lookupByKey(_parsed, iScale.axis, min).lo,
                    animationsDisabled
                        ? pointCount
                        : _lookupByKey(
                              points,
                              axis,
                              iScale.getPixelForValue(min),
                          ).lo,
                ),
                0,
                pointCount - 1,
            )),
            maxDefined
                ? (count =
                      _limitValue(
                          Math.max(
                              _lookupByKey(_parsed, iScale.axis, max, !0).hi +
                                  1,
                              animationsDisabled
                                  ? 0
                                  : _lookupByKey(
                                        points,
                                        axis,
                                        iScale.getPixelForValue(max),
                                        !0,
                                    ).hi + 1,
                          ),
                          start,
                          pointCount,
                      ) - start)
                : (count = pointCount - start)
    }
    return { start, count }
}
function _scaleRangesChanged(meta) {
    let { xScale, yScale, _scaleRanges } = meta,
        newRanges = {
            xmin: xScale.min,
            xmax: xScale.max,
            ymin: yScale.min,
            ymax: yScale.max,
        }
    if (!_scaleRanges) return (meta._scaleRanges = newRanges), !0
    let changed =
        _scaleRanges.xmin !== xScale.min ||
        _scaleRanges.xmax !== xScale.max ||
        _scaleRanges.ymin !== yScale.min ||
        _scaleRanges.ymax !== yScale.max
    return Object.assign(_scaleRanges, newRanges), changed
}
var atEdge = (t) => t === 0 || t === 1,
    elasticIn = (t, s, p) =>
        -(Math.pow(2, 10 * (t -= 1)) * Math.sin(((t - s) * TAU) / p)),
    elasticOut = (t, s, p) =>
        Math.pow(2, -10 * t) * Math.sin(((t - s) * TAU) / p) + 1,
    effects = {
        linear: (t) => t,
        easeInQuad: (t) => t * t,
        easeOutQuad: (t) => -t * (t - 2),
        easeInOutQuad: (t) =>
            (t /= 0.5) < 1 ? 0.5 * t * t : -0.5 * (--t * (t - 2) - 1),
        easeInCubic: (t) => t * t * t,
        easeOutCubic: (t) => (t -= 1) * t * t + 1,
        easeInOutCubic: (t) =>
            (t /= 0.5) < 1 ? 0.5 * t * t * t : 0.5 * ((t -= 2) * t * t + 2),
        easeInQuart: (t) => t * t * t * t,
        easeOutQuart: (t) => -((t -= 1) * t * t * t - 1),
        easeInOutQuart: (t) =>
            (t /= 0.5) < 1
                ? 0.5 * t * t * t * t
                : -0.5 * ((t -= 2) * t * t * t - 2),
        easeInQuint: (t) => t * t * t * t * t,
        easeOutQuint: (t) => (t -= 1) * t * t * t * t + 1,
        easeInOutQuint: (t) =>
            (t /= 0.5) < 1
                ? 0.5 * t * t * t * t * t
                : 0.5 * ((t -= 2) * t * t * t * t + 2),
        easeInSine: (t) => -Math.cos(t * HALF_PI) + 1,
        easeOutSine: (t) => Math.sin(t * HALF_PI),
        easeInOutSine: (t) => -0.5 * (Math.cos(PI * t) - 1),
        easeInExpo: (t) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
        easeOutExpo: (t) => (t === 1 ? 1 : -Math.pow(2, -10 * t) + 1),
        easeInOutExpo: (t) =>
            atEdge(t)
                ? t
                : t < 0.5
                ? 0.5 * Math.pow(2, 10 * (t * 2 - 1))
                : 0.5 * (-Math.pow(2, -10 * (t * 2 - 1)) + 2),
        easeInCirc: (t) => (t >= 1 ? t : -(Math.sqrt(1 - t * t) - 1)),
        easeOutCirc: (t) => Math.sqrt(1 - (t -= 1) * t),
        easeInOutCirc: (t) =>
            (t /= 0.5) < 1
                ? -0.5 * (Math.sqrt(1 - t * t) - 1)
                : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1),
        easeInElastic: (t) => (atEdge(t) ? t : elasticIn(t, 0.075, 0.3)),
        easeOutElastic: (t) => (atEdge(t) ? t : elasticOut(t, 0.075, 0.3)),
        easeInOutElastic(t) {
            let s = 0.1125,
                p = 0.45
            return atEdge(t)
                ? t
                : t < 0.5
                ? 0.5 * elasticIn(t * 2, s, p)
                : 0.5 + 0.5 * elasticOut(t * 2 - 1, s, p)
        },
        easeInBack(t) {
            let s = 1.70158
            return t * t * ((s + 1) * t - s)
        },
        easeOutBack(t) {
            let s = 1.70158
            return (t -= 1) * t * ((s + 1) * t + s) + 1
        },
        easeInOutBack(t) {
            let s = 1.70158
            return (t /= 0.5) < 1
                ? 0.5 * (t * t * (((s *= 1.525) + 1) * t - s))
                : 0.5 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2)
        },
        easeInBounce: (t) => 1 - effects.easeOutBounce(1 - t),
        easeOutBounce(t) {
            let m = 7.5625,
                d = 2.75
            return t < 1 / d
                ? m * t * t
                : t < 2 / d
                ? m * (t -= 1.5 / d) * t + 0.75
                : t < 2.5 / d
                ? m * (t -= 2.25 / d) * t + 0.9375
                : m * (t -= 2.625 / d) * t + 0.984375
        },
        easeInOutBounce: (t) =>
            t < 0.5
                ? effects.easeInBounce(t * 2) * 0.5
                : effects.easeOutBounce(t * 2 - 1) * 0.5 + 0.5,
    }
function round(v) {
    return (v + 0.5) | 0
}
var lim = (v, l, h) => Math.max(Math.min(v, h), l)
function p2b(v) {
    return lim(round(v * 2.55), 0, 255)
}
function n2b(v) {
    return lim(round(v * 255), 0, 255)
}
function b2n(v) {
    return lim(round(v / 2.55) / 100, 0, 1)
}
function n2p(v) {
    return lim(round(v * 100), 0, 100)
}
var map$1 = {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        A: 10,
        B: 11,
        C: 12,
        D: 13,
        E: 14,
        F: 15,
        a: 10,
        b: 11,
        c: 12,
        d: 13,
        e: 14,
        f: 15,
    },
    hex = [...'0123456789ABCDEF'],
    h1 = (b) => hex[b & 15],
    h2 = (b) => hex[(b & 240) >> 4] + hex[b & 15],
    eq = (b) => (b & 240) >> 4 == (b & 15),
    isShort = (v) => eq(v.r) && eq(v.g) && eq(v.b) && eq(v.a)
function hexParse(str) {
    var len = str.length,
        ret
    return (
        str[0] === '#' &&
            (len === 4 || len === 5
                ? (ret = {
                      r: 255 & (map$1[str[1]] * 17),
                      g: 255 & (map$1[str[2]] * 17),
                      b: 255 & (map$1[str[3]] * 17),
                      a: len === 5 ? map$1[str[4]] * 17 : 255,
                  })
                : (len === 7 || len === 9) &&
                  (ret = {
                      r: (map$1[str[1]] << 4) | map$1[str[2]],
                      g: (map$1[str[3]] << 4) | map$1[str[4]],
                      b: (map$1[str[5]] << 4) | map$1[str[6]],
                      a: len === 9 ? (map$1[str[7]] << 4) | map$1[str[8]] : 255,
                  })),
        ret
    )
}
var alpha = (a, f) => (a < 255 ? f(a) : '')
function hexString(v) {
    var f = isShort(v) ? h1 : h2
    return v ? '#' + f(v.r) + f(v.g) + f(v.b) + alpha(v.a, f) : void 0
}
var HUE_RE =
    /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/
function hsl2rgbn(h, s, l) {
    let a = s * Math.min(l, 1 - l),
        f = (n, k = (n + h / 30) % 12) =>
            l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return [f(0), f(8), f(4)]
}
function hsv2rgbn(h, s, v) {
    let f = (n, k = (n + h / 60) % 6) =>
        v - v * s * Math.max(Math.min(k, 4 - k, 1), 0)
    return [f(5), f(3), f(1)]
}
function hwb2rgbn(h, w, b) {
    let rgb = hsl2rgbn(h, 1, 0.5),
        i
    for (
        w + b > 1 && ((i = 1 / (w + b)), (w *= i), (b *= i)), i = 0;
        i < 3;
        i++
    )
        (rgb[i] *= 1 - w - b), (rgb[i] += w)
    return rgb
}
function hueValue(r, g, b, d, max) {
    return r === max
        ? (g - b) / d + (g < b ? 6 : 0)
        : g === max
        ? (b - r) / d + 2
        : (r - g) / d + 4
}
function rgb2hsl(v) {
    let range = 255,
        r = v.r / range,
        g = v.g / range,
        b = v.b / range,
        max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        l = (max + min) / 2,
        h,
        s,
        d
    return (
        max !== min &&
            ((d = max - min),
            (s = l > 0.5 ? d / (2 - max - min) : d / (max + min)),
            (h = hueValue(r, g, b, d, max)),
            (h = h * 60 + 0.5)),
        [h | 0, s || 0, l]
    )
}
function calln(f, a, b, c) {
    return (Array.isArray(a) ? f(a[0], a[1], a[2]) : f(a, b, c)).map(n2b)
}
function hsl2rgb(h, s, l) {
    return calln(hsl2rgbn, h, s, l)
}
function hwb2rgb(h, w, b) {
    return calln(hwb2rgbn, h, w, b)
}
function hsv2rgb(h, s, v) {
    return calln(hsv2rgbn, h, s, v)
}
function hue(h) {
    return ((h % 360) + 360) % 360
}
function hueParse(str) {
    let m = HUE_RE.exec(str),
        a = 255,
        v
    if (!m) return
    m[5] !== v && (a = m[6] ? p2b(+m[5]) : n2b(+m[5]))
    let h = hue(+m[2]),
        p1 = +m[3] / 100,
        p2 = +m[4] / 100
    return (
        m[1] === 'hwb'
            ? (v = hwb2rgb(h, p1, p2))
            : m[1] === 'hsv'
            ? (v = hsv2rgb(h, p1, p2))
            : (v = hsl2rgb(h, p1, p2)),
        { r: v[0], g: v[1], b: v[2], a }
    )
}
function rotate(v, deg) {
    var h = rgb2hsl(v)
    ;(h[0] = hue(h[0] + deg)),
        (h = hsl2rgb(h)),
        (v.r = h[0]),
        (v.g = h[1]),
        (v.b = h[2])
}
function hslString(v) {
    if (!v) return
    let a = rgb2hsl(v),
        h = a[0],
        s = n2p(a[1]),
        l = n2p(a[2])
    return v.a < 255
        ? `hsla(${h}, ${s}%, ${l}%, ${b2n(v.a)})`
        : `hsl(${h}, ${s}%, ${l}%)`
}
var map = {
        x: 'dark',
        Z: 'light',
        Y: 're',
        X: 'blu',
        W: 'gr',
        V: 'medium',
        U: 'slate',
        A: 'ee',
        T: 'ol',
        S: 'or',
        B: 'ra',
        C: 'lateg',
        D: 'ights',
        R: 'in',
        Q: 'turquois',
        E: 'hi',
        P: 'ro',
        O: 'al',
        N: 'le',
        M: 'de',
        L: 'yello',
        F: 'en',
        K: 'ch',
        G: 'arks',
        H: 'ea',
        I: 'ightg',
        J: 'wh',
    },
    names$1 = {
        OiceXe: 'f0f8ff',
        antiquewEte: 'faebd7',
        aqua: 'ffff',
        aquamarRe: '7fffd4',
        azuY: 'f0ffff',
        beige: 'f5f5dc',
        bisque: 'ffe4c4',
        black: '0',
        blanKedOmond: 'ffebcd',
        Xe: 'ff',
        XeviTet: '8a2be2',
        bPwn: 'a52a2a',
        burlywood: 'deb887',
        caMtXe: '5f9ea0',
        KartYuse: '7fff00',
        KocTate: 'd2691e',
        cSO: 'ff7f50',
        cSnflowerXe: '6495ed',
        cSnsilk: 'fff8dc',
        crimson: 'dc143c',
        cyan: 'ffff',
        xXe: '8b',
        xcyan: '8b8b',
        xgTMnPd: 'b8860b',
        xWay: 'a9a9a9',
        xgYF: '6400',
        xgYy: 'a9a9a9',
        xkhaki: 'bdb76b',
        xmagFta: '8b008b',
        xTivegYF: '556b2f',
        xSange: 'ff8c00',
        xScEd: '9932cc',
        xYd: '8b0000',
        xsOmon: 'e9967a',
        xsHgYF: '8fbc8f',
        xUXe: '483d8b',
        xUWay: '2f4f4f',
        xUgYy: '2f4f4f',
        xQe: 'ced1',
        xviTet: '9400d3',
        dAppRk: 'ff1493',
        dApskyXe: 'bfff',
        dimWay: '696969',
        dimgYy: '696969',
        dodgerXe: '1e90ff',
        fiYbrick: 'b22222',
        flSOwEte: 'fffaf0',
        foYstWAn: '228b22',
        fuKsia: 'ff00ff',
        gaRsbSo: 'dcdcdc',
        ghostwEte: 'f8f8ff',
        gTd: 'ffd700',
        gTMnPd: 'daa520',
        Way: '808080',
        gYF: '8000',
        gYFLw: 'adff2f',
        gYy: '808080',
        honeyMw: 'f0fff0',
        hotpRk: 'ff69b4',
        RdianYd: 'cd5c5c',
        Rdigo: '4b0082',
        ivSy: 'fffff0',
        khaki: 'f0e68c',
        lavFMr: 'e6e6fa',
        lavFMrXsh: 'fff0f5',
        lawngYF: '7cfc00',
        NmoncEffon: 'fffacd',
        ZXe: 'add8e6',
        ZcSO: 'f08080',
        Zcyan: 'e0ffff',
        ZgTMnPdLw: 'fafad2',
        ZWay: 'd3d3d3',
        ZgYF: '90ee90',
        ZgYy: 'd3d3d3',
        ZpRk: 'ffb6c1',
        ZsOmon: 'ffa07a',
        ZsHgYF: '20b2aa',
        ZskyXe: '87cefa',
        ZUWay: '778899',
        ZUgYy: '778899',
        ZstAlXe: 'b0c4de',
        ZLw: 'ffffe0',
        lime: 'ff00',
        limegYF: '32cd32',
        lRF: 'faf0e6',
        magFta: 'ff00ff',
        maPon: '800000',
        VaquamarRe: '66cdaa',
        VXe: 'cd',
        VScEd: 'ba55d3',
        VpurpN: '9370db',
        VsHgYF: '3cb371',
        VUXe: '7b68ee',
        VsprRggYF: 'fa9a',
        VQe: '48d1cc',
        VviTetYd: 'c71585',
        midnightXe: '191970',
        mRtcYam: 'f5fffa',
        mistyPse: 'ffe4e1',
        moccasR: 'ffe4b5',
        navajowEte: 'ffdead',
        navy: '80',
        Tdlace: 'fdf5e6',
        Tive: '808000',
        TivedBb: '6b8e23',
        Sange: 'ffa500',
        SangeYd: 'ff4500',
        ScEd: 'da70d6',
        pOegTMnPd: 'eee8aa',
        pOegYF: '98fb98',
        pOeQe: 'afeeee',
        pOeviTetYd: 'db7093',
        papayawEp: 'ffefd5',
        pHKpuff: 'ffdab9',
        peru: 'cd853f',
        pRk: 'ffc0cb',
        plum: 'dda0dd',
        powMrXe: 'b0e0e6',
        purpN: '800080',
        YbeccapurpN: '663399',
        Yd: 'ff0000',
        Psybrown: 'bc8f8f',
        PyOXe: '4169e1',
        saddNbPwn: '8b4513',
        sOmon: 'fa8072',
        sandybPwn: 'f4a460',
        sHgYF: '2e8b57',
        sHshell: 'fff5ee',
        siFna: 'a0522d',
        silver: 'c0c0c0',
        skyXe: '87ceeb',
        UXe: '6a5acd',
        UWay: '708090',
        UgYy: '708090',
        snow: 'fffafa',
        sprRggYF: 'ff7f',
        stAlXe: '4682b4',
        tan: 'd2b48c',
        teO: '8080',
        tEstN: 'd8bfd8',
        tomato: 'ff6347',
        Qe: '40e0d0',
        viTet: 'ee82ee',
        JHt: 'f5deb3',
        wEte: 'ffffff',
        wEtesmoke: 'f5f5f5',
        Lw: 'ffff00',
        LwgYF: '9acd32',
    }
function unpack() {
    let unpacked = {},
        keys = Object.keys(names$1),
        tkeys = Object.keys(map),
        i,
        j,
        k,
        ok,
        nk
    for (i = 0; i < keys.length; i++) {
        for (ok = nk = keys[i], j = 0; j < tkeys.length; j++)
            (k = tkeys[j]), (nk = nk.replace(k, map[k]))
        ;(k = parseInt(names$1[ok], 16)),
            (unpacked[nk] = [(k >> 16) & 255, (k >> 8) & 255, k & 255])
    }
    return unpacked
}
var names
function nameParse(str) {
    names || ((names = unpack()), (names.transparent = [0, 0, 0, 0]))
    let a = names[str.toLowerCase()]
    return a && { r: a[0], g: a[1], b: a[2], a: a.length === 4 ? a[3] : 255 }
}
var RGB_RE =
    /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/
function rgbParse(str) {
    let m = RGB_RE.exec(str),
        a = 255,
        r,
        g,
        b
    if (!!m) {
        if (m[7] !== r) {
            let v = +m[7]
            a = m[8] ? p2b(v) : lim(v * 255, 0, 255)
        }
        return (
            (r = +m[1]),
            (g = +m[3]),
            (b = +m[5]),
            (r = 255 & (m[2] ? p2b(r) : lim(r, 0, 255))),
            (g = 255 & (m[4] ? p2b(g) : lim(g, 0, 255))),
            (b = 255 & (m[6] ? p2b(b) : lim(b, 0, 255))),
            { r, g, b, a }
        )
    }
}
function rgbString(v) {
    return (
        v &&
        (v.a < 255
            ? `rgba(${v.r}, ${v.g}, ${v.b}, ${b2n(v.a)})`
            : `rgb(${v.r}, ${v.g}, ${v.b})`)
    )
}
var to = (v) =>
        v <= 0.0031308 ? v * 12.92 : Math.pow(v, 1 / 2.4) * 1.055 - 0.055,
    from = (v) =>
        v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
function interpolate(rgb1, rgb2, t) {
    let r = from(b2n(rgb1.r)),
        g = from(b2n(rgb1.g)),
        b = from(b2n(rgb1.b))
    return {
        r: n2b(to(r + t * (from(b2n(rgb2.r)) - r))),
        g: n2b(to(g + t * (from(b2n(rgb2.g)) - g))),
        b: n2b(to(b + t * (from(b2n(rgb2.b)) - b))),
        a: rgb1.a + t * (rgb2.a - rgb1.a),
    }
}
function modHSL(v, i, ratio) {
    if (v) {
        let tmp = rgb2hsl(v)
        ;(tmp[i] = Math.max(
            0,
            Math.min(tmp[i] + tmp[i] * ratio, i === 0 ? 360 : 1),
        )),
            (tmp = hsl2rgb(tmp)),
            (v.r = tmp[0]),
            (v.g = tmp[1]),
            (v.b = tmp[2])
    }
}
function clone(v, proto) {
    return v && Object.assign(proto || {}, v)
}
function fromObject(input) {
    var v = { r: 0, g: 0, b: 0, a: 255 }
    return (
        Array.isArray(input)
            ? input.length >= 3 &&
              ((v = { r: input[0], g: input[1], b: input[2], a: 255 }),
              input.length > 3 && (v.a = n2b(input[3])))
            : ((v = clone(input, { r: 0, g: 0, b: 0, a: 1 })),
              (v.a = n2b(v.a))),
        v
    )
}
function functionParse(str) {
    return str.charAt(0) === 'r' ? rgbParse(str) : hueParse(str)
}
var Color = class {
    constructor(input) {
        if (input instanceof Color) return input
        let type = typeof input,
            v
        type === 'object'
            ? (v = fromObject(input))
            : type === 'string' &&
              (v = hexParse(input) || nameParse(input) || functionParse(input)),
            (this._rgb = v),
            (this._valid = !!v)
    }
    get valid() {
        return this._valid
    }
    get rgb() {
        var v = clone(this._rgb)
        return v && (v.a = b2n(v.a)), v
    }
    set rgb(obj) {
        this._rgb = fromObject(obj)
    }
    rgbString() {
        return this._valid ? rgbString(this._rgb) : void 0
    }
    hexString() {
        return this._valid ? hexString(this._rgb) : void 0
    }
    hslString() {
        return this._valid ? hslString(this._rgb) : void 0
    }
    mix(color2, weight) {
        if (color2) {
            let c1 = this.rgb,
                c2 = color2.rgb,
                w2,
                p = weight === w2 ? 0.5 : weight,
                w = 2 * p - 1,
                a = c1.a - c2.a,
                w1 = ((w * a == -1 ? w : (w + a) / (1 + w * a)) + 1) / 2
            ;(w2 = 1 - w1),
                (c1.r = 255 & (w1 * c1.r + w2 * c2.r + 0.5)),
                (c1.g = 255 & (w1 * c1.g + w2 * c2.g + 0.5)),
                (c1.b = 255 & (w1 * c1.b + w2 * c2.b + 0.5)),
                (c1.a = p * c1.a + (1 - p) * c2.a),
                (this.rgb = c1)
        }
        return this
    }
    interpolate(color2, t) {
        return (
            color2 && (this._rgb = interpolate(this._rgb, color2._rgb, t)), this
        )
    }
    clone() {
        return new Color(this.rgb)
    }
    alpha(a) {
        return (this._rgb.a = n2b(a)), this
    }
    clearer(ratio) {
        let rgb = this._rgb
        return (rgb.a *= 1 - ratio), this
    }
    greyscale() {
        let rgb = this._rgb,
            val = round(rgb.r * 0.3 + rgb.g * 0.59 + rgb.b * 0.11)
        return (rgb.r = rgb.g = rgb.b = val), this
    }
    opaquer(ratio) {
        let rgb = this._rgb
        return (rgb.a *= 1 + ratio), this
    }
    negate() {
        let v = this._rgb
        return (v.r = 255 - v.r), (v.g = 255 - v.g), (v.b = 255 - v.b), this
    }
    lighten(ratio) {
        return modHSL(this._rgb, 2, ratio), this
    }
    darken(ratio) {
        return modHSL(this._rgb, 2, -ratio), this
    }
    saturate(ratio) {
        return modHSL(this._rgb, 1, ratio), this
    }
    desaturate(ratio) {
        return modHSL(this._rgb, 1, -ratio), this
    }
    rotate(deg) {
        return rotate(this._rgb, deg), this
    }
}
function index_esm(input) {
    return new Color(input)
}
function isPatternOrGradient(value) {
    if (value && typeof value == 'object') {
        let type = value.toString()
        return (
            type === '[object CanvasPattern]' ||
            type === '[object CanvasGradient]'
        )
    }
    return !1
}
function color(value) {
    return isPatternOrGradient(value) ? value : index_esm(value)
}
function getHoverColor(value) {
    return isPatternOrGradient(value)
        ? value
        : index_esm(value).saturate(0.5).darken(0.1).hexString()
}
var overrides = Object.create(null),
    descriptors = Object.create(null)
function getScope$1(node, key) {
    if (!key) return node
    let keys = key.split('.')
    for (let i = 0, n = keys.length; i < n; ++i) {
        let k = keys[i]
        node = node[k] || (node[k] = Object.create(null))
    }
    return node
}
function set(root, scope, values) {
    return typeof scope == 'string'
        ? merge(getScope$1(root, scope), values)
        : merge(getScope$1(root, ''), scope)
}
var Defaults = class {
        constructor(_descriptors2) {
            ;(this.animation = void 0),
                (this.backgroundColor = 'rgba(0,0,0,0.1)'),
                (this.borderColor = 'rgba(0,0,0,0.1)'),
                (this.color = '#666'),
                (this.datasets = {}),
                (this.devicePixelRatio = (context) =>
                    context.chart.platform.getDevicePixelRatio()),
                (this.elements = {}),
                (this.events = [
                    'mousemove',
                    'mouseout',
                    'click',
                    'touchstart',
                    'touchmove',
                ]),
                (this.font = {
                    family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    size: 12,
                    style: 'normal',
                    lineHeight: 1.2,
                    weight: null,
                }),
                (this.hover = {}),
                (this.hoverBackgroundColor = (ctx, options) =>
                    getHoverColor(options.backgroundColor)),
                (this.hoverBorderColor = (ctx, options) =>
                    getHoverColor(options.borderColor)),
                (this.hoverColor = (ctx, options) =>
                    getHoverColor(options.color)),
                (this.indexAxis = 'x'),
                (this.interaction = {
                    mode: 'nearest',
                    intersect: !0,
                    includeInvisible: !1,
                }),
                (this.maintainAspectRatio = !0),
                (this.onHover = null),
                (this.onClick = null),
                (this.parsing = !0),
                (this.plugins = {}),
                (this.responsive = !0),
                (this.scale = void 0),
                (this.scales = {}),
                (this.showLine = !0),
                (this.drawActiveElementsOnTop = !0),
                this.describe(_descriptors2)
        }
        set(scope, values) {
            return set(this, scope, values)
        }
        get(scope) {
            return getScope$1(this, scope)
        }
        describe(scope, values) {
            return set(descriptors, scope, values)
        }
        override(scope, values) {
            return set(overrides, scope, values)
        }
        route(scope, name, targetScope, targetName) {
            let scopeObject = getScope$1(this, scope),
                targetScopeObject = getScope$1(this, targetScope),
                privateName = '_' + name
            Object.defineProperties(scopeObject, {
                [privateName]: { value: scopeObject[name], writable: !0 },
                [name]: {
                    enumerable: !0,
                    get() {
                        let local = this[privateName],
                            target = targetScopeObject[targetName]
                        return isObject(local)
                            ? Object.assign({}, target, local)
                            : valueOrDefault(local, target)
                    },
                    set(value) {
                        this[privateName] = value
                    },
                },
            })
        }
    },
    defaults = new Defaults({
        _scriptable: (name) => !name.startsWith('on'),
        _indexable: (name) => name !== 'events',
        hover: { _fallback: 'interaction' },
        interaction: { _scriptable: !1, _indexable: !1 },
    })
function toFontString(font) {
    return !font || isNullOrUndef(font.size) || isNullOrUndef(font.family)
        ? null
        : (font.style ? font.style + ' ' : '') +
              (font.weight ? font.weight + ' ' : '') +
              font.size +
              'px ' +
              font.family
}
function _measureText(ctx, data, gc, longest, string) {
    let textWidth = data[string]
    return (
        textWidth ||
            ((textWidth = data[string] = ctx.measureText(string).width),
            gc.push(string)),
        textWidth > longest && (longest = textWidth),
        longest
    )
}
function _longestText(ctx, font, arrayOfThings, cache) {
    cache = cache || {}
    let data = (cache.data = cache.data || {}),
        gc = (cache.garbageCollect = cache.garbageCollect || [])
    cache.font !== font &&
        ((data = cache.data = {}),
        (gc = cache.garbageCollect = []),
        (cache.font = font)),
        ctx.save(),
        (ctx.font = font)
    let longest = 0,
        ilen = arrayOfThings.length,
        i,
        j,
        jlen,
        thing,
        nestedThing
    for (i = 0; i < ilen; i++)
        if (
            ((thing = arrayOfThings[i]), thing != null && isArray(thing) !== !0)
        )
            longest = _measureText(ctx, data, gc, longest, thing)
        else if (isArray(thing))
            for (j = 0, jlen = thing.length; j < jlen; j++)
                (nestedThing = thing[j]),
                    nestedThing != null &&
                        !isArray(nestedThing) &&
                        (longest = _measureText(
                            ctx,
                            data,
                            gc,
                            longest,
                            nestedThing,
                        ))
    ctx.restore()
    let gcLen = gc.length / 2
    if (gcLen > arrayOfThings.length) {
        for (i = 0; i < gcLen; i++) delete data[gc[i]]
        gc.splice(0, gcLen)
    }
    return longest
}
function _alignPixel(chart2, pixel, width) {
    let devicePixelRatio = chart2.currentDevicePixelRatio,
        halfWidth = width !== 0 ? Math.max(width / 2, 0.5) : 0
    return (
        Math.round((pixel - halfWidth) * devicePixelRatio) / devicePixelRatio +
        halfWidth
    )
}
function clearCanvas(canvas, ctx) {
    ;(ctx = ctx || canvas.getContext('2d')),
        ctx.save(),
        ctx.resetTransform(),
        ctx.clearRect(0, 0, canvas.width, canvas.height),
        ctx.restore()
}
function drawPoint(ctx, options, x, y) {
    drawPointLegend(ctx, options, x, y, null)
}
function drawPointLegend(ctx, options, x, y, w) {
    let type,
        xOffset,
        yOffset,
        size,
        cornerRadius,
        width,
        style = options.pointStyle,
        rotation = options.rotation,
        radius = options.radius,
        rad = (rotation || 0) * RAD_PER_DEG
    if (
        style &&
        typeof style == 'object' &&
        ((type = style.toString()),
        type === '[object HTMLImageElement]' ||
            type === '[object HTMLCanvasElement]')
    ) {
        ctx.save(),
            ctx.translate(x, y),
            ctx.rotate(rad),
            ctx.drawImage(
                style,
                -style.width / 2,
                -style.height / 2,
                style.width,
                style.height,
            ),
            ctx.restore()
        return
    }
    if (!(isNaN(radius) || radius <= 0)) {
        switch ((ctx.beginPath(), style)) {
            default:
                w
                    ? ctx.ellipse(x, y, w / 2, radius, 0, 0, TAU)
                    : ctx.arc(x, y, radius, 0, TAU),
                    ctx.closePath()
                break
            case 'triangle':
                ctx.moveTo(
                    x + Math.sin(rad) * radius,
                    y - Math.cos(rad) * radius,
                ),
                    (rad += TWO_THIRDS_PI),
                    ctx.lineTo(
                        x + Math.sin(rad) * radius,
                        y - Math.cos(rad) * radius,
                    ),
                    (rad += TWO_THIRDS_PI),
                    ctx.lineTo(
                        x + Math.sin(rad) * radius,
                        y - Math.cos(rad) * radius,
                    ),
                    ctx.closePath()
                break
            case 'rectRounded':
                ;(cornerRadius = radius * 0.516),
                    (size = radius - cornerRadius),
                    (xOffset = Math.cos(rad + QUARTER_PI) * size),
                    (yOffset = Math.sin(rad + QUARTER_PI) * size),
                    ctx.arc(
                        x - xOffset,
                        y - yOffset,
                        cornerRadius,
                        rad - PI,
                        rad - HALF_PI,
                    ),
                    ctx.arc(
                        x + yOffset,
                        y - xOffset,
                        cornerRadius,
                        rad - HALF_PI,
                        rad,
                    ),
                    ctx.arc(
                        x + xOffset,
                        y + yOffset,
                        cornerRadius,
                        rad,
                        rad + HALF_PI,
                    ),
                    ctx.arc(
                        x - yOffset,
                        y + xOffset,
                        cornerRadius,
                        rad + HALF_PI,
                        rad + PI,
                    ),
                    ctx.closePath()
                break
            case 'rect':
                if (!rotation) {
                    ;(size = Math.SQRT1_2 * radius),
                        (width = w ? w / 2 : size),
                        ctx.rect(x - width, y - size, 2 * width, 2 * size)
                    break
                }
                rad += QUARTER_PI
            case 'rectRot':
                ;(xOffset = Math.cos(rad) * radius),
                    (yOffset = Math.sin(rad) * radius),
                    ctx.moveTo(x - xOffset, y - yOffset),
                    ctx.lineTo(x + yOffset, y - xOffset),
                    ctx.lineTo(x + xOffset, y + yOffset),
                    ctx.lineTo(x - yOffset, y + xOffset),
                    ctx.closePath()
                break
            case 'crossRot':
                rad += QUARTER_PI
            case 'cross':
                ;(xOffset = Math.cos(rad) * radius),
                    (yOffset = Math.sin(rad) * radius),
                    ctx.moveTo(x - xOffset, y - yOffset),
                    ctx.lineTo(x + xOffset, y + yOffset),
                    ctx.moveTo(x + yOffset, y - xOffset),
                    ctx.lineTo(x - yOffset, y + xOffset)
                break
            case 'star':
                ;(xOffset = Math.cos(rad) * radius),
                    (yOffset = Math.sin(rad) * radius),
                    ctx.moveTo(x - xOffset, y - yOffset),
                    ctx.lineTo(x + xOffset, y + yOffset),
                    ctx.moveTo(x + yOffset, y - xOffset),
                    ctx.lineTo(x - yOffset, y + xOffset),
                    (rad += QUARTER_PI),
                    (xOffset = Math.cos(rad) * radius),
                    (yOffset = Math.sin(rad) * radius),
                    ctx.moveTo(x - xOffset, y - yOffset),
                    ctx.lineTo(x + xOffset, y + yOffset),
                    ctx.moveTo(x + yOffset, y - xOffset),
                    ctx.lineTo(x - yOffset, y + xOffset)
                break
            case 'line':
                ;(xOffset = w ? w / 2 : Math.cos(rad) * radius),
                    (yOffset = Math.sin(rad) * radius),
                    ctx.moveTo(x - xOffset, y - yOffset),
                    ctx.lineTo(x + xOffset, y + yOffset)
                break
            case 'dash':
                ctx.moveTo(x, y),
                    ctx.lineTo(
                        x + Math.cos(rad) * radius,
                        y + Math.sin(rad) * radius,
                    )
                break
        }
        ctx.fill(), options.borderWidth > 0 && ctx.stroke()
    }
}
function _isPointInArea(point, area, margin) {
    return (
        (margin = margin || 0.5),
        !area ||
            (point &&
                point.x > area.left - margin &&
                point.x < area.right + margin &&
                point.y > area.top - margin &&
                point.y < area.bottom + margin)
    )
}
function clipArea(ctx, area) {
    ctx.save(),
        ctx.beginPath(),
        ctx.rect(
            area.left,
            area.top,
            area.right - area.left,
            area.bottom - area.top,
        ),
        ctx.clip()
}
function unclipArea(ctx) {
    ctx.restore()
}
function _steppedLineTo(ctx, previous, target, flip, mode) {
    if (!previous) return ctx.lineTo(target.x, target.y)
    if (mode === 'middle') {
        let midpoint = (previous.x + target.x) / 2
        ctx.lineTo(midpoint, previous.y), ctx.lineTo(midpoint, target.y)
    } else
        (mode === 'after') != !!flip
            ? ctx.lineTo(previous.x, target.y)
            : ctx.lineTo(target.x, previous.y)
    ctx.lineTo(target.x, target.y)
}
function _bezierCurveTo(ctx, previous, target, flip) {
    if (!previous) return ctx.lineTo(target.x, target.y)
    ctx.bezierCurveTo(
        flip ? previous.cp1x : previous.cp2x,
        flip ? previous.cp1y : previous.cp2y,
        flip ? target.cp2x : target.cp1x,
        flip ? target.cp2y : target.cp1y,
        target.x,
        target.y,
    )
}
function renderText(ctx, text, x, y, font, opts = {}) {
    let lines = isArray(text) ? text : [text],
        stroke = opts.strokeWidth > 0 && opts.strokeColor !== '',
        i,
        line
    for (
        ctx.save(), ctx.font = font.string, setRenderOpts(ctx, opts), i = 0;
        i < lines.length;
        ++i
    )
        (line = lines[i]),
            stroke &&
                (opts.strokeColor && (ctx.strokeStyle = opts.strokeColor),
                isNullOrUndef(opts.strokeWidth) ||
                    (ctx.lineWidth = opts.strokeWidth),
                ctx.strokeText(line, x, y, opts.maxWidth)),
            ctx.fillText(line, x, y, opts.maxWidth),
            decorateText(ctx, x, y, line, opts),
            (y += font.lineHeight)
    ctx.restore()
}
function setRenderOpts(ctx, opts) {
    opts.translation && ctx.translate(opts.translation[0], opts.translation[1]),
        isNullOrUndef(opts.rotation) || ctx.rotate(opts.rotation),
        opts.color && (ctx.fillStyle = opts.color),
        opts.textAlign && (ctx.textAlign = opts.textAlign),
        opts.textBaseline && (ctx.textBaseline = opts.textBaseline)
}
function decorateText(ctx, x, y, line, opts) {
    if (opts.strikethrough || opts.underline) {
        let metrics = ctx.measureText(line),
            left = x - metrics.actualBoundingBoxLeft,
            right = x + metrics.actualBoundingBoxRight,
            top = y - metrics.actualBoundingBoxAscent,
            bottom = y + metrics.actualBoundingBoxDescent,
            yDecoration = opts.strikethrough ? (top + bottom) / 2 : bottom
        ;(ctx.strokeStyle = ctx.fillStyle),
            ctx.beginPath(),
            (ctx.lineWidth = opts.decorationWidth || 2),
            ctx.moveTo(left, yDecoration),
            ctx.lineTo(right, yDecoration),
            ctx.stroke()
    }
}
function addRoundedRectPath(ctx, rect) {
    let { x, y, w, h, radius } = rect
    ctx.arc(
        x + radius.topLeft,
        y + radius.topLeft,
        radius.topLeft,
        -HALF_PI,
        PI,
        !0,
    ),
        ctx.lineTo(x, y + h - radius.bottomLeft),
        ctx.arc(
            x + radius.bottomLeft,
            y + h - radius.bottomLeft,
            radius.bottomLeft,
            PI,
            HALF_PI,
            !0,
        ),
        ctx.lineTo(x + w - radius.bottomRight, y + h),
        ctx.arc(
            x + w - radius.bottomRight,
            y + h - radius.bottomRight,
            radius.bottomRight,
            HALF_PI,
            0,
            !0,
        ),
        ctx.lineTo(x + w, y + radius.topRight),
        ctx.arc(
            x + w - radius.topRight,
            y + radius.topRight,
            radius.topRight,
            0,
            -HALF_PI,
            !0,
        ),
        ctx.lineTo(x + radius.topLeft, y)
}
var LINE_HEIGHT = new RegExp(/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/),
    FONT_STYLE = new RegExp(
        /^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/,
    )
function toLineHeight(value, size) {
    let matches = ('' + value).match(LINE_HEIGHT)
    if (!matches || matches[1] === 'normal') return size * 1.2
    switch (((value = +matches[2]), matches[3])) {
        case 'px':
            return value
        case '%':
            value /= 100
            break
    }
    return size * value
}
var numberOrZero = (v) => +v || 0
function _readValueToProps(value, props) {
    let ret = {},
        objProps = isObject(props),
        keys = objProps ? Object.keys(props) : props,
        read = isObject(value)
            ? objProps
                ? (prop) => valueOrDefault(value[prop], value[props[prop]])
                : (prop) => value[prop]
            : () => value
    for (let prop of keys) ret[prop] = numberOrZero(read(prop))
    return ret
}
function toTRBL(value) {
    return _readValueToProps(value, {
        top: 'y',
        right: 'x',
        bottom: 'y',
        left: 'x',
    })
}
function toTRBLCorners(value) {
    return _readValueToProps(value, [
        'topLeft',
        'topRight',
        'bottomLeft',
        'bottomRight',
    ])
}
function toPadding(value) {
    let obj = toTRBL(value)
    return (
        (obj.width = obj.left + obj.right),
        (obj.height = obj.top + obj.bottom),
        obj
    )
}
function toFont(options, fallback) {
    ;(options = options || {}), (fallback = fallback || defaults.font)
    let size = valueOrDefault(options.size, fallback.size)
    typeof size == 'string' && (size = parseInt(size, 10))
    let style = valueOrDefault(options.style, fallback.style)
    style &&
        !('' + style).match(FONT_STYLE) &&
        (console.warn('Invalid font style specified: "' + style + '"'),
        (style = ''))
    let font = {
        family: valueOrDefault(options.family, fallback.family),
        lineHeight: toLineHeight(
            valueOrDefault(options.lineHeight, fallback.lineHeight),
            size,
        ),
        size,
        style,
        weight: valueOrDefault(options.weight, fallback.weight),
        string: '',
    }
    return (font.string = toFontString(font)), font
}
function resolve(inputs, context, index2, info) {
    let cacheable = !0,
        i,
        ilen,
        value
    for (i = 0, ilen = inputs.length; i < ilen; ++i)
        if (
            ((value = inputs[i]),
            value !== void 0 &&
                (context !== void 0 &&
                    typeof value == 'function' &&
                    ((value = value(context)), (cacheable = !1)),
                index2 !== void 0 &&
                    isArray(value) &&
                    ((value = value[index2 % value.length]), (cacheable = !1)),
                value !== void 0))
        )
            return info && !cacheable && (info.cacheable = !1), value
}
function _addGrace(minmax, grace, beginAtZero) {
    let { min, max } = minmax,
        change = toDimension(grace, (max - min) / 2),
        keepZero = (value, add) =>
            beginAtZero && value === 0 ? 0 : value + add
    return { min: keepZero(min, -Math.abs(change)), max: keepZero(max, change) }
}
function createContext(parentContext, context) {
    return Object.assign(Object.create(parentContext), context)
}
function _createResolver(
    scopes,
    prefixes = [''],
    rootScopes = scopes,
    fallback,
    getTarget = () => scopes[0],
) {
    defined(fallback) || (fallback = _resolve('_fallback', scopes))
    let cache = {
        [Symbol.toStringTag]: 'Object',
        _cacheable: !0,
        _scopes: scopes,
        _rootScopes: rootScopes,
        _fallback: fallback,
        _getTarget: getTarget,
        override: (scope) =>
            _createResolver([scope, ...scopes], prefixes, rootScopes, fallback),
    }
    return new Proxy(cache, {
        deleteProperty(target, prop) {
            return (
                delete target[prop],
                delete target._keys,
                delete scopes[0][prop],
                !0
            )
        },
        get(target, prop) {
            return _cached(target, prop, () =>
                _resolveWithPrefixes(prop, prefixes, scopes, target),
            )
        },
        getOwnPropertyDescriptor(target, prop) {
            return Reflect.getOwnPropertyDescriptor(target._scopes[0], prop)
        },
        getPrototypeOf() {
            return Reflect.getPrototypeOf(scopes[0])
        },
        has(target, prop) {
            return getKeysFromAllScopes(target).includes(prop)
        },
        ownKeys(target) {
            return getKeysFromAllScopes(target)
        },
        set(target, prop, value) {
            let storage = target._storage || (target._storage = getTarget())
            return (
                (target[prop] = storage[prop] = value), delete target._keys, !0
            )
        },
    })
}
function _attachContext(proxy, context, subProxy, descriptorDefaults) {
    let cache = {
        _cacheable: !1,
        _proxy: proxy,
        _context: context,
        _subProxy: subProxy,
        _stack: new Set(),
        _descriptors: _descriptors(proxy, descriptorDefaults),
        setContext: (ctx) =>
            _attachContext(proxy, ctx, subProxy, descriptorDefaults),
        override: (scope) =>
            _attachContext(
                proxy.override(scope),
                context,
                subProxy,
                descriptorDefaults,
            ),
    }
    return new Proxy(cache, {
        deleteProperty(target, prop) {
            return delete target[prop], delete proxy[prop], !0
        },
        get(target, prop, receiver) {
            return _cached(target, prop, () =>
                _resolveWithContext(target, prop, receiver),
            )
        },
        getOwnPropertyDescriptor(target, prop) {
            return target._descriptors.allKeys
                ? Reflect.has(proxy, prop)
                    ? { enumerable: !0, configurable: !0 }
                    : void 0
                : Reflect.getOwnPropertyDescriptor(proxy, prop)
        },
        getPrototypeOf() {
            return Reflect.getPrototypeOf(proxy)
        },
        has(target, prop) {
            return Reflect.has(proxy, prop)
        },
        ownKeys() {
            return Reflect.ownKeys(proxy)
        },
        set(target, prop, value) {
            return (proxy[prop] = value), delete target[prop], !0
        },
    })
}
function _descriptors(proxy, defaults2 = { scriptable: !0, indexable: !0 }) {
    let {
        _scriptable = defaults2.scriptable,
        _indexable = defaults2.indexable,
        _allKeys = defaults2.allKeys,
    } = proxy
    return {
        allKeys: _allKeys,
        scriptable: _scriptable,
        indexable: _indexable,
        isScriptable: isFunction(_scriptable) ? _scriptable : () => _scriptable,
        isIndexable: isFunction(_indexable) ? _indexable : () => _indexable,
    }
}
var readKey = (prefix, name) => (prefix ? prefix + _capitalize(name) : name),
    needsSubResolver = (prop, value) =>
        isObject(value) &&
        prop !== 'adapters' &&
        (Object.getPrototypeOf(value) === null || value.constructor === Object)
function _cached(target, prop, resolve2) {
    if (Object.prototype.hasOwnProperty.call(target, prop)) return target[prop]
    let value = resolve2()
    return (target[prop] = value), value
}
function _resolveWithContext(target, prop, receiver) {
    let { _proxy, _context, _subProxy, _descriptors: descriptors2 } = target,
        value = _proxy[prop]
    return (
        isFunction(value) &&
            descriptors2.isScriptable(prop) &&
            (value = _resolveScriptable(prop, value, target, receiver)),
        isArray(value) &&
            value.length &&
            (value = _resolveArray(
                prop,
                value,
                target,
                descriptors2.isIndexable,
            )),
        needsSubResolver(prop, value) &&
            (value = _attachContext(
                value,
                _context,
                _subProxy && _subProxy[prop],
                descriptors2,
            )),
        value
    )
}
function _resolveScriptable(prop, value, target, receiver) {
    let { _proxy, _context, _subProxy, _stack } = target
    if (_stack.has(prop))
        throw new Error(
            'Recursion detected: ' +
                Array.from(_stack).join('->') +
                '->' +
                prop,
        )
    return (
        _stack.add(prop),
        (value = value(_context, _subProxy || receiver)),
        _stack.delete(prop),
        needsSubResolver(prop, value) &&
            (value = createSubResolver(_proxy._scopes, _proxy, prop, value)),
        value
    )
}
function _resolveArray(prop, value, target, isIndexable) {
    let { _proxy, _context, _subProxy, _descriptors: descriptors2 } = target
    if (defined(_context.index) && isIndexable(prop))
        value = value[_context.index % value.length]
    else if (isObject(value[0])) {
        let arr = value,
            scopes = _proxy._scopes.filter((s) => s !== arr)
        value = []
        for (let item of arr) {
            let resolver = createSubResolver(scopes, _proxy, prop, item)
            value.push(
                _attachContext(
                    resolver,
                    _context,
                    _subProxy && _subProxy[prop],
                    descriptors2,
                ),
            )
        }
    }
    return value
}
function resolveFallback(fallback, prop, value) {
    return isFunction(fallback) ? fallback(prop, value) : fallback
}
var getScope = (key, parent) =>
    key === !0
        ? parent
        : typeof key == 'string'
        ? resolveObjectKey(parent, key)
        : void 0
function addScopes(set2, parentScopes, key, parentFallback, value) {
    for (let parent of parentScopes) {
        let scope = getScope(key, parent)
        if (scope) {
            set2.add(scope)
            let fallback = resolveFallback(scope._fallback, key, value)
            if (
                defined(fallback) &&
                fallback !== key &&
                fallback !== parentFallback
            )
                return fallback
        } else if (
            scope === !1 &&
            defined(parentFallback) &&
            key !== parentFallback
        )
            return null
    }
    return !1
}
function createSubResolver(parentScopes, resolver, prop, value) {
    let rootScopes = resolver._rootScopes,
        fallback = resolveFallback(resolver._fallback, prop, value),
        allScopes = [...parentScopes, ...rootScopes],
        set2 = new Set()
    set2.add(value)
    let key = addScopesFromKey(set2, allScopes, prop, fallback || prop, value)
    return key === null ||
        (defined(fallback) &&
            fallback !== prop &&
            ((key = addScopesFromKey(set2, allScopes, fallback, key, value)),
            key === null))
        ? !1
        : _createResolver(Array.from(set2), [''], rootScopes, fallback, () =>
              subGetTarget(resolver, prop, value),
          )
}
function addScopesFromKey(set2, allScopes, key, fallback, item) {
    for (; key; ) key = addScopes(set2, allScopes, key, fallback, item)
    return key
}
function subGetTarget(resolver, prop, value) {
    let parent = resolver._getTarget()
    prop in parent || (parent[prop] = {})
    let target = parent[prop]
    return isArray(target) && isObject(value) ? value : target
}
function _resolveWithPrefixes(prop, prefixes, scopes, proxy) {
    let value
    for (let prefix of prefixes)
        if (((value = _resolve(readKey(prefix, prop), scopes)), defined(value)))
            return needsSubResolver(prop, value)
                ? createSubResolver(scopes, proxy, prop, value)
                : value
}
function _resolve(key, scopes) {
    for (let scope of scopes) {
        if (!scope) continue
        let value = scope[key]
        if (defined(value)) return value
    }
}
function getKeysFromAllScopes(target) {
    let keys = target._keys
    return (
        keys ||
            (keys = target._keys = resolveKeysFromAllScopes(target._scopes)),
        keys
    )
}
function resolveKeysFromAllScopes(scopes) {
    let set2 = new Set()
    for (let scope of scopes)
        for (let key of Object.keys(scope).filter((k) => !k.startsWith('_')))
            set2.add(key)
    return Array.from(set2)
}
function _parseObjectDataRadialScale(meta, data, start, count) {
    let { iScale } = meta,
        { key = 'r' } = this._parsing,
        parsed = new Array(count),
        i,
        ilen,
        index2,
        item
    for (i = 0, ilen = count; i < ilen; ++i)
        (index2 = i + start),
            (item = data[index2]),
            (parsed[i] = {
                r: iScale.parse(resolveObjectKey(item, key), index2),
            })
    return parsed
}
var EPSILON = Number.EPSILON || 1e-14,
    getPoint = (points, i) => i < points.length && !points[i].skip && points[i],
    getValueAxis = (indexAxis) => (indexAxis === 'x' ? 'y' : 'x')
function splineCurve(firstPoint, middlePoint, afterPoint, t) {
    let previous = firstPoint.skip ? middlePoint : firstPoint,
        current = middlePoint,
        next = afterPoint.skip ? middlePoint : afterPoint,
        d01 = distanceBetweenPoints(current, previous),
        d12 = distanceBetweenPoints(next, current),
        s01 = d01 / (d01 + d12),
        s12 = d12 / (d01 + d12)
    ;(s01 = isNaN(s01) ? 0 : s01), (s12 = isNaN(s12) ? 0 : s12)
    let fa = t * s01,
        fb = t * s12
    return {
        previous: {
            x: current.x - fa * (next.x - previous.x),
            y: current.y - fa * (next.y - previous.y),
        },
        next: {
            x: current.x + fb * (next.x - previous.x),
            y: current.y + fb * (next.y - previous.y),
        },
    }
}
function monotoneAdjust(points, deltaK, mK) {
    let pointsLen = points.length,
        alphaK,
        betaK,
        tauK,
        squaredMagnitude,
        pointCurrent,
        pointAfter = getPoint(points, 0)
    for (let i = 0; i < pointsLen - 1; ++i)
        if (
            ((pointCurrent = pointAfter),
            (pointAfter = getPoint(points, i + 1)),
            !(!pointCurrent || !pointAfter))
        ) {
            if (almostEquals(deltaK[i], 0, EPSILON)) {
                mK[i] = mK[i + 1] = 0
                continue
            }
            ;(alphaK = mK[i] / deltaK[i]),
                (betaK = mK[i + 1] / deltaK[i]),
                (squaredMagnitude = Math.pow(alphaK, 2) + Math.pow(betaK, 2)),
                !(squaredMagnitude <= 9) &&
                    ((tauK = 3 / Math.sqrt(squaredMagnitude)),
                    (mK[i] = alphaK * tauK * deltaK[i]),
                    (mK[i + 1] = betaK * tauK * deltaK[i]))
        }
}
function monotoneCompute(points, mK, indexAxis = 'x') {
    let valueAxis = getValueAxis(indexAxis),
        pointsLen = points.length,
        delta,
        pointBefore,
        pointCurrent,
        pointAfter = getPoint(points, 0)
    for (let i = 0; i < pointsLen; ++i) {
        if (
            ((pointBefore = pointCurrent),
            (pointCurrent = pointAfter),
            (pointAfter = getPoint(points, i + 1)),
            !pointCurrent)
        )
            continue
        let iPixel = pointCurrent[indexAxis],
            vPixel = pointCurrent[valueAxis]
        pointBefore &&
            ((delta = (iPixel - pointBefore[indexAxis]) / 3),
            (pointCurrent[`cp1${indexAxis}`] = iPixel - delta),
            (pointCurrent[`cp1${valueAxis}`] = vPixel - delta * mK[i])),
            pointAfter &&
                ((delta = (pointAfter[indexAxis] - iPixel) / 3),
                (pointCurrent[`cp2${indexAxis}`] = iPixel + delta),
                (pointCurrent[`cp2${valueAxis}`] = vPixel + delta * mK[i]))
    }
}
function splineCurveMonotone(points, indexAxis = 'x') {
    let valueAxis = getValueAxis(indexAxis),
        pointsLen = points.length,
        deltaK = Array(pointsLen).fill(0),
        mK = Array(pointsLen),
        i,
        pointBefore,
        pointCurrent,
        pointAfter = getPoint(points, 0)
    for (i = 0; i < pointsLen; ++i)
        if (
            ((pointBefore = pointCurrent),
            (pointCurrent = pointAfter),
            (pointAfter = getPoint(points, i + 1)),
            !!pointCurrent)
        ) {
            if (pointAfter) {
                let slopeDelta = pointAfter[indexAxis] - pointCurrent[indexAxis]
                deltaK[i] =
                    slopeDelta !== 0
                        ? (pointAfter[valueAxis] - pointCurrent[valueAxis]) /
                          slopeDelta
                        : 0
            }
            mK[i] = pointBefore
                ? pointAfter
                    ? sign(deltaK[i - 1]) !== sign(deltaK[i])
                        ? 0
                        : (deltaK[i - 1] + deltaK[i]) / 2
                    : deltaK[i - 1]
                : deltaK[i]
        }
    monotoneAdjust(points, deltaK, mK), monotoneCompute(points, mK, indexAxis)
}
function capControlPoint(pt, min, max) {
    return Math.max(Math.min(pt, max), min)
}
function capBezierPoints(points, area) {
    let i,
        ilen,
        point,
        inArea,
        inAreaPrev,
        inAreaNext = _isPointInArea(points[0], area)
    for (i = 0, ilen = points.length; i < ilen; ++i)
        (inAreaPrev = inArea),
            (inArea = inAreaNext),
            (inAreaNext = i < ilen - 1 && _isPointInArea(points[i + 1], area)),
            !!inArea &&
                ((point = points[i]),
                inAreaPrev &&
                    ((point.cp1x = capControlPoint(
                        point.cp1x,
                        area.left,
                        area.right,
                    )),
                    (point.cp1y = capControlPoint(
                        point.cp1y,
                        area.top,
                        area.bottom,
                    ))),
                inAreaNext &&
                    ((point.cp2x = capControlPoint(
                        point.cp2x,
                        area.left,
                        area.right,
                    )),
                    (point.cp2y = capControlPoint(
                        point.cp2y,
                        area.top,
                        area.bottom,
                    ))))
}
function _updateBezierControlPoints(points, options, area, loop, indexAxis) {
    let i, ilen, point, controlPoints
    if (
        (options.spanGaps && (points = points.filter((pt) => !pt.skip)),
        options.cubicInterpolationMode === 'monotone')
    )
        splineCurveMonotone(points, indexAxis)
    else {
        let prev = loop ? points[points.length - 1] : points[0]
        for (i = 0, ilen = points.length; i < ilen; ++i)
            (point = points[i]),
                (controlPoints = splineCurve(
                    prev,
                    point,
                    points[Math.min(i + 1, ilen - (loop ? 0 : 1)) % ilen],
                    options.tension,
                )),
                (point.cp1x = controlPoints.previous.x),
                (point.cp1y = controlPoints.previous.y),
                (point.cp2x = controlPoints.next.x),
                (point.cp2y = controlPoints.next.y),
                (prev = point)
    }
    options.capBezierPoints && capBezierPoints(points, area)
}
function _isDomSupported() {
    return typeof window != 'undefined' && typeof document != 'undefined'
}
function _getParentNode(domNode) {
    let parent = domNode.parentNode
    return (
        parent &&
            parent.toString() === '[object ShadowRoot]' &&
            (parent = parent.host),
        parent
    )
}
function parseMaxStyle(styleValue, node, parentProperty) {
    let valueInPixels
    return (
        typeof styleValue == 'string'
            ? ((valueInPixels = parseInt(styleValue, 10)),
              styleValue.indexOf('%') !== -1 &&
                  (valueInPixels =
                      (valueInPixels / 100) * node.parentNode[parentProperty]))
            : (valueInPixels = styleValue),
        valueInPixels
    )
}
var getComputedStyle2 = (element) => window.getComputedStyle(element, null)
function getStyle(el, property) {
    return getComputedStyle2(el).getPropertyValue(property)
}
var positions = ['top', 'right', 'bottom', 'left']
function getPositionedStyle(styles, style, suffix) {
    let result = {}
    suffix = suffix ? '-' + suffix : ''
    for (let i = 0; i < 4; i++) {
        let pos = positions[i]
        result[pos] = parseFloat(styles[style + '-' + pos + suffix]) || 0
    }
    return (
        (result.width = result.left + result.right),
        (result.height = result.top + result.bottom),
        result
    )
}
var useOffsetPos = (x, y, target) =>
    (x > 0 || y > 0) && (!target || !target.shadowRoot)
function getCanvasPosition(e, canvas) {
    let touches = e.touches,
        source = touches && touches.length ? touches[0] : e,
        { offsetX, offsetY } = source,
        box = !1,
        x,
        y
    if (useOffsetPos(offsetX, offsetY, e.target)) (x = offsetX), (y = offsetY)
    else {
        let rect = canvas.getBoundingClientRect()
        ;(x = source.clientX - rect.left),
            (y = source.clientY - rect.top),
            (box = !0)
    }
    return { x, y, box }
}
function getRelativePosition(evt, chart2) {
    if ('native' in evt) return evt
    let { canvas, currentDevicePixelRatio } = chart2,
        style = getComputedStyle2(canvas),
        borderBox = style.boxSizing === 'border-box',
        paddings = getPositionedStyle(style, 'padding'),
        borders = getPositionedStyle(style, 'border', 'width'),
        { x, y, box } = getCanvasPosition(evt, canvas),
        xOffset = paddings.left + (box && borders.left),
        yOffset = paddings.top + (box && borders.top),
        { width, height } = chart2
    return (
        borderBox &&
            ((width -= paddings.width + borders.width),
            (height -= paddings.height + borders.height)),
        {
            x: Math.round(
                (((x - xOffset) / width) * canvas.width) /
                    currentDevicePixelRatio,
            ),
            y: Math.round(
                (((y - yOffset) / height) * canvas.height) /
                    currentDevicePixelRatio,
            ),
        }
    )
}
function getContainerSize(canvas, width, height) {
    let maxWidth, maxHeight
    if (width === void 0 || height === void 0) {
        let container = _getParentNode(canvas)
        if (!container)
            (width = canvas.clientWidth), (height = canvas.clientHeight)
        else {
            let rect = container.getBoundingClientRect(),
                containerStyle = getComputedStyle2(container),
                containerBorder = getPositionedStyle(
                    containerStyle,
                    'border',
                    'width',
                ),
                containerPadding = getPositionedStyle(containerStyle, 'padding')
            ;(width =
                rect.width - containerPadding.width - containerBorder.width),
                (height =
                    rect.height -
                    containerPadding.height -
                    containerBorder.height),
                (maxWidth = parseMaxStyle(
                    containerStyle.maxWidth,
                    container,
                    'clientWidth',
                )),
                (maxHeight = parseMaxStyle(
                    containerStyle.maxHeight,
                    container,
                    'clientHeight',
                ))
        }
    }
    return {
        width,
        height,
        maxWidth: maxWidth || INFINITY,
        maxHeight: maxHeight || INFINITY,
    }
}
var round1 = (v) => Math.round(v * 10) / 10
function getMaximumSize(canvas, bbWidth, bbHeight, aspectRatio) {
    let style = getComputedStyle2(canvas),
        margins = getPositionedStyle(style, 'margin'),
        maxWidth =
            parseMaxStyle(style.maxWidth, canvas, 'clientWidth') || INFINITY,
        maxHeight =
            parseMaxStyle(style.maxHeight, canvas, 'clientHeight') || INFINITY,
        containerSize = getContainerSize(canvas, bbWidth, bbHeight),
        { width, height } = containerSize
    if (style.boxSizing === 'content-box') {
        let borders = getPositionedStyle(style, 'border', 'width'),
            paddings = getPositionedStyle(style, 'padding')
        ;(width -= paddings.width + borders.width),
            (height -= paddings.height + borders.height)
    }
    return (
        (width = Math.max(0, width - margins.width)),
        (height = Math.max(
            0,
            aspectRatio
                ? Math.floor(width / aspectRatio)
                : height - margins.height,
        )),
        (width = round1(Math.min(width, maxWidth, containerSize.maxWidth))),
        (height = round1(Math.min(height, maxHeight, containerSize.maxHeight))),
        width && !height && (height = round1(width / 2)),
        { width, height }
    )
}
function retinaScale(chart2, forceRatio, forceStyle) {
    let pixelRatio = forceRatio || 1,
        deviceHeight = Math.floor(chart2.height * pixelRatio),
        deviceWidth = Math.floor(chart2.width * pixelRatio)
    ;(chart2.height = deviceHeight / pixelRatio),
        (chart2.width = deviceWidth / pixelRatio)
    let canvas = chart2.canvas
    return (
        canvas.style &&
            (forceStyle || (!canvas.style.height && !canvas.style.width)) &&
            ((canvas.style.height = `${chart2.height}px`),
            (canvas.style.width = `${chart2.width}px`)),
        chart2.currentDevicePixelRatio !== pixelRatio ||
        canvas.height !== deviceHeight ||
        canvas.width !== deviceWidth
            ? ((chart2.currentDevicePixelRatio = pixelRatio),
              (canvas.height = deviceHeight),
              (canvas.width = deviceWidth),
              chart2.ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0),
              !0)
            : !1
    )
}
var supportsEventListenerOptions = (function () {
    let passiveSupported = !1
    try {
        let options = {
            get passive() {
                return (passiveSupported = !0), !1
            },
        }
        window.addEventListener('test', null, options),
            window.removeEventListener('test', null, options)
    } catch (e) {}
    return passiveSupported
})()
function readUsedSize(element, property) {
    let value = getStyle(element, property),
        matches = value && value.match(/^(\d+)(\.\d+)?px$/)
    return matches ? +matches[1] : void 0
}
function _pointInLine(p1, p2, t, mode) {
    return { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) }
}
function _steppedInterpolation(p1, p2, t, mode) {
    return {
        x: p1.x + t * (p2.x - p1.x),
        y:
            mode === 'middle'
                ? t < 0.5
                    ? p1.y
                    : p2.y
                : mode === 'after'
                ? t < 1
                    ? p1.y
                    : p2.y
                : t > 0
                ? p2.y
                : p1.y,
    }
}
function _bezierInterpolation(p1, p2, t, mode) {
    let cp1 = { x: p1.cp2x, y: p1.cp2y },
        cp2 = { x: p2.cp1x, y: p2.cp1y },
        a = _pointInLine(p1, cp1, t),
        b = _pointInLine(cp1, cp2, t),
        c = _pointInLine(cp2, p2, t),
        d = _pointInLine(a, b, t),
        e = _pointInLine(b, c, t)
    return _pointInLine(d, e, t)
}
var intlCache = new Map()
function getNumberFormat(locale, options) {
    options = options || {}
    let cacheKey = locale + JSON.stringify(options),
        formatter = intlCache.get(cacheKey)
    return (
        formatter ||
            ((formatter = new Intl.NumberFormat(locale, options)),
            intlCache.set(cacheKey, formatter)),
        formatter
    )
}
function formatNumber(num, locale, options) {
    return getNumberFormat(locale, options).format(num)
}
var getRightToLeftAdapter = function (rectX, width) {
        return {
            x(x) {
                return rectX + rectX + width - x
            },
            setWidth(w) {
                width = w
            },
            textAlign(align) {
                return align === 'center'
                    ? align
                    : align === 'right'
                    ? 'left'
                    : 'right'
            },
            xPlus(x, value) {
                return x - value
            },
            leftForLtr(x, itemWidth) {
                return x - itemWidth
            },
        }
    },
    getLeftToRightAdapter = function () {
        return {
            x(x) {
                return x
            },
            setWidth(w) {},
            textAlign(align) {
                return align
            },
            xPlus(x, value) {
                return x + value
            },
            leftForLtr(x, _itemWidth) {
                return x
            },
        }
    }
function getRtlAdapter(rtl, rectX, width) {
    return rtl ? getRightToLeftAdapter(rectX, width) : getLeftToRightAdapter()
}
function overrideTextDirection(ctx, direction) {
    let style, original
    ;(direction === 'ltr' || direction === 'rtl') &&
        ((style = ctx.canvas.style),
        (original = [
            style.getPropertyValue('direction'),
            style.getPropertyPriority('direction'),
        ]),
        style.setProperty('direction', direction, 'important'),
        (ctx.prevTextDirection = original))
}
function restoreTextDirection(ctx, original) {
    original !== void 0 &&
        (delete ctx.prevTextDirection,
        ctx.canvas.style.setProperty('direction', original[0], original[1]))
}
function propertyFn(property) {
    return property === 'angle'
        ? {
              between: _angleBetween,
              compare: _angleDiff,
              normalize: _normalizeAngle,
          }
        : { between: _isBetween, compare: (a, b) => a - b, normalize: (x) => x }
}
function normalizeSegment({ start, end, count, loop, style }) {
    return {
        start: start % count,
        end: end % count,
        loop: loop && (end - start + 1) % count == 0,
        style,
    }
}
function getSegment(segment, points, bounds) {
    let { property, start: startBound, end: endBound } = bounds,
        { between, normalize } = propertyFn(property),
        count = points.length,
        { start, end, loop } = segment,
        i,
        ilen
    if (loop) {
        for (
            start += count, end += count, i = 0, ilen = count;
            i < ilen &&
            between(
                normalize(points[start % count][property]),
                startBound,
                endBound,
            );
            ++i
        )
            start--, end--
        ;(start %= count), (end %= count)
    }
    return (
        end < start && (end += count),
        { start, end, loop, style: segment.style }
    )
}
function _boundSegment(segment, points, bounds) {
    if (!bounds) return [segment]
    let { property, start: startBound, end: endBound } = bounds,
        count = points.length,
        { compare, between, normalize } = propertyFn(property),
        { start, end, loop, style } = getSegment(segment, points, bounds),
        result = [],
        inside = !1,
        subStart = null,
        value,
        point,
        prevValue,
        startIsBefore = () =>
            between(startBound, prevValue, value) &&
            compare(startBound, prevValue) !== 0,
        endIsBefore = () =>
            compare(endBound, value) === 0 ||
            between(endBound, prevValue, value),
        shouldStart = () => inside || startIsBefore(),
        shouldStop = () => !inside || endIsBefore()
    for (let i = start, prev = start; i <= end; ++i)
        (point = points[i % count]),
            !point.skip &&
                ((value = normalize(point[property])),
                value !== prevValue &&
                    ((inside = between(value, startBound, endBound)),
                    subStart === null &&
                        shouldStart() &&
                        (subStart =
                            compare(value, startBound) === 0 ? i : prev),
                    subStart !== null &&
                        shouldStop() &&
                        (result.push(
                            normalizeSegment({
                                start: subStart,
                                end: i,
                                loop,
                                count,
                                style,
                            }),
                        ),
                        (subStart = null)),
                    (prev = i),
                    (prevValue = value)))
    return (
        subStart !== null &&
            result.push(
                normalizeSegment({ start: subStart, end, loop, count, style }),
            ),
        result
    )
}
function _boundSegments(line, bounds) {
    let result = [],
        segments = line.segments
    for (let i = 0; i < segments.length; i++) {
        let sub = _boundSegment(segments[i], line.points, bounds)
        sub.length && result.push(...sub)
    }
    return result
}
function findStartAndEnd(points, count, loop, spanGaps) {
    let start = 0,
        end = count - 1
    if (loop && !spanGaps)
        for (; start < count && !points[start].skip; ) start++
    for (; start < count && points[start].skip; ) start++
    for (
        start %= count, loop && (end += start);
        end > start && points[end % count].skip;

    )
        end--
    return (end %= count), { start, end }
}
function solidSegments(points, start, max, loop) {
    let count = points.length,
        result = [],
        last = start,
        prev = points[start],
        end
    for (end = start + 1; end <= max; ++end) {
        let cur = points[end % count]
        cur.skip || cur.stop
            ? prev.skip ||
              ((loop = !1),
              result.push({
                  start: start % count,
                  end: (end - 1) % count,
                  loop,
              }),
              (start = last = cur.stop ? end : null))
            : ((last = end), prev.skip && (start = end)),
            (prev = cur)
    }
    return (
        last !== null &&
            result.push({ start: start % count, end: last % count, loop }),
        result
    )
}
function _computeSegments(line, segmentOptions) {
    let points = line.points,
        spanGaps = line.options.spanGaps,
        count = points.length
    if (!count) return []
    let loop = !!line._loop,
        { start, end } = findStartAndEnd(points, count, loop, spanGaps)
    if (spanGaps === !0)
        return splitByStyles(
            line,
            [{ start, end, loop }],
            points,
            segmentOptions,
        )
    let max = end < start ? end + count : end,
        completeLoop = !!line._fullLoop && start === 0 && end === count - 1
    return splitByStyles(
        line,
        solidSegments(points, start, max, completeLoop),
        points,
        segmentOptions,
    )
}
function splitByStyles(line, segments, points, segmentOptions) {
    return !segmentOptions || !segmentOptions.setContext || !points
        ? segments
        : doSplitByStyles(line, segments, points, segmentOptions)
}
function doSplitByStyles(line, segments, points, segmentOptions) {
    let chartContext = line._chart.getContext(),
        baseStyle = readStyle(line.options),
        {
            _datasetIndex: datasetIndex,
            options: { spanGaps },
        } = line,
        count = points.length,
        result = [],
        prevStyle = baseStyle,
        start = segments[0].start,
        i = start
    function addStyle(s, e, l, st) {
        let dir = spanGaps ? -1 : 1
        if (s !== e) {
            for (s += count; points[s % count].skip; ) s -= dir
            for (; points[e % count].skip; ) e += dir
            s % count != e % count &&
                (result.push({
                    start: s % count,
                    end: e % count,
                    loop: l,
                    style: st,
                }),
                (prevStyle = st),
                (start = e % count))
        }
    }
    for (let segment of segments) {
        start = spanGaps ? start : segment.start
        let prev = points[start % count],
            style
        for (i = start + 1; i <= segment.end; i++) {
            let pt = points[i % count]
            ;(style = readStyle(
                segmentOptions.setContext(
                    createContext(chartContext, {
                        type: 'segment',
                        p0: prev,
                        p1: pt,
                        p0DataIndex: (i - 1) % count,
                        p1DataIndex: i % count,
                        datasetIndex,
                    }),
                ),
            )),
                styleChanged(style, prevStyle) &&
                    addStyle(start, i - 1, segment.loop, prevStyle),
                (prev = pt),
                (prevStyle = style)
        }
        start < i - 1 && addStyle(start, i - 1, segment.loop, prevStyle)
    }
    return result
}
function readStyle(options) {
    return {
        backgroundColor: options.backgroundColor,
        borderCapStyle: options.borderCapStyle,
        borderDash: options.borderDash,
        borderDashOffset: options.borderDashOffset,
        borderJoinStyle: options.borderJoinStyle,
        borderWidth: options.borderWidth,
        borderColor: options.borderColor,
    }
}
function styleChanged(style, prevStyle) {
    return prevStyle && JSON.stringify(style) !== JSON.stringify(prevStyle)
}
var Animator = class {
        constructor() {
            ;(this._request = null),
                (this._charts = new Map()),
                (this._running = !1),
                (this._lastDate = void 0)
        }
        _notify(chart2, anims, date, type) {
            let callbacks = anims.listeners[type],
                numSteps = anims.duration
            callbacks.forEach((fn) =>
                fn({
                    chart: chart2,
                    initial: anims.initial,
                    numSteps,
                    currentStep: Math.min(date - anims.start, numSteps),
                }),
            )
        }
        _refresh() {
            this._request ||
                ((this._running = !0),
                (this._request = requestAnimFrame.call(window, () => {
                    this._update(),
                        (this._request = null),
                        this._running && this._refresh()
                })))
        }
        _update(date = Date.now()) {
            let remaining = 0
            this._charts.forEach((anims, chart2) => {
                if (!anims.running || !anims.items.length) return
                let items = anims.items,
                    i = items.length - 1,
                    draw2 = !1,
                    item
                for (; i >= 0; --i)
                    (item = items[i]),
                        item._active
                            ? (item._total > anims.duration &&
                                  (anims.duration = item._total),
                              item.tick(date),
                              (draw2 = !0))
                            : ((items[i] = items[items.length - 1]),
                              items.pop())
                draw2 &&
                    (chart2.draw(),
                    this._notify(chart2, anims, date, 'progress')),
                    items.length ||
                        ((anims.running = !1),
                        this._notify(chart2, anims, date, 'complete'),
                        (anims.initial = !1)),
                    (remaining += items.length)
            }),
                (this._lastDate = date),
                remaining === 0 && (this._running = !1)
        }
        _getAnims(chart2) {
            let charts = this._charts,
                anims = charts.get(chart2)
            return (
                anims ||
                    ((anims = {
                        running: !1,
                        initial: !0,
                        items: [],
                        listeners: { complete: [], progress: [] },
                    }),
                    charts.set(chart2, anims)),
                anims
            )
        }
        listen(chart2, event, cb) {
            this._getAnims(chart2).listeners[event].push(cb)
        }
        add(chart2, items) {
            !items ||
                !items.length ||
                this._getAnims(chart2).items.push(...items)
        }
        has(chart2) {
            return this._getAnims(chart2).items.length > 0
        }
        start(chart2) {
            let anims = this._charts.get(chart2)
            !anims ||
                ((anims.running = !0),
                (anims.start = Date.now()),
                (anims.duration = anims.items.reduce(
                    (acc, cur) => Math.max(acc, cur._duration),
                    0,
                )),
                this._refresh())
        }
        running(chart2) {
            if (!this._running) return !1
            let anims = this._charts.get(chart2)
            return !(!anims || !anims.running || !anims.items.length)
        }
        stop(chart2) {
            let anims = this._charts.get(chart2)
            if (!anims || !anims.items.length) return
            let items = anims.items,
                i = items.length - 1
            for (; i >= 0; --i) items[i].cancel()
            ;(anims.items = []),
                this._notify(chart2, anims, Date.now(), 'complete')
        }
        remove(chart2) {
            return this._charts.delete(chart2)
        }
    },
    animator = new Animator(),
    transparent = 'transparent',
    interpolators = {
        boolean(from2, to2, factor) {
            return factor > 0.5 ? to2 : from2
        },
        color(from2, to2, factor) {
            let c0 = color(from2 || transparent),
                c1 = c0.valid && color(to2 || transparent)
            return c1 && c1.valid ? c1.mix(c0, factor).hexString() : to2
        },
        number(from2, to2, factor) {
            return from2 + (to2 - from2) * factor
        },
    },
    Animation = class {
        constructor(cfg, target, prop, to2) {
            let currentValue = target[prop]
            to2 = resolve([cfg.to, to2, currentValue, cfg.from])
            let from2 = resolve([cfg.from, currentValue, to2])
            ;(this._active = !0),
                (this._fn = cfg.fn || interpolators[cfg.type || typeof from2]),
                (this._easing = effects[cfg.easing] || effects.linear),
                (this._start = Math.floor(Date.now() + (cfg.delay || 0))),
                (this._duration = this._total = Math.floor(cfg.duration)),
                (this._loop = !!cfg.loop),
                (this._target = target),
                (this._prop = prop),
                (this._from = from2),
                (this._to = to2),
                (this._promises = void 0)
        }
        active() {
            return this._active
        }
        update(cfg, to2, date) {
            if (this._active) {
                this._notify(!1)
                let currentValue = this._target[this._prop],
                    elapsed = date - this._start,
                    remain = this._duration - elapsed
                ;(this._start = date),
                    (this._duration = Math.floor(
                        Math.max(remain, cfg.duration),
                    )),
                    (this._total += elapsed),
                    (this._loop = !!cfg.loop),
                    (this._to = resolve([cfg.to, to2, currentValue, cfg.from])),
                    (this._from = resolve([cfg.from, currentValue, to2]))
            }
        }
        cancel() {
            this._active &&
                (this.tick(Date.now()), (this._active = !1), this._notify(!1))
        }
        tick(date) {
            let elapsed = date - this._start,
                duration = this._duration,
                prop = this._prop,
                from2 = this._from,
                loop = this._loop,
                to2 = this._to,
                factor
            if (
                ((this._active = from2 !== to2 && (loop || elapsed < duration)),
                !this._active)
            ) {
                ;(this._target[prop] = to2), this._notify(!0)
                return
            }
            if (elapsed < 0) {
                this._target[prop] = from2
                return
            }
            ;(factor = (elapsed / duration) % 2),
                (factor = loop && factor > 1 ? 2 - factor : factor),
                (factor = this._easing(Math.min(1, Math.max(0, factor)))),
                (this._target[prop] = this._fn(from2, to2, factor))
        }
        wait() {
            let promises = this._promises || (this._promises = [])
            return new Promise((res, rej) => {
                promises.push({ res, rej })
            })
        }
        _notify(resolved) {
            let method = resolved ? 'res' : 'rej',
                promises = this._promises || []
            for (let i = 0; i < promises.length; i++) promises[i][method]()
        }
    },
    numbers = ['x', 'y', 'borderWidth', 'radius', 'tension'],
    colors = ['color', 'borderColor', 'backgroundColor']
defaults.set('animation', {
    delay: void 0,
    duration: 1e3,
    easing: 'easeOutQuart',
    fn: void 0,
    from: void 0,
    loop: void 0,
    to: void 0,
    type: void 0,
})
var animationOptions = Object.keys(defaults.animation)
defaults.describe('animation', {
    _fallback: !1,
    _indexable: !1,
    _scriptable: (name) =>
        name !== 'onProgress' && name !== 'onComplete' && name !== 'fn',
})
defaults.set('animations', {
    colors: { type: 'color', properties: colors },
    numbers: { type: 'number', properties: numbers },
})
defaults.describe('animations', { _fallback: 'animation' })
defaults.set('transitions', {
    active: { animation: { duration: 400 } },
    resize: { animation: { duration: 0 } },
    show: {
        animations: {
            colors: { from: 'transparent' },
            visible: { type: 'boolean', duration: 0 },
        },
    },
    hide: {
        animations: {
            colors: { to: 'transparent' },
            visible: { type: 'boolean', easing: 'linear', fn: (v) => v | 0 },
        },
    },
})
var Animations = class {
    constructor(chart2, config) {
        ;(this._chart = chart2),
            (this._properties = new Map()),
            this.configure(config)
    }
    configure(config) {
        if (!isObject(config)) return
        let animatedProps = this._properties
        Object.getOwnPropertyNames(config).forEach((key) => {
            let cfg = config[key]
            if (!isObject(cfg)) return
            let resolved = {}
            for (let option of animationOptions) resolved[option] = cfg[option]
            ;((isArray(cfg.properties) && cfg.properties) || [key]).forEach(
                (prop) => {
                    ;(prop === key || !animatedProps.has(prop)) &&
                        animatedProps.set(prop, resolved)
                },
            )
        })
    }
    _animateOptions(target, values) {
        let newOptions = values.options,
            options = resolveTargetOptions(target, newOptions)
        if (!options) return []
        let animations = this._createAnimations(options, newOptions)
        return (
            newOptions.$shared &&
                awaitAll(target.options.$animations, newOptions).then(
                    () => {
                        target.options = newOptions
                    },
                    () => {},
                ),
            animations
        )
    }
    _createAnimations(target, values) {
        let animatedProps = this._properties,
            animations = [],
            running = target.$animations || (target.$animations = {}),
            props = Object.keys(values),
            date = Date.now(),
            i
        for (i = props.length - 1; i >= 0; --i) {
            let prop = props[i]
            if (prop.charAt(0) === '$') continue
            if (prop === 'options') {
                animations.push(...this._animateOptions(target, values))
                continue
            }
            let value = values[prop],
                animation = running[prop],
                cfg = animatedProps.get(prop)
            if (animation)
                if (cfg && animation.active()) {
                    animation.update(cfg, value, date)
                    continue
                } else animation.cancel()
            if (!cfg || !cfg.duration) {
                target[prop] = value
                continue
            }
            ;(running[prop] = animation =
                new Animation(cfg, target, prop, value)),
                animations.push(animation)
        }
        return animations
    }
    update(target, values) {
        if (this._properties.size === 0) {
            Object.assign(target, values)
            return
        }
        let animations = this._createAnimations(target, values)
        if (animations.length) return animator.add(this._chart, animations), !0
    }
}
function awaitAll(animations, properties) {
    let running = [],
        keys = Object.keys(properties)
    for (let i = 0; i < keys.length; i++) {
        let anim = animations[keys[i]]
        anim && anim.active() && running.push(anim.wait())
    }
    return Promise.all(running)
}
function resolveTargetOptions(target, newOptions) {
    if (!newOptions) return
    let options = target.options
    if (!options) {
        target.options = newOptions
        return
    }
    return (
        options.$shared &&
            (target.options = options =
                Object.assign({}, options, { $shared: !1, $animations: {} })),
        options
    )
}
function scaleClip(scale, allowedOverflow) {
    let opts = (scale && scale.options) || {},
        reverse = opts.reverse,
        min = opts.min === void 0 ? allowedOverflow : 0,
        max = opts.max === void 0 ? allowedOverflow : 0
    return { start: reverse ? max : min, end: reverse ? min : max }
}
function defaultClip(xScale, yScale, allowedOverflow) {
    if (allowedOverflow === !1) return !1
    let x = scaleClip(xScale, allowedOverflow),
        y = scaleClip(yScale, allowedOverflow)
    return { top: y.end, right: x.end, bottom: y.start, left: x.start }
}
function toClip(value) {
    let t, r, b, l
    return (
        isObject(value)
            ? ((t = value.top),
              (r = value.right),
              (b = value.bottom),
              (l = value.left))
            : (t = r = b = l = value),
        { top: t, right: r, bottom: b, left: l, disabled: value === !1 }
    )
}
function getSortedDatasetIndices(chart2, filterVisible) {
    let keys = [],
        metasets = chart2._getSortedDatasetMetas(filterVisible),
        i,
        ilen
    for (i = 0, ilen = metasets.length; i < ilen; ++i)
        keys.push(metasets[i].index)
    return keys
}
function applyStack(stack, value, dsIndex, options = {}) {
    let keys = stack.keys,
        singleMode = options.mode === 'single',
        i,
        ilen,
        datasetIndex,
        otherValue
    if (value !== null) {
        for (i = 0, ilen = keys.length; i < ilen; ++i) {
            if (((datasetIndex = +keys[i]), datasetIndex === dsIndex)) {
                if (options.all) continue
                break
            }
            ;(otherValue = stack.values[datasetIndex]),
                isNumberFinite(otherValue) &&
                    (singleMode ||
                        value === 0 ||
                        sign(value) === sign(otherValue)) &&
                    (value += otherValue)
        }
        return value
    }
}
function convertObjectDataToArray(data) {
    let keys = Object.keys(data),
        adata = new Array(keys.length),
        i,
        ilen,
        key
    for (i = 0, ilen = keys.length; i < ilen; ++i)
        (key = keys[i]), (adata[i] = { x: key, y: data[key] })
    return adata
}
function isStacked(scale, meta) {
    let stacked = scale && scale.options.stacked
    return stacked || (stacked === void 0 && meta.stack !== void 0)
}
function getStackKey(indexScale, valueScale, meta) {
    return `${indexScale.id}.${valueScale.id}.${meta.stack || meta.type}`
}
function getUserBounds(scale) {
    let { min, max, minDefined, maxDefined } = scale.getUserBounds()
    return {
        min: minDefined ? min : Number.NEGATIVE_INFINITY,
        max: maxDefined ? max : Number.POSITIVE_INFINITY,
    }
}
function getOrCreateStack(stacks, stackKey, indexValue) {
    let subStack = stacks[stackKey] || (stacks[stackKey] = {})
    return subStack[indexValue] || (subStack[indexValue] = {})
}
function getLastIndexInStack(stack, vScale, positive, type) {
    for (let meta of vScale.getMatchingVisibleMetas(type).reverse()) {
        let value = stack[meta.index]
        if ((positive && value > 0) || (!positive && value < 0))
            return meta.index
    }
    return null
}
function updateStacks(controller, parsed) {
    let { chart: chart2, _cachedMeta: meta } = controller,
        stacks = chart2._stacks || (chart2._stacks = {}),
        { iScale, vScale, index: datasetIndex } = meta,
        iAxis = iScale.axis,
        vAxis = vScale.axis,
        key = getStackKey(iScale, vScale, meta),
        ilen = parsed.length,
        stack
    for (let i = 0; i < ilen; ++i) {
        let item = parsed[i],
            { [iAxis]: index2, [vAxis]: value } = item,
            itemStacks = item._stacks || (item._stacks = {})
        ;(stack = itemStacks[vAxis] = getOrCreateStack(stacks, key, index2)),
            (stack[datasetIndex] = value),
            (stack._top = getLastIndexInStack(stack, vScale, !0, meta.type)),
            (stack._bottom = getLastIndexInStack(stack, vScale, !1, meta.type))
    }
}
function getFirstScaleId(chart2, axis) {
    let scales2 = chart2.scales
    return Object.keys(scales2)
        .filter((key) => scales2[key].axis === axis)
        .shift()
}
function createDatasetContext(parent, index2) {
    return createContext(parent, {
        active: !1,
        dataset: void 0,
        datasetIndex: index2,
        index: index2,
        mode: 'default',
        type: 'dataset',
    })
}
function createDataContext(parent, index2, element) {
    return createContext(parent, {
        active: !1,
        dataIndex: index2,
        parsed: void 0,
        raw: void 0,
        element,
        index: index2,
        mode: 'default',
        type: 'data',
    })
}
function clearStacks(meta, items) {
    let datasetIndex = meta.controller.index,
        axis = meta.vScale && meta.vScale.axis
    if (!!axis) {
        items = items || meta._parsed
        for (let parsed of items) {
            let stacks = parsed._stacks
            if (
                !stacks ||
                stacks[axis] === void 0 ||
                stacks[axis][datasetIndex] === void 0
            )
                return
            delete stacks[axis][datasetIndex]
        }
    }
}
var isDirectUpdateMode = (mode) => mode === 'reset' || mode === 'none',
    cloneIfNotShared = (cached, shared) =>
        shared ? cached : Object.assign({}, cached),
    createStack = (canStack, meta, chart2) =>
        canStack &&
        !meta.hidden &&
        meta._stacked && {
            keys: getSortedDatasetIndices(chart2, !0),
            values: null,
        },
    DatasetController = class {
        constructor(chart2, datasetIndex) {
            ;(this.chart = chart2),
                (this._ctx = chart2.ctx),
                (this.index = datasetIndex),
                (this._cachedDataOpts = {}),
                (this._cachedMeta = this.getMeta()),
                (this._type = this._cachedMeta.type),
                (this.options = void 0),
                (this._parsing = !1),
                (this._data = void 0),
                (this._objectData = void 0),
                (this._sharedOptions = void 0),
                (this._drawStart = void 0),
                (this._drawCount = void 0),
                (this.enableOptionSharing = !1),
                (this.supportsDecimation = !1),
                (this.$context = void 0),
                (this._syncList = []),
                this.initialize()
        }
        initialize() {
            let meta = this._cachedMeta
            this.configure(),
                this.linkScales(),
                (meta._stacked = isStacked(meta.vScale, meta)),
                this.addElements()
        }
        updateIndex(datasetIndex) {
            this.index !== datasetIndex && clearStacks(this._cachedMeta),
                (this.index = datasetIndex)
        }
        linkScales() {
            let chart2 = this.chart,
                meta = this._cachedMeta,
                dataset = this.getDataset(),
                chooseId = (axis, x, y, r) =>
                    axis === 'x' ? x : axis === 'r' ? r : y,
                xid = (meta.xAxisID = valueOrDefault(
                    dataset.xAxisID,
                    getFirstScaleId(chart2, 'x'),
                )),
                yid = (meta.yAxisID = valueOrDefault(
                    dataset.yAxisID,
                    getFirstScaleId(chart2, 'y'),
                )),
                rid = (meta.rAxisID = valueOrDefault(
                    dataset.rAxisID,
                    getFirstScaleId(chart2, 'r'),
                )),
                indexAxis = meta.indexAxis,
                iid = (meta.iAxisID = chooseId(indexAxis, xid, yid, rid)),
                vid = (meta.vAxisID = chooseId(indexAxis, yid, xid, rid))
            ;(meta.xScale = this.getScaleForId(xid)),
                (meta.yScale = this.getScaleForId(yid)),
                (meta.rScale = this.getScaleForId(rid)),
                (meta.iScale = this.getScaleForId(iid)),
                (meta.vScale = this.getScaleForId(vid))
        }
        getDataset() {
            return this.chart.data.datasets[this.index]
        }
        getMeta() {
            return this.chart.getDatasetMeta(this.index)
        }
        getScaleForId(scaleID) {
            return this.chart.scales[scaleID]
        }
        _getOtherScale(scale) {
            let meta = this._cachedMeta
            return scale === meta.iScale ? meta.vScale : meta.iScale
        }
        reset() {
            this._update('reset')
        }
        _destroy() {
            let meta = this._cachedMeta
            this._data && unlistenArrayEvents(this._data, this),
                meta._stacked && clearStacks(meta)
        }
        _dataCheck() {
            let dataset = this.getDataset(),
                data = dataset.data || (dataset.data = []),
                _data = this._data
            if (isObject(data)) this._data = convertObjectDataToArray(data)
            else if (_data !== data) {
                if (_data) {
                    unlistenArrayEvents(_data, this)
                    let meta = this._cachedMeta
                    clearStacks(meta), (meta._parsed = [])
                }
                data &&
                    Object.isExtensible(data) &&
                    listenArrayEvents(data, this),
                    (this._syncList = []),
                    (this._data = data)
            }
        }
        addElements() {
            let meta = this._cachedMeta
            this._dataCheck(),
                this.datasetElementType &&
                    (meta.dataset = new this.datasetElementType())
        }
        buildOrUpdateElements(resetNewElements) {
            let meta = this._cachedMeta,
                dataset = this.getDataset(),
                stackChanged = !1
            this._dataCheck()
            let oldStacked = meta._stacked
            ;(meta._stacked = isStacked(meta.vScale, meta)),
                meta.stack !== dataset.stack &&
                    ((stackChanged = !0),
                    clearStacks(meta),
                    (meta.stack = dataset.stack)),
                this._resyncElements(resetNewElements),
                (stackChanged || oldStacked !== meta._stacked) &&
                    updateStacks(this, meta._parsed)
        }
        configure() {
            let config = this.chart.config,
                scopeKeys = config.datasetScopeKeys(this._type),
                scopes = config.getOptionScopes(
                    this.getDataset(),
                    scopeKeys,
                    !0,
                )
            ;(this.options = config.createResolver(scopes, this.getContext())),
                (this._parsing = this.options.parsing),
                (this._cachedDataOpts = {})
        }
        parse(start, count) {
            let { _cachedMeta: meta, _data: data } = this,
                { iScale, _stacked } = meta,
                iAxis = iScale.axis,
                sorted =
                    start === 0 && count === data.length ? !0 : meta._sorted,
                prev = start > 0 && meta._parsed[start - 1],
                i,
                cur,
                parsed
            if (this._parsing === !1)
                (meta._parsed = data), (meta._sorted = !0), (parsed = data)
            else {
                isArray(data[start])
                    ? (parsed = this.parseArrayData(meta, data, start, count))
                    : isObject(data[start])
                    ? (parsed = this.parseObjectData(meta, data, start, count))
                    : (parsed = this.parsePrimitiveData(
                          meta,
                          data,
                          start,
                          count,
                      ))
                let isNotInOrderComparedToPrev = () =>
                    cur[iAxis] === null || (prev && cur[iAxis] < prev[iAxis])
                for (i = 0; i < count; ++i)
                    (meta._parsed[i + start] = cur = parsed[i]),
                        sorted &&
                            (isNotInOrderComparedToPrev() && (sorted = !1),
                            (prev = cur))
                meta._sorted = sorted
            }
            _stacked && updateStacks(this, parsed)
        }
        parsePrimitiveData(meta, data, start, count) {
            let { iScale, vScale } = meta,
                iAxis = iScale.axis,
                vAxis = vScale.axis,
                labels = iScale.getLabels(),
                singleScale = iScale === vScale,
                parsed = new Array(count),
                i,
                ilen,
                index2
            for (i = 0, ilen = count; i < ilen; ++i)
                (index2 = i + start),
                    (parsed[i] = {
                        [iAxis]:
                            singleScale || iScale.parse(labels[index2], index2),
                        [vAxis]: vScale.parse(data[index2], index2),
                    })
            return parsed
        }
        parseArrayData(meta, data, start, count) {
            let { xScale, yScale } = meta,
                parsed = new Array(count),
                i,
                ilen,
                index2,
                item
            for (i = 0, ilen = count; i < ilen; ++i)
                (index2 = i + start),
                    (item = data[index2]),
                    (parsed[i] = {
                        x: xScale.parse(item[0], index2),
                        y: yScale.parse(item[1], index2),
                    })
            return parsed
        }
        parseObjectData(meta, data, start, count) {
            let { xScale, yScale } = meta,
                { xAxisKey = 'x', yAxisKey = 'y' } = this._parsing,
                parsed = new Array(count),
                i,
                ilen,
                index2,
                item
            for (i = 0, ilen = count; i < ilen; ++i)
                (index2 = i + start),
                    (item = data[index2]),
                    (parsed[i] = {
                        x: xScale.parse(
                            resolveObjectKey(item, xAxisKey),
                            index2,
                        ),
                        y: yScale.parse(
                            resolveObjectKey(item, yAxisKey),
                            index2,
                        ),
                    })
            return parsed
        }
        getParsed(index2) {
            return this._cachedMeta._parsed[index2]
        }
        getDataElement(index2) {
            return this._cachedMeta.data[index2]
        }
        applyStack(scale, parsed, mode) {
            let chart2 = this.chart,
                meta = this._cachedMeta,
                value = parsed[scale.axis],
                stack = {
                    keys: getSortedDatasetIndices(chart2, !0),
                    values: parsed._stacks[scale.axis],
                }
            return applyStack(stack, value, meta.index, { mode })
        }
        updateRangeFromParsed(range, scale, parsed, stack) {
            let parsedValue = parsed[scale.axis],
                value = parsedValue === null ? NaN : parsedValue,
                values = stack && parsed._stacks[scale.axis]
            stack &&
                values &&
                ((stack.values = values),
                (value = applyStack(
                    stack,
                    parsedValue,
                    this._cachedMeta.index,
                ))),
                (range.min = Math.min(range.min, value)),
                (range.max = Math.max(range.max, value))
        }
        getMinMax(scale, canStack) {
            let meta = this._cachedMeta,
                _parsed = meta._parsed,
                sorted = meta._sorted && scale === meta.iScale,
                ilen = _parsed.length,
                otherScale = this._getOtherScale(scale),
                stack = createStack(canStack, meta, this.chart),
                range = {
                    min: Number.POSITIVE_INFINITY,
                    max: Number.NEGATIVE_INFINITY,
                },
                { min: otherMin, max: otherMax } = getUserBounds(otherScale),
                i,
                parsed
            function _skip() {
                parsed = _parsed[i]
                let otherValue = parsed[otherScale.axis]
                return (
                    !isNumberFinite(parsed[scale.axis]) ||
                    otherMin > otherValue ||
                    otherMax < otherValue
                )
            }
            for (
                i = 0;
                i < ilen &&
                !(
                    !_skip() &&
                    (this.updateRangeFromParsed(range, scale, parsed, stack),
                    sorted)
                );
                ++i
            );
            if (sorted) {
                for (i = ilen - 1; i >= 0; --i)
                    if (!_skip()) {
                        this.updateRangeFromParsed(range, scale, parsed, stack)
                        break
                    }
            }
            return range
        }
        getAllParsedValues(scale) {
            let parsed = this._cachedMeta._parsed,
                values = [],
                i,
                ilen,
                value
            for (i = 0, ilen = parsed.length; i < ilen; ++i)
                (value = parsed[i][scale.axis]),
                    isNumberFinite(value) && values.push(value)
            return values
        }
        getMaxOverflow() {
            return !1
        }
        getLabelAndValue(index2) {
            let meta = this._cachedMeta,
                iScale = meta.iScale,
                vScale = meta.vScale,
                parsed = this.getParsed(index2)
            return {
                label: iScale
                    ? '' + iScale.getLabelForValue(parsed[iScale.axis])
                    : '',
                value: vScale
                    ? '' + vScale.getLabelForValue(parsed[vScale.axis])
                    : '',
            }
        }
        _update(mode) {
            let meta = this._cachedMeta
            this.update(mode || 'default'),
                (meta._clip = toClip(
                    valueOrDefault(
                        this.options.clip,
                        defaultClip(
                            meta.xScale,
                            meta.yScale,
                            this.getMaxOverflow(),
                        ),
                    ),
                ))
        }
        update(mode) {}
        draw() {
            let ctx = this._ctx,
                chart2 = this.chart,
                meta = this._cachedMeta,
                elements2 = meta.data || [],
                area = chart2.chartArea,
                active = [],
                start = this._drawStart || 0,
                count = this._drawCount || elements2.length - start,
                drawActiveElementsOnTop = this.options.drawActiveElementsOnTop,
                i
            for (
                meta.dataset && meta.dataset.draw(ctx, area, start, count),
                    i = start;
                i < start + count;
                ++i
            ) {
                let element = elements2[i]
                element.hidden ||
                    (element.active && drawActiveElementsOnTop
                        ? active.push(element)
                        : element.draw(ctx, area))
            }
            for (i = 0; i < active.length; ++i) active[i].draw(ctx, area)
        }
        getStyle(index2, active) {
            let mode = active ? 'active' : 'default'
            return index2 === void 0 && this._cachedMeta.dataset
                ? this.resolveDatasetElementOptions(mode)
                : this.resolveDataElementOptions(index2 || 0, mode)
        }
        getContext(index2, active, mode) {
            let dataset = this.getDataset(),
                context
            if (index2 >= 0 && index2 < this._cachedMeta.data.length) {
                let element = this._cachedMeta.data[index2]
                ;(context =
                    element.$context ||
                    (element.$context = createDataContext(
                        this.getContext(),
                        index2,
                        element,
                    ))),
                    (context.parsed = this.getParsed(index2)),
                    (context.raw = dataset.data[index2]),
                    (context.index = context.dataIndex = index2)
            } else
                (context =
                    this.$context ||
                    (this.$context = createDatasetContext(
                        this.chart.getContext(),
                        this.index,
                    ))),
                    (context.dataset = dataset),
                    (context.index = context.datasetIndex = this.index)
            return (context.active = !!active), (context.mode = mode), context
        }
        resolveDatasetElementOptions(mode) {
            return this._resolveElementOptions(this.datasetElementType.id, mode)
        }
        resolveDataElementOptions(index2, mode) {
            return this._resolveElementOptions(
                this.dataElementType.id,
                mode,
                index2,
            )
        }
        _resolveElementOptions(elementType, mode = 'default', index2) {
            let active = mode === 'active',
                cache = this._cachedDataOpts,
                cacheKey = elementType + '-' + mode,
                cached = cache[cacheKey],
                sharing = this.enableOptionSharing && defined(index2)
            if (cached) return cloneIfNotShared(cached, sharing)
            let config = this.chart.config,
                scopeKeys = config.datasetElementScopeKeys(
                    this._type,
                    elementType,
                ),
                prefixes = active
                    ? [`${elementType}Hover`, 'hover', elementType, '']
                    : [elementType, ''],
                scopes = config.getOptionScopes(this.getDataset(), scopeKeys),
                names2 = Object.keys(defaults.elements[elementType]),
                context = () => this.getContext(index2, active),
                values = config.resolveNamedOptions(
                    scopes,
                    names2,
                    context,
                    prefixes,
                )
            return (
                values.$shared &&
                    ((values.$shared = sharing),
                    (cache[cacheKey] = Object.freeze(
                        cloneIfNotShared(values, sharing),
                    ))),
                values
            )
        }
        _resolveAnimations(index2, transition, active) {
            let chart2 = this.chart,
                cache = this._cachedDataOpts,
                cacheKey = `animation-${transition}`,
                cached = cache[cacheKey]
            if (cached) return cached
            let options
            if (chart2.options.animation !== !1) {
                let config = this.chart.config,
                    scopeKeys = config.datasetAnimationScopeKeys(
                        this._type,
                        transition,
                    ),
                    scopes = config.getOptionScopes(
                        this.getDataset(),
                        scopeKeys,
                    )
                options = config.createResolver(
                    scopes,
                    this.getContext(index2, active, transition),
                )
            }
            let animations = new Animations(
                chart2,
                options && options.animations,
            )
            return (
                options &&
                    options._cacheable &&
                    (cache[cacheKey] = Object.freeze(animations)),
                animations
            )
        }
        getSharedOptions(options) {
            if (!!options.$shared)
                return (
                    this._sharedOptions ||
                    (this._sharedOptions = Object.assign({}, options))
                )
        }
        includeOptions(mode, sharedOptions) {
            return (
                !sharedOptions ||
                isDirectUpdateMode(mode) ||
                this.chart._animationsDisabled
            )
        }
        _getSharedOptions(start, mode) {
            let firstOpts = this.resolveDataElementOptions(start, mode),
                previouslySharedOptions = this._sharedOptions,
                sharedOptions = this.getSharedOptions(firstOpts),
                includeOptions =
                    this.includeOptions(mode, sharedOptions) ||
                    sharedOptions !== previouslySharedOptions
            return (
                this.updateSharedOptions(sharedOptions, mode, firstOpts),
                { sharedOptions, includeOptions }
            )
        }
        updateElement(element, index2, properties, mode) {
            isDirectUpdateMode(mode)
                ? Object.assign(element, properties)
                : this._resolveAnimations(index2, mode).update(
                      element,
                      properties,
                  )
        }
        updateSharedOptions(sharedOptions, mode, newOptions) {
            sharedOptions &&
                !isDirectUpdateMode(mode) &&
                this._resolveAnimations(void 0, mode).update(
                    sharedOptions,
                    newOptions,
                )
        }
        _setStyle(element, index2, mode, active) {
            element.active = active
            let options = this.getStyle(index2, active)
            this._resolveAnimations(index2, mode, active).update(element, {
                options: (!active && this.getSharedOptions(options)) || options,
            })
        }
        removeHoverStyle(element, datasetIndex, index2) {
            this._setStyle(element, index2, 'active', !1)
        }
        setHoverStyle(element, datasetIndex, index2) {
            this._setStyle(element, index2, 'active', !0)
        }
        _removeDatasetHoverStyle() {
            let element = this._cachedMeta.dataset
            element && this._setStyle(element, void 0, 'active', !1)
        }
        _setDatasetHoverStyle() {
            let element = this._cachedMeta.dataset
            element && this._setStyle(element, void 0, 'active', !0)
        }
        _resyncElements(resetNewElements) {
            let data = this._data,
                elements2 = this._cachedMeta.data
            for (let [method, arg1, arg2] of this._syncList)
                this[method](arg1, arg2)
            this._syncList = []
            let numMeta = elements2.length,
                numData = data.length,
                count = Math.min(numData, numMeta)
            count && this.parse(0, count),
                numData > numMeta
                    ? this._insertElements(
                          numMeta,
                          numData - numMeta,
                          resetNewElements,
                      )
                    : numData < numMeta &&
                      this._removeElements(numData, numMeta - numData)
        }
        _insertElements(start, count, resetNewElements = !0) {
            let meta = this._cachedMeta,
                data = meta.data,
                end = start + count,
                i,
                move = (arr) => {
                    for (arr.length += count, i = arr.length - 1; i >= end; i--)
                        arr[i] = arr[i - count]
                }
            for (move(data), i = start; i < end; ++i)
                data[i] = new this.dataElementType()
            this._parsing && move(meta._parsed),
                this.parse(start, count),
                resetNewElements &&
                    this.updateElements(data, start, count, 'reset')
        }
        updateElements(element, start, count, mode) {}
        _removeElements(start, count) {
            let meta = this._cachedMeta
            if (this._parsing) {
                let removed = meta._parsed.splice(start, count)
                meta._stacked && clearStacks(meta, removed)
            }
            meta.data.splice(start, count)
        }
        _sync(args) {
            if (this._parsing) this._syncList.push(args)
            else {
                let [method, arg1, arg2] = args
                this[method](arg1, arg2)
            }
            this.chart._dataChanges.push([this.index, ...args])
        }
        _onDataPush() {
            let count = arguments.length
            this._sync([
                '_insertElements',
                this.getDataset().data.length - count,
                count,
            ])
        }
        _onDataPop() {
            this._sync(['_removeElements', this._cachedMeta.data.length - 1, 1])
        }
        _onDataShift() {
            this._sync(['_removeElements', 0, 1])
        }
        _onDataSplice(start, count) {
            count && this._sync(['_removeElements', start, count])
            let newCount = arguments.length - 2
            newCount && this._sync(['_insertElements', start, newCount])
        }
        _onDataUnshift() {
            this._sync(['_insertElements', 0, arguments.length])
        }
    }
DatasetController.defaults = {}
DatasetController.prototype.datasetElementType = null
DatasetController.prototype.dataElementType = null
function getAllScaleValues(scale, type) {
    if (!scale._cache.$bar) {
        let visibleMetas = scale.getMatchingVisibleMetas(type),
            values = []
        for (let i = 0, ilen = visibleMetas.length; i < ilen; i++)
            values = values.concat(
                visibleMetas[i].controller.getAllParsedValues(scale),
            )
        scale._cache.$bar = _arrayUnique(values.sort((a, b) => a - b))
    }
    return scale._cache.$bar
}
function computeMinSampleSize(meta) {
    let scale = meta.iScale,
        values = getAllScaleValues(scale, meta.type),
        min = scale._length,
        i,
        ilen,
        curr,
        prev,
        updateMinAndPrev = () => {
            curr === 32767 ||
                curr === -32768 ||
                (defined(prev) &&
                    (min = Math.min(min, Math.abs(curr - prev) || min)),
                (prev = curr))
        }
    for (i = 0, ilen = values.length; i < ilen; ++i)
        (curr = scale.getPixelForValue(values[i])), updateMinAndPrev()
    for (prev = void 0, i = 0, ilen = scale.ticks.length; i < ilen; ++i)
        (curr = scale.getPixelForTick(i)), updateMinAndPrev()
    return min
}
function computeFitCategoryTraits(index2, ruler, options, stackCount) {
    let thickness = options.barThickness,
        size,
        ratio
    return (
        isNullOrUndef(thickness)
            ? ((size = ruler.min * options.categoryPercentage),
              (ratio = options.barPercentage))
            : ((size = thickness * stackCount), (ratio = 1)),
        {
            chunk: size / stackCount,
            ratio,
            start: ruler.pixels[index2] - size / 2,
        }
    )
}
function computeFlexCategoryTraits(index2, ruler, options, stackCount) {
    let pixels = ruler.pixels,
        curr = pixels[index2],
        prev = index2 > 0 ? pixels[index2 - 1] : null,
        next = index2 < pixels.length - 1 ? pixels[index2 + 1] : null,
        percent = options.categoryPercentage
    prev === null &&
        (prev = curr - (next === null ? ruler.end - ruler.start : next - curr)),
        next === null && (next = curr + curr - prev)
    let start = curr - ((curr - Math.min(prev, next)) / 2) * percent
    return {
        chunk: ((Math.abs(next - prev) / 2) * percent) / stackCount,
        ratio: options.barPercentage,
        start,
    }
}
function parseFloatBar(entry, item, vScale, i) {
    let startValue = vScale.parse(entry[0], i),
        endValue = vScale.parse(entry[1], i),
        min = Math.min(startValue, endValue),
        max = Math.max(startValue, endValue),
        barStart = min,
        barEnd = max
    Math.abs(min) > Math.abs(max) && ((barStart = max), (barEnd = min)),
        (item[vScale.axis] = barEnd),
        (item._custom = {
            barStart,
            barEnd,
            start: startValue,
            end: endValue,
            min,
            max,
        })
}
function parseValue(entry, item, vScale, i) {
    return (
        isArray(entry)
            ? parseFloatBar(entry, item, vScale, i)
            : (item[vScale.axis] = vScale.parse(entry, i)),
        item
    )
}
function parseArrayOrPrimitive(meta, data, start, count) {
    let iScale = meta.iScale,
        vScale = meta.vScale,
        labels = iScale.getLabels(),
        singleScale = iScale === vScale,
        parsed = [],
        i,
        ilen,
        item,
        entry
    for (i = start, ilen = start + count; i < ilen; ++i)
        (entry = data[i]),
            (item = {}),
            (item[iScale.axis] = singleScale || iScale.parse(labels[i], i)),
            parsed.push(parseValue(entry, item, vScale, i))
    return parsed
}
function isFloatBar(custom) {
    return custom && custom.barStart !== void 0 && custom.barEnd !== void 0
}
function barSign(size, vScale, actualBase) {
    return size !== 0
        ? sign(size)
        : (vScale.isHorizontal() ? 1 : -1) * (vScale.min >= actualBase ? 1 : -1)
}
function borderProps(properties) {
    let reverse, start, end, top, bottom
    return (
        properties.horizontal
            ? ((reverse = properties.base > properties.x),
              (start = 'left'),
              (end = 'right'))
            : ((reverse = properties.base < properties.y),
              (start = 'bottom'),
              (end = 'top')),
        reverse
            ? ((top = 'end'), (bottom = 'start'))
            : ((top = 'start'), (bottom = 'end')),
        { start, end, reverse, top, bottom }
    )
}
function setBorderSkipped(properties, options, stack, index2) {
    let edge = options.borderSkipped,
        res = {}
    if (!edge) {
        properties.borderSkipped = res
        return
    }
    if (edge === !0) {
        properties.borderSkipped = { top: !0, right: !0, bottom: !0, left: !0 }
        return
    }
    let { start, end, reverse, top, bottom } = borderProps(properties)
    edge === 'middle' &&
        stack &&
        ((properties.enableBorderRadius = !0),
        (stack._top || 0) === index2
            ? (edge = top)
            : (stack._bottom || 0) === index2
            ? (edge = bottom)
            : ((res[parseEdge(bottom, start, end, reverse)] = !0),
              (edge = top))),
        (res[parseEdge(edge, start, end, reverse)] = !0),
        (properties.borderSkipped = res)
}
function parseEdge(edge, a, b, reverse) {
    return (
        reverse
            ? ((edge = swap(edge, a, b)), (edge = startEnd(edge, b, a)))
            : (edge = startEnd(edge, a, b)),
        edge
    )
}
function swap(orig, v1, v2) {
    return orig === v1 ? v2 : orig === v2 ? v1 : orig
}
function startEnd(v, start, end) {
    return v === 'start' ? start : v === 'end' ? end : v
}
function setInflateAmount(properties, { inflateAmount }, ratio) {
    properties.inflateAmount =
        inflateAmount === 'auto' ? (ratio === 1 ? 0.33 : 0) : inflateAmount
}
var BarController = class extends DatasetController {
    parsePrimitiveData(meta, data, start, count) {
        return parseArrayOrPrimitive(meta, data, start, count)
    }
    parseArrayData(meta, data, start, count) {
        return parseArrayOrPrimitive(meta, data, start, count)
    }
    parseObjectData(meta, data, start, count) {
        let { iScale, vScale } = meta,
            { xAxisKey = 'x', yAxisKey = 'y' } = this._parsing,
            iAxisKey = iScale.axis === 'x' ? xAxisKey : yAxisKey,
            vAxisKey = vScale.axis === 'x' ? xAxisKey : yAxisKey,
            parsed = [],
            i,
            ilen,
            item,
            obj
        for (i = start, ilen = start + count; i < ilen; ++i)
            (obj = data[i]),
                (item = {}),
                (item[iScale.axis] = iScale.parse(
                    resolveObjectKey(obj, iAxisKey),
                    i,
                )),
                parsed.push(
                    parseValue(
                        resolveObjectKey(obj, vAxisKey),
                        item,
                        vScale,
                        i,
                    ),
                )
        return parsed
    }
    updateRangeFromParsed(range, scale, parsed, stack) {
        super.updateRangeFromParsed(range, scale, parsed, stack)
        let custom = parsed._custom
        custom &&
            scale === this._cachedMeta.vScale &&
            ((range.min = Math.min(range.min, custom.min)),
            (range.max = Math.max(range.max, custom.max)))
    }
    getMaxOverflow() {
        return 0
    }
    getLabelAndValue(index2) {
        let meta = this._cachedMeta,
            { iScale, vScale } = meta,
            parsed = this.getParsed(index2),
            custom = parsed._custom,
            value = isFloatBar(custom)
                ? '[' + custom.start + ', ' + custom.end + ']'
                : '' + vScale.getLabelForValue(parsed[vScale.axis])
        return {
            label: '' + iScale.getLabelForValue(parsed[iScale.axis]),
            value,
        }
    }
    initialize() {
        ;(this.enableOptionSharing = !0), super.initialize()
        let meta = this._cachedMeta
        meta.stack = this.getDataset().stack
    }
    update(mode) {
        let meta = this._cachedMeta
        this.updateElements(meta.data, 0, meta.data.length, mode)
    }
    updateElements(bars, start, count, mode) {
        let reset = mode === 'reset',
            {
                index: index2,
                _cachedMeta: { vScale },
            } = this,
            base = vScale.getBasePixel(),
            horizontal = vScale.isHorizontal(),
            ruler = this._getRuler(),
            { sharedOptions, includeOptions } = this._getSharedOptions(
                start,
                mode,
            )
        for (let i = start; i < start + count; i++) {
            let parsed = this.getParsed(i),
                vpixels =
                    reset || isNullOrUndef(parsed[vScale.axis])
                        ? { base, head: base }
                        : this._calculateBarValuePixels(i),
                ipixels = this._calculateBarIndexPixels(i, ruler),
                stack = (parsed._stacks || {})[vScale.axis],
                properties = {
                    horizontal,
                    base: vpixels.base,
                    enableBorderRadius:
                        !stack ||
                        isFloatBar(parsed._custom) ||
                        index2 === stack._top ||
                        index2 === stack._bottom,
                    x: horizontal ? vpixels.head : ipixels.center,
                    y: horizontal ? ipixels.center : vpixels.head,
                    height: horizontal ? ipixels.size : Math.abs(vpixels.size),
                    width: horizontal ? Math.abs(vpixels.size) : ipixels.size,
                }
            includeOptions &&
                (properties.options =
                    sharedOptions ||
                    this.resolveDataElementOptions(
                        i,
                        bars[i].active ? 'active' : mode,
                    ))
            let options = properties.options || bars[i].options
            setBorderSkipped(properties, options, stack, index2),
                setInflateAmount(properties, options, ruler.ratio),
                this.updateElement(bars[i], i, properties, mode)
        }
    }
    _getStacks(last, dataIndex) {
        let { iScale } = this._cachedMeta,
            metasets = iScale
                .getMatchingVisibleMetas(this._type)
                .filter((meta) => meta.controller.options.grouped),
            stacked = iScale.options.stacked,
            stacks = [],
            skipNull = (meta) => {
                let parsed = meta.controller.getParsed(dataIndex),
                    val = parsed && parsed[meta.vScale.axis]
                if (isNullOrUndef(val) || isNaN(val)) return !0
            }
        for (let meta of metasets)
            if (
                !(dataIndex !== void 0 && skipNull(meta)) &&
                ((stacked === !1 ||
                    stacks.indexOf(meta.stack) === -1 ||
                    (stacked === void 0 && meta.stack === void 0)) &&
                    stacks.push(meta.stack),
                meta.index === last)
            )
                break
        return stacks.length || stacks.push(void 0), stacks
    }
    _getStackCount(index2) {
        return this._getStacks(void 0, index2).length
    }
    _getStackIndex(datasetIndex, name, dataIndex) {
        let stacks = this._getStacks(datasetIndex, dataIndex),
            index2 = name !== void 0 ? stacks.indexOf(name) : -1
        return index2 === -1 ? stacks.length - 1 : index2
    }
    _getRuler() {
        let opts = this.options,
            meta = this._cachedMeta,
            iScale = meta.iScale,
            pixels = [],
            i,
            ilen
        for (i = 0, ilen = meta.data.length; i < ilen; ++i)
            pixels.push(
                iScale.getPixelForValue(this.getParsed(i)[iScale.axis], i),
            )
        let barThickness = opts.barThickness
        return {
            min: barThickness || computeMinSampleSize(meta),
            pixels,
            start: iScale._startPixel,
            end: iScale._endPixel,
            stackCount: this._getStackCount(),
            scale: iScale,
            grouped: opts.grouped,
            ratio: barThickness
                ? 1
                : opts.categoryPercentage * opts.barPercentage,
        }
    }
    _calculateBarValuePixels(index2) {
        let {
                _cachedMeta: { vScale, _stacked },
                options: { base: baseValue, minBarLength },
            } = this,
            actualBase = baseValue || 0,
            parsed = this.getParsed(index2),
            custom = parsed._custom,
            floating = isFloatBar(custom),
            value = parsed[vScale.axis],
            start = 0,
            length = _stacked
                ? this.applyStack(vScale, parsed, _stacked)
                : value,
            head,
            size
        length !== value && ((start = length - value), (length = value)),
            floating &&
                ((value = custom.barStart),
                (length = custom.barEnd - custom.barStart),
                value !== 0 &&
                    sign(value) !== sign(custom.barEnd) &&
                    (start = 0),
                (start += value))
        let startValue =
                !isNullOrUndef(baseValue) && !floating ? baseValue : start,
            base = vScale.getPixelForValue(startValue)
        if (
            (this.chart.getDataVisibility(index2)
                ? (head = vScale.getPixelForValue(start + length))
                : (head = base),
            (size = head - base),
            Math.abs(size) < minBarLength)
        ) {
            ;(size = barSign(size, vScale, actualBase) * minBarLength),
                value === actualBase && (base -= size / 2)
            let startPixel = vScale.getPixelForDecimal(0),
                endPixel = vScale.getPixelForDecimal(1),
                min = Math.min(startPixel, endPixel),
                max = Math.max(startPixel, endPixel)
            ;(base = Math.max(Math.min(base, max), min)), (head = base + size)
        }
        if (base === vScale.getPixelForValue(actualBase)) {
            let halfGrid =
                (sign(size) * vScale.getLineWidthForValue(actualBase)) / 2
            ;(base += halfGrid), (size -= halfGrid)
        }
        return { size, base, head, center: head + size / 2 }
    }
    _calculateBarIndexPixels(index2, ruler) {
        let scale = ruler.scale,
            options = this.options,
            skipNull = options.skipNull,
            maxBarThickness = valueOrDefault(options.maxBarThickness, Infinity),
            center,
            size
        if (ruler.grouped) {
            let stackCount = skipNull
                    ? this._getStackCount(index2)
                    : ruler.stackCount,
                range =
                    options.barThickness === 'flex'
                        ? computeFlexCategoryTraits(
                              index2,
                              ruler,
                              options,
                              stackCount,
                          )
                        : computeFitCategoryTraits(
                              index2,
                              ruler,
                              options,
                              stackCount,
                          ),
                stackIndex = this._getStackIndex(
                    this.index,
                    this._cachedMeta.stack,
                    skipNull ? index2 : void 0,
                )
            ;(center =
                range.start + range.chunk * stackIndex + range.chunk / 2),
                (size = Math.min(maxBarThickness, range.chunk * range.ratio))
        } else
            (center = scale.getPixelForValue(
                this.getParsed(index2)[scale.axis],
                index2,
            )),
                (size = Math.min(maxBarThickness, ruler.min * ruler.ratio))
        return {
            base: center - size / 2,
            head: center + size / 2,
            center,
            size,
        }
    }
    draw() {
        let meta = this._cachedMeta,
            vScale = meta.vScale,
            rects = meta.data,
            ilen = rects.length,
            i = 0
        for (; i < ilen; ++i)
            this.getParsed(i)[vScale.axis] !== null && rects[i].draw(this._ctx)
    }
}
BarController.id = 'bar'
BarController.defaults = {
    datasetElementType: !1,
    dataElementType: 'bar',
    categoryPercentage: 0.8,
    barPercentage: 0.9,
    grouped: !0,
    animations: {
        numbers: {
            type: 'number',
            properties: ['x', 'y', 'base', 'width', 'height'],
        },
    },
}
BarController.overrides = {
    scales: {
        _index_: { type: 'category', offset: !0, grid: { offset: !0 } },
        _value_: { type: 'linear', beginAtZero: !0 },
    },
}
var BubbleController = class extends DatasetController {
    initialize() {
        ;(this.enableOptionSharing = !0), super.initialize()
    }
    parsePrimitiveData(meta, data, start, count) {
        let parsed = super.parsePrimitiveData(meta, data, start, count)
        for (let i = 0; i < parsed.length; i++)
            parsed[i]._custom = this.resolveDataElementOptions(i + start).radius
        return parsed
    }
    parseArrayData(meta, data, start, count) {
        let parsed = super.parseArrayData(meta, data, start, count)
        for (let i = 0; i < parsed.length; i++) {
            let item = data[start + i]
            parsed[i]._custom = valueOrDefault(
                item[2],
                this.resolveDataElementOptions(i + start).radius,
            )
        }
        return parsed
    }
    parseObjectData(meta, data, start, count) {
        let parsed = super.parseObjectData(meta, data, start, count)
        for (let i = 0; i < parsed.length; i++) {
            let item = data[start + i]
            parsed[i]._custom = valueOrDefault(
                item && item.r && +item.r,
                this.resolveDataElementOptions(i + start).radius,
            )
        }
        return parsed
    }
    getMaxOverflow() {
        let data = this._cachedMeta.data,
            max = 0
        for (let i = data.length - 1; i >= 0; --i)
            max = Math.max(
                max,
                data[i].size(this.resolveDataElementOptions(i)) / 2,
            )
        return max > 0 && max
    }
    getLabelAndValue(index2) {
        let meta = this._cachedMeta,
            { xScale, yScale } = meta,
            parsed = this.getParsed(index2),
            x = xScale.getLabelForValue(parsed.x),
            y = yScale.getLabelForValue(parsed.y),
            r = parsed._custom
        return {
            label: meta.label,
            value: '(' + x + ', ' + y + (r ? ', ' + r : '') + ')',
        }
    }
    update(mode) {
        let points = this._cachedMeta.data
        this.updateElements(points, 0, points.length, mode)
    }
    updateElements(points, start, count, mode) {
        let reset = mode === 'reset',
            { iScale, vScale } = this._cachedMeta,
            { sharedOptions, includeOptions } = this._getSharedOptions(
                start,
                mode,
            ),
            iAxis = iScale.axis,
            vAxis = vScale.axis
        for (let i = start; i < start + count; i++) {
            let point = points[i],
                parsed = !reset && this.getParsed(i),
                properties = {},
                iPixel = (properties[iAxis] = reset
                    ? iScale.getPixelForDecimal(0.5)
                    : iScale.getPixelForValue(parsed[iAxis])),
                vPixel = (properties[vAxis] = reset
                    ? vScale.getBasePixel()
                    : vScale.getPixelForValue(parsed[vAxis]))
            ;(properties.skip = isNaN(iPixel) || isNaN(vPixel)),
                includeOptions &&
                    ((properties.options =
                        sharedOptions ||
                        this.resolveDataElementOptions(
                            i,
                            point.active ? 'active' : mode,
                        )),
                    reset && (properties.options.radius = 0)),
                this.updateElement(point, i, properties, mode)
        }
    }
    resolveDataElementOptions(index2, mode) {
        let parsed = this.getParsed(index2),
            values = super.resolveDataElementOptions(index2, mode)
        values.$shared && (values = Object.assign({}, values, { $shared: !1 }))
        let radius = values.radius
        return (
            mode !== 'active' && (values.radius = 0),
            (values.radius += valueOrDefault(parsed && parsed._custom, radius)),
            values
        )
    }
}
BubbleController.id = 'bubble'
BubbleController.defaults = {
    datasetElementType: !1,
    dataElementType: 'point',
    animations: {
        numbers: {
            type: 'number',
            properties: ['x', 'y', 'borderWidth', 'radius'],
        },
    },
}
BubbleController.overrides = {
    scales: { x: { type: 'linear' }, y: { type: 'linear' } },
    plugins: {
        tooltip: {
            callbacks: {
                title() {
                    return ''
                },
            },
        },
    },
}
function getRatioAndOffset(rotation, circumference, cutout) {
    let ratioX = 1,
        ratioY = 1,
        offsetX = 0,
        offsetY = 0
    if (circumference < TAU) {
        let startAngle = rotation,
            endAngle = startAngle + circumference,
            startX = Math.cos(startAngle),
            startY = Math.sin(startAngle),
            endX = Math.cos(endAngle),
            endY = Math.sin(endAngle),
            calcMax = (angle, a, b) =>
                _angleBetween(angle, startAngle, endAngle, !0)
                    ? 1
                    : Math.max(a, a * cutout, b, b * cutout),
            calcMin = (angle, a, b) =>
                _angleBetween(angle, startAngle, endAngle, !0)
                    ? -1
                    : Math.min(a, a * cutout, b, b * cutout),
            maxX = calcMax(0, startX, endX),
            maxY = calcMax(HALF_PI, startY, endY),
            minX = calcMin(PI, startX, endX),
            minY = calcMin(PI + HALF_PI, startY, endY)
        ;(ratioX = (maxX - minX) / 2),
            (ratioY = (maxY - minY) / 2),
            (offsetX = -(maxX + minX) / 2),
            (offsetY = -(maxY + minY) / 2)
    }
    return { ratioX, ratioY, offsetX, offsetY }
}
var DoughnutController = class extends DatasetController {
    constructor(chart2, datasetIndex) {
        super(chart2, datasetIndex)
        ;(this.enableOptionSharing = !0),
            (this.innerRadius = void 0),
            (this.outerRadius = void 0),
            (this.offsetX = void 0),
            (this.offsetY = void 0)
    }
    linkScales() {}
    parse(start, count) {
        let data = this.getDataset().data,
            meta = this._cachedMeta
        if (this._parsing === !1) meta._parsed = data
        else {
            let getter = (i2) => +data[i2]
            if (isObject(data[start])) {
                let { key = 'value' } = this._parsing
                getter = (i2) => +resolveObjectKey(data[i2], key)
            }
            let i, ilen
            for (i = start, ilen = start + count; i < ilen; ++i)
                meta._parsed[i] = getter(i)
        }
    }
    _getRotation() {
        return toRadians(this.options.rotation - 90)
    }
    _getCircumference() {
        return toRadians(this.options.circumference)
    }
    _getRotationExtents() {
        let min = TAU,
            max = -TAU
        for (let i = 0; i < this.chart.data.datasets.length; ++i)
            if (this.chart.isDatasetVisible(i)) {
                let controller = this.chart.getDatasetMeta(i).controller,
                    rotation = controller._getRotation(),
                    circumference = controller._getCircumference()
                ;(min = Math.min(min, rotation)),
                    (max = Math.max(max, rotation + circumference))
            }
        return { rotation: min, circumference: max - min }
    }
    update(mode) {
        let chart2 = this.chart,
            { chartArea } = chart2,
            meta = this._cachedMeta,
            arcs = meta.data,
            spacing =
                this.getMaxBorderWidth() +
                this.getMaxOffset(arcs) +
                this.options.spacing,
            maxSize = Math.max(
                (Math.min(chartArea.width, chartArea.height) - spacing) / 2,
                0,
            ),
            cutout = Math.min(toPercentage(this.options.cutout, maxSize), 1),
            chartWeight = this._getRingWeight(this.index),
            { circumference, rotation } = this._getRotationExtents(),
            { ratioX, ratioY, offsetX, offsetY } = getRatioAndOffset(
                rotation,
                circumference,
                cutout,
            ),
            maxWidth = (chartArea.width - spacing) / ratioX,
            maxHeight = (chartArea.height - spacing) / ratioY,
            maxRadius = Math.max(Math.min(maxWidth, maxHeight) / 2, 0),
            outerRadius = toDimension(this.options.radius, maxRadius),
            innerRadius = Math.max(outerRadius * cutout, 0),
            radiusLength =
                (outerRadius - innerRadius) /
                this._getVisibleDatasetWeightTotal()
        ;(this.offsetX = offsetX * outerRadius),
            (this.offsetY = offsetY * outerRadius),
            (meta.total = this.calculateTotal()),
            (this.outerRadius =
                outerRadius -
                radiusLength * this._getRingWeightOffset(this.index)),
            (this.innerRadius = Math.max(
                this.outerRadius - radiusLength * chartWeight,
                0,
            )),
            this.updateElements(arcs, 0, arcs.length, mode)
    }
    _circumference(i, reset) {
        let opts = this.options,
            meta = this._cachedMeta,
            circumference = this._getCircumference()
        return (reset && opts.animation.animateRotate) ||
            !this.chart.getDataVisibility(i) ||
            meta._parsed[i] === null ||
            meta.data[i].hidden
            ? 0
            : this.calculateCircumference(
                  (meta._parsed[i] * circumference) / TAU,
              )
    }
    updateElements(arcs, start, count, mode) {
        let reset = mode === 'reset',
            chart2 = this.chart,
            chartArea = chart2.chartArea,
            animationOpts = chart2.options.animation,
            centerX = (chartArea.left + chartArea.right) / 2,
            centerY = (chartArea.top + chartArea.bottom) / 2,
            animateScale = reset && animationOpts.animateScale,
            innerRadius = animateScale ? 0 : this.innerRadius,
            outerRadius = animateScale ? 0 : this.outerRadius,
            { sharedOptions, includeOptions } = this._getSharedOptions(
                start,
                mode,
            ),
            startAngle = this._getRotation(),
            i
        for (i = 0; i < start; ++i) startAngle += this._circumference(i, reset)
        for (i = start; i < start + count; ++i) {
            let circumference = this._circumference(i, reset),
                arc = arcs[i],
                properties = {
                    x: centerX + this.offsetX,
                    y: centerY + this.offsetY,
                    startAngle,
                    endAngle: startAngle + circumference,
                    circumference,
                    outerRadius,
                    innerRadius,
                }
            includeOptions &&
                (properties.options =
                    sharedOptions ||
                    this.resolveDataElementOptions(
                        i,
                        arc.active ? 'active' : mode,
                    )),
                (startAngle += circumference),
                this.updateElement(arc, i, properties, mode)
        }
    }
    calculateTotal() {
        let meta = this._cachedMeta,
            metaData = meta.data,
            total = 0,
            i
        for (i = 0; i < metaData.length; i++) {
            let value = meta._parsed[i]
            value !== null &&
                !isNaN(value) &&
                this.chart.getDataVisibility(i) &&
                !metaData[i].hidden &&
                (total += Math.abs(value))
        }
        return total
    }
    calculateCircumference(value) {
        let total = this._cachedMeta.total
        return total > 0 && !isNaN(value) ? TAU * (Math.abs(value) / total) : 0
    }
    getLabelAndValue(index2) {
        let meta = this._cachedMeta,
            chart2 = this.chart,
            labels = chart2.data.labels || [],
            value = formatNumber(meta._parsed[index2], chart2.options.locale)
        return { label: labels[index2] || '', value }
    }
    getMaxBorderWidth(arcs) {
        let max = 0,
            chart2 = this.chart,
            i,
            ilen,
            meta,
            controller,
            options
        if (!arcs) {
            for (i = 0, ilen = chart2.data.datasets.length; i < ilen; ++i)
                if (chart2.isDatasetVisible(i)) {
                    ;(meta = chart2.getDatasetMeta(i)),
                        (arcs = meta.data),
                        (controller = meta.controller)
                    break
                }
        }
        if (!arcs) return 0
        for (i = 0, ilen = arcs.length; i < ilen; ++i)
            (options = controller.resolveDataElementOptions(i)),
                options.borderAlign !== 'inner' &&
                    (max = Math.max(
                        max,
                        options.borderWidth || 0,
                        options.hoverBorderWidth || 0,
                    ))
        return max
    }
    getMaxOffset(arcs) {
        let max = 0
        for (let i = 0, ilen = arcs.length; i < ilen; ++i) {
            let options = this.resolveDataElementOptions(i)
            max = Math.max(max, options.offset || 0, options.hoverOffset || 0)
        }
        return max
    }
    _getRingWeightOffset(datasetIndex) {
        let ringWeightOffset = 0
        for (let i = 0; i < datasetIndex; ++i)
            this.chart.isDatasetVisible(i) &&
                (ringWeightOffset += this._getRingWeight(i))
        return ringWeightOffset
    }
    _getRingWeight(datasetIndex) {
        return Math.max(
            valueOrDefault(this.chart.data.datasets[datasetIndex].weight, 1),
            0,
        )
    }
    _getVisibleDatasetWeightTotal() {
        return this._getRingWeightOffset(this.chart.data.datasets.length) || 1
    }
}
DoughnutController.id = 'doughnut'
DoughnutController.defaults = {
    datasetElementType: !1,
    dataElementType: 'arc',
    animation: { animateRotate: !0, animateScale: !1 },
    animations: {
        numbers: {
            type: 'number',
            properties: [
                'circumference',
                'endAngle',
                'innerRadius',
                'outerRadius',
                'startAngle',
                'x',
                'y',
                'offset',
                'borderWidth',
                'spacing',
            ],
        },
    },
    cutout: '50%',
    rotation: 0,
    circumference: 360,
    radius: '100%',
    spacing: 0,
    indexAxis: 'r',
}
DoughnutController.descriptors = {
    _scriptable: (name) => name !== 'spacing',
    _indexable: (name) => name !== 'spacing',
}
DoughnutController.overrides = {
    aspectRatio: 1,
    plugins: {
        legend: {
            labels: {
                generateLabels(chart2) {
                    let data = chart2.data
                    if (data.labels.length && data.datasets.length) {
                        let {
                            labels: { pointStyle },
                        } = chart2.legend.options
                        return data.labels.map((label, i) => {
                            let style = chart2
                                .getDatasetMeta(0)
                                .controller.getStyle(i)
                            return {
                                text: label,
                                fillStyle: style.backgroundColor,
                                strokeStyle: style.borderColor,
                                lineWidth: style.borderWidth,
                                pointStyle,
                                hidden: !chart2.getDataVisibility(i),
                                index: i,
                            }
                        })
                    }
                    return []
                },
            },
            onClick(e, legendItem, legend) {
                legend.chart.toggleDataVisibility(legendItem.index),
                    legend.chart.update()
            },
        },
        tooltip: {
            callbacks: {
                title() {
                    return ''
                },
                label(tooltipItem) {
                    let dataLabel = tooltipItem.label,
                        value = ': ' + tooltipItem.formattedValue
                    return (
                        isArray(dataLabel)
                            ? ((dataLabel = dataLabel.slice()),
                              (dataLabel[0] += value))
                            : (dataLabel += value),
                        dataLabel
                    )
                },
            },
        },
    },
}
var LineController = class extends DatasetController {
    initialize() {
        ;(this.enableOptionSharing = !0),
            (this.supportsDecimation = !0),
            super.initialize()
    }
    update(mode) {
        let meta = this._cachedMeta,
            { dataset: line, data: points = [], _dataset } = meta,
            animationsDisabled = this.chart._animationsDisabled,
            { start, count } = _getStartAndCountOfVisiblePoints(
                meta,
                points,
                animationsDisabled,
            )
        ;(this._drawStart = start),
            (this._drawCount = count),
            _scaleRangesChanged(meta) && ((start = 0), (count = points.length)),
            (line._chart = this.chart),
            (line._datasetIndex = this.index),
            (line._decimated = !!_dataset._decimated),
            (line.points = points)
        let options = this.resolveDatasetElementOptions(mode)
        this.options.showLine || (options.borderWidth = 0),
            (options.segment = this.options.segment),
            this.updateElement(
                line,
                void 0,
                { animated: !animationsDisabled, options },
                mode,
            ),
            this.updateElements(points, start, count, mode)
    }
    updateElements(points, start, count, mode) {
        let reset = mode === 'reset',
            { iScale, vScale, _stacked, _dataset } = this._cachedMeta,
            { sharedOptions, includeOptions } = this._getSharedOptions(
                start,
                mode,
            ),
            iAxis = iScale.axis,
            vAxis = vScale.axis,
            { spanGaps, segment } = this.options,
            maxGapLength = isNumber(spanGaps)
                ? spanGaps
                : Number.POSITIVE_INFINITY,
            directUpdate =
                this.chart._animationsDisabled || reset || mode === 'none',
            prevParsed = start > 0 && this.getParsed(start - 1)
        for (let i = start; i < start + count; ++i) {
            let point = points[i],
                parsed = this.getParsed(i),
                properties = directUpdate ? point : {},
                nullData = isNullOrUndef(parsed[vAxis]),
                iPixel = (properties[iAxis] = iScale.getPixelForValue(
                    parsed[iAxis],
                    i,
                )),
                vPixel = (properties[vAxis] =
                    reset || nullData
                        ? vScale.getBasePixel()
                        : vScale.getPixelForValue(
                              _stacked
                                  ? this.applyStack(vScale, parsed, _stacked)
                                  : parsed[vAxis],
                              i,
                          ))
            ;(properties.skip = isNaN(iPixel) || isNaN(vPixel) || nullData),
                (properties.stop =
                    i > 0 &&
                    Math.abs(parsed[iAxis] - prevParsed[iAxis]) > maxGapLength),
                segment &&
                    ((properties.parsed = parsed),
                    (properties.raw = _dataset.data[i])),
                includeOptions &&
                    (properties.options =
                        sharedOptions ||
                        this.resolveDataElementOptions(
                            i,
                            point.active ? 'active' : mode,
                        )),
                directUpdate || this.updateElement(point, i, properties, mode),
                (prevParsed = parsed)
        }
    }
    getMaxOverflow() {
        let meta = this._cachedMeta,
            dataset = meta.dataset,
            border = (dataset.options && dataset.options.borderWidth) || 0,
            data = meta.data || []
        if (!data.length) return border
        let firstPoint = data[0].size(this.resolveDataElementOptions(0)),
            lastPoint = data[data.length - 1].size(
                this.resolveDataElementOptions(data.length - 1),
            )
        return Math.max(border, firstPoint, lastPoint) / 2
    }
    draw() {
        let meta = this._cachedMeta
        meta.dataset.updateControlPoints(
            this.chart.chartArea,
            meta.iScale.axis,
        ),
            super.draw()
    }
}
LineController.id = 'line'
LineController.defaults = {
    datasetElementType: 'line',
    dataElementType: 'point',
    showLine: !0,
    spanGaps: !1,
}
LineController.overrides = {
    scales: { _index_: { type: 'category' }, _value_: { type: 'linear' } },
}
var PolarAreaController = class extends DatasetController {
    constructor(chart2, datasetIndex) {
        super(chart2, datasetIndex)
        ;(this.innerRadius = void 0), (this.outerRadius = void 0)
    }
    getLabelAndValue(index2) {
        let meta = this._cachedMeta,
            chart2 = this.chart,
            labels = chart2.data.labels || [],
            value = formatNumber(meta._parsed[index2].r, chart2.options.locale)
        return { label: labels[index2] || '', value }
    }
    parseObjectData(meta, data, start, count) {
        return _parseObjectDataRadialScale.bind(this)(meta, data, start, count)
    }
    update(mode) {
        let arcs = this._cachedMeta.data
        this._updateRadius(), this.updateElements(arcs, 0, arcs.length, mode)
    }
    getMinMax() {
        let meta = this._cachedMeta,
            range = {
                min: Number.POSITIVE_INFINITY,
                max: Number.NEGATIVE_INFINITY,
            }
        return (
            meta.data.forEach((element, index2) => {
                let parsed = this.getParsed(index2).r
                !isNaN(parsed) &&
                    this.chart.getDataVisibility(index2) &&
                    (parsed < range.min && (range.min = parsed),
                    parsed > range.max && (range.max = parsed))
            }),
            range
        )
    }
    _updateRadius() {
        let chart2 = this.chart,
            chartArea = chart2.chartArea,
            opts = chart2.options,
            minSize = Math.min(
                chartArea.right - chartArea.left,
                chartArea.bottom - chartArea.top,
            ),
            outerRadius = Math.max(minSize / 2, 0),
            innerRadius = Math.max(
                opts.cutoutPercentage
                    ? (outerRadius / 100) * opts.cutoutPercentage
                    : 1,
                0,
            ),
            radiusLength =
                (outerRadius - innerRadius) / chart2.getVisibleDatasetCount()
        ;(this.outerRadius = outerRadius - radiusLength * this.index),
            (this.innerRadius = this.outerRadius - radiusLength)
    }
    updateElements(arcs, start, count, mode) {
        let reset = mode === 'reset',
            chart2 = this.chart,
            animationOpts = chart2.options.animation,
            scale = this._cachedMeta.rScale,
            centerX = scale.xCenter,
            centerY = scale.yCenter,
            datasetStartAngle = scale.getIndexAngle(0) - 0.5 * PI,
            angle = datasetStartAngle,
            i,
            defaultAngle = 360 / this.countVisibleElements()
        for (i = 0; i < start; ++i)
            angle += this._computeAngle(i, mode, defaultAngle)
        for (i = start; i < start + count; i++) {
            let arc = arcs[i],
                startAngle = angle,
                endAngle = angle + this._computeAngle(i, mode, defaultAngle),
                outerRadius = chart2.getDataVisibility(i)
                    ? scale.getDistanceFromCenterForValue(this.getParsed(i).r)
                    : 0
            ;(angle = endAngle),
                reset &&
                    (animationOpts.animateScale && (outerRadius = 0),
                    animationOpts.animateRotate &&
                        (startAngle = endAngle = datasetStartAngle))
            let properties = {
                x: centerX,
                y: centerY,
                innerRadius: 0,
                outerRadius,
                startAngle,
                endAngle,
                options: this.resolveDataElementOptions(
                    i,
                    arc.active ? 'active' : mode,
                ),
            }
            this.updateElement(arc, i, properties, mode)
        }
    }
    countVisibleElements() {
        let meta = this._cachedMeta,
            count = 0
        return (
            meta.data.forEach((element, index2) => {
                !isNaN(this.getParsed(index2).r) &&
                    this.chart.getDataVisibility(index2) &&
                    count++
            }),
            count
        )
    }
    _computeAngle(index2, mode, defaultAngle) {
        return this.chart.getDataVisibility(index2)
            ? toRadians(
                  this.resolveDataElementOptions(index2, mode).angle ||
                      defaultAngle,
              )
            : 0
    }
}
PolarAreaController.id = 'polarArea'
PolarAreaController.defaults = {
    dataElementType: 'arc',
    animation: { animateRotate: !0, animateScale: !0 },
    animations: {
        numbers: {
            type: 'number',
            properties: [
                'x',
                'y',
                'startAngle',
                'endAngle',
                'innerRadius',
                'outerRadius',
            ],
        },
    },
    indexAxis: 'r',
    startAngle: 0,
}
PolarAreaController.overrides = {
    aspectRatio: 1,
    plugins: {
        legend: {
            labels: {
                generateLabels(chart2) {
                    let data = chart2.data
                    if (data.labels.length && data.datasets.length) {
                        let {
                            labels: { pointStyle },
                        } = chart2.legend.options
                        return data.labels.map((label, i) => {
                            let style = chart2
                                .getDatasetMeta(0)
                                .controller.getStyle(i)
                            return {
                                text: label,
                                fillStyle: style.backgroundColor,
                                strokeStyle: style.borderColor,
                                lineWidth: style.borderWidth,
                                pointStyle,
                                hidden: !chart2.getDataVisibility(i),
                                index: i,
                            }
                        })
                    }
                    return []
                },
            },
            onClick(e, legendItem, legend) {
                legend.chart.toggleDataVisibility(legendItem.index),
                    legend.chart.update()
            },
        },
        tooltip: {
            callbacks: {
                title() {
                    return ''
                },
                label(context) {
                    return (
                        context.chart.data.labels[context.dataIndex] +
                        ': ' +
                        context.formattedValue
                    )
                },
            },
        },
    },
    scales: {
        r: {
            type: 'radialLinear',
            angleLines: { display: !1 },
            beginAtZero: !0,
            grid: { circular: !0 },
            pointLabels: { display: !1 },
            startAngle: 0,
        },
    },
}
var PieController = class extends DoughnutController {}
PieController.id = 'pie'
PieController.defaults = {
    cutout: 0,
    rotation: 0,
    circumference: 360,
    radius: '100%',
}
var RadarController = class extends DatasetController {
    getLabelAndValue(index2) {
        let vScale = this._cachedMeta.vScale,
            parsed = this.getParsed(index2)
        return {
            label: vScale.getLabels()[index2],
            value: '' + vScale.getLabelForValue(parsed[vScale.axis]),
        }
    }
    parseObjectData(meta, data, start, count) {
        return _parseObjectDataRadialScale.bind(this)(meta, data, start, count)
    }
    update(mode) {
        let meta = this._cachedMeta,
            line = meta.dataset,
            points = meta.data || [],
            labels = meta.iScale.getLabels()
        if (((line.points = points), mode !== 'resize')) {
            let options = this.resolveDatasetElementOptions(mode)
            this.options.showLine || (options.borderWidth = 0)
            let properties = {
                _loop: !0,
                _fullLoop: labels.length === points.length,
                options,
            }
            this.updateElement(line, void 0, properties, mode)
        }
        this.updateElements(points, 0, points.length, mode)
    }
    updateElements(points, start, count, mode) {
        let scale = this._cachedMeta.rScale,
            reset = mode === 'reset'
        for (let i = start; i < start + count; i++) {
            let point = points[i],
                options = this.resolveDataElementOptions(
                    i,
                    point.active ? 'active' : mode,
                ),
                pointPosition = scale.getPointPositionForValue(
                    i,
                    this.getParsed(i).r,
                ),
                x = reset ? scale.xCenter : pointPosition.x,
                y = reset ? scale.yCenter : pointPosition.y,
                properties = {
                    x,
                    y,
                    angle: pointPosition.angle,
                    skip: isNaN(x) || isNaN(y),
                    options,
                }
            this.updateElement(point, i, properties, mode)
        }
    }
}
RadarController.id = 'radar'
RadarController.defaults = {
    datasetElementType: 'line',
    dataElementType: 'point',
    indexAxis: 'r',
    showLine: !0,
    elements: { line: { fill: 'start' } },
}
RadarController.overrides = {
    aspectRatio: 1,
    scales: { r: { type: 'radialLinear' } },
}
var Element = class {
    constructor() {
        ;(this.x = void 0),
            (this.y = void 0),
            (this.active = !1),
            (this.options = void 0),
            (this.$animations = void 0)
    }
    tooltipPosition(useFinalPosition) {
        let { x, y } = this.getProps(['x', 'y'], useFinalPosition)
        return { x, y }
    }
    hasValue() {
        return isNumber(this.x) && isNumber(this.y)
    }
    getProps(props, final) {
        let anims = this.$animations
        if (!final || !anims) return this
        let ret = {}
        return (
            props.forEach((prop) => {
                ret[prop] =
                    anims[prop] && anims[prop].active()
                        ? anims[prop]._to
                        : this[prop]
            }),
            ret
        )
    }
}
Element.defaults = {}
Element.defaultRoutes = void 0
var formatters = {
    values(value) {
        return isArray(value) ? value : '' + value
    },
    numeric(tickValue, index2, ticks) {
        if (tickValue === 0) return '0'
        let locale = this.chart.options.locale,
            notation,
            delta = tickValue
        if (ticks.length > 1) {
            let maxTick = Math.max(
                Math.abs(ticks[0].value),
                Math.abs(ticks[ticks.length - 1].value),
            )
            ;(maxTick < 1e-4 || maxTick > 1e15) && (notation = 'scientific'),
                (delta = calculateDelta(tickValue, ticks))
        }
        let logDelta = log10(Math.abs(delta)),
            numDecimal = Math.max(Math.min(-1 * Math.floor(logDelta), 20), 0),
            options = {
                notation,
                minimumFractionDigits: numDecimal,
                maximumFractionDigits: numDecimal,
            }
        return (
            Object.assign(options, this.options.ticks.format),
            formatNumber(tickValue, locale, options)
        )
    },
    logarithmic(tickValue, index2, ticks) {
        if (tickValue === 0) return '0'
        let remain = tickValue / Math.pow(10, Math.floor(log10(tickValue)))
        return remain === 1 || remain === 2 || remain === 5
            ? formatters.numeric.call(this, tickValue, index2, ticks)
            : ''
    },
}
function calculateDelta(tickValue, ticks) {
    let delta =
        ticks.length > 3
            ? ticks[2].value - ticks[1].value
            : ticks[1].value - ticks[0].value
    return (
        Math.abs(delta) >= 1 &&
            tickValue !== Math.floor(tickValue) &&
            (delta = tickValue - Math.floor(tickValue)),
        delta
    )
}
var Ticks = { formatters }
defaults.set('scale', {
    display: !0,
    offset: !1,
    reverse: !1,
    beginAtZero: !1,
    bounds: 'ticks',
    grace: 0,
    grid: {
        display: !0,
        lineWidth: 1,
        drawBorder: !0,
        drawOnChartArea: !0,
        drawTicks: !0,
        tickLength: 8,
        tickWidth: (_ctx, options) => options.lineWidth,
        tickColor: (_ctx, options) => options.color,
        offset: !1,
        borderDash: [],
        borderDashOffset: 0,
        borderWidth: 1,
    },
    title: { display: !1, text: '', padding: { top: 4, bottom: 4 } },
    ticks: {
        minRotation: 0,
        maxRotation: 50,
        mirror: !1,
        textStrokeWidth: 0,
        textStrokeColor: '',
        padding: 3,
        display: !0,
        autoSkip: !0,
        autoSkipPadding: 3,
        labelOffset: 0,
        callback: Ticks.formatters.values,
        minor: {},
        major: {},
        align: 'center',
        crossAlign: 'near',
        showLabelBackdrop: !1,
        backdropColor: 'rgba(255, 255, 255, 0.75)',
        backdropPadding: 2,
    },
})
defaults.route('scale.ticks', 'color', '', 'color')
defaults.route('scale.grid', 'color', '', 'borderColor')
defaults.route('scale.grid', 'borderColor', '', 'borderColor')
defaults.route('scale.title', 'color', '', 'color')
defaults.describe('scale', {
    _fallback: !1,
    _scriptable: (name) =>
        !name.startsWith('before') &&
        !name.startsWith('after') &&
        name !== 'callback' &&
        name !== 'parser',
    _indexable: (name) => name !== 'borderDash' && name !== 'tickBorderDash',
})
defaults.describe('scales', { _fallback: 'scale' })
defaults.describe('scale.ticks', {
    _scriptable: (name) => name !== 'backdropPadding' && name !== 'callback',
    _indexable: (name) => name !== 'backdropPadding',
})
function autoSkip(scale, ticks) {
    let tickOpts = scale.options.ticks,
        ticksLimit = tickOpts.maxTicksLimit || determineMaxTicks(scale),
        majorIndices = tickOpts.major.enabled ? getMajorIndices(ticks) : [],
        numMajorIndices = majorIndices.length,
        first = majorIndices[0],
        last = majorIndices[numMajorIndices - 1],
        newTicks = []
    if (numMajorIndices > ticksLimit)
        return (
            skipMajors(
                ticks,
                newTicks,
                majorIndices,
                numMajorIndices / ticksLimit,
            ),
            newTicks
        )
    let spacing = calculateSpacing(majorIndices, ticks, ticksLimit)
    if (numMajorIndices > 0) {
        let i,
            ilen,
            avgMajorSpacing =
                numMajorIndices > 1
                    ? Math.round((last - first) / (numMajorIndices - 1))
                    : null
        for (
            skip(
                ticks,
                newTicks,
                spacing,
                isNullOrUndef(avgMajorSpacing) ? 0 : first - avgMajorSpacing,
                first,
            ),
                i = 0,
                ilen = numMajorIndices - 1;
            i < ilen;
            i++
        )
            skip(ticks, newTicks, spacing, majorIndices[i], majorIndices[i + 1])
        return (
            skip(
                ticks,
                newTicks,
                spacing,
                last,
                isNullOrUndef(avgMajorSpacing)
                    ? ticks.length
                    : last + avgMajorSpacing,
            ),
            newTicks
        )
    }
    return skip(ticks, newTicks, spacing), newTicks
}
function determineMaxTicks(scale) {
    let offset = scale.options.offset,
        tickLength = scale._tickSize(),
        maxScale = scale._length / tickLength + (offset ? 0 : 1),
        maxChart = scale._maxLength / tickLength
    return Math.floor(Math.min(maxScale, maxChart))
}
function calculateSpacing(majorIndices, ticks, ticksLimit) {
    let evenMajorSpacing = getEvenSpacing(majorIndices),
        spacing = ticks.length / ticksLimit
    if (!evenMajorSpacing) return Math.max(spacing, 1)
    let factors = _factorize(evenMajorSpacing)
    for (let i = 0, ilen = factors.length - 1; i < ilen; i++) {
        let factor = factors[i]
        if (factor > spacing) return factor
    }
    return Math.max(spacing, 1)
}
function getMajorIndices(ticks) {
    let result = [],
        i,
        ilen
    for (i = 0, ilen = ticks.length; i < ilen; i++)
        ticks[i].major && result.push(i)
    return result
}
function skipMajors(ticks, newTicks, majorIndices, spacing) {
    let count = 0,
        next = majorIndices[0],
        i
    for (spacing = Math.ceil(spacing), i = 0; i < ticks.length; i++)
        i === next &&
            (newTicks.push(ticks[i]),
            count++,
            (next = majorIndices[count * spacing]))
}
function skip(ticks, newTicks, spacing, majorStart, majorEnd) {
    let start = valueOrDefault(majorStart, 0),
        end = Math.min(valueOrDefault(majorEnd, ticks.length), ticks.length),
        count = 0,
        length,
        i,
        next
    for (
        spacing = Math.ceil(spacing),
            majorEnd &&
                ((length = majorEnd - majorStart),
                (spacing = length / Math.floor(length / spacing))),
            next = start;
        next < 0;

    )
        count++, (next = Math.round(start + count * spacing))
    for (i = Math.max(start, 0); i < end; i++)
        i === next &&
            (newTicks.push(ticks[i]),
            count++,
            (next = Math.round(start + count * spacing)))
}
function getEvenSpacing(arr) {
    let len = arr.length,
        i,
        diff
    if (len < 2) return !1
    for (diff = arr[0], i = 1; i < len; ++i)
        if (arr[i] - arr[i - 1] !== diff) return !1
    return diff
}
var reverseAlign = (align) =>
        align === 'left' ? 'right' : align === 'right' ? 'left' : align,
    offsetFromEdge = (scale, edge, offset) =>
        edge === 'top' || edge === 'left'
            ? scale[edge] + offset
            : scale[edge] - offset
function sample(arr, numItems) {
    let result = [],
        increment = arr.length / numItems,
        len = arr.length,
        i = 0
    for (; i < len; i += increment) result.push(arr[Math.floor(i)])
    return result
}
function getPixelForGridLine(scale, index2, offsetGridLines) {
    let length = scale.ticks.length,
        validIndex2 = Math.min(index2, length - 1),
        start = scale._startPixel,
        end = scale._endPixel,
        epsilon = 1e-6,
        lineValue = scale.getPixelForTick(validIndex2),
        offset
    if (
        !(
            offsetGridLines &&
            (length === 1
                ? (offset = Math.max(lineValue - start, end - lineValue))
                : index2 === 0
                ? (offset = (scale.getPixelForTick(1) - lineValue) / 2)
                : (offset =
                      (lineValue - scale.getPixelForTick(validIndex2 - 1)) / 2),
            (lineValue += validIndex2 < index2 ? offset : -offset),
            lineValue < start - epsilon || lineValue > end + epsilon)
        )
    )
        return lineValue
}
function garbageCollect(caches, length) {
    each(caches, (cache) => {
        let gc = cache.gc,
            gcLen = gc.length / 2,
            i
        if (gcLen > length) {
            for (i = 0; i < gcLen; ++i) delete cache.data[gc[i]]
            gc.splice(0, gcLen)
        }
    })
}
function getTickMarkLength(options) {
    return options.drawTicks ? options.tickLength : 0
}
function getTitleHeight(options, fallback) {
    if (!options.display) return 0
    let font = toFont(options.font, fallback),
        padding = toPadding(options.padding)
    return (
        (isArray(options.text) ? options.text.length : 1) * font.lineHeight +
        padding.height
    )
}
function createScaleContext(parent, scale) {
    return createContext(parent, { scale, type: 'scale' })
}
function createTickContext(parent, index2, tick) {
    return createContext(parent, { tick, index: index2, type: 'tick' })
}
function titleAlign(align, position, reverse) {
    let ret = _toLeftRightCenter(align)
    return (
        ((reverse && position !== 'right') ||
            (!reverse && position === 'right')) &&
            (ret = reverseAlign(ret)),
        ret
    )
}
function titleArgs(scale, offset, position, align) {
    let { top, left, bottom, right, chart: chart2 } = scale,
        { chartArea, scales: scales2 } = chart2,
        rotation = 0,
        maxWidth,
        titleX,
        titleY,
        height = bottom - top,
        width = right - left
    if (scale.isHorizontal()) {
        if (
            ((titleX = _alignStartEnd(align, left, right)), isObject(position))
        ) {
            let positionAxisID = Object.keys(position)[0],
                value = position[positionAxisID]
            titleY =
                scales2[positionAxisID].getPixelForValue(value) +
                height -
                offset
        } else
            position === 'center'
                ? (titleY =
                      (chartArea.bottom + chartArea.top) / 2 + height - offset)
                : (titleY = offsetFromEdge(scale, position, offset))
        maxWidth = right - left
    } else {
        if (isObject(position)) {
            let positionAxisID = Object.keys(position)[0],
                value = position[positionAxisID]
            titleX =
                scales2[positionAxisID].getPixelForValue(value) - width + offset
        } else
            position === 'center'
                ? (titleX =
                      (chartArea.left + chartArea.right) / 2 - width + offset)
                : (titleX = offsetFromEdge(scale, position, offset))
        ;(titleY = _alignStartEnd(align, bottom, top)),
            (rotation = position === 'left' ? -HALF_PI : HALF_PI)
    }
    return { titleX, titleY, maxWidth, rotation }
}
var Scale = class extends Element {
        constructor(cfg) {
            super()
            ;(this.id = cfg.id),
                (this.type = cfg.type),
                (this.options = void 0),
                (this.ctx = cfg.ctx),
                (this.chart = cfg.chart),
                (this.top = void 0),
                (this.bottom = void 0),
                (this.left = void 0),
                (this.right = void 0),
                (this.width = void 0),
                (this.height = void 0),
                (this._margins = { left: 0, right: 0, top: 0, bottom: 0 }),
                (this.maxWidth = void 0),
                (this.maxHeight = void 0),
                (this.paddingTop = void 0),
                (this.paddingBottom = void 0),
                (this.paddingLeft = void 0),
                (this.paddingRight = void 0),
                (this.axis = void 0),
                (this.labelRotation = void 0),
                (this.min = void 0),
                (this.max = void 0),
                (this._range = void 0),
                (this.ticks = []),
                (this._gridLineItems = null),
                (this._labelItems = null),
                (this._labelSizes = null),
                (this._length = 0),
                (this._maxLength = 0),
                (this._longestTextCache = {}),
                (this._startPixel = void 0),
                (this._endPixel = void 0),
                (this._reversePixels = !1),
                (this._userMax = void 0),
                (this._userMin = void 0),
                (this._suggestedMax = void 0),
                (this._suggestedMin = void 0),
                (this._ticksLength = 0),
                (this._borderValue = 0),
                (this._cache = {}),
                (this._dataLimitsCached = !1),
                (this.$context = void 0)
        }
        init(options) {
            ;(this.options = options.setContext(this.getContext())),
                (this.axis = options.axis),
                (this._userMin = this.parse(options.min)),
                (this._userMax = this.parse(options.max)),
                (this._suggestedMin = this.parse(options.suggestedMin)),
                (this._suggestedMax = this.parse(options.suggestedMax))
        }
        parse(raw, index2) {
            return raw
        }
        getUserBounds() {
            let { _userMin, _userMax, _suggestedMin, _suggestedMax } = this
            return (
                (_userMin = finiteOrDefault(
                    _userMin,
                    Number.POSITIVE_INFINITY,
                )),
                (_userMax = finiteOrDefault(
                    _userMax,
                    Number.NEGATIVE_INFINITY,
                )),
                (_suggestedMin = finiteOrDefault(
                    _suggestedMin,
                    Number.POSITIVE_INFINITY,
                )),
                (_suggestedMax = finiteOrDefault(
                    _suggestedMax,
                    Number.NEGATIVE_INFINITY,
                )),
                {
                    min: finiteOrDefault(_userMin, _suggestedMin),
                    max: finiteOrDefault(_userMax, _suggestedMax),
                    minDefined: isNumberFinite(_userMin),
                    maxDefined: isNumberFinite(_userMax),
                }
            )
        }
        getMinMax(canStack) {
            let { min, max, minDefined, maxDefined } = this.getUserBounds(),
                range
            if (minDefined && maxDefined) return { min, max }
            let metas = this.getMatchingVisibleMetas()
            for (let i = 0, ilen = metas.length; i < ilen; ++i)
                (range = metas[i].controller.getMinMax(this, canStack)),
                    minDefined || (min = Math.min(min, range.min)),
                    maxDefined || (max = Math.max(max, range.max))
            return (
                (min = maxDefined && min > max ? max : min),
                (max = minDefined && min > max ? min : max),
                {
                    min: finiteOrDefault(min, finiteOrDefault(max, min)),
                    max: finiteOrDefault(max, finiteOrDefault(min, max)),
                }
            )
        }
        getPadding() {
            return {
                left: this.paddingLeft || 0,
                top: this.paddingTop || 0,
                right: this.paddingRight || 0,
                bottom: this.paddingBottom || 0,
            }
        }
        getTicks() {
            return this.ticks
        }
        getLabels() {
            let data = this.chart.data
            return (
                this.options.labels ||
                (this.isHorizontal() ? data.xLabels : data.yLabels) ||
                data.labels ||
                []
            )
        }
        beforeLayout() {
            ;(this._cache = {}), (this._dataLimitsCached = !1)
        }
        beforeUpdate() {
            callback(this.options.beforeUpdate, [this])
        }
        update(maxWidth, maxHeight, margins) {
            let { beginAtZero, grace, ticks: tickOpts } = this.options,
                sampleSize = tickOpts.sampleSize
            this.beforeUpdate(),
                (this.maxWidth = maxWidth),
                (this.maxHeight = maxHeight),
                (this._margins = margins =
                    Object.assign(
                        { left: 0, right: 0, top: 0, bottom: 0 },
                        margins,
                    )),
                (this.ticks = null),
                (this._labelSizes = null),
                (this._gridLineItems = null),
                (this._labelItems = null),
                this.beforeSetDimensions(),
                this.setDimensions(),
                this.afterSetDimensions(),
                (this._maxLength = this.isHorizontal()
                    ? this.width + margins.left + margins.right
                    : this.height + margins.top + margins.bottom),
                this._dataLimitsCached ||
                    (this.beforeDataLimits(),
                    this.determineDataLimits(),
                    this.afterDataLimits(),
                    (this._range = _addGrace(this, grace, beginAtZero)),
                    (this._dataLimitsCached = !0)),
                this.beforeBuildTicks(),
                (this.ticks = this.buildTicks() || []),
                this.afterBuildTicks()
            let samplingEnabled = sampleSize < this.ticks.length
            this._convertTicksToLabels(
                samplingEnabled ? sample(this.ticks, sampleSize) : this.ticks,
            ),
                this.configure(),
                this.beforeCalculateLabelRotation(),
                this.calculateLabelRotation(),
                this.afterCalculateLabelRotation(),
                tickOpts.display &&
                    (tickOpts.autoSkip || tickOpts.source === 'auto') &&
                    ((this.ticks = autoSkip(this, this.ticks)),
                    (this._labelSizes = null),
                    this.afterAutoSkip()),
                samplingEnabled && this._convertTicksToLabels(this.ticks),
                this.beforeFit(),
                this.fit(),
                this.afterFit(),
                this.afterUpdate()
        }
        configure() {
            let reversePixels = this.options.reverse,
                startPixel,
                endPixel
            this.isHorizontal()
                ? ((startPixel = this.left), (endPixel = this.right))
                : ((startPixel = this.top),
                  (endPixel = this.bottom),
                  (reversePixels = !reversePixels)),
                (this._startPixel = startPixel),
                (this._endPixel = endPixel),
                (this._reversePixels = reversePixels),
                (this._length = endPixel - startPixel),
                (this._alignToPixels = this.options.alignToPixels)
        }
        afterUpdate() {
            callback(this.options.afterUpdate, [this])
        }
        beforeSetDimensions() {
            callback(this.options.beforeSetDimensions, [this])
        }
        setDimensions() {
            this.isHorizontal()
                ? ((this.width = this.maxWidth),
                  (this.left = 0),
                  (this.right = this.width))
                : ((this.height = this.maxHeight),
                  (this.top = 0),
                  (this.bottom = this.height)),
                (this.paddingLeft = 0),
                (this.paddingTop = 0),
                (this.paddingRight = 0),
                (this.paddingBottom = 0)
        }
        afterSetDimensions() {
            callback(this.options.afterSetDimensions, [this])
        }
        _callHooks(name) {
            this.chart.notifyPlugins(name, this.getContext()),
                callback(this.options[name], [this])
        }
        beforeDataLimits() {
            this._callHooks('beforeDataLimits')
        }
        determineDataLimits() {}
        afterDataLimits() {
            this._callHooks('afterDataLimits')
        }
        beforeBuildTicks() {
            this._callHooks('beforeBuildTicks')
        }
        buildTicks() {
            return []
        }
        afterBuildTicks() {
            this._callHooks('afterBuildTicks')
        }
        beforeTickToLabelConversion() {
            callback(this.options.beforeTickToLabelConversion, [this])
        }
        generateTickLabels(ticks) {
            let tickOpts = this.options.ticks,
                i,
                ilen,
                tick
            for (i = 0, ilen = ticks.length; i < ilen; i++)
                (tick = ticks[i]),
                    (tick.label = callback(
                        tickOpts.callback,
                        [tick.value, i, ticks],
                        this,
                    ))
        }
        afterTickToLabelConversion() {
            callback(this.options.afterTickToLabelConversion, [this])
        }
        beforeCalculateLabelRotation() {
            callback(this.options.beforeCalculateLabelRotation, [this])
        }
        calculateLabelRotation() {
            let options = this.options,
                tickOpts = options.ticks,
                numTicks = this.ticks.length,
                minRotation = tickOpts.minRotation || 0,
                maxRotation = tickOpts.maxRotation,
                labelRotation = minRotation,
                tickWidth,
                maxHeight,
                maxLabelDiagonal
            if (
                !this._isVisible() ||
                !tickOpts.display ||
                minRotation >= maxRotation ||
                numTicks <= 1 ||
                !this.isHorizontal()
            ) {
                this.labelRotation = minRotation
                return
            }
            let labelSizes = this._getLabelSizes(),
                maxLabelWidth = labelSizes.widest.width,
                maxLabelHeight = labelSizes.highest.height,
                maxWidth = _limitValue(
                    this.chart.width - maxLabelWidth,
                    0,
                    this.maxWidth,
                )
            ;(tickWidth = options.offset
                ? this.maxWidth / numTicks
                : maxWidth / (numTicks - 1)),
                maxLabelWidth + 6 > tickWidth &&
                    ((tickWidth =
                        maxWidth / (numTicks - (options.offset ? 0.5 : 1))),
                    (maxHeight =
                        this.maxHeight -
                        getTickMarkLength(options.grid) -
                        tickOpts.padding -
                        getTitleHeight(options.title, this.chart.options.font)),
                    (maxLabelDiagonal = Math.sqrt(
                        maxLabelWidth * maxLabelWidth +
                            maxLabelHeight * maxLabelHeight,
                    )),
                    (labelRotation = toDegrees(
                        Math.min(
                            Math.asin(
                                _limitValue(
                                    (labelSizes.highest.height + 6) / tickWidth,
                                    -1,
                                    1,
                                ),
                            ),
                            Math.asin(
                                _limitValue(
                                    maxHeight / maxLabelDiagonal,
                                    -1,
                                    1,
                                ),
                            ) -
                                Math.asin(
                                    _limitValue(
                                        maxLabelHeight / maxLabelDiagonal,
                                        -1,
                                        1,
                                    ),
                                ),
                        ),
                    )),
                    (labelRotation = Math.max(
                        minRotation,
                        Math.min(maxRotation, labelRotation),
                    ))),
                (this.labelRotation = labelRotation)
        }
        afterCalculateLabelRotation() {
            callback(this.options.afterCalculateLabelRotation, [this])
        }
        afterAutoSkip() {}
        beforeFit() {
            callback(this.options.beforeFit, [this])
        }
        fit() {
            let minSize = { width: 0, height: 0 },
                {
                    chart: chart2,
                    options: {
                        ticks: tickOpts,
                        title: titleOpts,
                        grid: gridOpts,
                    },
                } = this,
                display = this._isVisible(),
                isHorizontal = this.isHorizontal()
            if (display) {
                let titleHeight = getTitleHeight(titleOpts, chart2.options.font)
                if (
                    (isHorizontal
                        ? ((minSize.width = this.maxWidth),
                          (minSize.height =
                              getTickMarkLength(gridOpts) + titleHeight))
                        : ((minSize.height = this.maxHeight),
                          (minSize.width =
                              getTickMarkLength(gridOpts) + titleHeight)),
                    tickOpts.display && this.ticks.length)
                ) {
                    let { first, last, widest, highest } =
                            this._getLabelSizes(),
                        tickPadding = tickOpts.padding * 2,
                        angleRadians = toRadians(this.labelRotation),
                        cos = Math.cos(angleRadians),
                        sin = Math.sin(angleRadians)
                    if (isHorizontal) {
                        let labelHeight = tickOpts.mirror
                            ? 0
                            : sin * widest.width + cos * highest.height
                        minSize.height = Math.min(
                            this.maxHeight,
                            minSize.height + labelHeight + tickPadding,
                        )
                    } else {
                        let labelWidth = tickOpts.mirror
                            ? 0
                            : cos * widest.width + sin * highest.height
                        minSize.width = Math.min(
                            this.maxWidth,
                            minSize.width + labelWidth + tickPadding,
                        )
                    }
                    this._calculatePadding(first, last, sin, cos)
                }
            }
            this._handleMargins(),
                isHorizontal
                    ? ((this.width = this._length =
                          chart2.width -
                          this._margins.left -
                          this._margins.right),
                      (this.height = minSize.height))
                    : ((this.width = minSize.width),
                      (this.height = this._length =
                          chart2.height -
                          this._margins.top -
                          this._margins.bottom))
        }
        _calculatePadding(first, last, sin, cos) {
            let {
                    ticks: { align, padding },
                    position,
                } = this.options,
                isRotated = this.labelRotation !== 0,
                labelsBelowTicks = position !== 'top' && this.axis === 'x'
            if (this.isHorizontal()) {
                let offsetLeft = this.getPixelForTick(0) - this.left,
                    offsetRight =
                        this.right -
                        this.getPixelForTick(this.ticks.length - 1),
                    paddingLeft = 0,
                    paddingRight = 0
                isRotated
                    ? labelsBelowTicks
                        ? ((paddingLeft = cos * first.width),
                          (paddingRight = sin * last.height))
                        : ((paddingLeft = sin * first.height),
                          (paddingRight = cos * last.width))
                    : align === 'start'
                    ? (paddingRight = last.width)
                    : align === 'end'
                    ? (paddingLeft = first.width)
                    : align !== 'inner' &&
                      ((paddingLeft = first.width / 2),
                      (paddingRight = last.width / 2)),
                    (this.paddingLeft = Math.max(
                        ((paddingLeft - offsetLeft + padding) * this.width) /
                            (this.width - offsetLeft),
                        0,
                    )),
                    (this.paddingRight = Math.max(
                        ((paddingRight - offsetRight + padding) * this.width) /
                            (this.width - offsetRight),
                        0,
                    ))
            } else {
                let paddingTop = last.height / 2,
                    paddingBottom = first.height / 2
                align === 'start'
                    ? ((paddingTop = 0), (paddingBottom = first.height))
                    : align === 'end' &&
                      ((paddingTop = last.height), (paddingBottom = 0)),
                    (this.paddingTop = paddingTop + padding),
                    (this.paddingBottom = paddingBottom + padding)
            }
        }
        _handleMargins() {
            this._margins &&
                ((this._margins.left = Math.max(
                    this.paddingLeft,
                    this._margins.left,
                )),
                (this._margins.top = Math.max(
                    this.paddingTop,
                    this._margins.top,
                )),
                (this._margins.right = Math.max(
                    this.paddingRight,
                    this._margins.right,
                )),
                (this._margins.bottom = Math.max(
                    this.paddingBottom,
                    this._margins.bottom,
                )))
        }
        afterFit() {
            callback(this.options.afterFit, [this])
        }
        isHorizontal() {
            let { axis, position } = this.options
            return position === 'top' || position === 'bottom' || axis === 'x'
        }
        isFullSize() {
            return this.options.fullSize
        }
        _convertTicksToLabels(ticks) {
            this.beforeTickToLabelConversion(), this.generateTickLabels(ticks)
            let i, ilen
            for (i = 0, ilen = ticks.length; i < ilen; i++)
                isNullOrUndef(ticks[i].label) &&
                    (ticks.splice(i, 1), ilen--, i--)
            this.afterTickToLabelConversion()
        }
        _getLabelSizes() {
            let labelSizes = this._labelSizes
            if (!labelSizes) {
                let sampleSize = this.options.ticks.sampleSize,
                    ticks = this.ticks
                sampleSize < ticks.length &&
                    (ticks = sample(ticks, sampleSize)),
                    (this._labelSizes = labelSizes =
                        this._computeLabelSizes(ticks, ticks.length))
            }
            return labelSizes
        }
        _computeLabelSizes(ticks, length) {
            let { ctx, _longestTextCache: caches } = this,
                widths = [],
                heights = [],
                widestLabelSize = 0,
                highestLabelSize = 0,
                i,
                j,
                jlen,
                label,
                tickFont,
                fontString,
                cache,
                lineHeight,
                width,
                height,
                nestedLabel
            for (i = 0; i < length; ++i) {
                if (
                    ((label = ticks[i].label),
                    (tickFont = this._resolveTickFontOptions(i)),
                    (ctx.font = fontString = tickFont.string),
                    (cache = caches[fontString] =
                        caches[fontString] || { data: {}, gc: [] }),
                    (lineHeight = tickFont.lineHeight),
                    (width = height = 0),
                    !isNullOrUndef(label) && !isArray(label))
                )
                    (width = _measureText(
                        ctx,
                        cache.data,
                        cache.gc,
                        width,
                        label,
                    )),
                        (height = lineHeight)
                else if (isArray(label))
                    for (j = 0, jlen = label.length; j < jlen; ++j)
                        (nestedLabel = label[j]),
                            !isNullOrUndef(nestedLabel) &&
                                !isArray(nestedLabel) &&
                                ((width = _measureText(
                                    ctx,
                                    cache.data,
                                    cache.gc,
                                    width,
                                    nestedLabel,
                                )),
                                (height += lineHeight))
                widths.push(width),
                    heights.push(height),
                    (widestLabelSize = Math.max(width, widestLabelSize)),
                    (highestLabelSize = Math.max(height, highestLabelSize))
            }
            garbageCollect(caches, length)
            let widest = widths.indexOf(widestLabelSize),
                highest = heights.indexOf(highestLabelSize),
                valueAt = (idx) => ({
                    width: widths[idx] || 0,
                    height: heights[idx] || 0,
                })
            return {
                first: valueAt(0),
                last: valueAt(length - 1),
                widest: valueAt(widest),
                highest: valueAt(highest),
                widths,
                heights,
            }
        }
        getLabelForValue(value) {
            return value
        }
        getPixelForValue(value, index2) {
            return NaN
        }
        getValueForPixel(pixel) {}
        getPixelForTick(index2) {
            let ticks = this.ticks
            return index2 < 0 || index2 > ticks.length - 1
                ? null
                : this.getPixelForValue(ticks[index2].value)
        }
        getPixelForDecimal(decimal) {
            this._reversePixels && (decimal = 1 - decimal)
            let pixel = this._startPixel + decimal * this._length
            return _int16Range(
                this._alignToPixels ? _alignPixel(this.chart, pixel, 0) : pixel,
            )
        }
        getDecimalForPixel(pixel) {
            let decimal = (pixel - this._startPixel) / this._length
            return this._reversePixels ? 1 - decimal : decimal
        }
        getBasePixel() {
            return this.getPixelForValue(this.getBaseValue())
        }
        getBaseValue() {
            let { min, max } = this
            return min < 0 && max < 0 ? max : min > 0 && max > 0 ? min : 0
        }
        getContext(index2) {
            let ticks = this.ticks || []
            if (index2 >= 0 && index2 < ticks.length) {
                let tick = ticks[index2]
                return (
                    tick.$context ||
                    (tick.$context = createTickContext(
                        this.getContext(),
                        index2,
                        tick,
                    ))
                )
            }
            return (
                this.$context ||
                (this.$context = createScaleContext(
                    this.chart.getContext(),
                    this,
                ))
            )
        }
        _tickSize() {
            let optionTicks = this.options.ticks,
                rot = toRadians(this.labelRotation),
                cos = Math.abs(Math.cos(rot)),
                sin = Math.abs(Math.sin(rot)),
                labelSizes = this._getLabelSizes(),
                padding = optionTicks.autoSkipPadding || 0,
                w = labelSizes ? labelSizes.widest.width + padding : 0,
                h = labelSizes ? labelSizes.highest.height + padding : 0
            return this.isHorizontal()
                ? h * cos > w * sin
                    ? w / cos
                    : h / sin
                : h * sin < w * cos
                ? h / cos
                : w / sin
        }
        _isVisible() {
            let display = this.options.display
            return display !== 'auto'
                ? !!display
                : this.getMatchingVisibleMetas().length > 0
        }
        _computeGridLineItems(chartArea) {
            let axis = this.axis,
                chart2 = this.chart,
                options = this.options,
                { grid, position } = options,
                offset = grid.offset,
                isHorizontal = this.isHorizontal(),
                ticksLength = this.ticks.length + (offset ? 1 : 0),
                tl = getTickMarkLength(grid),
                items = [],
                borderOpts = grid.setContext(this.getContext()),
                axisWidth = borderOpts.drawBorder ? borderOpts.borderWidth : 0,
                axisHalfWidth = axisWidth / 2,
                alignBorderValue = function (pixel) {
                    return _alignPixel(chart2, pixel, axisWidth)
                },
                borderValue,
                i,
                lineValue,
                alignedLineValue,
                tx1,
                ty1,
                tx2,
                ty2,
                x1,
                y1,
                x2,
                y2
            if (position === 'top')
                (borderValue = alignBorderValue(this.bottom)),
                    (ty1 = this.bottom - tl),
                    (ty2 = borderValue - axisHalfWidth),
                    (y1 = alignBorderValue(chartArea.top) + axisHalfWidth),
                    (y2 = chartArea.bottom)
            else if (position === 'bottom')
                (borderValue = alignBorderValue(this.top)),
                    (y1 = chartArea.top),
                    (y2 = alignBorderValue(chartArea.bottom) - axisHalfWidth),
                    (ty1 = borderValue + axisHalfWidth),
                    (ty2 = this.top + tl)
            else if (position === 'left')
                (borderValue = alignBorderValue(this.right)),
                    (tx1 = this.right - tl),
                    (tx2 = borderValue - axisHalfWidth),
                    (x1 = alignBorderValue(chartArea.left) + axisHalfWidth),
                    (x2 = chartArea.right)
            else if (position === 'right')
                (borderValue = alignBorderValue(this.left)),
                    (x1 = chartArea.left),
                    (x2 = alignBorderValue(chartArea.right) - axisHalfWidth),
                    (tx1 = borderValue + axisHalfWidth),
                    (tx2 = this.left + tl)
            else if (axis === 'x') {
                if (position === 'center')
                    borderValue = alignBorderValue(
                        (chartArea.top + chartArea.bottom) / 2 + 0.5,
                    )
                else if (isObject(position)) {
                    let positionAxisID = Object.keys(position)[0],
                        value = position[positionAxisID]
                    borderValue = alignBorderValue(
                        this.chart.scales[positionAxisID].getPixelForValue(
                            value,
                        ),
                    )
                }
                ;(y1 = chartArea.top),
                    (y2 = chartArea.bottom),
                    (ty1 = borderValue + axisHalfWidth),
                    (ty2 = ty1 + tl)
            } else if (axis === 'y') {
                if (position === 'center')
                    borderValue = alignBorderValue(
                        (chartArea.left + chartArea.right) / 2,
                    )
                else if (isObject(position)) {
                    let positionAxisID = Object.keys(position)[0],
                        value = position[positionAxisID]
                    borderValue = alignBorderValue(
                        this.chart.scales[positionAxisID].getPixelForValue(
                            value,
                        ),
                    )
                }
                ;(tx1 = borderValue - axisHalfWidth),
                    (tx2 = tx1 - tl),
                    (x1 = chartArea.left),
                    (x2 = chartArea.right)
            }
            let limit = valueOrDefault(
                    options.ticks.maxTicksLimit,
                    ticksLength,
                ),
                step = Math.max(1, Math.ceil(ticksLength / limit))
            for (i = 0; i < ticksLength; i += step) {
                let optsAtIndex = grid.setContext(this.getContext(i)),
                    lineWidth = optsAtIndex.lineWidth,
                    lineColor = optsAtIndex.color,
                    borderDash = optsAtIndex.borderDash || [],
                    borderDashOffset = optsAtIndex.borderDashOffset,
                    tickWidth = optsAtIndex.tickWidth,
                    tickColor = optsAtIndex.tickColor,
                    tickBorderDash = optsAtIndex.tickBorderDash || [],
                    tickBorderDashOffset = optsAtIndex.tickBorderDashOffset
                ;(lineValue = getPixelForGridLine(this, i, offset)),
                    lineValue !== void 0 &&
                        ((alignedLineValue = _alignPixel(
                            chart2,
                            lineValue,
                            lineWidth,
                        )),
                        isHorizontal
                            ? (tx1 = tx2 = x1 = x2 = alignedLineValue)
                            : (ty1 = ty2 = y1 = y2 = alignedLineValue),
                        items.push({
                            tx1,
                            ty1,
                            tx2,
                            ty2,
                            x1,
                            y1,
                            x2,
                            y2,
                            width: lineWidth,
                            color: lineColor,
                            borderDash,
                            borderDashOffset,
                            tickWidth,
                            tickColor,
                            tickBorderDash,
                            tickBorderDashOffset,
                        }))
            }
            return (
                (this._ticksLength = ticksLength),
                (this._borderValue = borderValue),
                items
            )
        }
        _computeLabelItems(chartArea) {
            let axis = this.axis,
                options = this.options,
                { position, ticks: optionTicks } = options,
                isHorizontal = this.isHorizontal(),
                ticks = this.ticks,
                { align, crossAlign, padding, mirror } = optionTicks,
                tl = getTickMarkLength(options.grid),
                tickAndPadding = tl + padding,
                hTickAndPadding = mirror ? -padding : tickAndPadding,
                rotation = -toRadians(this.labelRotation),
                items = [],
                i,
                ilen,
                tick,
                label,
                x,
                y,
                textAlign,
                pixel,
                font,
                lineHeight,
                lineCount,
                textOffset,
                textBaseline = 'middle'
            if (position === 'top')
                (y = this.bottom - hTickAndPadding),
                    (textAlign = this._getXAxisLabelAlignment())
            else if (position === 'bottom')
                (y = this.top + hTickAndPadding),
                    (textAlign = this._getXAxisLabelAlignment())
            else if (position === 'left') {
                let ret = this._getYAxisLabelAlignment(tl)
                ;(textAlign = ret.textAlign), (x = ret.x)
            } else if (position === 'right') {
                let ret = this._getYAxisLabelAlignment(tl)
                ;(textAlign = ret.textAlign), (x = ret.x)
            } else if (axis === 'x') {
                if (position === 'center')
                    y = (chartArea.top + chartArea.bottom) / 2 + tickAndPadding
                else if (isObject(position)) {
                    let positionAxisID = Object.keys(position)[0],
                        value = position[positionAxisID]
                    y =
                        this.chart.scales[positionAxisID].getPixelForValue(
                            value,
                        ) + tickAndPadding
                }
                textAlign = this._getXAxisLabelAlignment()
            } else if (axis === 'y') {
                if (position === 'center')
                    x = (chartArea.left + chartArea.right) / 2 - tickAndPadding
                else if (isObject(position)) {
                    let positionAxisID = Object.keys(position)[0],
                        value = position[positionAxisID]
                    x =
                        this.chart.scales[positionAxisID].getPixelForValue(
                            value,
                        )
                }
                textAlign = this._getYAxisLabelAlignment(tl).textAlign
            }
            axis === 'y' &&
                (align === 'start'
                    ? (textBaseline = 'top')
                    : align === 'end' && (textBaseline = 'bottom'))
            let labelSizes = this._getLabelSizes()
            for (i = 0, ilen = ticks.length; i < ilen; ++i) {
                ;(tick = ticks[i]), (label = tick.label)
                let optsAtIndex = optionTicks.setContext(this.getContext(i))
                ;(pixel = this.getPixelForTick(i) + optionTicks.labelOffset),
                    (font = this._resolveTickFontOptions(i)),
                    (lineHeight = font.lineHeight),
                    (lineCount = isArray(label) ? label.length : 1)
                let halfCount = lineCount / 2,
                    color2 = optsAtIndex.color,
                    strokeColor = optsAtIndex.textStrokeColor,
                    strokeWidth = optsAtIndex.textStrokeWidth,
                    tickTextAlign = textAlign
                isHorizontal
                    ? ((x = pixel),
                      textAlign === 'inner' &&
                          (i === ilen - 1
                              ? (tickTextAlign = this.options.reverse
                                    ? 'left'
                                    : 'right')
                              : i === 0
                              ? (tickTextAlign = this.options.reverse
                                    ? 'right'
                                    : 'left')
                              : (tickTextAlign = 'center')),
                      position === 'top'
                          ? crossAlign === 'near' || rotation !== 0
                              ? (textOffset =
                                    -lineCount * lineHeight + lineHeight / 2)
                              : crossAlign === 'center'
                              ? (textOffset =
                                    -labelSizes.highest.height / 2 -
                                    halfCount * lineHeight +
                                    lineHeight)
                              : (textOffset =
                                    -labelSizes.highest.height + lineHeight / 2)
                          : crossAlign === 'near' || rotation !== 0
                          ? (textOffset = lineHeight / 2)
                          : crossAlign === 'center'
                          ? (textOffset =
                                labelSizes.highest.height / 2 -
                                halfCount * lineHeight)
                          : (textOffset =
                                labelSizes.highest.height -
                                lineCount * lineHeight),
                      mirror && (textOffset *= -1))
                    : ((y = pixel),
                      (textOffset = ((1 - lineCount) * lineHeight) / 2))
                let backdrop
                if (optsAtIndex.showLabelBackdrop) {
                    let labelPadding = toPadding(optsAtIndex.backdropPadding),
                        height = labelSizes.heights[i],
                        width = labelSizes.widths[i],
                        top = y + textOffset - labelPadding.top,
                        left = x - labelPadding.left
                    switch (textBaseline) {
                        case 'middle':
                            top -= height / 2
                            break
                        case 'bottom':
                            top -= height
                            break
                    }
                    switch (textAlign) {
                        case 'center':
                            left -= width / 2
                            break
                        case 'right':
                            left -= width
                            break
                    }
                    backdrop = {
                        left,
                        top,
                        width: width + labelPadding.width,
                        height: height + labelPadding.height,
                        color: optsAtIndex.backdropColor,
                    }
                }
                items.push({
                    rotation,
                    label,
                    font,
                    color: color2,
                    strokeColor,
                    strokeWidth,
                    textOffset,
                    textAlign: tickTextAlign,
                    textBaseline,
                    translation: [x, y],
                    backdrop,
                })
            }
            return items
        }
        _getXAxisLabelAlignment() {
            let { position, ticks } = this.options
            if (-toRadians(this.labelRotation))
                return position === 'top' ? 'left' : 'right'
            let align = 'center'
            return (
                ticks.align === 'start'
                    ? (align = 'left')
                    : ticks.align === 'end'
                    ? (align = 'right')
                    : ticks.align === 'inner' && (align = 'inner'),
                align
            )
        }
        _getYAxisLabelAlignment(tl) {
            let {
                    position,
                    ticks: { crossAlign, mirror, padding },
                } = this.options,
                labelSizes = this._getLabelSizes(),
                tickAndPadding = tl + padding,
                widest = labelSizes.widest.width,
                textAlign,
                x
            return (
                position === 'left'
                    ? mirror
                        ? ((x = this.right + padding),
                          crossAlign === 'near'
                              ? (textAlign = 'left')
                              : crossAlign === 'center'
                              ? ((textAlign = 'center'), (x += widest / 2))
                              : ((textAlign = 'right'), (x += widest)))
                        : ((x = this.right - tickAndPadding),
                          crossAlign === 'near'
                              ? (textAlign = 'right')
                              : crossAlign === 'center'
                              ? ((textAlign = 'center'), (x -= widest / 2))
                              : ((textAlign = 'left'), (x = this.left)))
                    : position === 'right'
                    ? mirror
                        ? ((x = this.left + padding),
                          crossAlign === 'near'
                              ? (textAlign = 'right')
                              : crossAlign === 'center'
                              ? ((textAlign = 'center'), (x -= widest / 2))
                              : ((textAlign = 'left'), (x -= widest)))
                        : ((x = this.left + tickAndPadding),
                          crossAlign === 'near'
                              ? (textAlign = 'left')
                              : crossAlign === 'center'
                              ? ((textAlign = 'center'), (x += widest / 2))
                              : ((textAlign = 'right'), (x = this.right)))
                    : (textAlign = 'right'),
                { textAlign, x }
            )
        }
        _computeLabelArea() {
            if (this.options.ticks.mirror) return
            let chart2 = this.chart,
                position = this.options.position
            if (position === 'left' || position === 'right')
                return {
                    top: 0,
                    left: this.left,
                    bottom: chart2.height,
                    right: this.right,
                }
            if (position === 'top' || position === 'bottom')
                return {
                    top: this.top,
                    left: 0,
                    bottom: this.bottom,
                    right: chart2.width,
                }
        }
        drawBackground() {
            let {
                ctx,
                options: { backgroundColor },
                left,
                top,
                width,
                height,
            } = this
            backgroundColor &&
                (ctx.save(),
                (ctx.fillStyle = backgroundColor),
                ctx.fillRect(left, top, width, height),
                ctx.restore())
        }
        getLineWidthForValue(value) {
            let grid = this.options.grid
            if (!this._isVisible() || !grid.display) return 0
            let index2 = this.ticks.findIndex((t) => t.value === value)
            return index2 >= 0
                ? grid.setContext(this.getContext(index2)).lineWidth
                : 0
        }
        drawGrid(chartArea) {
            let grid = this.options.grid,
                ctx = this.ctx,
                items =
                    this._gridLineItems ||
                    (this._gridLineItems =
                        this._computeGridLineItems(chartArea)),
                i,
                ilen,
                drawLine = (p1, p2, style) => {
                    !style.width ||
                        !style.color ||
                        (ctx.save(),
                        (ctx.lineWidth = style.width),
                        (ctx.strokeStyle = style.color),
                        ctx.setLineDash(style.borderDash || []),
                        (ctx.lineDashOffset = style.borderDashOffset),
                        ctx.beginPath(),
                        ctx.moveTo(p1.x, p1.y),
                        ctx.lineTo(p2.x, p2.y),
                        ctx.stroke(),
                        ctx.restore())
                }
            if (grid.display)
                for (i = 0, ilen = items.length; i < ilen; ++i) {
                    let item = items[i]
                    grid.drawOnChartArea &&
                        drawLine(
                            { x: item.x1, y: item.y1 },
                            { x: item.x2, y: item.y2 },
                            item,
                        ),
                        grid.drawTicks &&
                            drawLine(
                                { x: item.tx1, y: item.ty1 },
                                { x: item.tx2, y: item.ty2 },
                                {
                                    color: item.tickColor,
                                    width: item.tickWidth,
                                    borderDash: item.tickBorderDash,
                                    borderDashOffset: item.tickBorderDashOffset,
                                },
                            )
                }
        }
        drawBorder() {
            let {
                    chart: chart2,
                    ctx,
                    options: { grid },
                } = this,
                borderOpts = grid.setContext(this.getContext()),
                axisWidth = grid.drawBorder ? borderOpts.borderWidth : 0
            if (!axisWidth) return
            let lastLineWidth = grid.setContext(this.getContext(0)).lineWidth,
                borderValue = this._borderValue,
                x1,
                x2,
                y1,
                y2
            this.isHorizontal()
                ? ((x1 =
                      _alignPixel(chart2, this.left, axisWidth) -
                      axisWidth / 2),
                  (x2 =
                      _alignPixel(chart2, this.right, lastLineWidth) +
                      lastLineWidth / 2),
                  (y1 = y2 = borderValue))
                : ((y1 =
                      _alignPixel(chart2, this.top, axisWidth) - axisWidth / 2),
                  (y2 =
                      _alignPixel(chart2, this.bottom, lastLineWidth) +
                      lastLineWidth / 2),
                  (x1 = x2 = borderValue)),
                ctx.save(),
                (ctx.lineWidth = borderOpts.borderWidth),
                (ctx.strokeStyle = borderOpts.borderColor),
                ctx.beginPath(),
                ctx.moveTo(x1, y1),
                ctx.lineTo(x2, y2),
                ctx.stroke(),
                ctx.restore()
        }
        drawLabels(chartArea) {
            if (!this.options.ticks.display) return
            let ctx = this.ctx,
                area = this._computeLabelArea()
            area && clipArea(ctx, area)
            let items =
                    this._labelItems ||
                    (this._labelItems = this._computeLabelItems(chartArea)),
                i,
                ilen
            for (i = 0, ilen = items.length; i < ilen; ++i) {
                let item = items[i],
                    tickFont = item.font,
                    label = item.label
                item.backdrop &&
                    ((ctx.fillStyle = item.backdrop.color),
                    ctx.fillRect(
                        item.backdrop.left,
                        item.backdrop.top,
                        item.backdrop.width,
                        item.backdrop.height,
                    ))
                let y = item.textOffset
                renderText(ctx, label, 0, y, tickFont, item)
            }
            area && unclipArea(ctx)
        }
        drawTitle() {
            let {
                ctx,
                options: { position, title, reverse },
            } = this
            if (!title.display) return
            let font = toFont(title.font),
                padding = toPadding(title.padding),
                align = title.align,
                offset = font.lineHeight / 2
            position === 'bottom' || position === 'center' || isObject(position)
                ? ((offset += padding.bottom),
                  isArray(title.text) &&
                      (offset += font.lineHeight * (title.text.length - 1)))
                : (offset += padding.top)
            let { titleX, titleY, maxWidth, rotation } = titleArgs(
                this,
                offset,
                position,
                align,
            )
            renderText(ctx, title.text, 0, 0, font, {
                color: title.color,
                maxWidth,
                rotation,
                textAlign: titleAlign(align, position, reverse),
                textBaseline: 'middle',
                translation: [titleX, titleY],
            })
        }
        draw(chartArea) {
            !this._isVisible() ||
                (this.drawBackground(),
                this.drawGrid(chartArea),
                this.drawBorder(),
                this.drawTitle(),
                this.drawLabels(chartArea))
        }
        _layers() {
            let opts = this.options,
                tz = (opts.ticks && opts.ticks.z) || 0,
                gz = valueOrDefault(opts.grid && opts.grid.z, -1)
            return !this._isVisible() || this.draw !== Scale.prototype.draw
                ? [
                      {
                          z: tz,
                          draw: (chartArea) => {
                              this.draw(chartArea)
                          },
                      },
                  ]
                : [
                      {
                          z: gz,
                          draw: (chartArea) => {
                              this.drawBackground(),
                                  this.drawGrid(chartArea),
                                  this.drawTitle()
                          },
                      },
                      {
                          z: gz + 1,
                          draw: () => {
                              this.drawBorder()
                          },
                      },
                      {
                          z: tz,
                          draw: (chartArea) => {
                              this.drawLabels(chartArea)
                          },
                      },
                  ]
        }
        getMatchingVisibleMetas(type) {
            let metas = this.chart.getSortedVisibleDatasetMetas(),
                axisID = this.axis + 'AxisID',
                result = [],
                i,
                ilen
            for (i = 0, ilen = metas.length; i < ilen; ++i) {
                let meta = metas[i]
                meta[axisID] === this.id &&
                    (!type || meta.type === type) &&
                    result.push(meta)
            }
            return result
        }
        _resolveTickFontOptions(index2) {
            let opts = this.options.ticks.setContext(this.getContext(index2))
            return toFont(opts.font)
        }
        _maxDigits() {
            let fontSize = this._resolveTickFontOptions(0).lineHeight
            return (this.isHorizontal() ? this.width : this.height) / fontSize
        }
    },
    TypedRegistry = class {
        constructor(type, scope, override) {
            ;(this.type = type),
                (this.scope = scope),
                (this.override = override),
                (this.items = Object.create(null))
        }
        isForType(type) {
            return Object.prototype.isPrototypeOf.call(
                this.type.prototype,
                type.prototype,
            )
        }
        register(item) {
            let proto = Object.getPrototypeOf(item),
                parentScope
            isIChartComponent(proto) && (parentScope = this.register(proto))
            let items = this.items,
                id = item.id,
                scope = this.scope + '.' + id
            if (!id) throw new Error('class does not have id: ' + item)
            return (
                id in items ||
                    ((items[id] = item),
                    registerDefaults(item, scope, parentScope),
                    this.override &&
                        defaults.override(item.id, item.overrides)),
                scope
            )
        }
        get(id) {
            return this.items[id]
        }
        unregister(item) {
            let items = this.items,
                id = item.id,
                scope = this.scope
            id in items && delete items[id],
                scope &&
                    id in defaults[scope] &&
                    (delete defaults[scope][id],
                    this.override && delete overrides[id])
        }
    }
function registerDefaults(item, scope, parentScope) {
    let itemDefaults = merge(Object.create(null), [
        parentScope ? defaults.get(parentScope) : {},
        defaults.get(scope),
        item.defaults,
    ])
    defaults.set(scope, itemDefaults),
        item.defaultRoutes && routeDefaults(scope, item.defaultRoutes),
        item.descriptors && defaults.describe(scope, item.descriptors)
}
function routeDefaults(scope, routes) {
    Object.keys(routes).forEach((property) => {
        let propertyParts = property.split('.'),
            sourceName = propertyParts.pop(),
            sourceScope = [scope].concat(propertyParts).join('.'),
            parts = routes[property].split('.'),
            targetName = parts.pop(),
            targetScope = parts.join('.')
        defaults.route(sourceScope, sourceName, targetScope, targetName)
    })
}
function isIChartComponent(proto) {
    return 'id' in proto && 'defaults' in proto
}
var Registry = class {
        constructor() {
            ;(this.controllers = new TypedRegistry(
                DatasetController,
                'datasets',
                !0,
            )),
                (this.elements = new TypedRegistry(Element, 'elements')),
                (this.plugins = new TypedRegistry(Object, 'plugins')),
                (this.scales = new TypedRegistry(Scale, 'scales')),
                (this._typedRegistries = [
                    this.controllers,
                    this.scales,
                    this.elements,
                ])
        }
        add(...args) {
            this._each('register', args)
        }
        remove(...args) {
            this._each('unregister', args)
        }
        addControllers(...args) {
            this._each('register', args, this.controllers)
        }
        addElements(...args) {
            this._each('register', args, this.elements)
        }
        addPlugins(...args) {
            this._each('register', args, this.plugins)
        }
        addScales(...args) {
            this._each('register', args, this.scales)
        }
        getController(id) {
            return this._get(id, this.controllers, 'controller')
        }
        getElement(id) {
            return this._get(id, this.elements, 'element')
        }
        getPlugin(id) {
            return this._get(id, this.plugins, 'plugin')
        }
        getScale(id) {
            return this._get(id, this.scales, 'scale')
        }
        removeControllers(...args) {
            this._each('unregister', args, this.controllers)
        }
        removeElements(...args) {
            this._each('unregister', args, this.elements)
        }
        removePlugins(...args) {
            this._each('unregister', args, this.plugins)
        }
        removeScales(...args) {
            this._each('unregister', args, this.scales)
        }
        _each(method, args, typedRegistry) {
            ;[...args].forEach((arg) => {
                let reg = typedRegistry || this._getRegistryForType(arg)
                typedRegistry ||
                reg.isForType(arg) ||
                (reg === this.plugins && arg.id)
                    ? this._exec(method, reg, arg)
                    : each(arg, (item) => {
                          let itemReg =
                              typedRegistry || this._getRegistryForType(item)
                          this._exec(method, itemReg, item)
                      })
            })
        }
        _exec(method, registry2, component) {
            let camelMethod = _capitalize(method)
            callback(component['before' + camelMethod], [], component),
                registry2[method](component),
                callback(component['after' + camelMethod], [], component)
        }
        _getRegistryForType(type) {
            for (let i = 0; i < this._typedRegistries.length; i++) {
                let reg = this._typedRegistries[i]
                if (reg.isForType(type)) return reg
            }
            return this.plugins
        }
        _get(id, typedRegistry, type) {
            let item = typedRegistry.get(id)
            if (item === void 0)
                throw new Error(
                    '"' + id + '" is not a registered ' + type + '.',
                )
            return item
        }
    },
    registry = new Registry(),
    ScatterController = class extends DatasetController {
        update(mode) {
            let meta = this._cachedMeta,
                { data: points = [] } = meta,
                animationsDisabled = this.chart._animationsDisabled,
                { start, count } = _getStartAndCountOfVisiblePoints(
                    meta,
                    points,
                    animationsDisabled,
                )
            if (
                ((this._drawStart = start),
                (this._drawCount = count),
                _scaleRangesChanged(meta) &&
                    ((start = 0), (count = points.length)),
                this.options.showLine)
            ) {
                let { dataset: line, _dataset } = meta
                ;(line._chart = this.chart),
                    (line._datasetIndex = this.index),
                    (line._decimated = !!_dataset._decimated),
                    (line.points = points)
                let options = this.resolveDatasetElementOptions(mode)
                ;(options.segment = this.options.segment),
                    this.updateElement(
                        line,
                        void 0,
                        { animated: !animationsDisabled, options },
                        mode,
                    )
            }
            this.updateElements(points, start, count, mode)
        }
        addElements() {
            let { showLine } = this.options
            !this.datasetElementType &&
                showLine &&
                (this.datasetElementType = registry.getElement('line')),
                super.addElements()
        }
        updateElements(points, start, count, mode) {
            let reset = mode === 'reset',
                { iScale, vScale, _stacked, _dataset } = this._cachedMeta,
                firstOpts = this.resolveDataElementOptions(start, mode),
                sharedOptions = this.getSharedOptions(firstOpts),
                includeOptions = this.includeOptions(mode, sharedOptions),
                iAxis = iScale.axis,
                vAxis = vScale.axis,
                { spanGaps, segment } = this.options,
                maxGapLength = isNumber(spanGaps)
                    ? spanGaps
                    : Number.POSITIVE_INFINITY,
                directUpdate =
                    this.chart._animationsDisabled || reset || mode === 'none',
                prevParsed = start > 0 && this.getParsed(start - 1)
            for (let i = start; i < start + count; ++i) {
                let point = points[i],
                    parsed = this.getParsed(i),
                    properties = directUpdate ? point : {},
                    nullData = isNullOrUndef(parsed[vAxis]),
                    iPixel = (properties[iAxis] = iScale.getPixelForValue(
                        parsed[iAxis],
                        i,
                    )),
                    vPixel = (properties[vAxis] =
                        reset || nullData
                            ? vScale.getBasePixel()
                            : vScale.getPixelForValue(
                                  _stacked
                                      ? this.applyStack(
                                            vScale,
                                            parsed,
                                            _stacked,
                                        )
                                      : parsed[vAxis],
                                  i,
                              ))
                ;(properties.skip = isNaN(iPixel) || isNaN(vPixel) || nullData),
                    (properties.stop =
                        i > 0 &&
                        Math.abs(parsed[iAxis] - prevParsed[iAxis]) >
                            maxGapLength),
                    segment &&
                        ((properties.parsed = parsed),
                        (properties.raw = _dataset.data[i])),
                    includeOptions &&
                        (properties.options =
                            sharedOptions ||
                            this.resolveDataElementOptions(
                                i,
                                point.active ? 'active' : mode,
                            )),
                    directUpdate ||
                        this.updateElement(point, i, properties, mode),
                    (prevParsed = parsed)
            }
            this.updateSharedOptions(sharedOptions, mode, firstOpts)
        }
        getMaxOverflow() {
            let meta = this._cachedMeta,
                data = meta.data || []
            if (!this.options.showLine) {
                let max = 0
                for (let i = data.length - 1; i >= 0; --i)
                    max = Math.max(
                        max,
                        data[i].size(this.resolveDataElementOptions(i)) / 2,
                    )
                return max > 0 && max
            }
            let dataset = meta.dataset,
                border = (dataset.options && dataset.options.borderWidth) || 0
            if (!data.length) return border
            let firstPoint = data[0].size(this.resolveDataElementOptions(0)),
                lastPoint = data[data.length - 1].size(
                    this.resolveDataElementOptions(data.length - 1),
                )
            return Math.max(border, firstPoint, lastPoint) / 2
        }
    }
ScatterController.id = 'scatter'
ScatterController.defaults = {
    datasetElementType: !1,
    dataElementType: 'point',
    showLine: !1,
    fill: !1,
}
ScatterController.overrides = {
    interaction: { mode: 'point' },
    plugins: {
        tooltip: {
            callbacks: {
                title() {
                    return ''
                },
                label(item) {
                    return '(' + item.label + ', ' + item.formattedValue + ')'
                },
            },
        },
    },
    scales: { x: { type: 'linear' }, y: { type: 'linear' } },
}
var controllers = Object.freeze({
    __proto__: null,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PolarAreaController,
    PieController,
    RadarController,
    ScatterController,
})
function abstract() {
    throw new Error(
        'This method is not implemented: Check that a complete date adapter is provided.',
    )
}
var DateAdapter = class {
    constructor(options) {
        this.options = options || {}
    }
    init(chartOptions) {}
    formats() {
        return abstract()
    }
    parse(value, format) {
        return abstract()
    }
    format(timestamp, format) {
        return abstract()
    }
    add(timestamp, amount, unit) {
        return abstract()
    }
    diff(a, b, unit) {
        return abstract()
    }
    startOf(timestamp, unit, weekday) {
        return abstract()
    }
    endOf(timestamp, unit) {
        return abstract()
    }
}
DateAdapter.override = function (members) {
    Object.assign(DateAdapter.prototype, members)
}
var adapters = { _date: DateAdapter }
function binarySearch(metaset, axis, value, intersect) {
    let { controller, data, _sorted } = metaset,
        iScale = controller._cachedMeta.iScale
    if (
        iScale &&
        axis === iScale.axis &&
        axis !== 'r' &&
        _sorted &&
        data.length
    ) {
        let lookupMethod = iScale._reversePixels ? _rlookupByKey : _lookupByKey
        if (intersect) {
            if (controller._sharedOptions) {
                let el = data[0],
                    range =
                        typeof el.getRange == 'function' && el.getRange(axis)
                if (range) {
                    let start = lookupMethod(data, axis, value - range),
                        end = lookupMethod(data, axis, value + range)
                    return { lo: start.lo, hi: end.hi }
                }
            }
        } else return lookupMethod(data, axis, value)
    }
    return { lo: 0, hi: data.length - 1 }
}
function evaluateInteractionItems(chart2, axis, position, handler, intersect) {
    let metasets = chart2.getSortedVisibleDatasetMetas(),
        value = position[axis]
    for (let i = 0, ilen = metasets.length; i < ilen; ++i) {
        let { index: index2, data } = metasets[i],
            { lo, hi } = binarySearch(metasets[i], axis, value, intersect)
        for (let j = lo; j <= hi; ++j) {
            let element = data[j]
            element.skip || handler(element, index2, j)
        }
    }
}
function getDistanceMetricForAxis(axis) {
    let useX = axis.indexOf('x') !== -1,
        useY = axis.indexOf('y') !== -1
    return function (pt1, pt2) {
        let deltaX = useX ? Math.abs(pt1.x - pt2.x) : 0,
            deltaY = useY ? Math.abs(pt1.y - pt2.y) : 0
        return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2))
    }
}
function getIntersectItems(
    chart2,
    position,
    axis,
    useFinalPosition,
    includeInvisible,
) {
    let items = []
    return (
        (!includeInvisible && !chart2.isPointInArea(position)) ||
            evaluateInteractionItems(
                chart2,
                axis,
                position,
                function (element, datasetIndex, index2) {
                    ;(!includeInvisible &&
                        !_isPointInArea(element, chart2.chartArea, 0)) ||
                        (element.inRange(
                            position.x,
                            position.y,
                            useFinalPosition,
                        ) &&
                            items.push({
                                element,
                                datasetIndex,
                                index: index2,
                            }))
                },
                !0,
            ),
        items
    )
}
function getNearestRadialItems(chart2, position, axis, useFinalPosition) {
    let items = []
    function evaluationFunc(element, datasetIndex, index2) {
        let { startAngle, endAngle } = element.getProps(
                ['startAngle', 'endAngle'],
                useFinalPosition,
            ),
            { angle } = getAngleFromPoint(element, {
                x: position.x,
                y: position.y,
            })
        _angleBetween(angle, startAngle, endAngle) &&
            items.push({ element, datasetIndex, index: index2 })
    }
    return (
        evaluateInteractionItems(chart2, axis, position, evaluationFunc), items
    )
}
function getNearestCartesianItems(
    chart2,
    position,
    axis,
    intersect,
    useFinalPosition,
    includeInvisible,
) {
    let items = [],
        distanceMetric = getDistanceMetricForAxis(axis),
        minDistance = Number.POSITIVE_INFINITY
    function evaluationFunc(element, datasetIndex, index2) {
        let inRange2 = element.inRange(position.x, position.y, useFinalPosition)
        if (intersect && !inRange2) return
        let center = element.getCenterPoint(useFinalPosition)
        if (!(!!includeInvisible || chart2.isPointInArea(center)) && !inRange2)
            return
        let distance = distanceMetric(position, center)
        distance < minDistance
            ? ((items = [{ element, datasetIndex, index: index2 }]),
              (minDistance = distance))
            : distance === minDistance &&
              items.push({ element, datasetIndex, index: index2 })
    }
    return (
        evaluateInteractionItems(chart2, axis, position, evaluationFunc), items
    )
}
function getNearestItems(
    chart2,
    position,
    axis,
    intersect,
    useFinalPosition,
    includeInvisible,
) {
    return !includeInvisible && !chart2.isPointInArea(position)
        ? []
        : axis === 'r' && !intersect
        ? getNearestRadialItems(chart2, position, axis, useFinalPosition)
        : getNearestCartesianItems(
              chart2,
              position,
              axis,
              intersect,
              useFinalPosition,
              includeInvisible,
          )
}
function getAxisItems(chart2, position, axis, intersect, useFinalPosition) {
    let items = [],
        rangeMethod = axis === 'x' ? 'inXRange' : 'inYRange',
        intersectsItem = !1
    return (
        evaluateInteractionItems(
            chart2,
            axis,
            position,
            (element, datasetIndex, index2) => {
                element[rangeMethod](position[axis], useFinalPosition) &&
                    (items.push({ element, datasetIndex, index: index2 }),
                    (intersectsItem =
                        intersectsItem ||
                        element.inRange(
                            position.x,
                            position.y,
                            useFinalPosition,
                        )))
            },
        ),
        intersect && !intersectsItem ? [] : items
    )
}
var Interaction = {
        evaluateInteractionItems,
        modes: {
            index(chart2, e, options, useFinalPosition) {
                let position = getRelativePosition(e, chart2),
                    axis = options.axis || 'x',
                    includeInvisible = options.includeInvisible || !1,
                    items = options.intersect
                        ? getIntersectItems(
                              chart2,
                              position,
                              axis,
                              useFinalPosition,
                              includeInvisible,
                          )
                        : getNearestItems(
                              chart2,
                              position,
                              axis,
                              !1,
                              useFinalPosition,
                              includeInvisible,
                          ),
                    elements2 = []
                return items.length
                    ? (chart2.getSortedVisibleDatasetMetas().forEach((meta) => {
                          let index2 = items[0].index,
                              element = meta.data[index2]
                          element &&
                              !element.skip &&
                              elements2.push({
                                  element,
                                  datasetIndex: meta.index,
                                  index: index2,
                              })
                      }),
                      elements2)
                    : []
            },
            dataset(chart2, e, options, useFinalPosition) {
                let position = getRelativePosition(e, chart2),
                    axis = options.axis || 'xy',
                    includeInvisible = options.includeInvisible || !1,
                    items = options.intersect
                        ? getIntersectItems(
                              chart2,
                              position,
                              axis,
                              useFinalPosition,
                              includeInvisible,
                          )
                        : getNearestItems(
                              chart2,
                              position,
                              axis,
                              !1,
                              useFinalPosition,
                              includeInvisible,
                          )
                if (items.length > 0) {
                    let datasetIndex = items[0].datasetIndex,
                        data = chart2.getDatasetMeta(datasetIndex).data
                    items = []
                    for (let i = 0; i < data.length; ++i)
                        items.push({ element: data[i], datasetIndex, index: i })
                }
                return items
            },
            point(chart2, e, options, useFinalPosition) {
                let position = getRelativePosition(e, chart2),
                    axis = options.axis || 'xy',
                    includeInvisible = options.includeInvisible || !1
                return getIntersectItems(
                    chart2,
                    position,
                    axis,
                    useFinalPosition,
                    includeInvisible,
                )
            },
            nearest(chart2, e, options, useFinalPosition) {
                let position = getRelativePosition(e, chart2),
                    axis = options.axis || 'xy',
                    includeInvisible = options.includeInvisible || !1
                return getNearestItems(
                    chart2,
                    position,
                    axis,
                    options.intersect,
                    useFinalPosition,
                    includeInvisible,
                )
            },
            x(chart2, e, options, useFinalPosition) {
                let position = getRelativePosition(e, chart2)
                return getAxisItems(
                    chart2,
                    position,
                    'x',
                    options.intersect,
                    useFinalPosition,
                )
            },
            y(chart2, e, options, useFinalPosition) {
                let position = getRelativePosition(e, chart2)
                return getAxisItems(
                    chart2,
                    position,
                    'y',
                    options.intersect,
                    useFinalPosition,
                )
            },
        },
    },
    STATIC_POSITIONS = ['left', 'top', 'right', 'bottom']
function filterByPosition(array, position) {
    return array.filter((v) => v.pos === position)
}
function filterDynamicPositionByAxis(array, axis) {
    return array.filter(
        (v) => STATIC_POSITIONS.indexOf(v.pos) === -1 && v.box.axis === axis,
    )
}
function sortByWeight(array, reverse) {
    return array.sort((a, b) => {
        let v0 = reverse ? b : a,
            v1 = reverse ? a : b
        return v0.weight === v1.weight
            ? v0.index - v1.index
            : v0.weight - v1.weight
    })
}
function wrapBoxes(boxes) {
    let layoutBoxes = [],
        i,
        ilen,
        box,
        pos,
        stack,
        stackWeight
    for (i = 0, ilen = (boxes || []).length; i < ilen; ++i)
        (box = boxes[i]),
            ({
                position: pos,
                options: { stack, stackWeight = 1 },
            } = box),
            layoutBoxes.push({
                index: i,
                box,
                pos,
                horizontal: box.isHorizontal(),
                weight: box.weight,
                stack: stack && pos + stack,
                stackWeight,
            })
    return layoutBoxes
}
function buildStacks(layouts2) {
    let stacks = {}
    for (let wrap of layouts2) {
        let { stack, pos, stackWeight } = wrap
        if (!stack || !STATIC_POSITIONS.includes(pos)) continue
        let _stack =
            stacks[stack] ||
            (stacks[stack] = { count: 0, placed: 0, weight: 0, size: 0 })
        _stack.count++, (_stack.weight += stackWeight)
    }
    return stacks
}
function setLayoutDims(layouts2, params) {
    let stacks = buildStacks(layouts2),
        { vBoxMaxWidth, hBoxMaxHeight } = params,
        i,
        ilen,
        layout
    for (i = 0, ilen = layouts2.length; i < ilen; ++i) {
        layout = layouts2[i]
        let { fullSize } = layout.box,
            stack = stacks[layout.stack],
            factor = stack && layout.stackWeight / stack.weight
        layout.horizontal
            ? ((layout.width = factor
                  ? factor * vBoxMaxWidth
                  : fullSize && params.availableWidth),
              (layout.height = hBoxMaxHeight))
            : ((layout.width = vBoxMaxWidth),
              (layout.height = factor
                  ? factor * hBoxMaxHeight
                  : fullSize && params.availableHeight))
    }
    return stacks
}
function buildLayoutBoxes(boxes) {
    let layoutBoxes = wrapBoxes(boxes),
        fullSize = sortByWeight(
            layoutBoxes.filter((wrap) => wrap.box.fullSize),
            !0,
        ),
        left = sortByWeight(filterByPosition(layoutBoxes, 'left'), !0),
        right = sortByWeight(filterByPosition(layoutBoxes, 'right')),
        top = sortByWeight(filterByPosition(layoutBoxes, 'top'), !0),
        bottom = sortByWeight(filterByPosition(layoutBoxes, 'bottom')),
        centerHorizontal = filterDynamicPositionByAxis(layoutBoxes, 'x'),
        centerVertical = filterDynamicPositionByAxis(layoutBoxes, 'y')
    return {
        fullSize,
        leftAndTop: left.concat(top),
        rightAndBottom: right
            .concat(centerVertical)
            .concat(bottom)
            .concat(centerHorizontal),
        chartArea: filterByPosition(layoutBoxes, 'chartArea'),
        vertical: left.concat(right).concat(centerVertical),
        horizontal: top.concat(bottom).concat(centerHorizontal),
    }
}
function getCombinedMax(maxPadding, chartArea, a, b) {
    return (
        Math.max(maxPadding[a], chartArea[a]) +
        Math.max(maxPadding[b], chartArea[b])
    )
}
function updateMaxPadding(maxPadding, boxPadding) {
    ;(maxPadding.top = Math.max(maxPadding.top, boxPadding.top)),
        (maxPadding.left = Math.max(maxPadding.left, boxPadding.left)),
        (maxPadding.bottom = Math.max(maxPadding.bottom, boxPadding.bottom)),
        (maxPadding.right = Math.max(maxPadding.right, boxPadding.right))
}
function updateDims(chartArea, params, layout, stacks) {
    let { pos, box } = layout,
        maxPadding = chartArea.maxPadding
    if (!isObject(pos)) {
        layout.size && (chartArea[pos] -= layout.size)
        let stack = stacks[layout.stack] || { size: 0, count: 1 }
        ;(stack.size = Math.max(
            stack.size,
            layout.horizontal ? box.height : box.width,
        )),
            (layout.size = stack.size / stack.count),
            (chartArea[pos] += layout.size)
    }
    box.getPadding && updateMaxPadding(maxPadding, box.getPadding())
    let newWidth = Math.max(
            0,
            params.outerWidth -
                getCombinedMax(maxPadding, chartArea, 'left', 'right'),
        ),
        newHeight = Math.max(
            0,
            params.outerHeight -
                getCombinedMax(maxPadding, chartArea, 'top', 'bottom'),
        ),
        widthChanged = newWidth !== chartArea.w,
        heightChanged = newHeight !== chartArea.h
    return (
        (chartArea.w = newWidth),
        (chartArea.h = newHeight),
        layout.horizontal
            ? { same: widthChanged, other: heightChanged }
            : { same: heightChanged, other: widthChanged }
    )
}
function handleMaxPadding(chartArea) {
    let maxPadding = chartArea.maxPadding
    function updatePos(pos) {
        let change = Math.max(maxPadding[pos] - chartArea[pos], 0)
        return (chartArea[pos] += change), change
    }
    ;(chartArea.y += updatePos('top')),
        (chartArea.x += updatePos('left')),
        updatePos('right'),
        updatePos('bottom')
}
function getMargins(horizontal, chartArea) {
    let maxPadding = chartArea.maxPadding
    function marginForPositions(positions2) {
        let margin = { left: 0, top: 0, right: 0, bottom: 0 }
        return (
            positions2.forEach((pos) => {
                margin[pos] = Math.max(chartArea[pos], maxPadding[pos])
            }),
            margin
        )
    }
    return marginForPositions(
        horizontal ? ['left', 'right'] : ['top', 'bottom'],
    )
}
function fitBoxes(boxes, chartArea, params, stacks) {
    let refitBoxes = [],
        i,
        ilen,
        layout,
        box,
        refit,
        changed
    for (i = 0, ilen = boxes.length, refit = 0; i < ilen; ++i) {
        ;(layout = boxes[i]),
            (box = layout.box),
            box.update(
                layout.width || chartArea.w,
                layout.height || chartArea.h,
                getMargins(layout.horizontal, chartArea),
            )
        let { same, other } = updateDims(chartArea, params, layout, stacks)
        ;(refit |= same && refitBoxes.length),
            (changed = changed || other),
            box.fullSize || refitBoxes.push(layout)
    }
    return (refit && fitBoxes(refitBoxes, chartArea, params, stacks)) || changed
}
function setBoxDims(box, left, top, width, height) {
    ;(box.top = top),
        (box.left = left),
        (box.right = left + width),
        (box.bottom = top + height),
        (box.width = width),
        (box.height = height)
}
function placeBoxes(boxes, chartArea, params, stacks) {
    let userPadding = params.padding,
        { x, y } = chartArea
    for (let layout of boxes) {
        let box = layout.box,
            stack = stacks[layout.stack] || { count: 1, placed: 0, weight: 1 },
            weight = layout.stackWeight / stack.weight || 1
        if (layout.horizontal) {
            let width = chartArea.w * weight,
                height = stack.size || box.height
            defined(stack.start) && (y = stack.start),
                box.fullSize
                    ? setBoxDims(
                          box,
                          userPadding.left,
                          y,
                          params.outerWidth -
                              userPadding.right -
                              userPadding.left,
                          height,
                      )
                    : setBoxDims(
                          box,
                          chartArea.left + stack.placed,
                          y,
                          width,
                          height,
                      ),
                (stack.start = y),
                (stack.placed += width),
                (y = box.bottom)
        } else {
            let height = chartArea.h * weight,
                width = stack.size || box.width
            defined(stack.start) && (x = stack.start),
                box.fullSize
                    ? setBoxDims(
                          box,
                          x,
                          userPadding.top,
                          width,
                          params.outerHeight -
                              userPadding.bottom -
                              userPadding.top,
                      )
                    : setBoxDims(
                          box,
                          x,
                          chartArea.top + stack.placed,
                          width,
                          height,
                      ),
                (stack.start = x),
                (stack.placed += height),
                (x = box.right)
        }
    }
    ;(chartArea.x = x), (chartArea.y = y)
}
defaults.set('layout', {
    autoPadding: !0,
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
})
var layouts = {
        addBox(chart2, item) {
            chart2.boxes || (chart2.boxes = []),
                (item.fullSize = item.fullSize || !1),
                (item.position = item.position || 'top'),
                (item.weight = item.weight || 0),
                (item._layers =
                    item._layers ||
                    function () {
                        return [
                            {
                                z: 0,
                                draw(chartArea) {
                                    item.draw(chartArea)
                                },
                            },
                        ]
                    }),
                chart2.boxes.push(item)
        },
        removeBox(chart2, layoutItem) {
            let index2 = chart2.boxes ? chart2.boxes.indexOf(layoutItem) : -1
            index2 !== -1 && chart2.boxes.splice(index2, 1)
        },
        configure(chart2, item, options) {
            ;(item.fullSize = options.fullSize),
                (item.position = options.position),
                (item.weight = options.weight)
        },
        update(chart2, width, height, minPadding) {
            if (!chart2) return
            let padding = toPadding(chart2.options.layout.padding),
                availableWidth = Math.max(width - padding.width, 0),
                availableHeight = Math.max(height - padding.height, 0),
                boxes = buildLayoutBoxes(chart2.boxes),
                verticalBoxes = boxes.vertical,
                horizontalBoxes = boxes.horizontal
            each(chart2.boxes, (box) => {
                typeof box.beforeLayout == 'function' && box.beforeLayout()
            })
            let visibleVerticalBoxCount =
                    verticalBoxes.reduce(
                        (total, wrap) =>
                            wrap.box.options && wrap.box.options.display === !1
                                ? total
                                : total + 1,
                        0,
                    ) || 1,
                params = Object.freeze({
                    outerWidth: width,
                    outerHeight: height,
                    padding,
                    availableWidth,
                    availableHeight,
                    vBoxMaxWidth: availableWidth / 2 / visibleVerticalBoxCount,
                    hBoxMaxHeight: availableHeight / 2,
                }),
                maxPadding = Object.assign({}, padding)
            updateMaxPadding(maxPadding, toPadding(minPadding))
            let chartArea = Object.assign(
                    {
                        maxPadding,
                        w: availableWidth,
                        h: availableHeight,
                        x: padding.left,
                        y: padding.top,
                    },
                    padding,
                ),
                stacks = setLayoutDims(
                    verticalBoxes.concat(horizontalBoxes),
                    params,
                )
            fitBoxes(boxes.fullSize, chartArea, params, stacks),
                fitBoxes(verticalBoxes, chartArea, params, stacks),
                fitBoxes(horizontalBoxes, chartArea, params, stacks) &&
                    fitBoxes(verticalBoxes, chartArea, params, stacks),
                handleMaxPadding(chartArea),
                placeBoxes(boxes.leftAndTop, chartArea, params, stacks),
                (chartArea.x += chartArea.w),
                (chartArea.y += chartArea.h),
                placeBoxes(boxes.rightAndBottom, chartArea, params, stacks),
                (chart2.chartArea = {
                    left: chartArea.left,
                    top: chartArea.top,
                    right: chartArea.left + chartArea.w,
                    bottom: chartArea.top + chartArea.h,
                    height: chartArea.h,
                    width: chartArea.w,
                }),
                each(boxes.chartArea, (layout) => {
                    let box = layout.box
                    Object.assign(box, chart2.chartArea),
                        box.update(chartArea.w, chartArea.h, {
                            left: 0,
                            top: 0,
                            right: 0,
                            bottom: 0,
                        })
                })
        },
    },
    BasePlatform = class {
        acquireContext(canvas, aspectRatio) {}
        releaseContext(context) {
            return !1
        }
        addEventListener(chart2, type, listener) {}
        removeEventListener(chart2, type, listener) {}
        getDevicePixelRatio() {
            return 1
        }
        getMaximumSize(element, width, height, aspectRatio) {
            return (
                (width = Math.max(0, width || element.width)),
                (height = height || element.height),
                {
                    width,
                    height: Math.max(
                        0,
                        aspectRatio ? Math.floor(width / aspectRatio) : height,
                    ),
                }
            )
        }
        isAttached(canvas) {
            return !0
        }
        updateConfig(config) {}
    },
    BasicPlatform = class extends BasePlatform {
        acquireContext(item) {
            return (item && item.getContext && item.getContext('2d')) || null
        }
        updateConfig(config) {
            config.options.animation = !1
        }
    },
    EXPANDO_KEY = '$chartjs',
    EVENT_TYPES = {
        touchstart: 'mousedown',
        touchmove: 'mousemove',
        touchend: 'mouseup',
        pointerenter: 'mouseenter',
        pointerdown: 'mousedown',
        pointermove: 'mousemove',
        pointerup: 'mouseup',
        pointerleave: 'mouseout',
        pointerout: 'mouseout',
    },
    isNullOrEmpty = (value) => value === null || value === ''
function initCanvas(canvas, aspectRatio) {
    let style = canvas.style,
        renderHeight = canvas.getAttribute('height'),
        renderWidth = canvas.getAttribute('width')
    if (
        ((canvas[EXPANDO_KEY] = {
            initial: {
                height: renderHeight,
                width: renderWidth,
                style: {
                    display: style.display,
                    height: style.height,
                    width: style.width,
                },
            },
        }),
        (style.display = style.display || 'block'),
        (style.boxSizing = style.boxSizing || 'border-box'),
        isNullOrEmpty(renderWidth))
    ) {
        let displayWidth = readUsedSize(canvas, 'width')
        displayWidth !== void 0 && (canvas.width = displayWidth)
    }
    if (isNullOrEmpty(renderHeight))
        if (canvas.style.height === '')
            canvas.height = canvas.width / (aspectRatio || 2)
        else {
            let displayHeight = readUsedSize(canvas, 'height')
            displayHeight !== void 0 && (canvas.height = displayHeight)
        }
    return canvas
}
var eventListenerOptions = supportsEventListenerOptions ? { passive: !0 } : !1
function addListener(node, type, listener) {
    node.addEventListener(type, listener, eventListenerOptions)
}
function removeListener(chart2, type, listener) {
    chart2.canvas.removeEventListener(type, listener, eventListenerOptions)
}
function fromNativeEvent(event, chart2) {
    let type = EVENT_TYPES[event.type] || event.type,
        { x, y } = getRelativePosition(event, chart2)
    return {
        type,
        chart: chart2,
        native: event,
        x: x !== void 0 ? x : null,
        y: y !== void 0 ? y : null,
    }
}
function nodeListContains(nodeList, canvas) {
    for (let node of nodeList)
        if (node === canvas || node.contains(canvas)) return !0
}
function createAttachObserver(chart2, type, listener) {
    let canvas = chart2.canvas,
        observer = new MutationObserver((entries) => {
            let trigger = !1
            for (let entry of entries)
                (trigger =
                    trigger || nodeListContains(entry.addedNodes, canvas)),
                    (trigger =
                        trigger &&
                        !nodeListContains(entry.removedNodes, canvas))
            trigger && listener()
        })
    return observer.observe(document, { childList: !0, subtree: !0 }), observer
}
function createDetachObserver(chart2, type, listener) {
    let canvas = chart2.canvas,
        observer = new MutationObserver((entries) => {
            let trigger = !1
            for (let entry of entries)
                (trigger =
                    trigger || nodeListContains(entry.removedNodes, canvas)),
                    (trigger =
                        trigger && !nodeListContains(entry.addedNodes, canvas))
            trigger && listener()
        })
    return observer.observe(document, { childList: !0, subtree: !0 }), observer
}
var drpListeningCharts = new Map(),
    oldDevicePixelRatio = 0
function onWindowResize() {
    let dpr = window.devicePixelRatio
    dpr !== oldDevicePixelRatio &&
        ((oldDevicePixelRatio = dpr),
        drpListeningCharts.forEach((resize, chart2) => {
            chart2.currentDevicePixelRatio !== dpr && resize()
        }))
}
function listenDevicePixelRatioChanges(chart2, resize) {
    drpListeningCharts.size ||
        window.addEventListener('resize', onWindowResize),
        drpListeningCharts.set(chart2, resize)
}
function unlistenDevicePixelRatioChanges(chart2) {
    drpListeningCharts.delete(chart2),
        drpListeningCharts.size ||
            window.removeEventListener('resize', onWindowResize)
}
function createResizeObserver(chart2, type, listener) {
    let canvas = chart2.canvas,
        container = canvas && _getParentNode(canvas)
    if (!container) return
    let resize = throttled((width, height) => {
            let w = container.clientWidth
            listener(width, height), w < container.clientWidth && listener()
        }, window),
        observer = new ResizeObserver((entries) => {
            let entry = entries[0],
                width = entry.contentRect.width,
                height = entry.contentRect.height
            ;(width === 0 && height === 0) || resize(width, height)
        })
    return (
        observer.observe(container),
        listenDevicePixelRatioChanges(chart2, resize),
        observer
    )
}
function releaseObserver(chart2, type, observer) {
    observer && observer.disconnect(),
        type === 'resize' && unlistenDevicePixelRatioChanges(chart2)
}
function createProxyAndListen(chart2, type, listener) {
    let canvas = chart2.canvas,
        proxy = throttled(
            (event) => {
                chart2.ctx !== null && listener(fromNativeEvent(event, chart2))
            },
            chart2,
            (args) => {
                let event = args[0]
                return [event, event.offsetX, event.offsetY]
            },
        )
    return addListener(canvas, type, proxy), proxy
}
var DomPlatform = class extends BasePlatform {
    acquireContext(canvas, aspectRatio) {
        let context = canvas && canvas.getContext && canvas.getContext('2d')
        return context && context.canvas === canvas
            ? (initCanvas(canvas, aspectRatio), context)
            : null
    }
    releaseContext(context) {
        let canvas = context.canvas
        if (!canvas[EXPANDO_KEY]) return !1
        let initial = canvas[EXPANDO_KEY].initial
        ;['height', 'width'].forEach((prop) => {
            let value = initial[prop]
            isNullOrUndef(value)
                ? canvas.removeAttribute(prop)
                : canvas.setAttribute(prop, value)
        })
        let style = initial.style || {}
        return (
            Object.keys(style).forEach((key) => {
                canvas.style[key] = style[key]
            }),
            (canvas.width = canvas.width),
            delete canvas[EXPANDO_KEY],
            !0
        )
    }
    addEventListener(chart2, type, listener) {
        this.removeEventListener(chart2, type)
        let proxies = chart2.$proxies || (chart2.$proxies = {}),
            handler =
                {
                    attach: createAttachObserver,
                    detach: createDetachObserver,
                    resize: createResizeObserver,
                }[type] || createProxyAndListen
        proxies[type] = handler(chart2, type, listener)
    }
    removeEventListener(chart2, type) {
        let proxies = chart2.$proxies || (chart2.$proxies = {}),
            proxy = proxies[type]
        if (!proxy) return
        ;(
            ({
                attach: releaseObserver,
                detach: releaseObserver,
                resize: releaseObserver,
            })[type] || removeListener
        )(chart2, type, proxy),
            (proxies[type] = void 0)
    }
    getDevicePixelRatio() {
        return window.devicePixelRatio
    }
    getMaximumSize(canvas, width, height, aspectRatio) {
        return getMaximumSize(canvas, width, height, aspectRatio)
    }
    isAttached(canvas) {
        let container = _getParentNode(canvas)
        return !!(container && container.isConnected)
    }
}
function _detectPlatform(canvas) {
    return !_isDomSupported() ||
        (typeof OffscreenCanvas != 'undefined' &&
            canvas instanceof OffscreenCanvas)
        ? BasicPlatform
        : DomPlatform
}
var PluginService = class {
    constructor() {
        this._init = []
    }
    notify(chart2, hook, args, filter) {
        hook === 'beforeInit' &&
            ((this._init = this._createDescriptors(chart2, !0)),
            this._notify(this._init, chart2, 'install'))
        let descriptors2 = filter
                ? this._descriptors(chart2).filter(filter)
                : this._descriptors(chart2),
            result = this._notify(descriptors2, chart2, hook, args)
        return (
            hook === 'afterDestroy' &&
                (this._notify(descriptors2, chart2, 'stop'),
                this._notify(this._init, chart2, 'uninstall')),
            result
        )
    }
    _notify(descriptors2, chart2, hook, args) {
        args = args || {}
        for (let descriptor of descriptors2) {
            let plugin = descriptor.plugin,
                method = plugin[hook],
                params = [chart2, args, descriptor.options]
            if (callback(method, params, plugin) === !1 && args.cancelable)
                return !1
        }
        return !0
    }
    invalidate() {
        isNullOrUndef(this._cache) ||
            ((this._oldCache = this._cache), (this._cache = void 0))
    }
    _descriptors(chart2) {
        if (this._cache) return this._cache
        let descriptors2 = (this._cache = this._createDescriptors(chart2))
        return this._notifyStateChanges(chart2), descriptors2
    }
    _createDescriptors(chart2, all) {
        let config = chart2 && chart2.config,
            options = valueOrDefault(
                config.options && config.options.plugins,
                {},
            ),
            plugins2 = allPlugins(config)
        return options === !1 && !all
            ? []
            : createDescriptors(chart2, plugins2, options, all)
    }
    _notifyStateChanges(chart2) {
        let previousDescriptors = this._oldCache || [],
            descriptors2 = this._cache,
            diff = (a, b) =>
                a.filter((x) => !b.some((y) => x.plugin.id === y.plugin.id))
        this._notify(diff(previousDescriptors, descriptors2), chart2, 'stop'),
            this._notify(
                diff(descriptors2, previousDescriptors),
                chart2,
                'start',
            )
    }
}
function allPlugins(config) {
    let localIds = {},
        plugins2 = [],
        keys = Object.keys(registry.plugins.items)
    for (let i = 0; i < keys.length; i++)
        plugins2.push(registry.getPlugin(keys[i]))
    let local = config.plugins || []
    for (let i = 0; i < local.length; i++) {
        let plugin = local[i]
        plugins2.indexOf(plugin) === -1 &&
            (plugins2.push(plugin), (localIds[plugin.id] = !0))
    }
    return { plugins: plugins2, localIds }
}
function getOpts(options, all) {
    return !all && options === !1 ? null : options === !0 ? {} : options
}
function createDescriptors(
    chart2,
    { plugins: plugins2, localIds },
    options,
    all,
) {
    let result = [],
        context = chart2.getContext()
    for (let plugin of plugins2) {
        let id = plugin.id,
            opts = getOpts(options[id], all)
        opts !== null &&
            result.push({
                plugin,
                options: pluginOpts(
                    chart2.config,
                    { plugin, local: localIds[id] },
                    opts,
                    context,
                ),
            })
    }
    return result
}
function pluginOpts(config, { plugin, local }, opts, context) {
    let keys = config.pluginScopeKeys(plugin),
        scopes = config.getOptionScopes(opts, keys)
    return (
        local && plugin.defaults && scopes.push(plugin.defaults),
        config.createResolver(scopes, context, [''], {
            scriptable: !1,
            indexable: !1,
            allKeys: !0,
        })
    )
}
function getIndexAxis(type, options) {
    let datasetDefaults = defaults.datasets[type] || {}
    return (
        ((options.datasets || {})[type] || {}).indexAxis ||
        options.indexAxis ||
        datasetDefaults.indexAxis ||
        'x'
    )
}
function getAxisFromDefaultScaleID(id, indexAxis) {
    let axis = id
    return (
        id === '_index_'
            ? (axis = indexAxis)
            : id === '_value_' && (axis = indexAxis === 'x' ? 'y' : 'x'),
        axis
    )
}
function getDefaultScaleIDFromAxis(axis, indexAxis) {
    return axis === indexAxis ? '_index_' : '_value_'
}
function axisFromPosition(position) {
    if (position === 'top' || position === 'bottom') return 'x'
    if (position === 'left' || position === 'right') return 'y'
}
function determineAxis(id, scaleOptions) {
    return id === 'x' || id === 'y'
        ? id
        : scaleOptions.axis ||
              axisFromPosition(scaleOptions.position) ||
              id.charAt(0).toLowerCase()
}
function mergeScaleConfig(config, options) {
    let chartDefaults = overrides[config.type] || { scales: {} },
        configScales = options.scales || {},
        chartIndexAxis = getIndexAxis(config.type, options),
        firstIDs = Object.create(null),
        scales2 = Object.create(null)
    return (
        Object.keys(configScales).forEach((id) => {
            let scaleConf = configScales[id]
            if (!isObject(scaleConf))
                return console.error(
                    `Invalid scale configuration for scale: ${id}`,
                )
            if (scaleConf._proxy)
                return console.warn(
                    `Ignoring resolver passed as options for scale: ${id}`,
                )
            let axis = determineAxis(id, scaleConf),
                defaultId = getDefaultScaleIDFromAxis(axis, chartIndexAxis),
                defaultScaleOptions = chartDefaults.scales || {}
            ;(firstIDs[axis] = firstIDs[axis] || id),
                (scales2[id] = mergeIf(Object.create(null), [
                    { axis },
                    scaleConf,
                    defaultScaleOptions[axis],
                    defaultScaleOptions[defaultId],
                ]))
        }),
        config.data.datasets.forEach((dataset) => {
            let type = dataset.type || config.type,
                indexAxis = dataset.indexAxis || getIndexAxis(type, options),
                defaultScaleOptions = (overrides[type] || {}).scales || {}
            Object.keys(defaultScaleOptions).forEach((defaultID) => {
                let axis = getAxisFromDefaultScaleID(defaultID, indexAxis),
                    id = dataset[axis + 'AxisID'] || firstIDs[axis] || axis
                ;(scales2[id] = scales2[id] || Object.create(null)),
                    mergeIf(scales2[id], [
                        { axis },
                        configScales[id],
                        defaultScaleOptions[defaultID],
                    ])
            })
        }),
        Object.keys(scales2).forEach((key) => {
            let scale = scales2[key]
            mergeIf(scale, [defaults.scales[scale.type], defaults.scale])
        }),
        scales2
    )
}
function initOptions(config) {
    let options = config.options || (config.options = {})
    ;(options.plugins = valueOrDefault(options.plugins, {})),
        (options.scales = mergeScaleConfig(config, options))
}
function initData(data) {
    return (
        (data = data || {}),
        (data.datasets = data.datasets || []),
        (data.labels = data.labels || []),
        data
    )
}
function initConfig(config) {
    return (
        (config = config || {}),
        (config.data = initData(config.data)),
        initOptions(config),
        config
    )
}
var keyCache = new Map(),
    keysCached = new Set()
function cachedKeys(cacheKey, generate) {
    let keys = keyCache.get(cacheKey)
    return (
        keys ||
            ((keys = generate()),
            keyCache.set(cacheKey, keys),
            keysCached.add(keys)),
        keys
    )
}
var addIfFound = (set2, obj, key) => {
        let opts = resolveObjectKey(obj, key)
        opts !== void 0 && set2.add(opts)
    },
    Config = class {
        constructor(config) {
            ;(this._config = initConfig(config)),
                (this._scopeCache = new Map()),
                (this._resolverCache = new Map())
        }
        get platform() {
            return this._config.platform
        }
        get type() {
            return this._config.type
        }
        set type(type) {
            this._config.type = type
        }
        get data() {
            return this._config.data
        }
        set data(data) {
            this._config.data = initData(data)
        }
        get options() {
            return this._config.options
        }
        set options(options) {
            this._config.options = options
        }
        get plugins() {
            return this._config.plugins
        }
        update() {
            let config = this._config
            this.clearCache(), initOptions(config)
        }
        clearCache() {
            this._scopeCache.clear(), this._resolverCache.clear()
        }
        datasetScopeKeys(datasetType) {
            return cachedKeys(datasetType, () => [
                [`datasets.${datasetType}`, ''],
            ])
        }
        datasetAnimationScopeKeys(datasetType, transition) {
            return cachedKeys(`${datasetType}.transition.${transition}`, () => [
                [
                    `datasets.${datasetType}.transitions.${transition}`,
                    `transitions.${transition}`,
                ],
                [`datasets.${datasetType}`, ''],
            ])
        }
        datasetElementScopeKeys(datasetType, elementType) {
            return cachedKeys(`${datasetType}-${elementType}`, () => [
                [
                    `datasets.${datasetType}.elements.${elementType}`,
                    `datasets.${datasetType}`,
                    `elements.${elementType}`,
                    '',
                ],
            ])
        }
        pluginScopeKeys(plugin) {
            let id = plugin.id,
                type = this.type
            return cachedKeys(`${type}-plugin-${id}`, () => [
                [`plugins.${id}`, ...(plugin.additionalOptionScopes || [])],
            ])
        }
        _cachedScopes(mainScope, resetCache) {
            let _scopeCache = this._scopeCache,
                cache = _scopeCache.get(mainScope)
            return (
                (!cache || resetCache) &&
                    ((cache = new Map()), _scopeCache.set(mainScope, cache)),
                cache
            )
        }
        getOptionScopes(mainScope, keyLists, resetCache) {
            let { options, type } = this,
                cache = this._cachedScopes(mainScope, resetCache),
                cached = cache.get(keyLists)
            if (cached) return cached
            let scopes = new Set()
            keyLists.forEach((keys) => {
                mainScope &&
                    (scopes.add(mainScope),
                    keys.forEach((key) => addIfFound(scopes, mainScope, key))),
                    keys.forEach((key) => addIfFound(scopes, options, key)),
                    keys.forEach((key) =>
                        addIfFound(scopes, overrides[type] || {}, key),
                    ),
                    keys.forEach((key) => addIfFound(scopes, defaults, key)),
                    keys.forEach((key) => addIfFound(scopes, descriptors, key))
            })
            let array = Array.from(scopes)
            return (
                array.length === 0 && array.push(Object.create(null)),
                keysCached.has(keyLists) && cache.set(keyLists, array),
                array
            )
        }
        chartOptionScopes() {
            let { options, type } = this
            return [
                options,
                overrides[type] || {},
                defaults.datasets[type] || {},
                { type },
                defaults,
                descriptors,
            ]
        }
        resolveNamedOptions(scopes, names2, context, prefixes = ['']) {
            let result = { $shared: !0 },
                { resolver, subPrefixes } = getResolver(
                    this._resolverCache,
                    scopes,
                    prefixes,
                ),
                options = resolver
            if (needContext(resolver, names2)) {
                ;(result.$shared = !1),
                    (context = isFunction(context) ? context() : context)
                let subResolver = this.createResolver(
                    scopes,
                    context,
                    subPrefixes,
                )
                options = _attachContext(resolver, context, subResolver)
            }
            for (let prop of names2) result[prop] = options[prop]
            return result
        }
        createResolver(scopes, context, prefixes = [''], descriptorDefaults) {
            let { resolver } = getResolver(
                this._resolverCache,
                scopes,
                prefixes,
            )
            return isObject(context)
                ? _attachContext(resolver, context, void 0, descriptorDefaults)
                : resolver
        }
    }
function getResolver(resolverCache, scopes, prefixes) {
    let cache = resolverCache.get(scopes)
    cache || ((cache = new Map()), resolverCache.set(scopes, cache))
    let cacheKey = prefixes.join(),
        cached = cache.get(cacheKey)
    return (
        cached ||
            ((cached = {
                resolver: _createResolver(scopes, prefixes),
                subPrefixes: prefixes.filter(
                    (p) => !p.toLowerCase().includes('hover'),
                ),
            }),
            cache.set(cacheKey, cached)),
        cached
    )
}
var hasFunction = (value) =>
    isObject(value) &&
    Object.getOwnPropertyNames(value).reduce(
        (acc, key) => acc || isFunction(value[key]),
        !1,
    )
function needContext(proxy, names2) {
    let { isScriptable, isIndexable } = _descriptors(proxy)
    for (let prop of names2) {
        let scriptable = isScriptable(prop),
            indexable = isIndexable(prop),
            value = (indexable || scriptable) && proxy[prop]
        if (
            (scriptable && (isFunction(value) || hasFunction(value))) ||
            (indexable && isArray(value))
        )
            return !0
    }
    return !1
}
var version = '3.9.1',
    KNOWN_POSITIONS = ['top', 'bottom', 'left', 'right', 'chartArea']
function positionIsHorizontal(position, axis) {
    return (
        position === 'top' ||
        position === 'bottom' ||
        (KNOWN_POSITIONS.indexOf(position) === -1 && axis === 'x')
    )
}
function compare2Level(l1, l2) {
    return function (a, b) {
        return a[l1] === b[l1] ? a[l2] - b[l2] : a[l1] - b[l1]
    }
}
function onAnimationsComplete(context) {
    let chart2 = context.chart,
        animationOptions2 = chart2.options.animation
    chart2.notifyPlugins('afterRender'),
        callback(
            animationOptions2 && animationOptions2.onComplete,
            [context],
            chart2,
        )
}
function onAnimationProgress(context) {
    let chart2 = context.chart,
        animationOptions2 = chart2.options.animation
    callback(
        animationOptions2 && animationOptions2.onProgress,
        [context],
        chart2,
    )
}
function getCanvas(item) {
    return (
        _isDomSupported() && typeof item == 'string'
            ? (item = document.getElementById(item))
            : item && item.length && (item = item[0]),
        item && item.canvas && (item = item.canvas),
        item
    )
}
var instances = {},
    getChart = (key) => {
        let canvas = getCanvas(key)
        return Object.values(instances)
            .filter((c) => c.canvas === canvas)
            .pop()
    }
function moveNumericKeys(obj, start, move) {
    let keys = Object.keys(obj)
    for (let key of keys) {
        let intKey = +key
        if (intKey >= start) {
            let value = obj[key]
            delete obj[key],
                (move > 0 || intKey > start) && (obj[intKey + move] = value)
        }
    }
}
function determineLastEvent(e, lastEvent, inChartArea, isClick) {
    return !inChartArea || e.type === 'mouseout'
        ? null
        : isClick
        ? lastEvent
        : e
}
var Chart = class {
        constructor(item, userConfig) {
            let config = (this.config = new Config(userConfig)),
                initialCanvas = getCanvas(item),
                existingChart = getChart(initialCanvas)
            if (existingChart)
                throw new Error(
                    "Canvas is already in use. Chart with ID '" +
                        existingChart.id +
                        "' must be destroyed before the canvas with ID '" +
                        existingChart.canvas.id +
                        "' can be reused.",
                )
            let options = config.createResolver(
                config.chartOptionScopes(),
                this.getContext(),
            )
            ;(this.platform = new (config.platform ||
                _detectPlatform(initialCanvas))()),
                this.platform.updateConfig(config)
            let context = this.platform.acquireContext(
                    initialCanvas,
                    options.aspectRatio,
                ),
                canvas = context && context.canvas,
                height = canvas && canvas.height,
                width = canvas && canvas.width
            if (
                ((this.id = uid()),
                (this.ctx = context),
                (this.canvas = canvas),
                (this.width = width),
                (this.height = height),
                (this._options = options),
                (this._aspectRatio = this.aspectRatio),
                (this._layers = []),
                (this._metasets = []),
                (this._stacks = void 0),
                (this.boxes = []),
                (this.currentDevicePixelRatio = void 0),
                (this.chartArea = void 0),
                (this._active = []),
                (this._lastEvent = void 0),
                (this._listeners = {}),
                (this._responsiveListeners = void 0),
                (this._sortedMetasets = []),
                (this.scales = {}),
                (this._plugins = new PluginService()),
                (this.$proxies = {}),
                (this._hiddenIndices = {}),
                (this.attached = !1),
                (this._animationsDisabled = void 0),
                (this.$context = void 0),
                (this._doResize = debounce(
                    (mode) => this.update(mode),
                    options.resizeDelay || 0,
                )),
                (this._dataChanges = []),
                (instances[this.id] = this),
                !context || !canvas)
            ) {
                console.error(
                    "Failed to create chart: can't acquire context from the given item",
                )
                return
            }
            animator.listen(this, 'complete', onAnimationsComplete),
                animator.listen(this, 'progress', onAnimationProgress),
                this._initialize(),
                this.attached && this.update()
        }
        get aspectRatio() {
            let {
                options: { aspectRatio, maintainAspectRatio },
                width,
                height,
                _aspectRatio,
            } = this
            return isNullOrUndef(aspectRatio)
                ? maintainAspectRatio && _aspectRatio
                    ? _aspectRatio
                    : height
                    ? width / height
                    : null
                : aspectRatio
        }
        get data() {
            return this.config.data
        }
        set data(data) {
            this.config.data = data
        }
        get options() {
            return this._options
        }
        set options(options) {
            this.config.options = options
        }
        _initialize() {
            return (
                this.notifyPlugins('beforeInit'),
                this.options.responsive
                    ? this.resize()
                    : retinaScale(this, this.options.devicePixelRatio),
                this.bindEvents(),
                this.notifyPlugins('afterInit'),
                this
            )
        }
        clear() {
            return clearCanvas(this.canvas, this.ctx), this
        }
        stop() {
            return animator.stop(this), this
        }
        resize(width, height) {
            animator.running(this)
                ? (this._resizeBeforeDraw = { width, height })
                : this._resize(width, height)
        }
        _resize(width, height) {
            let options = this.options,
                canvas = this.canvas,
                aspectRatio = options.maintainAspectRatio && this.aspectRatio,
                newSize = this.platform.getMaximumSize(
                    canvas,
                    width,
                    height,
                    aspectRatio,
                ),
                newRatio =
                    options.devicePixelRatio ||
                    this.platform.getDevicePixelRatio(),
                mode = this.width ? 'resize' : 'attach'
            ;(this.width = newSize.width),
                (this.height = newSize.height),
                (this._aspectRatio = this.aspectRatio),
                !!retinaScale(this, newRatio, !0) &&
                    (this.notifyPlugins('resize', { size: newSize }),
                    callback(options.onResize, [this, newSize], this),
                    this.attached && this._doResize(mode) && this.render())
        }
        ensureScalesHaveIDs() {
            let scalesOptions = this.options.scales || {}
            each(scalesOptions, (axisOptions, axisID) => {
                axisOptions.id = axisID
            })
        }
        buildOrUpdateScales() {
            let options = this.options,
                scaleOpts = options.scales,
                scales2 = this.scales,
                updated = Object.keys(scales2).reduce(
                    (obj, id) => ((obj[id] = !1), obj),
                    {},
                ),
                items = []
            scaleOpts &&
                (items = items.concat(
                    Object.keys(scaleOpts).map((id) => {
                        let scaleOptions = scaleOpts[id],
                            axis = determineAxis(id, scaleOptions),
                            isRadial = axis === 'r',
                            isHorizontal = axis === 'x'
                        return {
                            options: scaleOptions,
                            dposition: isRadial
                                ? 'chartArea'
                                : isHorizontal
                                ? 'bottom'
                                : 'left',
                            dtype: isRadial
                                ? 'radialLinear'
                                : isHorizontal
                                ? 'category'
                                : 'linear',
                        }
                    }),
                )),
                each(items, (item) => {
                    let scaleOptions = item.options,
                        id = scaleOptions.id,
                        axis = determineAxis(id, scaleOptions),
                        scaleType = valueOrDefault(
                            scaleOptions.type,
                            item.dtype,
                        )
                    ;(scaleOptions.position === void 0 ||
                        positionIsHorizontal(scaleOptions.position, axis) !==
                            positionIsHorizontal(item.dposition)) &&
                        (scaleOptions.position = item.dposition),
                        (updated[id] = !0)
                    let scale = null
                    if (id in scales2 && scales2[id].type === scaleType)
                        scale = scales2[id]
                    else {
                        let scaleClass = registry.getScale(scaleType)
                        ;(scale = new scaleClass({
                            id,
                            type: scaleType,
                            ctx: this.ctx,
                            chart: this,
                        })),
                            (scales2[scale.id] = scale)
                    }
                    scale.init(scaleOptions, options)
                }),
                each(updated, (hasUpdated, id) => {
                    hasUpdated || delete scales2[id]
                }),
                each(scales2, (scale) => {
                    layouts.configure(this, scale, scale.options),
                        layouts.addBox(this, scale)
                })
        }
        _updateMetasets() {
            let metasets = this._metasets,
                numData = this.data.datasets.length,
                numMeta = metasets.length
            if (
                (metasets.sort((a, b) => a.index - b.index), numMeta > numData)
            ) {
                for (let i = numData; i < numMeta; ++i)
                    this._destroyDatasetMeta(i)
                metasets.splice(numData, numMeta - numData)
            }
            this._sortedMetasets = metasets
                .slice(0)
                .sort(compare2Level('order', 'index'))
        }
        _removeUnreferencedMetasets() {
            let {
                _metasets: metasets,
                data: { datasets },
            } = this
            metasets.length > datasets.length && delete this._stacks,
                metasets.forEach((meta, index2) => {
                    datasets.filter((x) => x === meta._dataset).length === 0 &&
                        this._destroyDatasetMeta(index2)
                })
        }
        buildOrUpdateControllers() {
            let newControllers = [],
                datasets = this.data.datasets,
                i,
                ilen
            for (
                this._removeUnreferencedMetasets(),
                    i = 0,
                    ilen = datasets.length;
                i < ilen;
                i++
            ) {
                let dataset = datasets[i],
                    meta = this.getDatasetMeta(i),
                    type = dataset.type || this.config.type
                if (
                    (meta.type &&
                        meta.type !== type &&
                        (this._destroyDatasetMeta(i),
                        (meta = this.getDatasetMeta(i))),
                    (meta.type = type),
                    (meta.indexAxis =
                        dataset.indexAxis || getIndexAxis(type, this.options)),
                    (meta.order = dataset.order || 0),
                    (meta.index = i),
                    (meta.label = '' + dataset.label),
                    (meta.visible = this.isDatasetVisible(i)),
                    meta.controller)
                )
                    meta.controller.updateIndex(i), meta.controller.linkScales()
                else {
                    let ControllerClass = registry.getController(type),
                        { datasetElementType, dataElementType } =
                            defaults.datasets[type]
                    Object.assign(ControllerClass.prototype, {
                        dataElementType: registry.getElement(dataElementType),
                        datasetElementType:
                            datasetElementType &&
                            registry.getElement(datasetElementType),
                    }),
                        (meta.controller = new ControllerClass(this, i)),
                        newControllers.push(meta.controller)
                }
            }
            return this._updateMetasets(), newControllers
        }
        _resetElements() {
            each(
                this.data.datasets,
                (dataset, datasetIndex) => {
                    this.getDatasetMeta(datasetIndex).controller.reset()
                },
                this,
            )
        }
        reset() {
            this._resetElements(), this.notifyPlugins('reset')
        }
        update(mode) {
            let config = this.config
            config.update()
            let options = (this._options = config.createResolver(
                    config.chartOptionScopes(),
                    this.getContext(),
                )),
                animsDisabled = (this._animationsDisabled = !options.animation)
            if (
                (this._updateScales(),
                this._checkEventBindings(),
                this._updateHiddenIndices(),
                this._plugins.invalidate(),
                this.notifyPlugins('beforeUpdate', { mode, cancelable: !0 }) ===
                    !1)
            )
                return
            let newControllers = this.buildOrUpdateControllers()
            this.notifyPlugins('beforeElementsUpdate')
            let minPadding = 0
            for (let i = 0, ilen = this.data.datasets.length; i < ilen; i++) {
                let { controller } = this.getDatasetMeta(i),
                    reset =
                        !animsDisabled &&
                        newControllers.indexOf(controller) === -1
                controller.buildOrUpdateElements(reset),
                    (minPadding = Math.max(
                        +controller.getMaxOverflow(),
                        minPadding,
                    ))
            }
            ;(minPadding = this._minPadding =
                options.layout.autoPadding ? minPadding : 0),
                this._updateLayout(minPadding),
                animsDisabled ||
                    each(newControllers, (controller) => {
                        controller.reset()
                    }),
                this._updateDatasets(mode),
                this.notifyPlugins('afterUpdate', { mode }),
                this._layers.sort(compare2Level('z', '_idx'))
            let { _active, _lastEvent } = this
            _lastEvent
                ? this._eventHandler(_lastEvent, !0)
                : _active.length &&
                  this._updateHoverStyles(_active, _active, !0),
                this.render()
        }
        _updateScales() {
            each(this.scales, (scale) => {
                layouts.removeBox(this, scale)
            }),
                this.ensureScalesHaveIDs(),
                this.buildOrUpdateScales()
        }
        _checkEventBindings() {
            let options = this.options,
                existingEvents = new Set(Object.keys(this._listeners)),
                newEvents = new Set(options.events)
            ;(!setsEqual(existingEvents, newEvents) ||
                !!this._responsiveListeners !== options.responsive) &&
                (this.unbindEvents(), this.bindEvents())
        }
        _updateHiddenIndices() {
            let { _hiddenIndices } = this,
                changes = this._getUniformDataChanges() || []
            for (let { method, start, count } of changes) {
                let move = method === '_removeElements' ? -count : count
                moveNumericKeys(_hiddenIndices, start, move)
            }
        }
        _getUniformDataChanges() {
            let _dataChanges = this._dataChanges
            if (!_dataChanges || !_dataChanges.length) return
            this._dataChanges = []
            let datasetCount = this.data.datasets.length,
                makeSet = (idx) =>
                    new Set(
                        _dataChanges
                            .filter((c) => c[0] === idx)
                            .map((c, i) => i + ',' + c.splice(1).join(',')),
                    ),
                changeSet = makeSet(0)
            for (let i = 1; i < datasetCount; i++)
                if (!setsEqual(changeSet, makeSet(i))) return
            return Array.from(changeSet)
                .map((c) => c.split(','))
                .map((a) => ({ method: a[1], start: +a[2], count: +a[3] }))
        }
        _updateLayout(minPadding) {
            if (this.notifyPlugins('beforeLayout', { cancelable: !0 }) === !1)
                return
            layouts.update(this, this.width, this.height, minPadding)
            let area = this.chartArea,
                noArea = area.width <= 0 || area.height <= 0
            ;(this._layers = []),
                each(
                    this.boxes,
                    (box) => {
                        ;(noArea && box.position === 'chartArea') ||
                            (box.configure && box.configure(),
                            this._layers.push(...box._layers()))
                    },
                    this,
                ),
                this._layers.forEach((item, index2) => {
                    item._idx = index2
                }),
                this.notifyPlugins('afterLayout')
        }
        _updateDatasets(mode) {
            if (
                this.notifyPlugins('beforeDatasetsUpdate', {
                    mode,
                    cancelable: !0,
                }) !== !1
            ) {
                for (let i = 0, ilen = this.data.datasets.length; i < ilen; ++i)
                    this.getDatasetMeta(i).controller.configure()
                for (let i = 0, ilen = this.data.datasets.length; i < ilen; ++i)
                    this._updateDataset(
                        i,
                        isFunction(mode) ? mode({ datasetIndex: i }) : mode,
                    )
                this.notifyPlugins('afterDatasetsUpdate', { mode })
            }
        }
        _updateDataset(index2, mode) {
            let meta = this.getDatasetMeta(index2),
                args = { meta, index: index2, mode, cancelable: !0 }
            this.notifyPlugins('beforeDatasetUpdate', args) !== !1 &&
                (meta.controller._update(mode),
                (args.cancelable = !1),
                this.notifyPlugins('afterDatasetUpdate', args))
        }
        render() {
            this.notifyPlugins('beforeRender', { cancelable: !0 }) !== !1 &&
                (animator.has(this)
                    ? this.attached &&
                      !animator.running(this) &&
                      animator.start(this)
                    : (this.draw(), onAnimationsComplete({ chart: this })))
        }
        draw() {
            let i
            if (this._resizeBeforeDraw) {
                let { width, height } = this._resizeBeforeDraw
                this._resize(width, height), (this._resizeBeforeDraw = null)
            }
            if (
                (this.clear(),
                this.width <= 0 ||
                    this.height <= 0 ||
                    this.notifyPlugins('beforeDraw', { cancelable: !0 }) === !1)
            )
                return
            let layers = this._layers
            for (i = 0; i < layers.length && layers[i].z <= 0; ++i)
                layers[i].draw(this.chartArea)
            for (this._drawDatasets(); i < layers.length; ++i)
                layers[i].draw(this.chartArea)
            this.notifyPlugins('afterDraw')
        }
        _getSortedDatasetMetas(filterVisible) {
            let metasets = this._sortedMetasets,
                result = [],
                i,
                ilen
            for (i = 0, ilen = metasets.length; i < ilen; ++i) {
                let meta = metasets[i]
                ;(!filterVisible || meta.visible) && result.push(meta)
            }
            return result
        }
        getSortedVisibleDatasetMetas() {
            return this._getSortedDatasetMetas(!0)
        }
        _drawDatasets() {
            if (
                this.notifyPlugins('beforeDatasetsDraw', { cancelable: !0 }) ===
                !1
            )
                return
            let metasets = this.getSortedVisibleDatasetMetas()
            for (let i = metasets.length - 1; i >= 0; --i)
                this._drawDataset(metasets[i])
            this.notifyPlugins('afterDatasetsDraw')
        }
        _drawDataset(meta) {
            let ctx = this.ctx,
                clip = meta._clip,
                useClip = !clip.disabled,
                area = this.chartArea,
                args = { meta, index: meta.index, cancelable: !0 }
            this.notifyPlugins('beforeDatasetDraw', args) !== !1 &&
                (useClip &&
                    clipArea(ctx, {
                        left: clip.left === !1 ? 0 : area.left - clip.left,
                        right:
                            clip.right === !1
                                ? this.width
                                : area.right + clip.right,
                        top: clip.top === !1 ? 0 : area.top - clip.top,
                        bottom:
                            clip.bottom === !1
                                ? this.height
                                : area.bottom + clip.bottom,
                    }),
                meta.controller.draw(),
                useClip && unclipArea(ctx),
                (args.cancelable = !1),
                this.notifyPlugins('afterDatasetDraw', args))
        }
        isPointInArea(point) {
            return _isPointInArea(point, this.chartArea, this._minPadding)
        }
        getElementsAtEventForMode(e, mode, options, useFinalPosition) {
            let method = Interaction.modes[mode]
            return typeof method == 'function'
                ? method(this, e, options, useFinalPosition)
                : []
        }
        getDatasetMeta(datasetIndex) {
            let dataset = this.data.datasets[datasetIndex],
                metasets = this._metasets,
                meta = metasets.filter((x) => x && x._dataset === dataset).pop()
            return (
                meta ||
                    ((meta = {
                        type: null,
                        data: [],
                        dataset: null,
                        controller: null,
                        hidden: null,
                        xAxisID: null,
                        yAxisID: null,
                        order: (dataset && dataset.order) || 0,
                        index: datasetIndex,
                        _dataset: dataset,
                        _parsed: [],
                        _sorted: !1,
                    }),
                    metasets.push(meta)),
                meta
            )
        }
        getContext() {
            return (
                this.$context ||
                (this.$context = createContext(null, {
                    chart: this,
                    type: 'chart',
                }))
            )
        }
        getVisibleDatasetCount() {
            return this.getSortedVisibleDatasetMetas().length
        }
        isDatasetVisible(datasetIndex) {
            let dataset = this.data.datasets[datasetIndex]
            if (!dataset) return !1
            let meta = this.getDatasetMeta(datasetIndex)
            return typeof meta.hidden == 'boolean'
                ? !meta.hidden
                : !dataset.hidden
        }
        setDatasetVisibility(datasetIndex, visible) {
            let meta = this.getDatasetMeta(datasetIndex)
            meta.hidden = !visible
        }
        toggleDataVisibility(index2) {
            this._hiddenIndices[index2] = !this._hiddenIndices[index2]
        }
        getDataVisibility(index2) {
            return !this._hiddenIndices[index2]
        }
        _updateVisibility(datasetIndex, dataIndex, visible) {
            let mode = visible ? 'show' : 'hide',
                meta = this.getDatasetMeta(datasetIndex),
                anims = meta.controller._resolveAnimations(void 0, mode)
            defined(dataIndex)
                ? ((meta.data[dataIndex].hidden = !visible), this.update())
                : (this.setDatasetVisibility(datasetIndex, visible),
                  anims.update(meta, { visible }),
                  this.update((ctx) =>
                      ctx.datasetIndex === datasetIndex ? mode : void 0,
                  ))
        }
        hide(datasetIndex, dataIndex) {
            this._updateVisibility(datasetIndex, dataIndex, !1)
        }
        show(datasetIndex, dataIndex) {
            this._updateVisibility(datasetIndex, dataIndex, !0)
        }
        _destroyDatasetMeta(datasetIndex) {
            let meta = this._metasets[datasetIndex]
            meta && meta.controller && meta.controller._destroy(),
                delete this._metasets[datasetIndex]
        }
        _stop() {
            let i, ilen
            for (
                this.stop(),
                    animator.remove(this),
                    i = 0,
                    ilen = this.data.datasets.length;
                i < ilen;
                ++i
            )
                this._destroyDatasetMeta(i)
        }
        destroy() {
            this.notifyPlugins('beforeDestroy')
            let { canvas, ctx } = this
            this._stop(),
                this.config.clearCache(),
                canvas &&
                    (this.unbindEvents(),
                    clearCanvas(canvas, ctx),
                    this.platform.releaseContext(ctx),
                    (this.canvas = null),
                    (this.ctx = null)),
                this.notifyPlugins('destroy'),
                delete instances[this.id],
                this.notifyPlugins('afterDestroy')
        }
        toBase64Image(...args) {
            return this.canvas.toDataURL(...args)
        }
        bindEvents() {
            this.bindUserEvents(),
                this.options.responsive
                    ? this.bindResponsiveEvents()
                    : (this.attached = !0)
        }
        bindUserEvents() {
            let listeners = this._listeners,
                platform = this.platform,
                _add = (type, listener2) => {
                    platform.addEventListener(this, type, listener2),
                        (listeners[type] = listener2)
                },
                listener = (e, x, y) => {
                    ;(e.offsetX = x), (e.offsetY = y), this._eventHandler(e)
                }
            each(this.options.events, (type) => _add(type, listener))
        }
        bindResponsiveEvents() {
            this._responsiveListeners || (this._responsiveListeners = {})
            let listeners = this._responsiveListeners,
                platform = this.platform,
                _add = (type, listener2) => {
                    platform.addEventListener(this, type, listener2),
                        (listeners[type] = listener2)
                },
                _remove = (type, listener2) => {
                    listeners[type] &&
                        (platform.removeEventListener(this, type, listener2),
                        delete listeners[type])
                },
                listener = (width, height) => {
                    this.canvas && this.resize(width, height)
                },
                detached,
                attached = () => {
                    _remove('attach', attached),
                        (this.attached = !0),
                        this.resize(),
                        _add('resize', listener),
                        _add('detach', detached)
                }
            ;(detached = () => {
                ;(this.attached = !1),
                    _remove('resize', listener),
                    this._stop(),
                    this._resize(0, 0),
                    _add('attach', attached)
            }),
                platform.isAttached(this.canvas) ? attached() : detached()
        }
        unbindEvents() {
            each(this._listeners, (listener, type) => {
                this.platform.removeEventListener(this, type, listener)
            }),
                (this._listeners = {}),
                each(this._responsiveListeners, (listener, type) => {
                    this.platform.removeEventListener(this, type, listener)
                }),
                (this._responsiveListeners = void 0)
        }
        updateHoverStyle(items, mode, enabled) {
            let prefix = enabled ? 'set' : 'remove',
                meta,
                item,
                i,
                ilen
            for (
                mode === 'dataset' &&
                    ((meta = this.getDatasetMeta(items[0].datasetIndex)),
                    meta.controller['_' + prefix + 'DatasetHoverStyle']()),
                    i = 0,
                    ilen = items.length;
                i < ilen;
                ++i
            ) {
                item = items[i]
                let controller =
                    item && this.getDatasetMeta(item.datasetIndex).controller
                controller &&
                    controller[prefix + 'HoverStyle'](
                        item.element,
                        item.datasetIndex,
                        item.index,
                    )
            }
        }
        getActiveElements() {
            return this._active || []
        }
        setActiveElements(activeElements) {
            let lastActive = this._active || [],
                active = activeElements.map(
                    ({ datasetIndex, index: index2 }) => {
                        let meta = this.getDatasetMeta(datasetIndex)
                        if (!meta)
                            throw new Error(
                                'No dataset found at index ' + datasetIndex,
                            )
                        return {
                            datasetIndex,
                            element: meta.data[index2],
                            index: index2,
                        }
                    },
                )
            !_elementsEqual(active, lastActive) &&
                ((this._active = active),
                (this._lastEvent = null),
                this._updateHoverStyles(active, lastActive))
        }
        notifyPlugins(hook, args, filter) {
            return this._plugins.notify(this, hook, args, filter)
        }
        _updateHoverStyles(active, lastActive, replay) {
            let hoverOptions = this.options.hover,
                diff = (a, b) =>
                    a.filter(
                        (x) =>
                            !b.some(
                                (y) =>
                                    x.datasetIndex === y.datasetIndex &&
                                    x.index === y.index,
                            ),
                    ),
                deactivated = diff(lastActive, active),
                activated = replay ? active : diff(active, lastActive)
            deactivated.length &&
                this.updateHoverStyle(deactivated, hoverOptions.mode, !1),
                activated.length &&
                    hoverOptions.mode &&
                    this.updateHoverStyle(activated, hoverOptions.mode, !0)
        }
        _eventHandler(e, replay) {
            let args = {
                    event: e,
                    replay,
                    cancelable: !0,
                    inChartArea: this.isPointInArea(e),
                },
                eventFilter = (plugin) =>
                    (plugin.options.events || this.options.events).includes(
                        e.native.type,
                    )
            if (this.notifyPlugins('beforeEvent', args, eventFilter) === !1)
                return
            let changed = this._handleEvent(e, replay, args.inChartArea)
            return (
                (args.cancelable = !1),
                this.notifyPlugins('afterEvent', args, eventFilter),
                (changed || args.changed) && this.render(),
                this
            )
        }
        _handleEvent(e, replay, inChartArea) {
            let { _active: lastActive = [], options } = this,
                useFinalPosition = replay,
                active = this._getActiveElements(
                    e,
                    lastActive,
                    inChartArea,
                    useFinalPosition,
                ),
                isClick = _isClickEvent(e),
                lastEvent = determineLastEvent(
                    e,
                    this._lastEvent,
                    inChartArea,
                    isClick,
                )
            inChartArea &&
                ((this._lastEvent = null),
                callback(options.onHover, [e, active, this], this),
                isClick && callback(options.onClick, [e, active, this], this))
            let changed = !_elementsEqual(active, lastActive)
            return (
                (changed || replay) &&
                    ((this._active = active),
                    this._updateHoverStyles(active, lastActive, replay)),
                (this._lastEvent = lastEvent),
                changed
            )
        }
        _getActiveElements(e, lastActive, inChartArea, useFinalPosition) {
            if (e.type === 'mouseout') return []
            if (!inChartArea) return lastActive
            let hoverOptions = this.options.hover
            return this.getElementsAtEventForMode(
                e,
                hoverOptions.mode,
                hoverOptions,
                useFinalPosition,
            )
        }
    },
    invalidatePlugins = () =>
        each(Chart.instances, (chart2) => chart2._plugins.invalidate()),
    enumerable = !0
Object.defineProperties(Chart, {
    defaults: { enumerable, value: defaults },
    instances: { enumerable, value: instances },
    overrides: { enumerable, value: overrides },
    registry: { enumerable, value: registry },
    version: { enumerable, value: version },
    getChart: { enumerable, value: getChart },
    register: {
        enumerable,
        value: (...items) => {
            registry.add(...items), invalidatePlugins()
        },
    },
    unregister: {
        enumerable,
        value: (...items) => {
            registry.remove(...items), invalidatePlugins()
        },
    },
})
function clipArc(ctx, element, endAngle) {
    let { startAngle, pixelMargin, x, y, outerRadius, innerRadius } = element,
        angleMargin = pixelMargin / outerRadius
    ctx.beginPath(),
        ctx.arc(
            x,
            y,
            outerRadius,
            startAngle - angleMargin,
            endAngle + angleMargin,
        ),
        innerRadius > pixelMargin
            ? ((angleMargin = pixelMargin / innerRadius),
              ctx.arc(
                  x,
                  y,
                  innerRadius,
                  endAngle + angleMargin,
                  startAngle - angleMargin,
                  !0,
              ))
            : ctx.arc(
                  x,
                  y,
                  pixelMargin,
                  endAngle + HALF_PI,
                  startAngle - HALF_PI,
              ),
        ctx.closePath(),
        ctx.clip()
}
function toRadiusCorners(value) {
    return _readValueToProps(value, [
        'outerStart',
        'outerEnd',
        'innerStart',
        'innerEnd',
    ])
}
function parseBorderRadius$1(arc, innerRadius, outerRadius, angleDelta) {
    let o = toRadiusCorners(arc.options.borderRadius),
        halfThickness = (outerRadius - innerRadius) / 2,
        innerLimit = Math.min(halfThickness, (angleDelta * innerRadius) / 2),
        computeOuterLimit = (val) => {
            let outerArcLimit =
                ((outerRadius - Math.min(halfThickness, val)) * angleDelta) / 2
            return _limitValue(val, 0, Math.min(halfThickness, outerArcLimit))
        }
    return {
        outerStart: computeOuterLimit(o.outerStart),
        outerEnd: computeOuterLimit(o.outerEnd),
        innerStart: _limitValue(o.innerStart, 0, innerLimit),
        innerEnd: _limitValue(o.innerEnd, 0, innerLimit),
    }
}
function rThetaToXY(r, theta, x, y) {
    return { x: x + r * Math.cos(theta), y: y + r * Math.sin(theta) }
}
function pathArc(ctx, element, offset, spacing, end, circular) {
    let { x, y, startAngle: start, pixelMargin, innerRadius: innerR } = element,
        outerRadius = Math.max(
            element.outerRadius + spacing + offset - pixelMargin,
            0,
        ),
        innerRadius = innerR > 0 ? innerR + spacing + offset + pixelMargin : 0,
        spacingOffset = 0,
        alpha2 = end - start
    if (spacing) {
        let noSpacingInnerRadius = innerR > 0 ? innerR - spacing : 0,
            noSpacingOuterRadius = outerRadius > 0 ? outerRadius - spacing : 0,
            avNogSpacingRadius =
                (noSpacingInnerRadius + noSpacingOuterRadius) / 2,
            adjustedAngle =
                avNogSpacingRadius !== 0
                    ? (alpha2 * avNogSpacingRadius) /
                      (avNogSpacingRadius + spacing)
                    : alpha2
        spacingOffset = (alpha2 - adjustedAngle) / 2
    }
    let beta =
            Math.max(0.001, alpha2 * outerRadius - offset / PI) / outerRadius,
        angleOffset = (alpha2 - beta) / 2,
        startAngle = start + angleOffset + spacingOffset,
        endAngle = end - angleOffset - spacingOffset,
        { outerStart, outerEnd, innerStart, innerEnd } = parseBorderRadius$1(
            element,
            innerRadius,
            outerRadius,
            endAngle - startAngle,
        ),
        outerStartAdjustedRadius = outerRadius - outerStart,
        outerEndAdjustedRadius = outerRadius - outerEnd,
        outerStartAdjustedAngle =
            startAngle + outerStart / outerStartAdjustedRadius,
        outerEndAdjustedAngle = endAngle - outerEnd / outerEndAdjustedRadius,
        innerStartAdjustedRadius = innerRadius + innerStart,
        innerEndAdjustedRadius = innerRadius + innerEnd,
        innerStartAdjustedAngle =
            startAngle + innerStart / innerStartAdjustedRadius,
        innerEndAdjustedAngle = endAngle - innerEnd / innerEndAdjustedRadius
    if ((ctx.beginPath(), circular)) {
        if (
            (ctx.arc(
                x,
                y,
                outerRadius,
                outerStartAdjustedAngle,
                outerEndAdjustedAngle,
            ),
            outerEnd > 0)
        ) {
            let pCenter = rThetaToXY(
                outerEndAdjustedRadius,
                outerEndAdjustedAngle,
                x,
                y,
            )
            ctx.arc(
                pCenter.x,
                pCenter.y,
                outerEnd,
                outerEndAdjustedAngle,
                endAngle + HALF_PI,
            )
        }
        let p4 = rThetaToXY(innerEndAdjustedRadius, endAngle, x, y)
        if ((ctx.lineTo(p4.x, p4.y), innerEnd > 0)) {
            let pCenter = rThetaToXY(
                innerEndAdjustedRadius,
                innerEndAdjustedAngle,
                x,
                y,
            )
            ctx.arc(
                pCenter.x,
                pCenter.y,
                innerEnd,
                endAngle + HALF_PI,
                innerEndAdjustedAngle + Math.PI,
            )
        }
        if (
            (ctx.arc(
                x,
                y,
                innerRadius,
                endAngle - innerEnd / innerRadius,
                startAngle + innerStart / innerRadius,
                !0,
            ),
            innerStart > 0)
        ) {
            let pCenter = rThetaToXY(
                innerStartAdjustedRadius,
                innerStartAdjustedAngle,
                x,
                y,
            )
            ctx.arc(
                pCenter.x,
                pCenter.y,
                innerStart,
                innerStartAdjustedAngle + Math.PI,
                startAngle - HALF_PI,
            )
        }
        let p8 = rThetaToXY(outerStartAdjustedRadius, startAngle, x, y)
        if ((ctx.lineTo(p8.x, p8.y), outerStart > 0)) {
            let pCenter = rThetaToXY(
                outerStartAdjustedRadius,
                outerStartAdjustedAngle,
                x,
                y,
            )
            ctx.arc(
                pCenter.x,
                pCenter.y,
                outerStart,
                startAngle - HALF_PI,
                outerStartAdjustedAngle,
            )
        }
    } else {
        ctx.moveTo(x, y)
        let outerStartX = Math.cos(outerStartAdjustedAngle) * outerRadius + x,
            outerStartY = Math.sin(outerStartAdjustedAngle) * outerRadius + y
        ctx.lineTo(outerStartX, outerStartY)
        let outerEndX = Math.cos(outerEndAdjustedAngle) * outerRadius + x,
            outerEndY = Math.sin(outerEndAdjustedAngle) * outerRadius + y
        ctx.lineTo(outerEndX, outerEndY)
    }
    ctx.closePath()
}
function drawArc(ctx, element, offset, spacing, circular) {
    let { fullCircles, startAngle, circumference } = element,
        endAngle = element.endAngle
    if (fullCircles) {
        pathArc(ctx, element, offset, spacing, startAngle + TAU, circular)
        for (let i = 0; i < fullCircles; ++i) ctx.fill()
        isNaN(circumference) ||
            ((endAngle = startAngle + (circumference % TAU)),
            circumference % TAU == 0 && (endAngle += TAU))
    }
    return (
        pathArc(ctx, element, offset, spacing, endAngle, circular),
        ctx.fill(),
        endAngle
    )
}
function drawFullCircleBorders(ctx, element, inner) {
    let { x, y, startAngle, pixelMargin, fullCircles } = element,
        outerRadius = Math.max(element.outerRadius - pixelMargin, 0),
        innerRadius = element.innerRadius + pixelMargin,
        i
    for (
        inner && clipArc(ctx, element, startAngle + TAU),
            ctx.beginPath(),
            ctx.arc(x, y, innerRadius, startAngle + TAU, startAngle, !0),
            i = 0;
        i < fullCircles;
        ++i
    )
        ctx.stroke()
    for (
        ctx.beginPath(),
            ctx.arc(x, y, outerRadius, startAngle, startAngle + TAU),
            i = 0;
        i < fullCircles;
        ++i
    )
        ctx.stroke()
}
function drawBorder(ctx, element, offset, spacing, endAngle, circular) {
    let { options } = element,
        { borderWidth, borderJoinStyle } = options,
        inner = options.borderAlign === 'inner'
    !borderWidth ||
        (inner
            ? ((ctx.lineWidth = borderWidth * 2),
              (ctx.lineJoin = borderJoinStyle || 'round'))
            : ((ctx.lineWidth = borderWidth),
              (ctx.lineJoin = borderJoinStyle || 'bevel')),
        element.fullCircles && drawFullCircleBorders(ctx, element, inner),
        inner && clipArc(ctx, element, endAngle),
        pathArc(ctx, element, offset, spacing, endAngle, circular),
        ctx.stroke())
}
var ArcElement = class extends Element {
    constructor(cfg) {
        super()
        ;(this.options = void 0),
            (this.circumference = void 0),
            (this.startAngle = void 0),
            (this.endAngle = void 0),
            (this.innerRadius = void 0),
            (this.outerRadius = void 0),
            (this.pixelMargin = 0),
            (this.fullCircles = 0),
            cfg && Object.assign(this, cfg)
    }
    inRange(chartX, chartY, useFinalPosition) {
        let point = this.getProps(['x', 'y'], useFinalPosition),
            { angle, distance } = getAngleFromPoint(point, {
                x: chartX,
                y: chartY,
            }),
            { startAngle, endAngle, innerRadius, outerRadius, circumference } =
                this.getProps(
                    [
                        'startAngle',
                        'endAngle',
                        'innerRadius',
                        'outerRadius',
                        'circumference',
                    ],
                    useFinalPosition,
                ),
            rAdjust = this.options.spacing / 2,
            betweenAngles =
                valueOrDefault(circumference, endAngle - startAngle) >= TAU ||
                _angleBetween(angle, startAngle, endAngle),
            withinRadius = _isBetween(
                distance,
                innerRadius + rAdjust,
                outerRadius + rAdjust,
            )
        return betweenAngles && withinRadius
    }
    getCenterPoint(useFinalPosition) {
        let { x, y, startAngle, endAngle, innerRadius, outerRadius } =
                this.getProps(
                    [
                        'x',
                        'y',
                        'startAngle',
                        'endAngle',
                        'innerRadius',
                        'outerRadius',
                        'circumference',
                    ],
                    useFinalPosition,
                ),
            { offset, spacing } = this.options,
            halfAngle = (startAngle + endAngle) / 2,
            halfRadius = (innerRadius + outerRadius + spacing + offset) / 2
        return {
            x: x + Math.cos(halfAngle) * halfRadius,
            y: y + Math.sin(halfAngle) * halfRadius,
        }
    }
    tooltipPosition(useFinalPosition) {
        return this.getCenterPoint(useFinalPosition)
    }
    draw(ctx) {
        let { options, circumference } = this,
            offset = (options.offset || 0) / 2,
            spacing = (options.spacing || 0) / 2,
            circular = options.circular
        if (
            ((this.pixelMargin = options.borderAlign === 'inner' ? 0.33 : 0),
            (this.fullCircles =
                circumference > TAU ? Math.floor(circumference / TAU) : 0),
            circumference === 0 || this.innerRadius < 0 || this.outerRadius < 0)
        )
            return
        ctx.save()
        let radiusOffset = 0
        if (offset) {
            radiusOffset = offset / 2
            let halfAngle = (this.startAngle + this.endAngle) / 2
            ctx.translate(
                Math.cos(halfAngle) * radiusOffset,
                Math.sin(halfAngle) * radiusOffset,
            ),
                this.circumference >= PI && (radiusOffset = offset)
        }
        ;(ctx.fillStyle = options.backgroundColor),
            (ctx.strokeStyle = options.borderColor)
        let endAngle = drawArc(ctx, this, radiusOffset, spacing, circular)
        drawBorder(ctx, this, radiusOffset, spacing, endAngle, circular),
            ctx.restore()
    }
}
ArcElement.id = 'arc'
ArcElement.defaults = {
    borderAlign: 'center',
    borderColor: '#fff',
    borderJoinStyle: void 0,
    borderRadius: 0,
    borderWidth: 2,
    offset: 0,
    spacing: 0,
    angle: void 0,
    circular: !0,
}
ArcElement.defaultRoutes = { backgroundColor: 'backgroundColor' }
function setStyle(ctx, options, style = options) {
    ;(ctx.lineCap = valueOrDefault(
        style.borderCapStyle,
        options.borderCapStyle,
    )),
        ctx.setLineDash(valueOrDefault(style.borderDash, options.borderDash)),
        (ctx.lineDashOffset = valueOrDefault(
            style.borderDashOffset,
            options.borderDashOffset,
        )),
        (ctx.lineJoin = valueOrDefault(
            style.borderJoinStyle,
            options.borderJoinStyle,
        )),
        (ctx.lineWidth = valueOrDefault(
            style.borderWidth,
            options.borderWidth,
        )),
        (ctx.strokeStyle = valueOrDefault(
            style.borderColor,
            options.borderColor,
        ))
}
function lineTo(ctx, previous, target) {
    ctx.lineTo(target.x, target.y)
}
function getLineMethod(options) {
    return options.stepped
        ? _steppedLineTo
        : options.tension || options.cubicInterpolationMode === 'monotone'
        ? _bezierCurveTo
        : lineTo
}
function pathVars(points, segment, params = {}) {
    let count = points.length,
        { start: paramsStart = 0, end: paramsEnd = count - 1 } = params,
        { start: segmentStart, end: segmentEnd } = segment,
        start = Math.max(paramsStart, segmentStart),
        end = Math.min(paramsEnd, segmentEnd),
        outside =
            (paramsStart < segmentStart && paramsEnd < segmentStart) ||
            (paramsStart > segmentEnd && paramsEnd > segmentEnd)
    return {
        count,
        start,
        loop: segment.loop,
        ilen: end < start && !outside ? count + end - start : end - start,
    }
}
function pathSegment(ctx, line, segment, params) {
    let { points, options } = line,
        { count, start, loop, ilen } = pathVars(points, segment, params),
        lineMethod = getLineMethod(options),
        { move = !0, reverse } = params || {},
        i,
        point,
        prev
    for (i = 0; i <= ilen; ++i)
        (point = points[(start + (reverse ? ilen - i : i)) % count]),
            !point.skip &&
                (move
                    ? (ctx.moveTo(point.x, point.y), (move = !1))
                    : lineMethod(ctx, prev, point, reverse, options.stepped),
                (prev = point))
    return (
        loop &&
            ((point = points[(start + (reverse ? ilen : 0)) % count]),
            lineMethod(ctx, prev, point, reverse, options.stepped)),
        !!loop
    )
}
function fastPathSegment(ctx, line, segment, params) {
    let points = line.points,
        { count, start, ilen } = pathVars(points, segment, params),
        { move = !0, reverse } = params || {},
        avgX = 0,
        countX = 0,
        i,
        point,
        prevX,
        minY,
        maxY,
        lastY,
        pointIndex = (index2) =>
            (start + (reverse ? ilen - index2 : index2)) % count,
        drawX = () => {
            minY !== maxY &&
                (ctx.lineTo(avgX, maxY),
                ctx.lineTo(avgX, minY),
                ctx.lineTo(avgX, lastY))
        }
    for (
        move && ((point = points[pointIndex(0)]), ctx.moveTo(point.x, point.y)),
            i = 0;
        i <= ilen;
        ++i
    ) {
        if (((point = points[pointIndex(i)]), point.skip)) continue
        let x = point.x,
            y = point.y,
            truncX = x | 0
        truncX === prevX
            ? (y < minY ? (minY = y) : y > maxY && (maxY = y),
              (avgX = (countX * avgX + x) / ++countX))
            : (drawX(),
              ctx.lineTo(x, y),
              (prevX = truncX),
              (countX = 0),
              (minY = maxY = y)),
            (lastY = y)
    }
    drawX()
}
function _getSegmentMethod(line) {
    let opts = line.options,
        borderDash = opts.borderDash && opts.borderDash.length
    return !line._decimated &&
        !line._loop &&
        !opts.tension &&
        opts.cubicInterpolationMode !== 'monotone' &&
        !opts.stepped &&
        !borderDash
        ? fastPathSegment
        : pathSegment
}
function _getInterpolationMethod(options) {
    return options.stepped
        ? _steppedInterpolation
        : options.tension || options.cubicInterpolationMode === 'monotone'
        ? _bezierInterpolation
        : _pointInLine
}
function strokePathWithCache(ctx, line, start, count) {
    let path = line._path
    path ||
        ((path = line._path = new Path2D()),
        line.path(path, start, count) && path.closePath()),
        setStyle(ctx, line.options),
        ctx.stroke(path)
}
function strokePathDirect(ctx, line, start, count) {
    let { segments, options } = line,
        segmentMethod = _getSegmentMethod(line)
    for (let segment of segments)
        setStyle(ctx, options, segment.style),
            ctx.beginPath(),
            segmentMethod(ctx, line, segment, {
                start,
                end: start + count - 1,
            }) && ctx.closePath(),
            ctx.stroke()
}
var usePath2D = typeof Path2D == 'function'
function draw(ctx, line, start, count) {
    usePath2D && !line.options.segment
        ? strokePathWithCache(ctx, line, start, count)
        : strokePathDirect(ctx, line, start, count)
}
var LineElement = class extends Element {
    constructor(cfg) {
        super()
        ;(this.animated = !0),
            (this.options = void 0),
            (this._chart = void 0),
            (this._loop = void 0),
            (this._fullLoop = void 0),
            (this._path = void 0),
            (this._points = void 0),
            (this._segments = void 0),
            (this._decimated = !1),
            (this._pointsUpdated = !1),
            (this._datasetIndex = void 0),
            cfg && Object.assign(this, cfg)
    }
    updateControlPoints(chartArea, indexAxis) {
        let options = this.options
        if (
            (options.tension ||
                options.cubicInterpolationMode === 'monotone') &&
            !options.stepped &&
            !this._pointsUpdated
        ) {
            let loop = options.spanGaps ? this._loop : this._fullLoop
            _updateBezierControlPoints(
                this._points,
                options,
                chartArea,
                loop,
                indexAxis,
            ),
                (this._pointsUpdated = !0)
        }
    }
    set points(points) {
        ;(this._points = points),
            delete this._segments,
            delete this._path,
            (this._pointsUpdated = !1)
    }
    get points() {
        return this._points
    }
    get segments() {
        return (
            this._segments ||
            (this._segments = _computeSegments(this, this.options.segment))
        )
    }
    first() {
        let segments = this.segments,
            points = this.points
        return segments.length && points[segments[0].start]
    }
    last() {
        let segments = this.segments,
            points = this.points,
            count = segments.length
        return count && points[segments[count - 1].end]
    }
    interpolate(point, property) {
        let options = this.options,
            value = point[property],
            points = this.points,
            segments = _boundSegments(this, {
                property,
                start: value,
                end: value,
            })
        if (!segments.length) return
        let result = [],
            _interpolate = _getInterpolationMethod(options),
            i,
            ilen
        for (i = 0, ilen = segments.length; i < ilen; ++i) {
            let { start, end } = segments[i],
                p1 = points[start],
                p2 = points[end]
            if (p1 === p2) {
                result.push(p1)
                continue
            }
            let t = Math.abs(
                    (value - p1[property]) / (p2[property] - p1[property]),
                ),
                interpolated = _interpolate(p1, p2, t, options.stepped)
            ;(interpolated[property] = point[property]),
                result.push(interpolated)
        }
        return result.length === 1 ? result[0] : result
    }
    pathSegment(ctx, segment, params) {
        return _getSegmentMethod(this)(ctx, this, segment, params)
    }
    path(ctx, start, count) {
        let segments = this.segments,
            segmentMethod = _getSegmentMethod(this),
            loop = this._loop
        ;(start = start || 0), (count = count || this.points.length - start)
        for (let segment of segments)
            loop &= segmentMethod(ctx, this, segment, {
                start,
                end: start + count - 1,
            })
        return !!loop
    }
    draw(ctx, chartArea, start, count) {
        let options = this.options || {}
        ;(this.points || []).length &&
            options.borderWidth &&
            (ctx.save(), draw(ctx, this, start, count), ctx.restore()),
            this.animated && ((this._pointsUpdated = !1), (this._path = void 0))
    }
}
LineElement.id = 'line'
LineElement.defaults = {
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0,
    borderJoinStyle: 'miter',
    borderWidth: 3,
    capBezierPoints: !0,
    cubicInterpolationMode: 'default',
    fill: !1,
    spanGaps: !1,
    stepped: !1,
    tension: 0,
}
LineElement.defaultRoutes = {
    backgroundColor: 'backgroundColor',
    borderColor: 'borderColor',
}
LineElement.descriptors = {
    _scriptable: !0,
    _indexable: (name) => name !== 'borderDash' && name !== 'fill',
}
function inRange$1(el, pos, axis, useFinalPosition) {
    let options = el.options,
        { [axis]: value } = el.getProps([axis], useFinalPosition)
    return Math.abs(pos - value) < options.radius + options.hitRadius
}
var PointElement = class extends Element {
    constructor(cfg) {
        super()
        ;(this.options = void 0),
            (this.parsed = void 0),
            (this.skip = void 0),
            (this.stop = void 0),
            cfg && Object.assign(this, cfg)
    }
    inRange(mouseX, mouseY, useFinalPosition) {
        let options = this.options,
            { x, y } = this.getProps(['x', 'y'], useFinalPosition)
        return (
            Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2) <
            Math.pow(options.hitRadius + options.radius, 2)
        )
    }
    inXRange(mouseX, useFinalPosition) {
        return inRange$1(this, mouseX, 'x', useFinalPosition)
    }
    inYRange(mouseY, useFinalPosition) {
        return inRange$1(this, mouseY, 'y', useFinalPosition)
    }
    getCenterPoint(useFinalPosition) {
        let { x, y } = this.getProps(['x', 'y'], useFinalPosition)
        return { x, y }
    }
    size(options) {
        options = options || this.options || {}
        let radius = options.radius || 0
        radius = Math.max(radius, (radius && options.hoverRadius) || 0)
        let borderWidth = (radius && options.borderWidth) || 0
        return (radius + borderWidth) * 2
    }
    draw(ctx, area) {
        let options = this.options
        this.skip ||
            options.radius < 0.1 ||
            !_isPointInArea(this, area, this.size(options) / 2) ||
            ((ctx.strokeStyle = options.borderColor),
            (ctx.lineWidth = options.borderWidth),
            (ctx.fillStyle = options.backgroundColor),
            drawPoint(ctx, options, this.x, this.y))
    }
    getRange() {
        let options = this.options || {}
        return options.radius + options.hitRadius
    }
}
PointElement.id = 'point'
PointElement.defaults = {
    borderWidth: 1,
    hitRadius: 1,
    hoverBorderWidth: 1,
    hoverRadius: 4,
    pointStyle: 'circle',
    radius: 3,
    rotation: 0,
}
PointElement.defaultRoutes = {
    backgroundColor: 'backgroundColor',
    borderColor: 'borderColor',
}
function getBarBounds(bar, useFinalPosition) {
    let { x, y, base, width, height } = bar.getProps(
            ['x', 'y', 'base', 'width', 'height'],
            useFinalPosition,
        ),
        left,
        right,
        top,
        bottom,
        half
    return (
        bar.horizontal
            ? ((half = height / 2),
              (left = Math.min(x, base)),
              (right = Math.max(x, base)),
              (top = y - half),
              (bottom = y + half))
            : ((half = width / 2),
              (left = x - half),
              (right = x + half),
              (top = Math.min(y, base)),
              (bottom = Math.max(y, base))),
        { left, top, right, bottom }
    )
}
function skipOrLimit(skip2, value, min, max) {
    return skip2 ? 0 : _limitValue(value, min, max)
}
function parseBorderWidth(bar, maxW, maxH) {
    let value = bar.options.borderWidth,
        skip2 = bar.borderSkipped,
        o = toTRBL(value)
    return {
        t: skipOrLimit(skip2.top, o.top, 0, maxH),
        r: skipOrLimit(skip2.right, o.right, 0, maxW),
        b: skipOrLimit(skip2.bottom, o.bottom, 0, maxH),
        l: skipOrLimit(skip2.left, o.left, 0, maxW),
    }
}
function parseBorderRadius(bar, maxW, maxH) {
    let { enableBorderRadius } = bar.getProps(['enableBorderRadius']),
        value = bar.options.borderRadius,
        o = toTRBLCorners(value),
        maxR = Math.min(maxW, maxH),
        skip2 = bar.borderSkipped,
        enableBorder = enableBorderRadius || isObject(value)
    return {
        topLeft: skipOrLimit(
            !enableBorder || skip2.top || skip2.left,
            o.topLeft,
            0,
            maxR,
        ),
        topRight: skipOrLimit(
            !enableBorder || skip2.top || skip2.right,
            o.topRight,
            0,
            maxR,
        ),
        bottomLeft: skipOrLimit(
            !enableBorder || skip2.bottom || skip2.left,
            o.bottomLeft,
            0,
            maxR,
        ),
        bottomRight: skipOrLimit(
            !enableBorder || skip2.bottom || skip2.right,
            o.bottomRight,
            0,
            maxR,
        ),
    }
}
function boundingRects(bar) {
    let bounds = getBarBounds(bar),
        width = bounds.right - bounds.left,
        height = bounds.bottom - bounds.top,
        border = parseBorderWidth(bar, width / 2, height / 2),
        radius = parseBorderRadius(bar, width / 2, height / 2)
    return {
        outer: { x: bounds.left, y: bounds.top, w: width, h: height, radius },
        inner: {
            x: bounds.left + border.l,
            y: bounds.top + border.t,
            w: width - border.l - border.r,
            h: height - border.t - border.b,
            radius: {
                topLeft: Math.max(
                    0,
                    radius.topLeft - Math.max(border.t, border.l),
                ),
                topRight: Math.max(
                    0,
                    radius.topRight - Math.max(border.t, border.r),
                ),
                bottomLeft: Math.max(
                    0,
                    radius.bottomLeft - Math.max(border.b, border.l),
                ),
                bottomRight: Math.max(
                    0,
                    radius.bottomRight - Math.max(border.b, border.r),
                ),
            },
        },
    }
}
function inRange(bar, x, y, useFinalPosition) {
    let skipX = x === null,
        skipY = y === null,
        bounds = bar && !(skipX && skipY) && getBarBounds(bar, useFinalPosition)
    return (
        bounds &&
        (skipX || _isBetween(x, bounds.left, bounds.right)) &&
        (skipY || _isBetween(y, bounds.top, bounds.bottom))
    )
}
function hasRadius(radius) {
    return (
        radius.topLeft ||
        radius.topRight ||
        radius.bottomLeft ||
        radius.bottomRight
    )
}
function addNormalRectPath(ctx, rect) {
    ctx.rect(rect.x, rect.y, rect.w, rect.h)
}
function inflateRect(rect, amount, refRect = {}) {
    let x = rect.x !== refRect.x ? -amount : 0,
        y = rect.y !== refRect.y ? -amount : 0,
        w = (rect.x + rect.w !== refRect.x + refRect.w ? amount : 0) - x,
        h = (rect.y + rect.h !== refRect.y + refRect.h ? amount : 0) - y
    return {
        x: rect.x + x,
        y: rect.y + y,
        w: rect.w + w,
        h: rect.h + h,
        radius: rect.radius,
    }
}
var BarElement = class extends Element {
    constructor(cfg) {
        super()
        ;(this.options = void 0),
            (this.horizontal = void 0),
            (this.base = void 0),
            (this.width = void 0),
            (this.height = void 0),
            (this.inflateAmount = void 0),
            cfg && Object.assign(this, cfg)
    }
    draw(ctx) {
        let {
                inflateAmount,
                options: { borderColor, backgroundColor },
            } = this,
            { inner, outer } = boundingRects(this),
            addRectPath = hasRadius(outer.radius)
                ? addRoundedRectPath
                : addNormalRectPath
        ctx.save(),
            (outer.w !== inner.w || outer.h !== inner.h) &&
                (ctx.beginPath(),
                addRectPath(ctx, inflateRect(outer, inflateAmount, inner)),
                ctx.clip(),
                addRectPath(ctx, inflateRect(inner, -inflateAmount, outer)),
                (ctx.fillStyle = borderColor),
                ctx.fill('evenodd')),
            ctx.beginPath(),
            addRectPath(ctx, inflateRect(inner, inflateAmount)),
            (ctx.fillStyle = backgroundColor),
            ctx.fill(),
            ctx.restore()
    }
    inRange(mouseX, mouseY, useFinalPosition) {
        return inRange(this, mouseX, mouseY, useFinalPosition)
    }
    inXRange(mouseX, useFinalPosition) {
        return inRange(this, mouseX, null, useFinalPosition)
    }
    inYRange(mouseY, useFinalPosition) {
        return inRange(this, null, mouseY, useFinalPosition)
    }
    getCenterPoint(useFinalPosition) {
        let { x, y, base, horizontal } = this.getProps(
            ['x', 'y', 'base', 'horizontal'],
            useFinalPosition,
        )
        return {
            x: horizontal ? (x + base) / 2 : x,
            y: horizontal ? y : (y + base) / 2,
        }
    }
    getRange(axis) {
        return axis === 'x' ? this.width / 2 : this.height / 2
    }
}
BarElement.id = 'bar'
BarElement.defaults = {
    borderSkipped: 'start',
    borderWidth: 0,
    borderRadius: 0,
    inflateAmount: 'auto',
    pointStyle: void 0,
}
BarElement.defaultRoutes = {
    backgroundColor: 'backgroundColor',
    borderColor: 'borderColor',
}
var elements = Object.freeze({
    __proto__: null,
    ArcElement,
    LineElement,
    PointElement,
    BarElement,
})
function lttbDecimation(data, start, count, availableWidth, options) {
    let samples = options.samples || availableWidth
    if (samples >= count) return data.slice(start, start + count)
    let decimated = [],
        bucketWidth = (count - 2) / (samples - 2),
        sampledIndex = 0,
        endIndex = start + count - 1,
        a = start,
        i,
        maxAreaPoint,
        maxArea,
        area,
        nextA
    for (decimated[sampledIndex++] = data[a], i = 0; i < samples - 2; i++) {
        let avgX = 0,
            avgY = 0,
            j,
            avgRangeStart = Math.floor((i + 1) * bucketWidth) + 1 + start,
            avgRangeEnd =
                Math.min(Math.floor((i + 2) * bucketWidth) + 1, count) + start,
            avgRangeLength = avgRangeEnd - avgRangeStart
        for (j = avgRangeStart; j < avgRangeEnd; j++)
            (avgX += data[j].x), (avgY += data[j].y)
        ;(avgX /= avgRangeLength), (avgY /= avgRangeLength)
        let rangeOffs = Math.floor(i * bucketWidth) + 1 + start,
            rangeTo =
                Math.min(Math.floor((i + 1) * bucketWidth) + 1, count) + start,
            { x: pointAx, y: pointAy } = data[a]
        for (maxArea = area = -1, j = rangeOffs; j < rangeTo; j++)
            (area =
                0.5 *
                Math.abs(
                    (pointAx - avgX) * (data[j].y - pointAy) -
                        (pointAx - data[j].x) * (avgY - pointAy),
                )),
                area > maxArea &&
                    ((maxArea = area), (maxAreaPoint = data[j]), (nextA = j))
        ;(decimated[sampledIndex++] = maxAreaPoint), (a = nextA)
    }
    return (decimated[sampledIndex++] = data[endIndex]), decimated
}
function minMaxDecimation(data, start, count, availableWidth) {
    let avgX = 0,
        countX = 0,
        i,
        point,
        x,
        y,
        prevX,
        minIndex,
        maxIndex,
        startIndex,
        minY,
        maxY,
        decimated = [],
        endIndex = start + count - 1,
        xMin = data[start].x,
        dx = data[endIndex].x - xMin
    for (i = start; i < start + count; ++i) {
        ;(point = data[i]),
            (x = ((point.x - xMin) / dx) * availableWidth),
            (y = point.y)
        let truncX = x | 0
        if (truncX === prevX)
            y < minY
                ? ((minY = y), (minIndex = i))
                : y > maxY && ((maxY = y), (maxIndex = i)),
                (avgX = (countX * avgX + point.x) / ++countX)
        else {
            let lastIndex = i - 1
            if (!isNullOrUndef(minIndex) && !isNullOrUndef(maxIndex)) {
                let intermediateIndex1 = Math.min(minIndex, maxIndex),
                    intermediateIndex2 = Math.max(minIndex, maxIndex)
                intermediateIndex1 !== startIndex &&
                    intermediateIndex1 !== lastIndex &&
                    decimated.push({ ...data[intermediateIndex1], x: avgX }),
                    intermediateIndex2 !== startIndex &&
                        intermediateIndex2 !== lastIndex &&
                        decimated.push({ ...data[intermediateIndex2], x: avgX })
            }
            i > 0 &&
                lastIndex !== startIndex &&
                decimated.push(data[lastIndex]),
                decimated.push(point),
                (prevX = truncX),
                (countX = 0),
                (minY = maxY = y),
                (minIndex = maxIndex = startIndex = i)
        }
    }
    return decimated
}
function cleanDecimatedDataset(dataset) {
    if (dataset._decimated) {
        let data = dataset._data
        delete dataset._decimated,
            delete dataset._data,
            Object.defineProperty(dataset, 'data', { value: data })
    }
}
function cleanDecimatedData(chart2) {
    chart2.data.datasets.forEach((dataset) => {
        cleanDecimatedDataset(dataset)
    })
}
function getStartAndCountOfVisiblePointsSimplified(meta, points) {
    let pointCount = points.length,
        start = 0,
        count,
        { iScale } = meta,
        { min, max, minDefined, maxDefined } = iScale.getUserBounds()
    return (
        minDefined &&
            (start = _limitValue(
                _lookupByKey(points, iScale.axis, min).lo,
                0,
                pointCount - 1,
            )),
        maxDefined
            ? (count =
                  _limitValue(
                      _lookupByKey(points, iScale.axis, max).hi + 1,
                      start,
                      pointCount,
                  ) - start)
            : (count = pointCount - start),
        { start, count }
    )
}
var plugin_decimation = {
    id: 'decimation',
    defaults: { algorithm: 'min-max', enabled: !1 },
    beforeElementsUpdate: (chart2, args, options) => {
        if (!options.enabled) {
            cleanDecimatedData(chart2)
            return
        }
        let availableWidth = chart2.width
        chart2.data.datasets.forEach((dataset, datasetIndex) => {
            let { _data, indexAxis } = dataset,
                meta = chart2.getDatasetMeta(datasetIndex),
                data = _data || dataset.data
            if (
                resolve([indexAxis, chart2.options.indexAxis]) === 'y' ||
                !meta.controller.supportsDecimation
            )
                return
            let xAxis = chart2.scales[meta.xAxisID]
            if (
                (xAxis.type !== 'linear' && xAxis.type !== 'time') ||
                chart2.options.parsing
            )
                return
            let { start, count } = getStartAndCountOfVisiblePointsSimplified(
                    meta,
                    data,
                ),
                threshold = options.threshold || 4 * availableWidth
            if (count <= threshold) {
                cleanDecimatedDataset(dataset)
                return
            }
            isNullOrUndef(_data) &&
                ((dataset._data = data),
                delete dataset.data,
                Object.defineProperty(dataset, 'data', {
                    configurable: !0,
                    enumerable: !0,
                    get: function () {
                        return this._decimated
                    },
                    set: function (d) {
                        this._data = d
                    },
                }))
            let decimated
            switch (options.algorithm) {
                case 'lttb':
                    decimated = lttbDecimation(
                        data,
                        start,
                        count,
                        availableWidth,
                        options,
                    )
                    break
                case 'min-max':
                    decimated = minMaxDecimation(
                        data,
                        start,
                        count,
                        availableWidth,
                    )
                    break
                default:
                    throw new Error(
                        `Unsupported decimation algorithm '${options.algorithm}'`,
                    )
            }
            dataset._decimated = decimated
        })
    },
    destroy(chart2) {
        cleanDecimatedData(chart2)
    },
}
function _segments(line, target, property) {
    let segments = line.segments,
        points = line.points,
        tpoints = target.points,
        parts = []
    for (let segment of segments) {
        let { start, end } = segment
        end = _findSegmentEnd(start, end, points)
        let bounds = _getBounds(
            property,
            points[start],
            points[end],
            segment.loop,
        )
        if (!target.segments) {
            parts.push({
                source: segment,
                target: bounds,
                start: points[start],
                end: points[end],
            })
            continue
        }
        let targetSegments = _boundSegments(target, bounds)
        for (let tgt of targetSegments) {
            let subBounds = _getBounds(
                    property,
                    tpoints[tgt.start],
                    tpoints[tgt.end],
                    tgt.loop,
                ),
                fillSources = _boundSegment(segment, points, subBounds)
            for (let fillSource of fillSources)
                parts.push({
                    source: fillSource,
                    target: tgt,
                    start: {
                        [property]: _getEdge(
                            bounds,
                            subBounds,
                            'start',
                            Math.max,
                        ),
                    },
                    end: {
                        [property]: _getEdge(
                            bounds,
                            subBounds,
                            'end',
                            Math.min,
                        ),
                    },
                })
        }
    }
    return parts
}
function _getBounds(property, first, last, loop) {
    if (loop) return
    let start = first[property],
        end = last[property]
    return (
        property === 'angle' &&
            ((start = _normalizeAngle(start)), (end = _normalizeAngle(end))),
        { property, start, end }
    )
}
function _pointsFromSegments(boundary, line) {
    let { x = null, y = null } = boundary || {},
        linePoints = line.points,
        points = []
    return (
        line.segments.forEach(({ start, end }) => {
            end = _findSegmentEnd(start, end, linePoints)
            let first = linePoints[start],
                last = linePoints[end]
            y !== null
                ? (points.push({ x: first.x, y }),
                  points.push({ x: last.x, y }))
                : x !== null &&
                  (points.push({ x, y: first.y }),
                  points.push({ x, y: last.y }))
        }),
        points
    )
}
function _findSegmentEnd(start, end, points) {
    for (; end > start; end--) {
        let point = points[end]
        if (!isNaN(point.x) && !isNaN(point.y)) break
    }
    return end
}
function _getEdge(a, b, prop, fn) {
    return a && b ? fn(a[prop], b[prop]) : a ? a[prop] : b ? b[prop] : 0
}
function _createBoundaryLine(boundary, line) {
    let points = [],
        _loop = !1
    return (
        isArray(boundary)
            ? ((_loop = !0), (points = boundary))
            : (points = _pointsFromSegments(boundary, line)),
        points.length
            ? new LineElement({
                  points,
                  options: { tension: 0 },
                  _loop,
                  _fullLoop: _loop,
              })
            : null
    )
}
function _shouldApplyFill(source) {
    return source && source.fill !== !1
}
function _resolveTarget(sources, index2, propagate) {
    let fill2 = sources[index2].fill,
        visited = [index2],
        target
    if (!propagate) return fill2
    for (; fill2 !== !1 && visited.indexOf(fill2) === -1; ) {
        if (!isNumberFinite(fill2)) return fill2
        if (((target = sources[fill2]), !target)) return !1
        if (target.visible) return fill2
        visited.push(fill2), (fill2 = target.fill)
    }
    return !1
}
function _decodeFill(line, index2, count) {
    let fill2 = parseFillOption(line)
    if (isObject(fill2)) return isNaN(fill2.value) ? !1 : fill2
    let target = parseFloat(fill2)
    return isNumberFinite(target) && Math.floor(target) === target
        ? decodeTargetIndex(fill2[0], index2, target, count)
        : ['origin', 'start', 'end', 'stack', 'shape'].indexOf(fill2) >= 0 &&
              fill2
}
function decodeTargetIndex(firstCh, index2, target, count) {
    return (
        (firstCh === '-' || firstCh === '+') && (target = index2 + target),
        target === index2 || target < 0 || target >= count ? !1 : target
    )
}
function _getTargetPixel(fill2, scale) {
    let pixel = null
    return (
        fill2 === 'start'
            ? (pixel = scale.bottom)
            : fill2 === 'end'
            ? (pixel = scale.top)
            : isObject(fill2)
            ? (pixel = scale.getPixelForValue(fill2.value))
            : scale.getBasePixel && (pixel = scale.getBasePixel()),
        pixel
    )
}
function _getTargetValue(fill2, scale, startValue) {
    let value
    return (
        fill2 === 'start'
            ? (value = startValue)
            : fill2 === 'end'
            ? (value = scale.options.reverse ? scale.min : scale.max)
            : isObject(fill2)
            ? (value = fill2.value)
            : (value = scale.getBaseValue()),
        value
    )
}
function parseFillOption(line) {
    let options = line.options,
        fillOption = options.fill,
        fill2 = valueOrDefault(fillOption && fillOption.target, fillOption)
    return (
        fill2 === void 0 && (fill2 = !!options.backgroundColor),
        fill2 === !1 || fill2 === null ? !1 : fill2 === !0 ? 'origin' : fill2
    )
}
function _buildStackLine(source) {
    let { scale, index: index2, line } = source,
        points = [],
        segments = line.segments,
        sourcePoints = line.points,
        linesBelow = getLinesBelow(scale, index2)
    linesBelow.push(_createBoundaryLine({ x: null, y: scale.bottom }, line))
    for (let i = 0; i < segments.length; i++) {
        let segment = segments[i]
        for (let j = segment.start; j <= segment.end; j++)
            addPointsBelow(points, sourcePoints[j], linesBelow)
    }
    return new LineElement({ points, options: {} })
}
function getLinesBelow(scale, index2) {
    let below = [],
        metas = scale.getMatchingVisibleMetas('line')
    for (let i = 0; i < metas.length; i++) {
        let meta = metas[i]
        if (meta.index === index2) break
        meta.hidden || below.unshift(meta.dataset)
    }
    return below
}
function addPointsBelow(points, sourcePoint, linesBelow) {
    let postponed = []
    for (let j = 0; j < linesBelow.length; j++) {
        let line = linesBelow[j],
            { first, last, point } = findPoint(line, sourcePoint, 'x')
        if (!(!point || (first && last))) {
            if (first) postponed.unshift(point)
            else if ((points.push(point), !last)) break
        }
    }
    points.push(...postponed)
}
function findPoint(line, sourcePoint, property) {
    let point = line.interpolate(sourcePoint, property)
    if (!point) return {}
    let pointValue = point[property],
        segments = line.segments,
        linePoints = line.points,
        first = !1,
        last = !1
    for (let i = 0; i < segments.length; i++) {
        let segment = segments[i],
            firstValue = linePoints[segment.start][property],
            lastValue = linePoints[segment.end][property]
        if (_isBetween(pointValue, firstValue, lastValue)) {
            ;(first = pointValue === firstValue),
                (last = pointValue === lastValue)
            break
        }
    }
    return { first, last, point }
}
var simpleArc = class {
    constructor(opts) {
        ;(this.x = opts.x), (this.y = opts.y), (this.radius = opts.radius)
    }
    pathSegment(ctx, bounds, opts) {
        let { x, y, radius } = this
        return (
            (bounds = bounds || { start: 0, end: TAU }),
            ctx.arc(x, y, radius, bounds.end, bounds.start, !0),
            !opts.bounds
        )
    }
    interpolate(point) {
        let { x, y, radius } = this,
            angle = point.angle
        return {
            x: x + Math.cos(angle) * radius,
            y: y + Math.sin(angle) * radius,
            angle,
        }
    }
}
function _getTarget(source) {
    let { chart: chart2, fill: fill2, line } = source
    if (isNumberFinite(fill2)) return getLineByIndex(chart2, fill2)
    if (fill2 === 'stack') return _buildStackLine(source)
    if (fill2 === 'shape') return !0
    let boundary = computeBoundary(source)
    return boundary instanceof simpleArc
        ? boundary
        : _createBoundaryLine(boundary, line)
}
function getLineByIndex(chart2, index2) {
    let meta = chart2.getDatasetMeta(index2)
    return meta && chart2.isDatasetVisible(index2) ? meta.dataset : null
}
function computeBoundary(source) {
    return (source.scale || {}).getPointPositionForValue
        ? computeCircularBoundary(source)
        : computeLinearBoundary(source)
}
function computeLinearBoundary(source) {
    let { scale = {}, fill: fill2 } = source,
        pixel = _getTargetPixel(fill2, scale)
    if (isNumberFinite(pixel)) {
        let horizontal = scale.isHorizontal()
        return { x: horizontal ? pixel : null, y: horizontal ? null : pixel }
    }
    return null
}
function computeCircularBoundary(source) {
    let { scale, fill: fill2 } = source,
        options = scale.options,
        length = scale.getLabels().length,
        start = options.reverse ? scale.max : scale.min,
        value = _getTargetValue(fill2, scale, start),
        target = []
    if (options.grid.circular) {
        let center = scale.getPointPositionForValue(0, start)
        return new simpleArc({
            x: center.x,
            y: center.y,
            radius: scale.getDistanceFromCenterForValue(value),
        })
    }
    for (let i = 0; i < length; ++i)
        target.push(scale.getPointPositionForValue(i, value))
    return target
}
function _drawfill(ctx, source, area) {
    let target = _getTarget(source),
        { line, scale, axis } = source,
        lineOpts = line.options,
        fillOption = lineOpts.fill,
        color2 = lineOpts.backgroundColor,
        { above = color2, below = color2 } = fillOption || {}
    target &&
        line.points.length &&
        (clipArea(ctx, area),
        doFill(ctx, { line, target, above, below, area, scale, axis }),
        unclipArea(ctx))
}
function doFill(ctx, cfg) {
    let { line, target, above, below, area, scale } = cfg,
        property = line._loop ? 'angle' : cfg.axis
    ctx.save(),
        property === 'x' &&
            below !== above &&
            (clipVertical(ctx, target, area.top),
            fill(ctx, { line, target, color: above, scale, property }),
            ctx.restore(),
            ctx.save(),
            clipVertical(ctx, target, area.bottom)),
        fill(ctx, { line, target, color: below, scale, property }),
        ctx.restore()
}
function clipVertical(ctx, target, clipY) {
    let { segments, points } = target,
        first = !0,
        lineLoop = !1
    ctx.beginPath()
    for (let segment of segments) {
        let { start, end } = segment,
            firstPoint = points[start],
            lastPoint = points[_findSegmentEnd(start, end, points)]
        first
            ? (ctx.moveTo(firstPoint.x, firstPoint.y), (first = !1))
            : (ctx.lineTo(firstPoint.x, clipY),
              ctx.lineTo(firstPoint.x, firstPoint.y)),
            (lineLoop = !!target.pathSegment(ctx, segment, { move: lineLoop })),
            lineLoop ? ctx.closePath() : ctx.lineTo(lastPoint.x, clipY)
    }
    ctx.lineTo(target.first().x, clipY), ctx.closePath(), ctx.clip()
}
function fill(ctx, cfg) {
    let { line, target, property, color: color2, scale } = cfg,
        segments = _segments(line, target, property)
    for (let { source: src, target: tgt, start, end } of segments) {
        let { style: { backgroundColor = color2 } = {} } = src,
            notShape = target !== !0
        ctx.save(),
            (ctx.fillStyle = backgroundColor),
            clipBounds(
                ctx,
                scale,
                notShape && _getBounds(property, start, end),
            ),
            ctx.beginPath()
        let lineLoop = !!line.pathSegment(ctx, src),
            loop
        if (notShape) {
            lineLoop
                ? ctx.closePath()
                : interpolatedLineTo(ctx, target, end, property)
            let targetLoop = !!target.pathSegment(ctx, tgt, {
                move: lineLoop,
                reverse: !0,
            })
            ;(loop = lineLoop && targetLoop),
                loop || interpolatedLineTo(ctx, target, start, property)
        }
        ctx.closePath(), ctx.fill(loop ? 'evenodd' : 'nonzero'), ctx.restore()
    }
}
function clipBounds(ctx, scale, bounds) {
    let { top, bottom } = scale.chart.chartArea,
        { property, start, end } = bounds || {}
    property === 'x' &&
        (ctx.beginPath(),
        ctx.rect(start, top, end - start, bottom - top),
        ctx.clip())
}
function interpolatedLineTo(ctx, target, point, property) {
    let interpolatedPoint = target.interpolate(point, property)
    interpolatedPoint && ctx.lineTo(interpolatedPoint.x, interpolatedPoint.y)
}
var index = {
        id: 'filler',
        afterDatasetsUpdate(chart2, _args, options) {
            let count = (chart2.data.datasets || []).length,
                sources = [],
                meta,
                i,
                line,
                source
            for (i = 0; i < count; ++i)
                (meta = chart2.getDatasetMeta(i)),
                    (line = meta.dataset),
                    (source = null),
                    line &&
                        line.options &&
                        line instanceof LineElement &&
                        (source = {
                            visible: chart2.isDatasetVisible(i),
                            index: i,
                            fill: _decodeFill(line, i, count),
                            chart: chart2,
                            axis: meta.controller.options.indexAxis,
                            scale: meta.vScale,
                            line,
                        }),
                    (meta.$filler = source),
                    sources.push(source)
            for (i = 0; i < count; ++i)
                (source = sources[i]),
                    !(!source || source.fill === !1) &&
                        (source.fill = _resolveTarget(
                            sources,
                            i,
                            options.propagate,
                        ))
        },
        beforeDraw(chart2, _args, options) {
            let draw2 = options.drawTime === 'beforeDraw',
                metasets = chart2.getSortedVisibleDatasetMetas(),
                area = chart2.chartArea
            for (let i = metasets.length - 1; i >= 0; --i) {
                let source = metasets[i].$filler
                !source ||
                    (source.line.updateControlPoints(area, source.axis),
                    draw2 && source.fill && _drawfill(chart2.ctx, source, area))
            }
        },
        beforeDatasetsDraw(chart2, _args, options) {
            if (options.drawTime !== 'beforeDatasetsDraw') return
            let metasets = chart2.getSortedVisibleDatasetMetas()
            for (let i = metasets.length - 1; i >= 0; --i) {
                let source = metasets[i].$filler
                _shouldApplyFill(source) &&
                    _drawfill(chart2.ctx, source, chart2.chartArea)
            }
        },
        beforeDatasetDraw(chart2, args, options) {
            let source = args.meta.$filler
            !_shouldApplyFill(source) ||
                options.drawTime !== 'beforeDatasetDraw' ||
                _drawfill(chart2.ctx, source, chart2.chartArea)
        },
        defaults: { propagate: !0, drawTime: 'beforeDatasetDraw' },
    },
    getBoxSize = (labelOpts, fontSize) => {
        let { boxHeight = fontSize, boxWidth = fontSize } = labelOpts
        return (
            labelOpts.usePointStyle &&
                ((boxHeight = Math.min(boxHeight, fontSize)),
                (boxWidth =
                    labelOpts.pointStyleWidth || Math.min(boxWidth, fontSize))),
            { boxWidth, boxHeight, itemHeight: Math.max(fontSize, boxHeight) }
        )
    },
    itemsEqual = (a, b) =>
        a !== null &&
        b !== null &&
        a.datasetIndex === b.datasetIndex &&
        a.index === b.index,
    Legend = class extends Element {
        constructor(config) {
            super()
            ;(this._added = !1),
                (this.legendHitBoxes = []),
                (this._hoveredItem = null),
                (this.doughnutMode = !1),
                (this.chart = config.chart),
                (this.options = config.options),
                (this.ctx = config.ctx),
                (this.legendItems = void 0),
                (this.columnSizes = void 0),
                (this.lineWidths = void 0),
                (this.maxHeight = void 0),
                (this.maxWidth = void 0),
                (this.top = void 0),
                (this.bottom = void 0),
                (this.left = void 0),
                (this.right = void 0),
                (this.height = void 0),
                (this.width = void 0),
                (this._margins = void 0),
                (this.position = void 0),
                (this.weight = void 0),
                (this.fullSize = void 0)
        }
        update(maxWidth, maxHeight, margins) {
            ;(this.maxWidth = maxWidth),
                (this.maxHeight = maxHeight),
                (this._margins = margins),
                this.setDimensions(),
                this.buildLabels(),
                this.fit()
        }
        setDimensions() {
            this.isHorizontal()
                ? ((this.width = this.maxWidth),
                  (this.left = this._margins.left),
                  (this.right = this.width))
                : ((this.height = this.maxHeight),
                  (this.top = this._margins.top),
                  (this.bottom = this.height))
        }
        buildLabels() {
            let labelOpts = this.options.labels || {},
                legendItems =
                    callback(labelOpts.generateLabels, [this.chart], this) || []
            labelOpts.filter &&
                (legendItems = legendItems.filter((item) =>
                    labelOpts.filter(item, this.chart.data),
                )),
                labelOpts.sort &&
                    (legendItems = legendItems.sort((a, b) =>
                        labelOpts.sort(a, b, this.chart.data),
                    )),
                this.options.reverse && legendItems.reverse(),
                (this.legendItems = legendItems)
        }
        fit() {
            let { options, ctx } = this
            if (!options.display) {
                this.width = this.height = 0
                return
            }
            let labelOpts = options.labels,
                labelFont = toFont(labelOpts.font),
                fontSize = labelFont.size,
                titleHeight = this._computeTitleHeight(),
                { boxWidth, itemHeight } = getBoxSize(labelOpts, fontSize),
                width,
                height
            ;(ctx.font = labelFont.string),
                this.isHorizontal()
                    ? ((width = this.maxWidth),
                      (height =
                          this._fitRows(
                              titleHeight,
                              fontSize,
                              boxWidth,
                              itemHeight,
                          ) + 10))
                    : ((height = this.maxHeight),
                      (width =
                          this._fitCols(
                              titleHeight,
                              fontSize,
                              boxWidth,
                              itemHeight,
                          ) + 10)),
                (this.width = Math.min(
                    width,
                    options.maxWidth || this.maxWidth,
                )),
                (this.height = Math.min(
                    height,
                    options.maxHeight || this.maxHeight,
                ))
        }
        _fitRows(titleHeight, fontSize, boxWidth, itemHeight) {
            let {
                    ctx,
                    maxWidth,
                    options: {
                        labels: { padding },
                    },
                } = this,
                hitboxes = (this.legendHitBoxes = []),
                lineWidths = (this.lineWidths = [0]),
                lineHeight = itemHeight + padding,
                totalHeight = titleHeight
            ;(ctx.textAlign = 'left'), (ctx.textBaseline = 'middle')
            let row = -1,
                top = -lineHeight
            return (
                this.legendItems.forEach((legendItem, i) => {
                    let itemWidth =
                        boxWidth +
                        fontSize / 2 +
                        ctx.measureText(legendItem.text).width
                    ;(i === 0 ||
                        lineWidths[lineWidths.length - 1] +
                            itemWidth +
                            2 * padding >
                            maxWidth) &&
                        ((totalHeight += lineHeight),
                        (lineWidths[lineWidths.length - (i > 0 ? 0 : 1)] = 0),
                        (top += lineHeight),
                        row++),
                        (hitboxes[i] = {
                            left: 0,
                            top,
                            row,
                            width: itemWidth,
                            height: itemHeight,
                        }),
                        (lineWidths[lineWidths.length - 1] +=
                            itemWidth + padding)
                }),
                totalHeight
            )
        }
        _fitCols(titleHeight, fontSize, boxWidth, itemHeight) {
            let {
                    ctx,
                    maxHeight,
                    options: {
                        labels: { padding },
                    },
                } = this,
                hitboxes = (this.legendHitBoxes = []),
                columnSizes = (this.columnSizes = []),
                heightLimit = maxHeight - titleHeight,
                totalWidth = padding,
                currentColWidth = 0,
                currentColHeight = 0,
                left = 0,
                col = 0
            return (
                this.legendItems.forEach((legendItem, i) => {
                    let itemWidth =
                        boxWidth +
                        fontSize / 2 +
                        ctx.measureText(legendItem.text).width
                    i > 0 &&
                        currentColHeight + itemHeight + 2 * padding >
                            heightLimit &&
                        ((totalWidth += currentColWidth + padding),
                        columnSizes.push({
                            width: currentColWidth,
                            height: currentColHeight,
                        }),
                        (left += currentColWidth + padding),
                        col++,
                        (currentColWidth = currentColHeight = 0)),
                        (hitboxes[i] = {
                            left,
                            top: currentColHeight,
                            col,
                            width: itemWidth,
                            height: itemHeight,
                        }),
                        (currentColWidth = Math.max(
                            currentColWidth,
                            itemWidth,
                        )),
                        (currentColHeight += itemHeight + padding)
                }),
                (totalWidth += currentColWidth),
                columnSizes.push({
                    width: currentColWidth,
                    height: currentColHeight,
                }),
                totalWidth
            )
        }
        adjustHitBoxes() {
            if (!this.options.display) return
            let titleHeight = this._computeTitleHeight(),
                {
                    legendHitBoxes: hitboxes,
                    options: {
                        align,
                        labels: { padding },
                        rtl,
                    },
                } = this,
                rtlHelper = getRtlAdapter(rtl, this.left, this.width)
            if (this.isHorizontal()) {
                let row = 0,
                    left = _alignStartEnd(
                        align,
                        this.left + padding,
                        this.right - this.lineWidths[row],
                    )
                for (let hitbox of hitboxes)
                    row !== hitbox.row &&
                        ((row = hitbox.row),
                        (left = _alignStartEnd(
                            align,
                            this.left + padding,
                            this.right - this.lineWidths[row],
                        ))),
                        (hitbox.top += this.top + titleHeight + padding),
                        (hitbox.left = rtlHelper.leftForLtr(
                            rtlHelper.x(left),
                            hitbox.width,
                        )),
                        (left += hitbox.width + padding)
            } else {
                let col = 0,
                    top = _alignStartEnd(
                        align,
                        this.top + titleHeight + padding,
                        this.bottom - this.columnSizes[col].height,
                    )
                for (let hitbox of hitboxes)
                    hitbox.col !== col &&
                        ((col = hitbox.col),
                        (top = _alignStartEnd(
                            align,
                            this.top + titleHeight + padding,
                            this.bottom - this.columnSizes[col].height,
                        ))),
                        (hitbox.top = top),
                        (hitbox.left += this.left + padding),
                        (hitbox.left = rtlHelper.leftForLtr(
                            rtlHelper.x(hitbox.left),
                            hitbox.width,
                        )),
                        (top += hitbox.height + padding)
            }
        }
        isHorizontal() {
            return (
                this.options.position === 'top' ||
                this.options.position === 'bottom'
            )
        }
        draw() {
            if (this.options.display) {
                let ctx = this.ctx
                clipArea(ctx, this), this._draw(), unclipArea(ctx)
            }
        }
        _draw() {
            let { options: opts, columnSizes, lineWidths, ctx } = this,
                { align, labels: labelOpts } = opts,
                defaultColor = defaults.color,
                rtlHelper = getRtlAdapter(opts.rtl, this.left, this.width),
                labelFont = toFont(labelOpts.font),
                { color: fontColor, padding } = labelOpts,
                fontSize = labelFont.size,
                halfFontSize = fontSize / 2,
                cursor
            this.drawTitle(),
                (ctx.textAlign = rtlHelper.textAlign('left')),
                (ctx.textBaseline = 'middle'),
                (ctx.lineWidth = 0.5),
                (ctx.font = labelFont.string)
            let { boxWidth, boxHeight, itemHeight } = getBoxSize(
                    labelOpts,
                    fontSize,
                ),
                drawLegendBox = function (x, y, legendItem) {
                    if (
                        isNaN(boxWidth) ||
                        boxWidth <= 0 ||
                        isNaN(boxHeight) ||
                        boxHeight < 0
                    )
                        return
                    ctx.save()
                    let lineWidth = valueOrDefault(legendItem.lineWidth, 1)
                    if (
                        ((ctx.fillStyle = valueOrDefault(
                            legendItem.fillStyle,
                            defaultColor,
                        )),
                        (ctx.lineCap = valueOrDefault(
                            legendItem.lineCap,
                            'butt',
                        )),
                        (ctx.lineDashOffset = valueOrDefault(
                            legendItem.lineDashOffset,
                            0,
                        )),
                        (ctx.lineJoin = valueOrDefault(
                            legendItem.lineJoin,
                            'miter',
                        )),
                        (ctx.lineWidth = lineWidth),
                        (ctx.strokeStyle = valueOrDefault(
                            legendItem.strokeStyle,
                            defaultColor,
                        )),
                        ctx.setLineDash(
                            valueOrDefault(legendItem.lineDash, []),
                        ),
                        labelOpts.usePointStyle)
                    ) {
                        let drawOptions = {
                                radius: (boxHeight * Math.SQRT2) / 2,
                                pointStyle: legendItem.pointStyle,
                                rotation: legendItem.rotation,
                                borderWidth: lineWidth,
                            },
                            centerX = rtlHelper.xPlus(x, boxWidth / 2),
                            centerY = y + halfFontSize
                        drawPointLegend(
                            ctx,
                            drawOptions,
                            centerX,
                            centerY,
                            labelOpts.pointStyleWidth && boxWidth,
                        )
                    } else {
                        let yBoxTop =
                                y + Math.max((fontSize - boxHeight) / 2, 0),
                            xBoxLeft = rtlHelper.leftForLtr(x, boxWidth),
                            borderRadius = toTRBLCorners(
                                legendItem.borderRadius,
                            )
                        ctx.beginPath(),
                            Object.values(borderRadius).some((v) => v !== 0)
                                ? addRoundedRectPath(ctx, {
                                      x: xBoxLeft,
                                      y: yBoxTop,
                                      w: boxWidth,
                                      h: boxHeight,
                                      radius: borderRadius,
                                  })
                                : ctx.rect(
                                      xBoxLeft,
                                      yBoxTop,
                                      boxWidth,
                                      boxHeight,
                                  ),
                            ctx.fill(),
                            lineWidth !== 0 && ctx.stroke()
                    }
                    ctx.restore()
                },
                fillText = function (x, y, legendItem) {
                    renderText(
                        ctx,
                        legendItem.text,
                        x,
                        y + itemHeight / 2,
                        labelFont,
                        {
                            strikethrough: legendItem.hidden,
                            textAlign: rtlHelper.textAlign(
                                legendItem.textAlign,
                            ),
                        },
                    )
                },
                isHorizontal = this.isHorizontal(),
                titleHeight = this._computeTitleHeight()
            isHorizontal
                ? (cursor = {
                      x: _alignStartEnd(
                          align,
                          this.left + padding,
                          this.right - lineWidths[0],
                      ),
                      y: this.top + padding + titleHeight,
                      line: 0,
                  })
                : (cursor = {
                      x: this.left + padding,
                      y: _alignStartEnd(
                          align,
                          this.top + titleHeight + padding,
                          this.bottom - columnSizes[0].height,
                      ),
                      line: 0,
                  }),
                overrideTextDirection(this.ctx, opts.textDirection)
            let lineHeight = itemHeight + padding
            this.legendItems.forEach((legendItem, i) => {
                ;(ctx.strokeStyle = legendItem.fontColor || fontColor),
                    (ctx.fillStyle = legendItem.fontColor || fontColor)
                let textWidth = ctx.measureText(legendItem.text).width,
                    textAlign = rtlHelper.textAlign(
                        legendItem.textAlign ||
                            (legendItem.textAlign = labelOpts.textAlign),
                    ),
                    width = boxWidth + halfFontSize + textWidth,
                    x = cursor.x,
                    y = cursor.y
                rtlHelper.setWidth(this.width),
                    isHorizontal
                        ? i > 0 &&
                          x + width + padding > this.right &&
                          ((y = cursor.y += lineHeight),
                          cursor.line++,
                          (x = cursor.x =
                              _alignStartEnd(
                                  align,
                                  this.left + padding,
                                  this.right - lineWidths[cursor.line],
                              )))
                        : i > 0 &&
                          y + lineHeight > this.bottom &&
                          ((x = cursor.x =
                              x + columnSizes[cursor.line].width + padding),
                          cursor.line++,
                          (y = cursor.y =
                              _alignStartEnd(
                                  align,
                                  this.top + titleHeight + padding,
                                  this.bottom - columnSizes[cursor.line].height,
                              )))
                let realX = rtlHelper.x(x)
                drawLegendBox(realX, y, legendItem),
                    (x = _textX(
                        textAlign,
                        x + boxWidth + halfFontSize,
                        isHorizontal ? x + width : this.right,
                        opts.rtl,
                    )),
                    fillText(rtlHelper.x(x), y, legendItem),
                    isHorizontal
                        ? (cursor.x += width + padding)
                        : (cursor.y += lineHeight)
            }),
                restoreTextDirection(this.ctx, opts.textDirection)
        }
        drawTitle() {
            let opts = this.options,
                titleOpts = opts.title,
                titleFont = toFont(titleOpts.font),
                titlePadding = toPadding(titleOpts.padding)
            if (!titleOpts.display) return
            let rtlHelper = getRtlAdapter(opts.rtl, this.left, this.width),
                ctx = this.ctx,
                position = titleOpts.position,
                halfFontSize = titleFont.size / 2,
                topPaddingPlusHalfFontSize = titlePadding.top + halfFontSize,
                y,
                left = this.left,
                maxWidth = this.width
            if (this.isHorizontal())
                (maxWidth = Math.max(...this.lineWidths)),
                    (y = this.top + topPaddingPlusHalfFontSize),
                    (left = _alignStartEnd(
                        opts.align,
                        left,
                        this.right - maxWidth,
                    ))
            else {
                let maxHeight = this.columnSizes.reduce(
                    (acc, size) => Math.max(acc, size.height),
                    0,
                )
                y =
                    topPaddingPlusHalfFontSize +
                    _alignStartEnd(
                        opts.align,
                        this.top,
                        this.bottom -
                            maxHeight -
                            opts.labels.padding -
                            this._computeTitleHeight(),
                    )
            }
            let x = _alignStartEnd(position, left, left + maxWidth)
            ;(ctx.textAlign = rtlHelper.textAlign(
                _toLeftRightCenter(position),
            )),
                (ctx.textBaseline = 'middle'),
                (ctx.strokeStyle = titleOpts.color),
                (ctx.fillStyle = titleOpts.color),
                (ctx.font = titleFont.string),
                renderText(ctx, titleOpts.text, x, y, titleFont)
        }
        _computeTitleHeight() {
            let titleOpts = this.options.title,
                titleFont = toFont(titleOpts.font),
                titlePadding = toPadding(titleOpts.padding)
            return titleOpts.display
                ? titleFont.lineHeight + titlePadding.height
                : 0
        }
        _getLegendItemAt(x, y) {
            let i, hitBox, lh
            if (
                _isBetween(x, this.left, this.right) &&
                _isBetween(y, this.top, this.bottom)
            ) {
                for (lh = this.legendHitBoxes, i = 0; i < lh.length; ++i)
                    if (
                        ((hitBox = lh[i]),
                        _isBetween(
                            x,
                            hitBox.left,
                            hitBox.left + hitBox.width,
                        ) &&
                            _isBetween(
                                y,
                                hitBox.top,
                                hitBox.top + hitBox.height,
                            ))
                    )
                        return this.legendItems[i]
            }
            return null
        }
        handleEvent(e) {
            let opts = this.options
            if (!isListened(e.type, opts)) return
            let hoveredItem = this._getLegendItemAt(e.x, e.y)
            if (e.type === 'mousemove' || e.type === 'mouseout') {
                let previous = this._hoveredItem,
                    sameItem = itemsEqual(previous, hoveredItem)
                previous &&
                    !sameItem &&
                    callback(opts.onLeave, [e, previous, this], this),
                    (this._hoveredItem = hoveredItem),
                    hoveredItem &&
                        !sameItem &&
                        callback(opts.onHover, [e, hoveredItem, this], this)
            } else
                hoveredItem &&
                    callback(opts.onClick, [e, hoveredItem, this], this)
        }
    }
function isListened(type, opts) {
    return !!(
        ((type === 'mousemove' || type === 'mouseout') &&
            (opts.onHover || opts.onLeave)) ||
        (opts.onClick && (type === 'click' || type === 'mouseup'))
    )
}
var plugin_legend = {
        id: 'legend',
        _element: Legend,
        start(chart2, _args, options) {
            let legend = (chart2.legend = new Legend({
                ctx: chart2.ctx,
                options,
                chart: chart2,
            }))
            layouts.configure(chart2, legend, options),
                layouts.addBox(chart2, legend)
        },
        stop(chart2) {
            layouts.removeBox(chart2, chart2.legend), delete chart2.legend
        },
        beforeUpdate(chart2, _args, options) {
            let legend = chart2.legend
            layouts.configure(chart2, legend, options),
                (legend.options = options)
        },
        afterUpdate(chart2) {
            let legend = chart2.legend
            legend.buildLabels(), legend.adjustHitBoxes()
        },
        afterEvent(chart2, args) {
            args.replay || chart2.legend.handleEvent(args.event)
        },
        defaults: {
            display: !0,
            position: 'top',
            align: 'center',
            fullSize: !0,
            reverse: !1,
            weight: 1e3,
            onClick(e, legendItem, legend) {
                let index2 = legendItem.datasetIndex,
                    ci = legend.chart
                ci.isDatasetVisible(index2)
                    ? (ci.hide(index2), (legendItem.hidden = !0))
                    : (ci.show(index2), (legendItem.hidden = !1))
            },
            onHover: null,
            onLeave: null,
            labels: {
                color: (ctx) => ctx.chart.options.color,
                boxWidth: 40,
                padding: 10,
                generateLabels(chart2) {
                    let datasets = chart2.data.datasets,
                        {
                            labels: {
                                usePointStyle,
                                pointStyle,
                                textAlign,
                                color: color2,
                            },
                        } = chart2.legend.options
                    return chart2._getSortedDatasetMetas().map((meta) => {
                        let style = meta.controller.getStyle(
                                usePointStyle ? 0 : void 0,
                            ),
                            borderWidth = toPadding(style.borderWidth)
                        return {
                            text: datasets[meta.index].label,
                            fillStyle: style.backgroundColor,
                            fontColor: color2,
                            hidden: !meta.visible,
                            lineCap: style.borderCapStyle,
                            lineDash: style.borderDash,
                            lineDashOffset: style.borderDashOffset,
                            lineJoin: style.borderJoinStyle,
                            lineWidth:
                                (borderWidth.width + borderWidth.height) / 4,
                            strokeStyle: style.borderColor,
                            pointStyle: pointStyle || style.pointStyle,
                            rotation: style.rotation,
                            textAlign: textAlign || style.textAlign,
                            borderRadius: 0,
                            datasetIndex: meta.index,
                        }
                    }, this)
                },
            },
            title: {
                color: (ctx) => ctx.chart.options.color,
                display: !1,
                position: 'center',
                text: '',
            },
        },
        descriptors: {
            _scriptable: (name) => !name.startsWith('on'),
            labels: {
                _scriptable: (name) =>
                    !['generateLabels', 'filter', 'sort'].includes(name),
            },
        },
    },
    Title = class extends Element {
        constructor(config) {
            super()
            ;(this.chart = config.chart),
                (this.options = config.options),
                (this.ctx = config.ctx),
                (this._padding = void 0),
                (this.top = void 0),
                (this.bottom = void 0),
                (this.left = void 0),
                (this.right = void 0),
                (this.width = void 0),
                (this.height = void 0),
                (this.position = void 0),
                (this.weight = void 0),
                (this.fullSize = void 0)
        }
        update(maxWidth, maxHeight) {
            let opts = this.options
            if (((this.left = 0), (this.top = 0), !opts.display)) {
                this.width = this.height = this.right = this.bottom = 0
                return
            }
            ;(this.width = this.right = maxWidth),
                (this.height = this.bottom = maxHeight)
            let lineCount = isArray(opts.text) ? opts.text.length : 1
            this._padding = toPadding(opts.padding)
            let textSize =
                lineCount * toFont(opts.font).lineHeight + this._padding.height
            this.isHorizontal()
                ? (this.height = textSize)
                : (this.width = textSize)
        }
        isHorizontal() {
            let pos = this.options.position
            return pos === 'top' || pos === 'bottom'
        }
        _drawArgs(offset) {
            let { top, left, bottom, right, options } = this,
                align = options.align,
                rotation = 0,
                maxWidth,
                titleX,
                titleY
            return (
                this.isHorizontal()
                    ? ((titleX = _alignStartEnd(align, left, right)),
                      (titleY = top + offset),
                      (maxWidth = right - left))
                    : (options.position === 'left'
                          ? ((titleX = left + offset),
                            (titleY = _alignStartEnd(align, bottom, top)),
                            (rotation = PI * -0.5))
                          : ((titleX = right - offset),
                            (titleY = _alignStartEnd(align, top, bottom)),
                            (rotation = PI * 0.5)),
                      (maxWidth = bottom - top)),
                { titleX, titleY, maxWidth, rotation }
            )
        }
        draw() {
            let ctx = this.ctx,
                opts = this.options
            if (!opts.display) return
            let fontOpts = toFont(opts.font),
                offset = fontOpts.lineHeight / 2 + this._padding.top,
                { titleX, titleY, maxWidth, rotation } = this._drawArgs(offset)
            renderText(ctx, opts.text, 0, 0, fontOpts, {
                color: opts.color,
                maxWidth,
                rotation,
                textAlign: _toLeftRightCenter(opts.align),
                textBaseline: 'middle',
                translation: [titleX, titleY],
            })
        }
    }
function createTitle(chart2, titleOpts) {
    let title = new Title({
        ctx: chart2.ctx,
        options: titleOpts,
        chart: chart2,
    })
    layouts.configure(chart2, title, titleOpts),
        layouts.addBox(chart2, title),
        (chart2.titleBlock = title)
}
var plugin_title = {
        id: 'title',
        _element: Title,
        start(chart2, _args, options) {
            createTitle(chart2, options)
        },
        stop(chart2) {
            let titleBlock = chart2.titleBlock
            layouts.removeBox(chart2, titleBlock), delete chart2.titleBlock
        },
        beforeUpdate(chart2, _args, options) {
            let title = chart2.titleBlock
            layouts.configure(chart2, title, options), (title.options = options)
        },
        defaults: {
            align: 'center',
            display: !1,
            font: { weight: 'bold' },
            fullSize: !0,
            padding: 10,
            position: 'top',
            text: '',
            weight: 2e3,
        },
        defaultRoutes: { color: 'color' },
        descriptors: { _scriptable: !0, _indexable: !1 },
    },
    map2 = new WeakMap(),
    plugin_subtitle = {
        id: 'subtitle',
        start(chart2, _args, options) {
            let title = new Title({ ctx: chart2.ctx, options, chart: chart2 })
            layouts.configure(chart2, title, options),
                layouts.addBox(chart2, title),
                map2.set(chart2, title)
        },
        stop(chart2) {
            layouts.removeBox(chart2, map2.get(chart2)), map2.delete(chart2)
        },
        beforeUpdate(chart2, _args, options) {
            let title = map2.get(chart2)
            layouts.configure(chart2, title, options), (title.options = options)
        },
        defaults: {
            align: 'center',
            display: !1,
            font: { weight: 'normal' },
            fullSize: !0,
            padding: 0,
            position: 'top',
            text: '',
            weight: 1500,
        },
        defaultRoutes: { color: 'color' },
        descriptors: { _scriptable: !0, _indexable: !1 },
    },
    positioners = {
        average(items) {
            if (!items.length) return !1
            let i,
                len,
                x = 0,
                y = 0,
                count = 0
            for (i = 0, len = items.length; i < len; ++i) {
                let el = items[i].element
                if (el && el.hasValue()) {
                    let pos = el.tooltipPosition()
                    ;(x += pos.x), (y += pos.y), ++count
                }
            }
            return { x: x / count, y: y / count }
        },
        nearest(items, eventPosition) {
            if (!items.length) return !1
            let x = eventPosition.x,
                y = eventPosition.y,
                minDistance = Number.POSITIVE_INFINITY,
                i,
                len,
                nearestElement
            for (i = 0, len = items.length; i < len; ++i) {
                let el = items[i].element
                if (el && el.hasValue()) {
                    let center = el.getCenterPoint(),
                        d = distanceBetweenPoints(eventPosition, center)
                    d < minDistance &&
                        ((minDistance = d), (nearestElement = el))
                }
            }
            if (nearestElement) {
                let tp = nearestElement.tooltipPosition()
                ;(x = tp.x), (y = tp.y)
            }
            return { x, y }
        },
    }
function pushOrConcat(base, toPush) {
    return (
        toPush &&
            (isArray(toPush)
                ? Array.prototype.push.apply(base, toPush)
                : base.push(toPush)),
        base
    )
}
function splitNewlines(str) {
    return (typeof str == 'string' || str instanceof String) &&
        str.indexOf(`
`) > -1
        ? str.split(`
`)
        : str
}
function createTooltipItem(chart2, item) {
    let { element, datasetIndex, index: index2 } = item,
        controller = chart2.getDatasetMeta(datasetIndex).controller,
        { label, value } = controller.getLabelAndValue(index2)
    return {
        chart: chart2,
        label,
        parsed: controller.getParsed(index2),
        raw: chart2.data.datasets[datasetIndex].data[index2],
        formattedValue: value,
        dataset: controller.getDataset(),
        dataIndex: index2,
        datasetIndex,
        element,
    }
}
function getTooltipSize(tooltip, options) {
    let ctx = tooltip.chart.ctx,
        { body, footer, title } = tooltip,
        { boxWidth, boxHeight } = options,
        bodyFont = toFont(options.bodyFont),
        titleFont = toFont(options.titleFont),
        footerFont = toFont(options.footerFont),
        titleLineCount = title.length,
        footerLineCount = footer.length,
        bodyLineItemCount = body.length,
        padding = toPadding(options.padding),
        height = padding.height,
        width = 0,
        combinedBodyLength = body.reduce(
            (count, bodyItem) =>
                count +
                bodyItem.before.length +
                bodyItem.lines.length +
                bodyItem.after.length,
            0,
        )
    if (
        ((combinedBodyLength +=
            tooltip.beforeBody.length + tooltip.afterBody.length),
        titleLineCount &&
            (height +=
                titleLineCount * titleFont.lineHeight +
                (titleLineCount - 1) * options.titleSpacing +
                options.titleMarginBottom),
        combinedBodyLength)
    ) {
        let bodyLineHeight = options.displayColors
            ? Math.max(boxHeight, bodyFont.lineHeight)
            : bodyFont.lineHeight
        height +=
            bodyLineItemCount * bodyLineHeight +
            (combinedBodyLength - bodyLineItemCount) * bodyFont.lineHeight +
            (combinedBodyLength - 1) * options.bodySpacing
    }
    footerLineCount &&
        (height +=
            options.footerMarginTop +
            footerLineCount * footerFont.lineHeight +
            (footerLineCount - 1) * options.footerSpacing)
    let widthPadding = 0,
        maxLineWidth = function (line) {
            width = Math.max(width, ctx.measureText(line).width + widthPadding)
        }
    return (
        ctx.save(),
        (ctx.font = titleFont.string),
        each(tooltip.title, maxLineWidth),
        (ctx.font = bodyFont.string),
        each(tooltip.beforeBody.concat(tooltip.afterBody), maxLineWidth),
        (widthPadding = options.displayColors
            ? boxWidth + 2 + options.boxPadding
            : 0),
        each(body, (bodyItem) => {
            each(bodyItem.before, maxLineWidth),
                each(bodyItem.lines, maxLineWidth),
                each(bodyItem.after, maxLineWidth)
        }),
        (widthPadding = 0),
        (ctx.font = footerFont.string),
        each(tooltip.footer, maxLineWidth),
        ctx.restore(),
        (width += padding.width),
        { width, height }
    )
}
function determineYAlign(chart2, size) {
    let { y, height } = size
    return y < height / 2
        ? 'top'
        : y > chart2.height - height / 2
        ? 'bottom'
        : 'center'
}
function doesNotFitWithAlign(xAlign, chart2, options, size) {
    let { x, width } = size,
        caret = options.caretSize + options.caretPadding
    if (
        (xAlign === 'left' && x + width + caret > chart2.width) ||
        (xAlign === 'right' && x - width - caret < 0)
    )
        return !0
}
function determineXAlign(chart2, options, size, yAlign) {
    let { x, width } = size,
        {
            width: chartWidth,
            chartArea: { left, right },
        } = chart2,
        xAlign = 'center'
    return (
        yAlign === 'center'
            ? (xAlign = x <= (left + right) / 2 ? 'left' : 'right')
            : x <= width / 2
            ? (xAlign = 'left')
            : x >= chartWidth - width / 2 && (xAlign = 'right'),
        doesNotFitWithAlign(xAlign, chart2, options, size) &&
            (xAlign = 'center'),
        xAlign
    )
}
function determineAlignment(chart2, options, size) {
    let yAlign = size.yAlign || options.yAlign || determineYAlign(chart2, size)
    return {
        xAlign:
            size.xAlign ||
            options.xAlign ||
            determineXAlign(chart2, options, size, yAlign),
        yAlign,
    }
}
function alignX(size, xAlign) {
    let { x, width } = size
    return (
        xAlign === 'right'
            ? (x -= width)
            : xAlign === 'center' && (x -= width / 2),
        x
    )
}
function alignY(size, yAlign, paddingAndSize) {
    let { y, height } = size
    return (
        yAlign === 'top'
            ? (y += paddingAndSize)
            : yAlign === 'bottom'
            ? (y -= height + paddingAndSize)
            : (y -= height / 2),
        y
    )
}
function getBackgroundPoint(options, size, alignment, chart2) {
    let { caretSize, caretPadding, cornerRadius } = options,
        { xAlign, yAlign } = alignment,
        paddingAndSize = caretSize + caretPadding,
        { topLeft, topRight, bottomLeft, bottomRight } =
            toTRBLCorners(cornerRadius),
        x = alignX(size, xAlign),
        y = alignY(size, yAlign, paddingAndSize)
    return (
        yAlign === 'center'
            ? xAlign === 'left'
                ? (x += paddingAndSize)
                : xAlign === 'right' && (x -= paddingAndSize)
            : xAlign === 'left'
            ? (x -= Math.max(topLeft, bottomLeft) + caretSize)
            : xAlign === 'right' &&
              (x += Math.max(topRight, bottomRight) + caretSize),
        {
            x: _limitValue(x, 0, chart2.width - size.width),
            y: _limitValue(y, 0, chart2.height - size.height),
        }
    )
}
function getAlignedX(tooltip, align, options) {
    let padding = toPadding(options.padding)
    return align === 'center'
        ? tooltip.x + tooltip.width / 2
        : align === 'right'
        ? tooltip.x + tooltip.width - padding.right
        : tooltip.x + padding.left
}
function getBeforeAfterBodyLines(callback2) {
    return pushOrConcat([], splitNewlines(callback2))
}
function createTooltipContext(parent, tooltip, tooltipItems) {
    return createContext(parent, { tooltip, tooltipItems, type: 'tooltip' })
}
function overrideCallbacks(callbacks, context) {
    let override =
        context &&
        context.dataset &&
        context.dataset.tooltip &&
        context.dataset.tooltip.callbacks
    return override ? callbacks.override(override) : callbacks
}
var Tooltip = class extends Element {
    constructor(config) {
        super()
        ;(this.opacity = 0),
            (this._active = []),
            (this._eventPosition = void 0),
            (this._size = void 0),
            (this._cachedAnimations = void 0),
            (this._tooltipItems = []),
            (this.$animations = void 0),
            (this.$context = void 0),
            (this.chart = config.chart || config._chart),
            (this._chart = this.chart),
            (this.options = config.options),
            (this.dataPoints = void 0),
            (this.title = void 0),
            (this.beforeBody = void 0),
            (this.body = void 0),
            (this.afterBody = void 0),
            (this.footer = void 0),
            (this.xAlign = void 0),
            (this.yAlign = void 0),
            (this.x = void 0),
            (this.y = void 0),
            (this.height = void 0),
            (this.width = void 0),
            (this.caretX = void 0),
            (this.caretY = void 0),
            (this.labelColors = void 0),
            (this.labelPointStyles = void 0),
            (this.labelTextColors = void 0)
    }
    initialize(options) {
        ;(this.options = options),
            (this._cachedAnimations = void 0),
            (this.$context = void 0)
    }
    _resolveAnimations() {
        let cached = this._cachedAnimations
        if (cached) return cached
        let chart2 = this.chart,
            options = this.options.setContext(this.getContext()),
            opts =
                options.enabled &&
                chart2.options.animation &&
                options.animations,
            animations = new Animations(this.chart, opts)
        return (
            opts._cacheable &&
                (this._cachedAnimations = Object.freeze(animations)),
            animations
        )
    }
    getContext() {
        return (
            this.$context ||
            (this.$context = createTooltipContext(
                this.chart.getContext(),
                this,
                this._tooltipItems,
            ))
        )
    }
    getTitle(context, options) {
        let { callbacks } = options,
            beforeTitle = callbacks.beforeTitle.apply(this, [context]),
            title = callbacks.title.apply(this, [context]),
            afterTitle = callbacks.afterTitle.apply(this, [context]),
            lines = []
        return (
            (lines = pushOrConcat(lines, splitNewlines(beforeTitle))),
            (lines = pushOrConcat(lines, splitNewlines(title))),
            (lines = pushOrConcat(lines, splitNewlines(afterTitle))),
            lines
        )
    }
    getBeforeBody(tooltipItems, options) {
        return getBeforeAfterBodyLines(
            options.callbacks.beforeBody.apply(this, [tooltipItems]),
        )
    }
    getBody(tooltipItems, options) {
        let { callbacks } = options,
            bodyItems = []
        return (
            each(tooltipItems, (context) => {
                let bodyItem = { before: [], lines: [], after: [] },
                    scoped = overrideCallbacks(callbacks, context)
                pushOrConcat(
                    bodyItem.before,
                    splitNewlines(scoped.beforeLabel.call(this, context)),
                ),
                    pushOrConcat(
                        bodyItem.lines,
                        scoped.label.call(this, context),
                    ),
                    pushOrConcat(
                        bodyItem.after,
                        splitNewlines(scoped.afterLabel.call(this, context)),
                    ),
                    bodyItems.push(bodyItem)
            }),
            bodyItems
        )
    }
    getAfterBody(tooltipItems, options) {
        return getBeforeAfterBodyLines(
            options.callbacks.afterBody.apply(this, [tooltipItems]),
        )
    }
    getFooter(tooltipItems, options) {
        let { callbacks } = options,
            beforeFooter = callbacks.beforeFooter.apply(this, [tooltipItems]),
            footer = callbacks.footer.apply(this, [tooltipItems]),
            afterFooter = callbacks.afterFooter.apply(this, [tooltipItems]),
            lines = []
        return (
            (lines = pushOrConcat(lines, splitNewlines(beforeFooter))),
            (lines = pushOrConcat(lines, splitNewlines(footer))),
            (lines = pushOrConcat(lines, splitNewlines(afterFooter))),
            lines
        )
    }
    _createItems(options) {
        let active = this._active,
            data = this.chart.data,
            labelColors = [],
            labelPointStyles = [],
            labelTextColors = [],
            tooltipItems = [],
            i,
            len
        for (i = 0, len = active.length; i < len; ++i)
            tooltipItems.push(createTooltipItem(this.chart, active[i]))
        return (
            options.filter &&
                (tooltipItems = tooltipItems.filter((element, index2, array) =>
                    options.filter(element, index2, array, data),
                )),
            options.itemSort &&
                (tooltipItems = tooltipItems.sort((a, b) =>
                    options.itemSort(a, b, data),
                )),
            each(tooltipItems, (context) => {
                let scoped = overrideCallbacks(options.callbacks, context)
                labelColors.push(scoped.labelColor.call(this, context)),
                    labelPointStyles.push(
                        scoped.labelPointStyle.call(this, context),
                    ),
                    labelTextColors.push(
                        scoped.labelTextColor.call(this, context),
                    )
            }),
            (this.labelColors = labelColors),
            (this.labelPointStyles = labelPointStyles),
            (this.labelTextColors = labelTextColors),
            (this.dataPoints = tooltipItems),
            tooltipItems
        )
    }
    update(changed, replay) {
        let options = this.options.setContext(this.getContext()),
            active = this._active,
            properties,
            tooltipItems = []
        if (!active.length) this.opacity !== 0 && (properties = { opacity: 0 })
        else {
            let position = positioners[options.position].call(
                this,
                active,
                this._eventPosition,
            )
            ;(tooltipItems = this._createItems(options)),
                (this.title = this.getTitle(tooltipItems, options)),
                (this.beforeBody = this.getBeforeBody(tooltipItems, options)),
                (this.body = this.getBody(tooltipItems, options)),
                (this.afterBody = this.getAfterBody(tooltipItems, options)),
                (this.footer = this.getFooter(tooltipItems, options))
            let size = (this._size = getTooltipSize(this, options)),
                positionAndSize = Object.assign({}, position, size),
                alignment = determineAlignment(
                    this.chart,
                    options,
                    positionAndSize,
                ),
                backgroundPoint = getBackgroundPoint(
                    options,
                    positionAndSize,
                    alignment,
                    this.chart,
                )
            ;(this.xAlign = alignment.xAlign),
                (this.yAlign = alignment.yAlign),
                (properties = {
                    opacity: 1,
                    x: backgroundPoint.x,
                    y: backgroundPoint.y,
                    width: size.width,
                    height: size.height,
                    caretX: position.x,
                    caretY: position.y,
                })
        }
        ;(this._tooltipItems = tooltipItems),
            (this.$context = void 0),
            properties && this._resolveAnimations().update(this, properties),
            changed &&
                options.external &&
                options.external.call(this, {
                    chart: this.chart,
                    tooltip: this,
                    replay,
                })
    }
    drawCaret(tooltipPoint, ctx, size, options) {
        let caretPosition = this.getCaretPosition(tooltipPoint, size, options)
        ctx.lineTo(caretPosition.x1, caretPosition.y1),
            ctx.lineTo(caretPosition.x2, caretPosition.y2),
            ctx.lineTo(caretPosition.x3, caretPosition.y3)
    }
    getCaretPosition(tooltipPoint, size, options) {
        let { xAlign, yAlign } = this,
            { caretSize, cornerRadius } = options,
            { topLeft, topRight, bottomLeft, bottomRight } =
                toTRBLCorners(cornerRadius),
            { x: ptX, y: ptY } = tooltipPoint,
            { width, height } = size,
            x1,
            x2,
            x3,
            y1,
            y2,
            y3
        return (
            yAlign === 'center'
                ? ((y2 = ptY + height / 2),
                  xAlign === 'left'
                      ? ((x1 = ptX),
                        (x2 = x1 - caretSize),
                        (y1 = y2 + caretSize),
                        (y3 = y2 - caretSize))
                      : ((x1 = ptX + width),
                        (x2 = x1 + caretSize),
                        (y1 = y2 - caretSize),
                        (y3 = y2 + caretSize)),
                  (x3 = x1))
                : (xAlign === 'left'
                      ? (x2 = ptX + Math.max(topLeft, bottomLeft) + caretSize)
                      : xAlign === 'right'
                      ? (x2 =
                            ptX +
                            width -
                            Math.max(topRight, bottomRight) -
                            caretSize)
                      : (x2 = this.caretX),
                  yAlign === 'top'
                      ? ((y1 = ptY),
                        (y2 = y1 - caretSize),
                        (x1 = x2 - caretSize),
                        (x3 = x2 + caretSize))
                      : ((y1 = ptY + height),
                        (y2 = y1 + caretSize),
                        (x1 = x2 + caretSize),
                        (x3 = x2 - caretSize)),
                  (y3 = y1)),
            { x1, x2, x3, y1, y2, y3 }
        )
    }
    drawTitle(pt, ctx, options) {
        let title = this.title,
            length = title.length,
            titleFont,
            titleSpacing,
            i
        if (length) {
            let rtlHelper = getRtlAdapter(options.rtl, this.x, this.width)
            for (
                pt.x = getAlignedX(this, options.titleAlign, options),
                    ctx.textAlign = rtlHelper.textAlign(options.titleAlign),
                    ctx.textBaseline = 'middle',
                    titleFont = toFont(options.titleFont),
                    titleSpacing = options.titleSpacing,
                    ctx.fillStyle = options.titleColor,
                    ctx.font = titleFont.string,
                    i = 0;
                i < length;
                ++i
            )
                ctx.fillText(
                    title[i],
                    rtlHelper.x(pt.x),
                    pt.y + titleFont.lineHeight / 2,
                ),
                    (pt.y += titleFont.lineHeight + titleSpacing),
                    i + 1 === length &&
                        (pt.y += options.titleMarginBottom - titleSpacing)
        }
    }
    _drawColorBox(ctx, pt, i, rtlHelper, options) {
        let labelColors = this.labelColors[i],
            labelPointStyle = this.labelPointStyles[i],
            { boxHeight, boxWidth, boxPadding } = options,
            bodyFont = toFont(options.bodyFont),
            colorX = getAlignedX(this, 'left', options),
            rtlColorX = rtlHelper.x(colorX),
            yOffSet =
                boxHeight < bodyFont.lineHeight
                    ? (bodyFont.lineHeight - boxHeight) / 2
                    : 0,
            colorY = pt.y + yOffSet
        if (options.usePointStyle) {
            let drawOptions = {
                    radius: Math.min(boxWidth, boxHeight) / 2,
                    pointStyle: labelPointStyle.pointStyle,
                    rotation: labelPointStyle.rotation,
                    borderWidth: 1,
                },
                centerX =
                    rtlHelper.leftForLtr(rtlColorX, boxWidth) + boxWidth / 2,
                centerY = colorY + boxHeight / 2
            ;(ctx.strokeStyle = options.multiKeyBackground),
                (ctx.fillStyle = options.multiKeyBackground),
                drawPoint(ctx, drawOptions, centerX, centerY),
                (ctx.strokeStyle = labelColors.borderColor),
                (ctx.fillStyle = labelColors.backgroundColor),
                drawPoint(ctx, drawOptions, centerX, centerY)
        } else {
            ;(ctx.lineWidth = isObject(labelColors.borderWidth)
                ? Math.max(...Object.values(labelColors.borderWidth))
                : labelColors.borderWidth || 1),
                (ctx.strokeStyle = labelColors.borderColor),
                ctx.setLineDash(labelColors.borderDash || []),
                (ctx.lineDashOffset = labelColors.borderDashOffset || 0)
            let outerX = rtlHelper.leftForLtr(rtlColorX, boxWidth - boxPadding),
                innerX = rtlHelper.leftForLtr(
                    rtlHelper.xPlus(rtlColorX, 1),
                    boxWidth - boxPadding - 2,
                ),
                borderRadius = toTRBLCorners(labelColors.borderRadius)
            Object.values(borderRadius).some((v) => v !== 0)
                ? (ctx.beginPath(),
                  (ctx.fillStyle = options.multiKeyBackground),
                  addRoundedRectPath(ctx, {
                      x: outerX,
                      y: colorY,
                      w: boxWidth,
                      h: boxHeight,
                      radius: borderRadius,
                  }),
                  ctx.fill(),
                  ctx.stroke(),
                  (ctx.fillStyle = labelColors.backgroundColor),
                  ctx.beginPath(),
                  addRoundedRectPath(ctx, {
                      x: innerX,
                      y: colorY + 1,
                      w: boxWidth - 2,
                      h: boxHeight - 2,
                      radius: borderRadius,
                  }),
                  ctx.fill())
                : ((ctx.fillStyle = options.multiKeyBackground),
                  ctx.fillRect(outerX, colorY, boxWidth, boxHeight),
                  ctx.strokeRect(outerX, colorY, boxWidth, boxHeight),
                  (ctx.fillStyle = labelColors.backgroundColor),
                  ctx.fillRect(innerX, colorY + 1, boxWidth - 2, boxHeight - 2))
        }
        ctx.fillStyle = this.labelTextColors[i]
    }
    drawBody(pt, ctx, options) {
        let { body } = this,
            {
                bodySpacing,
                bodyAlign,
                displayColors,
                boxHeight,
                boxWidth,
                boxPadding,
            } = options,
            bodyFont = toFont(options.bodyFont),
            bodyLineHeight = bodyFont.lineHeight,
            xLinePadding = 0,
            rtlHelper = getRtlAdapter(options.rtl, this.x, this.width),
            fillLineOfText = function (line) {
                ctx.fillText(
                    line,
                    rtlHelper.x(pt.x + xLinePadding),
                    pt.y + bodyLineHeight / 2,
                ),
                    (pt.y += bodyLineHeight + bodySpacing)
            },
            bodyAlignForCalculation = rtlHelper.textAlign(bodyAlign),
            bodyItem,
            textColor,
            lines,
            i,
            j,
            ilen,
            jlen
        for (
            ctx.textAlign = bodyAlign,
                ctx.textBaseline = 'middle',
                ctx.font = bodyFont.string,
                pt.x = getAlignedX(this, bodyAlignForCalculation, options),
                ctx.fillStyle = options.bodyColor,
                each(this.beforeBody, fillLineOfText),
                xLinePadding =
                    displayColors && bodyAlignForCalculation !== 'right'
                        ? bodyAlign === 'center'
                            ? boxWidth / 2 + boxPadding
                            : boxWidth + 2 + boxPadding
                        : 0,
                i = 0,
                ilen = body.length;
            i < ilen;
            ++i
        ) {
            for (
                bodyItem = body[i],
                    textColor = this.labelTextColors[i],
                    ctx.fillStyle = textColor,
                    each(bodyItem.before, fillLineOfText),
                    lines = bodyItem.lines,
                    displayColors &&
                        lines.length &&
                        (this._drawColorBox(ctx, pt, i, rtlHelper, options),
                        (bodyLineHeight = Math.max(
                            bodyFont.lineHeight,
                            boxHeight,
                        ))),
                    j = 0,
                    jlen = lines.length;
                j < jlen;
                ++j
            )
                fillLineOfText(lines[j]), (bodyLineHeight = bodyFont.lineHeight)
            each(bodyItem.after, fillLineOfText)
        }
        ;(xLinePadding = 0),
            (bodyLineHeight = bodyFont.lineHeight),
            each(this.afterBody, fillLineOfText),
            (pt.y -= bodySpacing)
    }
    drawFooter(pt, ctx, options) {
        let footer = this.footer,
            length = footer.length,
            footerFont,
            i
        if (length) {
            let rtlHelper = getRtlAdapter(options.rtl, this.x, this.width)
            for (
                pt.x = getAlignedX(this, options.footerAlign, options),
                    pt.y += options.footerMarginTop,
                    ctx.textAlign = rtlHelper.textAlign(options.footerAlign),
                    ctx.textBaseline = 'middle',
                    footerFont = toFont(options.footerFont),
                    ctx.fillStyle = options.footerColor,
                    ctx.font = footerFont.string,
                    i = 0;
                i < length;
                ++i
            )
                ctx.fillText(
                    footer[i],
                    rtlHelper.x(pt.x),
                    pt.y + footerFont.lineHeight / 2,
                ),
                    (pt.y += footerFont.lineHeight + options.footerSpacing)
        }
    }
    drawBackground(pt, ctx, tooltipSize, options) {
        let { xAlign, yAlign } = this,
            { x, y } = pt,
            { width, height } = tooltipSize,
            { topLeft, topRight, bottomLeft, bottomRight } = toTRBLCorners(
                options.cornerRadius,
            )
        ;(ctx.fillStyle = options.backgroundColor),
            (ctx.strokeStyle = options.borderColor),
            (ctx.lineWidth = options.borderWidth),
            ctx.beginPath(),
            ctx.moveTo(x + topLeft, y),
            yAlign === 'top' && this.drawCaret(pt, ctx, tooltipSize, options),
            ctx.lineTo(x + width - topRight, y),
            ctx.quadraticCurveTo(x + width, y, x + width, y + topRight),
            yAlign === 'center' &&
                xAlign === 'right' &&
                this.drawCaret(pt, ctx, tooltipSize, options),
            ctx.lineTo(x + width, y + height - bottomRight),
            ctx.quadraticCurveTo(
                x + width,
                y + height,
                x + width - bottomRight,
                y + height,
            ),
            yAlign === 'bottom' &&
                this.drawCaret(pt, ctx, tooltipSize, options),
            ctx.lineTo(x + bottomLeft, y + height),
            ctx.quadraticCurveTo(x, y + height, x, y + height - bottomLeft),
            yAlign === 'center' &&
                xAlign === 'left' &&
                this.drawCaret(pt, ctx, tooltipSize, options),
            ctx.lineTo(x, y + topLeft),
            ctx.quadraticCurveTo(x, y, x + topLeft, y),
            ctx.closePath(),
            ctx.fill(),
            options.borderWidth > 0 && ctx.stroke()
    }
    _updateAnimationTarget(options) {
        let chart2 = this.chart,
            anims = this.$animations,
            animX = anims && anims.x,
            animY = anims && anims.y
        if (animX || animY) {
            let position = positioners[options.position].call(
                this,
                this._active,
                this._eventPosition,
            )
            if (!position) return
            let size = (this._size = getTooltipSize(this, options)),
                positionAndSize = Object.assign({}, position, this._size),
                alignment = determineAlignment(
                    chart2,
                    options,
                    positionAndSize,
                ),
                point = getBackgroundPoint(
                    options,
                    positionAndSize,
                    alignment,
                    chart2,
                )
            ;(animX._to !== point.x || animY._to !== point.y) &&
                ((this.xAlign = alignment.xAlign),
                (this.yAlign = alignment.yAlign),
                (this.width = size.width),
                (this.height = size.height),
                (this.caretX = position.x),
                (this.caretY = position.y),
                this._resolveAnimations().update(this, point))
        }
    }
    _willRender() {
        return !!this.opacity
    }
    draw(ctx) {
        let options = this.options.setContext(this.getContext()),
            opacity = this.opacity
        if (!opacity) return
        this._updateAnimationTarget(options)
        let tooltipSize = { width: this.width, height: this.height },
            pt = { x: this.x, y: this.y }
        opacity = Math.abs(opacity) < 0.001 ? 0 : opacity
        let padding = toPadding(options.padding),
            hasTooltipContent =
                this.title.length ||
                this.beforeBody.length ||
                this.body.length ||
                this.afterBody.length ||
                this.footer.length
        options.enabled &&
            hasTooltipContent &&
            (ctx.save(),
            (ctx.globalAlpha = opacity),
            this.drawBackground(pt, ctx, tooltipSize, options),
            overrideTextDirection(ctx, options.textDirection),
            (pt.y += padding.top),
            this.drawTitle(pt, ctx, options),
            this.drawBody(pt, ctx, options),
            this.drawFooter(pt, ctx, options),
            restoreTextDirection(ctx, options.textDirection),
            ctx.restore())
    }
    getActiveElements() {
        return this._active || []
    }
    setActiveElements(activeElements, eventPosition) {
        let lastActive = this._active,
            active = activeElements.map(({ datasetIndex, index: index2 }) => {
                let meta = this.chart.getDatasetMeta(datasetIndex)
                if (!meta)
                    throw new Error(
                        'Cannot find a dataset at index ' + datasetIndex,
                    )
                return {
                    datasetIndex,
                    element: meta.data[index2],
                    index: index2,
                }
            }),
            changed = !_elementsEqual(lastActive, active),
            positionChanged = this._positionChanged(active, eventPosition)
        ;(changed || positionChanged) &&
            ((this._active = active),
            (this._eventPosition = eventPosition),
            (this._ignoreReplayEvents = !0),
            this.update(!0))
    }
    handleEvent(e, replay, inChartArea = !0) {
        if (replay && this._ignoreReplayEvents) return !1
        this._ignoreReplayEvents = !1
        let options = this.options,
            lastActive = this._active || [],
            active = this._getActiveElements(
                e,
                lastActive,
                replay,
                inChartArea,
            ),
            positionChanged = this._positionChanged(active, e),
            changed =
                replay || !_elementsEqual(active, lastActive) || positionChanged
        return (
            changed &&
                ((this._active = active),
                (options.enabled || options.external) &&
                    ((this._eventPosition = { x: e.x, y: e.y }),
                    this.update(!0, replay))),
            changed
        )
    }
    _getActiveElements(e, lastActive, replay, inChartArea) {
        let options = this.options
        if (e.type === 'mouseout') return []
        if (!inChartArea) return lastActive
        let active = this.chart.getElementsAtEventForMode(
            e,
            options.mode,
            options,
            replay,
        )
        return options.reverse && active.reverse(), active
    }
    _positionChanged(active, e) {
        let { caretX, caretY, options } = this,
            position = positioners[options.position].call(this, active, e)
        return (
            position !== !1 && (caretX !== position.x || caretY !== position.y)
        )
    }
}
Tooltip.positioners = positioners
var plugin_tooltip = {
        id: 'tooltip',
        _element: Tooltip,
        positioners,
        afterInit(chart2, _args, options) {
            options &&
                (chart2.tooltip = new Tooltip({ chart: chart2, options }))
        },
        beforeUpdate(chart2, _args, options) {
            chart2.tooltip && chart2.tooltip.initialize(options)
        },
        reset(chart2, _args, options) {
            chart2.tooltip && chart2.tooltip.initialize(options)
        },
        afterDraw(chart2) {
            let tooltip = chart2.tooltip
            if (tooltip && tooltip._willRender()) {
                let args = { tooltip }
                if (chart2.notifyPlugins('beforeTooltipDraw', args) === !1)
                    return
                tooltip.draw(chart2.ctx),
                    chart2.notifyPlugins('afterTooltipDraw', args)
            }
        },
        afterEvent(chart2, args) {
            if (chart2.tooltip) {
                let useFinalPosition = args.replay
                chart2.tooltip.handleEvent(
                    args.event,
                    useFinalPosition,
                    args.inChartArea,
                ) && (args.changed = !0)
            }
        },
        defaults: {
            enabled: !0,
            external: null,
            position: 'average',
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleColor: '#fff',
            titleFont: { weight: 'bold' },
            titleSpacing: 2,
            titleMarginBottom: 6,
            titleAlign: 'left',
            bodyColor: '#fff',
            bodySpacing: 2,
            bodyFont: {},
            bodyAlign: 'left',
            footerColor: '#fff',
            footerSpacing: 2,
            footerMarginTop: 6,
            footerFont: { weight: 'bold' },
            footerAlign: 'left',
            padding: 6,
            caretPadding: 2,
            caretSize: 5,
            cornerRadius: 6,
            boxHeight: (ctx, opts) => opts.bodyFont.size,
            boxWidth: (ctx, opts) => opts.bodyFont.size,
            multiKeyBackground: '#fff',
            displayColors: !0,
            boxPadding: 0,
            borderColor: 'rgba(0,0,0,0)',
            borderWidth: 0,
            animation: { duration: 400, easing: 'easeOutQuart' },
            animations: {
                numbers: {
                    type: 'number',
                    properties: [
                        'x',
                        'y',
                        'width',
                        'height',
                        'caretX',
                        'caretY',
                    ],
                },
                opacity: { easing: 'linear', duration: 200 },
            },
            callbacks: {
                beforeTitle: noop,
                title(tooltipItems) {
                    if (tooltipItems.length > 0) {
                        let item = tooltipItems[0],
                            labels = item.chart.data.labels,
                            labelCount = labels ? labels.length : 0
                        if (
                            this &&
                            this.options &&
                            this.options.mode === 'dataset'
                        )
                            return item.dataset.label || ''
                        if (item.label) return item.label
                        if (labelCount > 0 && item.dataIndex < labelCount)
                            return labels[item.dataIndex]
                    }
                    return ''
                },
                afterTitle: noop,
                beforeBody: noop,
                beforeLabel: noop,
                label(tooltipItem) {
                    if (this && this.options && this.options.mode === 'dataset')
                        return (
                            tooltipItem.label +
                                ': ' +
                                tooltipItem.formattedValue ||
                            tooltipItem.formattedValue
                        )
                    let label = tooltipItem.dataset.label || ''
                    label && (label += ': ')
                    let value = tooltipItem.formattedValue
                    return isNullOrUndef(value) || (label += value), label
                },
                labelColor(tooltipItem) {
                    let options = tooltipItem.chart
                        .getDatasetMeta(tooltipItem.datasetIndex)
                        .controller.getStyle(tooltipItem.dataIndex)
                    return {
                        borderColor: options.borderColor,
                        backgroundColor: options.backgroundColor,
                        borderWidth: options.borderWidth,
                        borderDash: options.borderDash,
                        borderDashOffset: options.borderDashOffset,
                        borderRadius: 0,
                    }
                },
                labelTextColor() {
                    return this.options.bodyColor
                },
                labelPointStyle(tooltipItem) {
                    let options = tooltipItem.chart
                        .getDatasetMeta(tooltipItem.datasetIndex)
                        .controller.getStyle(tooltipItem.dataIndex)
                    return {
                        pointStyle: options.pointStyle,
                        rotation: options.rotation,
                    }
                },
                afterLabel: noop,
                afterBody: noop,
                beforeFooter: noop,
                footer: noop,
                afterFooter: noop,
            },
        },
        defaultRoutes: {
            bodyFont: 'font',
            footerFont: 'font',
            titleFont: 'font',
        },
        descriptors: {
            _scriptable: (name) =>
                name !== 'filter' && name !== 'itemSort' && name !== 'external',
            _indexable: !1,
            callbacks: { _scriptable: !1, _indexable: !1 },
            animation: { _fallback: !1 },
            animations: { _fallback: 'animation' },
        },
        additionalOptionScopes: ['interaction'],
    },
    plugins = Object.freeze({
        __proto__: null,
        Decimation: plugin_decimation,
        Filler: index,
        Legend: plugin_legend,
        SubTitle: plugin_subtitle,
        Title: plugin_title,
        Tooltip: plugin_tooltip,
    }),
    addIfString = (labels, raw, index2, addedLabels) => (
        typeof raw == 'string'
            ? ((index2 = labels.push(raw) - 1),
              addedLabels.unshift({ index: index2, label: raw }))
            : isNaN(raw) && (index2 = null),
        index2
    )
function findOrAddLabel(labels, raw, index2, addedLabels) {
    let first = labels.indexOf(raw)
    if (first === -1) return addIfString(labels, raw, index2, addedLabels)
    let last = labels.lastIndexOf(raw)
    return first !== last ? index2 : first
}
var validIndex = (index2, max) =>
        index2 === null ? null : _limitValue(Math.round(index2), 0, max),
    CategoryScale = class extends Scale {
        constructor(cfg) {
            super(cfg)
            ;(this._startValue = void 0),
                (this._valueRange = 0),
                (this._addedLabels = [])
        }
        init(scaleOptions) {
            let added = this._addedLabels
            if (added.length) {
                let labels = this.getLabels()
                for (let { index: index2, label } of added)
                    labels[index2] === label && labels.splice(index2, 1)
                this._addedLabels = []
            }
            super.init(scaleOptions)
        }
        parse(raw, index2) {
            if (isNullOrUndef(raw)) return null
            let labels = this.getLabels()
            return (
                (index2 =
                    isFinite(index2) && labels[index2] === raw
                        ? index2
                        : findOrAddLabel(
                              labels,
                              raw,
                              valueOrDefault(index2, raw),
                              this._addedLabels,
                          )),
                validIndex(index2, labels.length - 1)
            )
        }
        determineDataLimits() {
            let { minDefined, maxDefined } = this.getUserBounds(),
                { min, max } = this.getMinMax(!0)
            this.options.bounds === 'ticks' &&
                (minDefined || (min = 0),
                maxDefined || (max = this.getLabels().length - 1)),
                (this.min = min),
                (this.max = max)
        }
        buildTicks() {
            let min = this.min,
                max = this.max,
                offset = this.options.offset,
                ticks = [],
                labels = this.getLabels()
            ;(labels =
                min === 0 && max === labels.length - 1
                    ? labels
                    : labels.slice(min, max + 1)),
                (this._valueRange = Math.max(
                    labels.length - (offset ? 0 : 1),
                    1,
                )),
                (this._startValue = this.min - (offset ? 0.5 : 0))
            for (let value = min; value <= max; value++) ticks.push({ value })
            return ticks
        }
        getLabelForValue(value) {
            let labels = this.getLabels()
            return value >= 0 && value < labels.length ? labels[value] : value
        }
        configure() {
            super.configure(),
                this.isHorizontal() ||
                    (this._reversePixels = !this._reversePixels)
        }
        getPixelForValue(value) {
            return (
                typeof value != 'number' && (value = this.parse(value)),
                value === null
                    ? NaN
                    : this.getPixelForDecimal(
                          (value - this._startValue) / this._valueRange,
                      )
            )
        }
        getPixelForTick(index2) {
            let ticks = this.ticks
            return index2 < 0 || index2 > ticks.length - 1
                ? null
                : this.getPixelForValue(ticks[index2].value)
        }
        getValueForPixel(pixel) {
            return Math.round(
                this._startValue +
                    this.getDecimalForPixel(pixel) * this._valueRange,
            )
        }
        getBasePixel() {
            return this.bottom
        }
    }
CategoryScale.id = 'category'
CategoryScale.defaults = {
    ticks: { callback: CategoryScale.prototype.getLabelForValue },
}
function generateTicks$1(generationOptions, dataRange) {
    let ticks = [],
        MIN_SPACING = 1e-14,
        {
            bounds,
            step,
            min,
            max,
            precision,
            count,
            maxTicks,
            maxDigits,
            includeBounds,
        } = generationOptions,
        unit = step || 1,
        maxSpaces = maxTicks - 1,
        { min: rmin, max: rmax } = dataRange,
        minDefined = !isNullOrUndef(min),
        maxDefined = !isNullOrUndef(max),
        countDefined = !isNullOrUndef(count),
        minSpacing = (rmax - rmin) / (maxDigits + 1),
        spacing = niceNum((rmax - rmin) / maxSpaces / unit) * unit,
        factor,
        niceMin,
        niceMax,
        numSpaces
    if (spacing < MIN_SPACING && !minDefined && !maxDefined)
        return [{ value: rmin }, { value: rmax }]
    ;(numSpaces = Math.ceil(rmax / spacing) - Math.floor(rmin / spacing)),
        numSpaces > maxSpaces &&
            (spacing =
                niceNum((numSpaces * spacing) / maxSpaces / unit) * unit),
        isNullOrUndef(precision) ||
            ((factor = Math.pow(10, precision)),
            (spacing = Math.ceil(spacing * factor) / factor)),
        bounds === 'ticks'
            ? ((niceMin = Math.floor(rmin / spacing) * spacing),
              (niceMax = Math.ceil(rmax / spacing) * spacing))
            : ((niceMin = rmin), (niceMax = rmax)),
        minDefined &&
        maxDefined &&
        step &&
        almostWhole((max - min) / step, spacing / 1e3)
            ? ((numSpaces = Math.round(
                  Math.min((max - min) / spacing, maxTicks),
              )),
              (spacing = (max - min) / numSpaces),
              (niceMin = min),
              (niceMax = max))
            : countDefined
            ? ((niceMin = minDefined ? min : niceMin),
              (niceMax = maxDefined ? max : niceMax),
              (numSpaces = count - 1),
              (spacing = (niceMax - niceMin) / numSpaces))
            : ((numSpaces = (niceMax - niceMin) / spacing),
              almostEquals(numSpaces, Math.round(numSpaces), spacing / 1e3)
                  ? (numSpaces = Math.round(numSpaces))
                  : (numSpaces = Math.ceil(numSpaces)))
    let decimalPlaces = Math.max(
        _decimalPlaces(spacing),
        _decimalPlaces(niceMin),
    )
    ;(factor = Math.pow(
        10,
        isNullOrUndef(precision) ? decimalPlaces : precision,
    )),
        (niceMin = Math.round(niceMin * factor) / factor),
        (niceMax = Math.round(niceMax * factor) / factor)
    let j = 0
    for (
        minDefined &&
        (includeBounds && niceMin !== min
            ? (ticks.push({ value: min }),
              niceMin < min && j++,
              almostEquals(
                  Math.round((niceMin + j * spacing) * factor) / factor,
                  min,
                  relativeLabelSize(min, minSpacing, generationOptions),
              ) && j++)
            : niceMin < min && j++);
        j < numSpaces;
        ++j
    )
        ticks.push({
            value: Math.round((niceMin + j * spacing) * factor) / factor,
        })
    return (
        maxDefined && includeBounds && niceMax !== max
            ? ticks.length &&
              almostEquals(
                  ticks[ticks.length - 1].value,
                  max,
                  relativeLabelSize(max, minSpacing, generationOptions),
              )
                ? (ticks[ticks.length - 1].value = max)
                : ticks.push({ value: max })
            : (!maxDefined || niceMax === max) &&
              ticks.push({ value: niceMax }),
        ticks
    )
}
function relativeLabelSize(value, minSpacing, { horizontal, minRotation }) {
    let rad = toRadians(minRotation),
        ratio = (horizontal ? Math.sin(rad) : Math.cos(rad)) || 0.001,
        length = 0.75 * minSpacing * ('' + value).length
    return Math.min(minSpacing / ratio, length)
}
var LinearScaleBase = class extends Scale {
        constructor(cfg) {
            super(cfg)
            ;(this.start = void 0),
                (this.end = void 0),
                (this._startValue = void 0),
                (this._endValue = void 0),
                (this._valueRange = 0)
        }
        parse(raw, index2) {
            return isNullOrUndef(raw) ||
                ((typeof raw == 'number' || raw instanceof Number) &&
                    !isFinite(+raw))
                ? null
                : +raw
        }
        handleTickRangeOptions() {
            let { beginAtZero } = this.options,
                { minDefined, maxDefined } = this.getUserBounds(),
                { min, max } = this,
                setMin = (v) => (min = minDefined ? min : v),
                setMax = (v) => (max = maxDefined ? max : v)
            if (beginAtZero) {
                let minSign = sign(min),
                    maxSign = sign(max)
                minSign < 0 && maxSign < 0
                    ? setMax(0)
                    : minSign > 0 && maxSign > 0 && setMin(0)
            }
            if (min === max) {
                let offset = 1
                ;(max >= Number.MAX_SAFE_INTEGER ||
                    min <= Number.MIN_SAFE_INTEGER) &&
                    (offset = Math.abs(max * 0.05)),
                    setMax(max + offset),
                    beginAtZero || setMin(min - offset)
            }
            ;(this.min = min), (this.max = max)
        }
        getTickLimit() {
            let tickOpts = this.options.ticks,
                { maxTicksLimit, stepSize } = tickOpts,
                maxTicks
            return (
                stepSize
                    ? ((maxTicks =
                          Math.ceil(this.max / stepSize) -
                          Math.floor(this.min / stepSize) +
                          1),
                      maxTicks > 1e3 &&
                          (console.warn(
                              `scales.${this.id}.ticks.stepSize: ${stepSize} would result generating up to ${maxTicks} ticks. Limiting to 1000.`,
                          ),
                          (maxTicks = 1e3)))
                    : ((maxTicks = this.computeTickLimit()),
                      (maxTicksLimit = maxTicksLimit || 11)),
                maxTicksLimit && (maxTicks = Math.min(maxTicksLimit, maxTicks)),
                maxTicks
            )
        }
        computeTickLimit() {
            return Number.POSITIVE_INFINITY
        }
        buildTicks() {
            let opts = this.options,
                tickOpts = opts.ticks,
                maxTicks = this.getTickLimit()
            maxTicks = Math.max(2, maxTicks)
            let numericGeneratorOptions = {
                    maxTicks,
                    bounds: opts.bounds,
                    min: opts.min,
                    max: opts.max,
                    precision: tickOpts.precision,
                    step: tickOpts.stepSize,
                    count: tickOpts.count,
                    maxDigits: this._maxDigits(),
                    horizontal: this.isHorizontal(),
                    minRotation: tickOpts.minRotation || 0,
                    includeBounds: tickOpts.includeBounds !== !1,
                },
                dataRange = this._range || this,
                ticks = generateTicks$1(numericGeneratorOptions, dataRange)
            return (
                opts.bounds === 'ticks' &&
                    _setMinAndMaxByKey(ticks, this, 'value'),
                opts.reverse
                    ? (ticks.reverse(),
                      (this.start = this.max),
                      (this.end = this.min))
                    : ((this.start = this.min), (this.end = this.max)),
                ticks
            )
        }
        configure() {
            let ticks = this.ticks,
                start = this.min,
                end = this.max
            if ((super.configure(), this.options.offset && ticks.length)) {
                let offset = (end - start) / Math.max(ticks.length - 1, 1) / 2
                ;(start -= offset), (end += offset)
            }
            ;(this._startValue = start),
                (this._endValue = end),
                (this._valueRange = end - start)
        }
        getLabelForValue(value) {
            return formatNumber(
                value,
                this.chart.options.locale,
                this.options.ticks.format,
            )
        }
    },
    LinearScale = class extends LinearScaleBase {
        determineDataLimits() {
            let { min, max } = this.getMinMax(!0)
            ;(this.min = isNumberFinite(min) ? min : 0),
                (this.max = isNumberFinite(max) ? max : 1),
                this.handleTickRangeOptions()
        }
        computeTickLimit() {
            let horizontal = this.isHorizontal(),
                length = horizontal ? this.width : this.height,
                minRotation = toRadians(this.options.ticks.minRotation),
                ratio =
                    (horizontal
                        ? Math.sin(minRotation)
                        : Math.cos(minRotation)) || 0.001,
                tickFont = this._resolveTickFontOptions(0)
            return Math.ceil(length / Math.min(40, tickFont.lineHeight / ratio))
        }
        getPixelForValue(value) {
            return value === null
                ? NaN
                : this.getPixelForDecimal(
                      (value - this._startValue) / this._valueRange,
                  )
        }
        getValueForPixel(pixel) {
            return (
                this._startValue +
                this.getDecimalForPixel(pixel) * this._valueRange
            )
        }
    }
LinearScale.id = 'linear'
LinearScale.defaults = { ticks: { callback: Ticks.formatters.numeric } }
function isMajor(tickVal) {
    return tickVal / Math.pow(10, Math.floor(log10(tickVal))) === 1
}
function generateTicks(generationOptions, dataRange) {
    let endExp = Math.floor(log10(dataRange.max)),
        endSignificand = Math.ceil(dataRange.max / Math.pow(10, endExp)),
        ticks = [],
        tickVal = finiteOrDefault(
            generationOptions.min,
            Math.pow(10, Math.floor(log10(dataRange.min))),
        ),
        exp = Math.floor(log10(tickVal)),
        significand = Math.floor(tickVal / Math.pow(10, exp)),
        precision = exp < 0 ? Math.pow(10, Math.abs(exp)) : 1
    do
        ticks.push({ value: tickVal, major: isMajor(tickVal) }),
            ++significand,
            significand === 10 &&
                ((significand = 1),
                ++exp,
                (precision = exp >= 0 ? 1 : precision)),
            (tickVal =
                Math.round(significand * Math.pow(10, exp) * precision) /
                precision)
    while (exp < endExp || (exp === endExp && significand < endSignificand))
    let lastTick = finiteOrDefault(generationOptions.max, tickVal)
    return ticks.push({ value: lastTick, major: isMajor(tickVal) }), ticks
}
var LogarithmicScale = class extends Scale {
    constructor(cfg) {
        super(cfg)
        ;(this.start = void 0),
            (this.end = void 0),
            (this._startValue = void 0),
            (this._valueRange = 0)
    }
    parse(raw, index2) {
        let value = LinearScaleBase.prototype.parse.apply(this, [raw, index2])
        if (value === 0) {
            this._zero = !0
            return
        }
        return isNumberFinite(value) && value > 0 ? value : null
    }
    determineDataLimits() {
        let { min, max } = this.getMinMax(!0)
        ;(this.min = isNumberFinite(min) ? Math.max(0, min) : null),
            (this.max = isNumberFinite(max) ? Math.max(0, max) : null),
            this.options.beginAtZero && (this._zero = !0),
            this.handleTickRangeOptions()
    }
    handleTickRangeOptions() {
        let { minDefined, maxDefined } = this.getUserBounds(),
            min = this.min,
            max = this.max,
            setMin = (v) => (min = minDefined ? min : v),
            setMax = (v) => (max = maxDefined ? max : v),
            exp = (v, m) => Math.pow(10, Math.floor(log10(v)) + m)
        min === max &&
            (min <= 0
                ? (setMin(1), setMax(10))
                : (setMin(exp(min, -1)), setMax(exp(max, 1)))),
            min <= 0 && setMin(exp(max, -1)),
            max <= 0 && setMax(exp(min, 1)),
            this._zero &&
                this.min !== this._suggestedMin &&
                min === exp(this.min, 0) &&
                setMin(exp(min, -1)),
            (this.min = min),
            (this.max = max)
    }
    buildTicks() {
        let opts = this.options,
            generationOptions = { min: this._userMin, max: this._userMax },
            ticks = generateTicks(generationOptions, this)
        return (
            opts.bounds === 'ticks' && _setMinAndMaxByKey(ticks, this, 'value'),
            opts.reverse
                ? (ticks.reverse(),
                  (this.start = this.max),
                  (this.end = this.min))
                : ((this.start = this.min), (this.end = this.max)),
            ticks
        )
    }
    getLabelForValue(value) {
        return value === void 0
            ? '0'
            : formatNumber(
                  value,
                  this.chart.options.locale,
                  this.options.ticks.format,
              )
    }
    configure() {
        let start = this.min
        super.configure(),
            (this._startValue = log10(start)),
            (this._valueRange = log10(this.max) - log10(start))
    }
    getPixelForValue(value) {
        return (
            (value === void 0 || value === 0) && (value = this.min),
            value === null || isNaN(value)
                ? NaN
                : this.getPixelForDecimal(
                      value === this.min
                          ? 0
                          : (log10(value) - this._startValue) /
                                this._valueRange,
                  )
        )
    }
    getValueForPixel(pixel) {
        let decimal = this.getDecimalForPixel(pixel)
        return Math.pow(10, this._startValue + decimal * this._valueRange)
    }
}
LogarithmicScale.id = 'logarithmic'
LogarithmicScale.defaults = {
    ticks: { callback: Ticks.formatters.logarithmic, major: { enabled: !0 } },
}
function getTickBackdropHeight(opts) {
    let tickOpts = opts.ticks
    if (tickOpts.display && opts.display) {
        let padding = toPadding(tickOpts.backdropPadding)
        return (
            valueOrDefault(
                tickOpts.font && tickOpts.font.size,
                defaults.font.size,
            ) + padding.height
        )
    }
    return 0
}
function measureLabelSize(ctx, font, label) {
    return (
        (label = isArray(label) ? label : [label]),
        {
            w: _longestText(ctx, font.string, label),
            h: label.length * font.lineHeight,
        }
    )
}
function determineLimits(angle, pos, size, min, max) {
    return angle === min || angle === max
        ? { start: pos - size / 2, end: pos + size / 2 }
        : angle < min || angle > max
        ? { start: pos - size, end: pos }
        : { start: pos, end: pos + size }
}
function fitWithPointLabels(scale) {
    let orig = {
            l: scale.left + scale._padding.left,
            r: scale.right - scale._padding.right,
            t: scale.top + scale._padding.top,
            b: scale.bottom - scale._padding.bottom,
        },
        limits = Object.assign({}, orig),
        labelSizes = [],
        padding = [],
        valueCount = scale._pointLabels.length,
        pointLabelOpts = scale.options.pointLabels,
        additionalAngle = pointLabelOpts.centerPointLabels ? PI / valueCount : 0
    for (let i = 0; i < valueCount; i++) {
        let opts = pointLabelOpts.setContext(scale.getPointLabelContext(i))
        padding[i] = opts.padding
        let pointPosition = scale.getPointPosition(
                i,
                scale.drawingArea + padding[i],
                additionalAngle,
            ),
            plFont = toFont(opts.font),
            textSize = measureLabelSize(
                scale.ctx,
                plFont,
                scale._pointLabels[i],
            )
        labelSizes[i] = textSize
        let angleRadians = _normalizeAngle(
                scale.getIndexAngle(i) + additionalAngle,
            ),
            angle = Math.round(toDegrees(angleRadians)),
            hLimits = determineLimits(
                angle,
                pointPosition.x,
                textSize.w,
                0,
                180,
            ),
            vLimits = determineLimits(
                angle,
                pointPosition.y,
                textSize.h,
                90,
                270,
            )
        updateLimits(limits, orig, angleRadians, hLimits, vLimits)
    }
    scale.setCenterPoint(
        orig.l - limits.l,
        limits.r - orig.r,
        orig.t - limits.t,
        limits.b - orig.b,
    ),
        (scale._pointLabelItems = buildPointLabelItems(
            scale,
            labelSizes,
            padding,
        ))
}
function updateLimits(limits, orig, angle, hLimits, vLimits) {
    let sin = Math.abs(Math.sin(angle)),
        cos = Math.abs(Math.cos(angle)),
        x = 0,
        y = 0
    hLimits.start < orig.l
        ? ((x = (orig.l - hLimits.start) / sin),
          (limits.l = Math.min(limits.l, orig.l - x)))
        : hLimits.end > orig.r &&
          ((x = (hLimits.end - orig.r) / sin),
          (limits.r = Math.max(limits.r, orig.r + x))),
        vLimits.start < orig.t
            ? ((y = (orig.t - vLimits.start) / cos),
              (limits.t = Math.min(limits.t, orig.t - y)))
            : vLimits.end > orig.b &&
              ((y = (vLimits.end - orig.b) / cos),
              (limits.b = Math.max(limits.b, orig.b + y)))
}
function buildPointLabelItems(scale, labelSizes, padding) {
    let items = [],
        valueCount = scale._pointLabels.length,
        opts = scale.options,
        extra = getTickBackdropHeight(opts) / 2,
        outerDistance = scale.drawingArea,
        additionalAngle = opts.pointLabels.centerPointLabels
            ? PI / valueCount
            : 0
    for (let i = 0; i < valueCount; i++) {
        let pointLabelPosition = scale.getPointPosition(
                i,
                outerDistance + extra + padding[i],
                additionalAngle,
            ),
            angle = Math.round(
                toDegrees(_normalizeAngle(pointLabelPosition.angle + HALF_PI)),
            ),
            size = labelSizes[i],
            y = yForAngle(pointLabelPosition.y, size.h, angle),
            textAlign = getTextAlignForAngle(angle),
            left = leftForTextAlign(pointLabelPosition.x, size.w, textAlign)
        items.push({
            x: pointLabelPosition.x,
            y,
            textAlign,
            left,
            top: y,
            right: left + size.w,
            bottom: y + size.h,
        })
    }
    return items
}
function getTextAlignForAngle(angle) {
    return angle === 0 || angle === 180
        ? 'center'
        : angle < 180
        ? 'left'
        : 'right'
}
function leftForTextAlign(x, w, align) {
    return align === 'right' ? (x -= w) : align === 'center' && (x -= w / 2), x
}
function yForAngle(y, h, angle) {
    return (
        angle === 90 || angle === 270
            ? (y -= h / 2)
            : (angle > 270 || angle < 90) && (y -= h),
        y
    )
}
function drawPointLabels(scale, labelCount) {
    let {
        ctx,
        options: { pointLabels },
    } = scale
    for (let i = labelCount - 1; i >= 0; i--) {
        let optsAtIndex = pointLabels.setContext(scale.getPointLabelContext(i)),
            plFont = toFont(optsAtIndex.font),
            { x, y, textAlign, left, top, right, bottom } =
                scale._pointLabelItems[i],
            { backdropColor } = optsAtIndex
        if (!isNullOrUndef(backdropColor)) {
            let borderRadius = toTRBLCorners(optsAtIndex.borderRadius),
                padding = toPadding(optsAtIndex.backdropPadding)
            ctx.fillStyle = backdropColor
            let backdropLeft = left - padding.left,
                backdropTop = top - padding.top,
                backdropWidth = right - left + padding.width,
                backdropHeight = bottom - top + padding.height
            Object.values(borderRadius).some((v) => v !== 0)
                ? (ctx.beginPath(),
                  addRoundedRectPath(ctx, {
                      x: backdropLeft,
                      y: backdropTop,
                      w: backdropWidth,
                      h: backdropHeight,
                      radius: borderRadius,
                  }),
                  ctx.fill())
                : ctx.fillRect(
                      backdropLeft,
                      backdropTop,
                      backdropWidth,
                      backdropHeight,
                  )
        }
        renderText(
            ctx,
            scale._pointLabels[i],
            x,
            y + plFont.lineHeight / 2,
            plFont,
            { color: optsAtIndex.color, textAlign, textBaseline: 'middle' },
        )
    }
}
function pathRadiusLine(scale, radius, circular, labelCount) {
    let { ctx } = scale
    if (circular) ctx.arc(scale.xCenter, scale.yCenter, radius, 0, TAU)
    else {
        let pointPosition = scale.getPointPosition(0, radius)
        ctx.moveTo(pointPosition.x, pointPosition.y)
        for (let i = 1; i < labelCount; i++)
            (pointPosition = scale.getPointPosition(i, radius)),
                ctx.lineTo(pointPosition.x, pointPosition.y)
    }
}
function drawRadiusLine(scale, gridLineOpts, radius, labelCount) {
    let ctx = scale.ctx,
        circular = gridLineOpts.circular,
        { color: color2, lineWidth } = gridLineOpts
    ;(!circular && !labelCount) ||
        !color2 ||
        !lineWidth ||
        radius < 0 ||
        (ctx.save(),
        (ctx.strokeStyle = color2),
        (ctx.lineWidth = lineWidth),
        ctx.setLineDash(gridLineOpts.borderDash),
        (ctx.lineDashOffset = gridLineOpts.borderDashOffset),
        ctx.beginPath(),
        pathRadiusLine(scale, radius, circular, labelCount),
        ctx.closePath(),
        ctx.stroke(),
        ctx.restore())
}
function createPointLabelContext(parent, index2, label) {
    return createContext(parent, { label, index: index2, type: 'pointLabel' })
}
var RadialLinearScale = class extends LinearScaleBase {
    constructor(cfg) {
        super(cfg)
        ;(this.xCenter = void 0),
            (this.yCenter = void 0),
            (this.drawingArea = void 0),
            (this._pointLabels = []),
            (this._pointLabelItems = [])
    }
    setDimensions() {
        let padding = (this._padding = toPadding(
                getTickBackdropHeight(this.options) / 2,
            )),
            w = (this.width = this.maxWidth - padding.width),
            h = (this.height = this.maxHeight - padding.height)
        ;(this.xCenter = Math.floor(this.left + w / 2 + padding.left)),
            (this.yCenter = Math.floor(this.top + h / 2 + padding.top)),
            (this.drawingArea = Math.floor(Math.min(w, h) / 2))
    }
    determineDataLimits() {
        let { min, max } = this.getMinMax(!1)
        ;(this.min = isNumberFinite(min) && !isNaN(min) ? min : 0),
            (this.max = isNumberFinite(max) && !isNaN(max) ? max : 0),
            this.handleTickRangeOptions()
    }
    computeTickLimit() {
        return Math.ceil(this.drawingArea / getTickBackdropHeight(this.options))
    }
    generateTickLabels(ticks) {
        LinearScaleBase.prototype.generateTickLabels.call(this, ticks),
            (this._pointLabels = this.getLabels()
                .map((value, index2) => {
                    let label = callback(
                        this.options.pointLabels.callback,
                        [value, index2],
                        this,
                    )
                    return label || label === 0 ? label : ''
                })
                .filter((v, i) => this.chart.getDataVisibility(i)))
    }
    fit() {
        let opts = this.options
        opts.display && opts.pointLabels.display
            ? fitWithPointLabels(this)
            : this.setCenterPoint(0, 0, 0, 0)
    }
    setCenterPoint(leftMovement, rightMovement, topMovement, bottomMovement) {
        ;(this.xCenter += Math.floor((leftMovement - rightMovement) / 2)),
            (this.yCenter += Math.floor((topMovement - bottomMovement) / 2)),
            (this.drawingArea -= Math.min(
                this.drawingArea / 2,
                Math.max(
                    leftMovement,
                    rightMovement,
                    topMovement,
                    bottomMovement,
                ),
            ))
    }
    getIndexAngle(index2) {
        let angleMultiplier = TAU / (this._pointLabels.length || 1),
            startAngle = this.options.startAngle || 0
        return _normalizeAngle(index2 * angleMultiplier + toRadians(startAngle))
    }
    getDistanceFromCenterForValue(value) {
        if (isNullOrUndef(value)) return NaN
        let scalingFactor = this.drawingArea / (this.max - this.min)
        return this.options.reverse
            ? (this.max - value) * scalingFactor
            : (value - this.min) * scalingFactor
    }
    getValueForDistanceFromCenter(distance) {
        if (isNullOrUndef(distance)) return NaN
        let scaledDistance =
            distance / (this.drawingArea / (this.max - this.min))
        return this.options.reverse
            ? this.max - scaledDistance
            : this.min + scaledDistance
    }
    getPointLabelContext(index2) {
        let pointLabels = this._pointLabels || []
        if (index2 >= 0 && index2 < pointLabels.length) {
            let pointLabel = pointLabels[index2]
            return createPointLabelContext(
                this.getContext(),
                index2,
                pointLabel,
            )
        }
    }
    getPointPosition(index2, distanceFromCenter, additionalAngle = 0) {
        let angle = this.getIndexAngle(index2) - HALF_PI + additionalAngle
        return {
            x: Math.cos(angle) * distanceFromCenter + this.xCenter,
            y: Math.sin(angle) * distanceFromCenter + this.yCenter,
            angle,
        }
    }
    getPointPositionForValue(index2, value) {
        return this.getPointPosition(
            index2,
            this.getDistanceFromCenterForValue(value),
        )
    }
    getBasePosition(index2) {
        return this.getPointPositionForValue(index2 || 0, this.getBaseValue())
    }
    getPointLabelPosition(index2) {
        let { left, top, right, bottom } = this._pointLabelItems[index2]
        return { left, top, right, bottom }
    }
    drawBackground() {
        let {
            backgroundColor,
            grid: { circular },
        } = this.options
        if (backgroundColor) {
            let ctx = this.ctx
            ctx.save(),
                ctx.beginPath(),
                pathRadiusLine(
                    this,
                    this.getDistanceFromCenterForValue(this._endValue),
                    circular,
                    this._pointLabels.length,
                ),
                ctx.closePath(),
                (ctx.fillStyle = backgroundColor),
                ctx.fill(),
                ctx.restore()
        }
    }
    drawGrid() {
        let ctx = this.ctx,
            opts = this.options,
            { angleLines, grid } = opts,
            labelCount = this._pointLabels.length,
            i,
            offset,
            position
        if (
            (opts.pointLabels.display && drawPointLabels(this, labelCount),
            grid.display &&
                this.ticks.forEach((tick, index2) => {
                    if (index2 !== 0) {
                        offset = this.getDistanceFromCenterForValue(tick.value)
                        let optsAtIndex = grid.setContext(
                            this.getContext(index2 - 1),
                        )
                        drawRadiusLine(this, optsAtIndex, offset, labelCount)
                    }
                }),
            angleLines.display)
        ) {
            for (ctx.save(), i = labelCount - 1; i >= 0; i--) {
                let optsAtIndex = angleLines.setContext(
                        this.getPointLabelContext(i),
                    ),
                    { color: color2, lineWidth } = optsAtIndex
                !lineWidth ||
                    !color2 ||
                    ((ctx.lineWidth = lineWidth),
                    (ctx.strokeStyle = color2),
                    ctx.setLineDash(optsAtIndex.borderDash),
                    (ctx.lineDashOffset = optsAtIndex.borderDashOffset),
                    (offset = this.getDistanceFromCenterForValue(
                        opts.ticks.reverse ? this.min : this.max,
                    )),
                    (position = this.getPointPosition(i, offset)),
                    ctx.beginPath(),
                    ctx.moveTo(this.xCenter, this.yCenter),
                    ctx.lineTo(position.x, position.y),
                    ctx.stroke())
            }
            ctx.restore()
        }
    }
    drawBorder() {}
    drawLabels() {
        let ctx = this.ctx,
            opts = this.options,
            tickOpts = opts.ticks
        if (!tickOpts.display) return
        let startAngle = this.getIndexAngle(0),
            offset,
            width
        ctx.save(),
            ctx.translate(this.xCenter, this.yCenter),
            ctx.rotate(startAngle),
            (ctx.textAlign = 'center'),
            (ctx.textBaseline = 'middle'),
            this.ticks.forEach((tick, index2) => {
                if (index2 === 0 && !opts.reverse) return
                let optsAtIndex = tickOpts.setContext(this.getContext(index2)),
                    tickFont = toFont(optsAtIndex.font)
                if (
                    ((offset = this.getDistanceFromCenterForValue(
                        this.ticks[index2].value,
                    )),
                    optsAtIndex.showLabelBackdrop)
                ) {
                    ;(ctx.font = tickFont.string),
                        (width = ctx.measureText(tick.label).width),
                        (ctx.fillStyle = optsAtIndex.backdropColor)
                    let padding = toPadding(optsAtIndex.backdropPadding)
                    ctx.fillRect(
                        -width / 2 - padding.left,
                        -offset - tickFont.size / 2 - padding.top,
                        width + padding.width,
                        tickFont.size + padding.height,
                    )
                }
                renderText(ctx, tick.label, 0, -offset, tickFont, {
                    color: optsAtIndex.color,
                })
            }),
            ctx.restore()
    }
    drawTitle() {}
}
RadialLinearScale.id = 'radialLinear'
RadialLinearScale.defaults = {
    display: !0,
    animate: !0,
    position: 'chartArea',
    angleLines: {
        display: !0,
        lineWidth: 1,
        borderDash: [],
        borderDashOffset: 0,
    },
    grid: { circular: !1 },
    startAngle: 0,
    ticks: { showLabelBackdrop: !0, callback: Ticks.formatters.numeric },
    pointLabels: {
        backdropColor: void 0,
        backdropPadding: 2,
        display: !0,
        font: { size: 10 },
        callback(label) {
            return label
        },
        padding: 5,
        centerPointLabels: !1,
    },
}
RadialLinearScale.defaultRoutes = {
    'angleLines.color': 'borderColor',
    'pointLabels.color': 'color',
    'ticks.color': 'color',
}
RadialLinearScale.descriptors = { angleLines: { _fallback: 'grid' } }
var INTERVALS = {
        millisecond: { common: !0, size: 1, steps: 1e3 },
        second: { common: !0, size: 1e3, steps: 60 },
        minute: { common: !0, size: 6e4, steps: 60 },
        hour: { common: !0, size: 36e5, steps: 24 },
        day: { common: !0, size: 864e5, steps: 30 },
        week: { common: !1, size: 6048e5, steps: 4 },
        month: { common: !0, size: 2628e6, steps: 12 },
        quarter: { common: !1, size: 7884e6, steps: 4 },
        year: { common: !0, size: 3154e7 },
    },
    UNITS = Object.keys(INTERVALS)
function sorter(a, b) {
    return a - b
}
function parse(scale, input) {
    if (isNullOrUndef(input)) return null
    let adapter = scale._adapter,
        { parser, round: round2, isoWeekday } = scale._parseOpts,
        value = input
    return (
        typeof parser == 'function' && (value = parser(value)),
        isNumberFinite(value) ||
            (value =
                typeof parser == 'string'
                    ? adapter.parse(value, parser)
                    : adapter.parse(value)),
        value === null
            ? null
            : (round2 &&
                  (value =
                      round2 === 'week' &&
                      (isNumber(isoWeekday) || isoWeekday === !0)
                          ? adapter.startOf(value, 'isoWeek', isoWeekday)
                          : adapter.startOf(value, round2)),
              +value)
    )
}
function determineUnitForAutoTicks(minUnit, min, max, capacity) {
    let ilen = UNITS.length
    for (let i = UNITS.indexOf(minUnit); i < ilen - 1; ++i) {
        let interval = INTERVALS[UNITS[i]],
            factor = interval.steps ? interval.steps : Number.MAX_SAFE_INTEGER
        if (
            interval.common &&
            Math.ceil((max - min) / (factor * interval.size)) <= capacity
        )
            return UNITS[i]
    }
    return UNITS[ilen - 1]
}
function determineUnitForFormatting(scale, numTicks, minUnit, min, max) {
    for (let i = UNITS.length - 1; i >= UNITS.indexOf(minUnit); i--) {
        let unit = UNITS[i]
        if (
            INTERVALS[unit].common &&
            scale._adapter.diff(max, min, unit) >= numTicks - 1
        )
            return unit
    }
    return UNITS[minUnit ? UNITS.indexOf(minUnit) : 0]
}
function determineMajorUnit(unit) {
    for (let i = UNITS.indexOf(unit) + 1, ilen = UNITS.length; i < ilen; ++i)
        if (INTERVALS[UNITS[i]].common) return UNITS[i]
}
function addTick(ticks, time, timestamps) {
    if (!timestamps) ticks[time] = !0
    else if (timestamps.length) {
        let { lo, hi } = _lookup(timestamps, time),
            timestamp = timestamps[lo] >= time ? timestamps[lo] : timestamps[hi]
        ticks[timestamp] = !0
    }
}
function setMajorTicks(scale, ticks, map3, majorUnit) {
    let adapter = scale._adapter,
        first = +adapter.startOf(ticks[0].value, majorUnit),
        last = ticks[ticks.length - 1].value,
        major,
        index2
    for (
        major = first;
        major <= last;
        major = +adapter.add(major, 1, majorUnit)
    )
        (index2 = map3[major]), index2 >= 0 && (ticks[index2].major = !0)
    return ticks
}
function ticksFromTimestamps(scale, values, majorUnit) {
    let ticks = [],
        map3 = {},
        ilen = values.length,
        i,
        value
    for (i = 0; i < ilen; ++i)
        (value = values[i]), (map3[value] = i), ticks.push({ value, major: !1 })
    return ilen === 0 || !majorUnit
        ? ticks
        : setMajorTicks(scale, ticks, map3, majorUnit)
}
var TimeScale = class extends Scale {
    constructor(props) {
        super(props)
        ;(this._cache = { data: [], labels: [], all: [] }),
            (this._unit = 'day'),
            (this._majorUnit = void 0),
            (this._offsets = {}),
            (this._normalized = !1),
            (this._parseOpts = void 0)
    }
    init(scaleOpts, opts) {
        let time = scaleOpts.time || (scaleOpts.time = {}),
            adapter = (this._adapter = new adapters._date(
                scaleOpts.adapters.date,
            ))
        adapter.init(opts),
            mergeIf(time.displayFormats, adapter.formats()),
            (this._parseOpts = {
                parser: time.parser,
                round: time.round,
                isoWeekday: time.isoWeekday,
            }),
            super.init(scaleOpts),
            (this._normalized = opts.normalized)
    }
    parse(raw, index2) {
        return raw === void 0 ? null : parse(this, raw)
    }
    beforeLayout() {
        super.beforeLayout(), (this._cache = { data: [], labels: [], all: [] })
    }
    determineDataLimits() {
        let options = this.options,
            adapter = this._adapter,
            unit = options.time.unit || 'day',
            { min, max, minDefined, maxDefined } = this.getUserBounds()
        function _applyBounds(bounds) {
            !minDefined &&
                !isNaN(bounds.min) &&
                (min = Math.min(min, bounds.min)),
                !maxDefined &&
                    !isNaN(bounds.max) &&
                    (max = Math.max(max, bounds.max))
        }
        ;(!minDefined || !maxDefined) &&
            (_applyBounds(this._getLabelBounds()),
            (options.bounds !== 'ticks' || options.ticks.source !== 'labels') &&
                _applyBounds(this.getMinMax(!1))),
            (min =
                isNumberFinite(min) && !isNaN(min)
                    ? min
                    : +adapter.startOf(Date.now(), unit)),
            (max =
                isNumberFinite(max) && !isNaN(max)
                    ? max
                    : +adapter.endOf(Date.now(), unit) + 1),
            (this.min = Math.min(min, max - 1)),
            (this.max = Math.max(min + 1, max))
    }
    _getLabelBounds() {
        let arr = this.getLabelTimestamps(),
            min = Number.POSITIVE_INFINITY,
            max = Number.NEGATIVE_INFINITY
        return (
            arr.length && ((min = arr[0]), (max = arr[arr.length - 1])),
            { min, max }
        )
    }
    buildTicks() {
        let options = this.options,
            timeOpts = options.time,
            tickOpts = options.ticks,
            timestamps =
                tickOpts.source === 'labels'
                    ? this.getLabelTimestamps()
                    : this._generate()
        options.bounds === 'ticks' &&
            timestamps.length &&
            ((this.min = this._userMin || timestamps[0]),
            (this.max = this._userMax || timestamps[timestamps.length - 1]))
        let min = this.min,
            max = this.max,
            ticks = _filterBetween(timestamps, min, max)
        return (
            (this._unit =
                timeOpts.unit ||
                (tickOpts.autoSkip
                    ? determineUnitForAutoTicks(
                          timeOpts.minUnit,
                          this.min,
                          this.max,
                          this._getLabelCapacity(min),
                      )
                    : determineUnitForFormatting(
                          this,
                          ticks.length,
                          timeOpts.minUnit,
                          this.min,
                          this.max,
                      ))),
            (this._majorUnit =
                !tickOpts.major.enabled || this._unit === 'year'
                    ? void 0
                    : determineMajorUnit(this._unit)),
            this.initOffsets(timestamps),
            options.reverse && ticks.reverse(),
            ticksFromTimestamps(this, ticks, this._majorUnit)
        )
    }
    afterAutoSkip() {
        this.options.offsetAfterAutoskip &&
            this.initOffsets(this.ticks.map((tick) => +tick.value))
    }
    initOffsets(timestamps) {
        let start = 0,
            end = 0,
            first,
            last
        this.options.offset &&
            timestamps.length &&
            ((first = this.getDecimalForValue(timestamps[0])),
            timestamps.length === 1
                ? (start = 1 - first)
                : (start =
                      (this.getDecimalForValue(timestamps[1]) - first) / 2),
            (last = this.getDecimalForValue(timestamps[timestamps.length - 1])),
            timestamps.length === 1
                ? (end = last)
                : (end =
                      (last -
                          this.getDecimalForValue(
                              timestamps[timestamps.length - 2],
                          )) /
                      2))
        let limit = timestamps.length < 3 ? 0.5 : 0.25
        ;(start = _limitValue(start, 0, limit)),
            (end = _limitValue(end, 0, limit)),
            (this._offsets = { start, end, factor: 1 / (start + 1 + end) })
    }
    _generate() {
        let adapter = this._adapter,
            min = this.min,
            max = this.max,
            options = this.options,
            timeOpts = options.time,
            minor =
                timeOpts.unit ||
                determineUnitForAutoTicks(
                    timeOpts.minUnit,
                    min,
                    max,
                    this._getLabelCapacity(min),
                ),
            stepSize = valueOrDefault(timeOpts.stepSize, 1),
            weekday = minor === 'week' ? timeOpts.isoWeekday : !1,
            hasWeekday = isNumber(weekday) || weekday === !0,
            ticks = {},
            first = min,
            time,
            count
        if (
            (hasWeekday &&
                (first = +adapter.startOf(first, 'isoWeek', weekday)),
            (first = +adapter.startOf(first, hasWeekday ? 'day' : minor)),
            adapter.diff(max, min, minor) > 1e5 * stepSize)
        )
            throw new Error(
                min +
                    ' and ' +
                    max +
                    ' are too far apart with stepSize of ' +
                    stepSize +
                    ' ' +
                    minor,
            )
        let timestamps =
            options.ticks.source === 'data' && this.getDataTimestamps()
        for (
            time = first, count = 0;
            time < max;
            time = +adapter.add(time, stepSize, minor), count++
        )
            addTick(ticks, time, timestamps)
        return (
            (time === max || options.bounds === 'ticks' || count === 1) &&
                addTick(ticks, time, timestamps),
            Object.keys(ticks)
                .sort((a, b) => a - b)
                .map((x) => +x)
        )
    }
    getLabelForValue(value) {
        let adapter = this._adapter,
            timeOpts = this.options.time
        return timeOpts.tooltipFormat
            ? adapter.format(value, timeOpts.tooltipFormat)
            : adapter.format(value, timeOpts.displayFormats.datetime)
    }
    _tickFormatFunction(time, index2, ticks, format) {
        let options = this.options,
            formats = options.time.displayFormats,
            unit = this._unit,
            majorUnit = this._majorUnit,
            minorFormat = unit && formats[unit],
            majorFormat = majorUnit && formats[majorUnit],
            tick = ticks[index2],
            major = majorUnit && majorFormat && tick && tick.major,
            label = this._adapter.format(
                time,
                format || (major ? majorFormat : minorFormat),
            ),
            formatter = options.ticks.callback
        return formatter
            ? callback(formatter, [label, index2, ticks], this)
            : label
    }
    generateTickLabels(ticks) {
        let i, ilen, tick
        for (i = 0, ilen = ticks.length; i < ilen; ++i)
            (tick = ticks[i]),
                (tick.label = this._tickFormatFunction(tick.value, i, ticks))
    }
    getDecimalForValue(value) {
        return value === null ? NaN : (value - this.min) / (this.max - this.min)
    }
    getPixelForValue(value) {
        let offsets = this._offsets,
            pos = this.getDecimalForValue(value)
        return this.getPixelForDecimal((offsets.start + pos) * offsets.factor)
    }
    getValueForPixel(pixel) {
        let offsets = this._offsets,
            pos = this.getDecimalForPixel(pixel) / offsets.factor - offsets.end
        return this.min + pos * (this.max - this.min)
    }
    _getLabelSize(label) {
        let ticksOpts = this.options.ticks,
            tickLabelWidth = this.ctx.measureText(label).width,
            angle = toRadians(
                this.isHorizontal()
                    ? ticksOpts.maxRotation
                    : ticksOpts.minRotation,
            ),
            cosRotation = Math.cos(angle),
            sinRotation = Math.sin(angle),
            tickFontSize = this._resolveTickFontOptions(0).size
        return {
            w: tickLabelWidth * cosRotation + tickFontSize * sinRotation,
            h: tickLabelWidth * sinRotation + tickFontSize * cosRotation,
        }
    }
    _getLabelCapacity(exampleTime) {
        let timeOpts = this.options.time,
            displayFormats = timeOpts.displayFormats,
            format =
                displayFormats[timeOpts.unit] || displayFormats.millisecond,
            exampleLabel = this._tickFormatFunction(
                exampleTime,
                0,
                ticksFromTimestamps(this, [exampleTime], this._majorUnit),
                format,
            ),
            size = this._getLabelSize(exampleLabel),
            capacity =
                Math.floor(
                    this.isHorizontal()
                        ? this.width / size.w
                        : this.height / size.h,
                ) - 1
        return capacity > 0 ? capacity : 1
    }
    getDataTimestamps() {
        let timestamps = this._cache.data || [],
            i,
            ilen
        if (timestamps.length) return timestamps
        let metas = this.getMatchingVisibleMetas()
        if (this._normalized && metas.length)
            return (this._cache.data =
                metas[0].controller.getAllParsedValues(this))
        for (i = 0, ilen = metas.length; i < ilen; ++i)
            timestamps = timestamps.concat(
                metas[i].controller.getAllParsedValues(this),
            )
        return (this._cache.data = this.normalize(timestamps))
    }
    getLabelTimestamps() {
        let timestamps = this._cache.labels || [],
            i,
            ilen
        if (timestamps.length) return timestamps
        let labels = this.getLabels()
        for (i = 0, ilen = labels.length; i < ilen; ++i)
            timestamps.push(parse(this, labels[i]))
        return (this._cache.labels = this._normalized
            ? timestamps
            : this.normalize(timestamps))
    }
    normalize(values) {
        return _arrayUnique(values.sort(sorter))
    }
}
TimeScale.id = 'time'
TimeScale.defaults = {
    bounds: 'data',
    adapters: {},
    time: {
        parser: !1,
        unit: !1,
        round: !1,
        isoWeekday: !1,
        minUnit: 'millisecond',
        displayFormats: {},
    },
    ticks: { source: 'auto', major: { enabled: !1 } },
}
function interpolate2(table, val, reverse) {
    let lo = 0,
        hi = table.length - 1,
        prevSource,
        nextSource,
        prevTarget,
        nextTarget
    reverse
        ? (val >= table[lo].pos &&
              val <= table[hi].pos &&
              ({ lo, hi } = _lookupByKey(table, 'pos', val)),
          ({ pos: prevSource, time: prevTarget } = table[lo]),
          ({ pos: nextSource, time: nextTarget } = table[hi]))
        : (val >= table[lo].time &&
              val <= table[hi].time &&
              ({ lo, hi } = _lookupByKey(table, 'time', val)),
          ({ time: prevSource, pos: prevTarget } = table[lo]),
          ({ time: nextSource, pos: nextTarget } = table[hi]))
    let span = nextSource - prevSource
    return span
        ? prevTarget + ((nextTarget - prevTarget) * (val - prevSource)) / span
        : prevTarget
}
var TimeSeriesScale = class extends TimeScale {
    constructor(props) {
        super(props)
        ;(this._table = []),
            (this._minPos = void 0),
            (this._tableRange = void 0)
    }
    initOffsets() {
        let timestamps = this._getTimestampsForTable(),
            table = (this._table = this.buildLookupTable(timestamps))
        ;(this._minPos = interpolate2(table, this.min)),
            (this._tableRange = interpolate2(table, this.max) - this._minPos),
            super.initOffsets(timestamps)
    }
    buildLookupTable(timestamps) {
        let { min, max } = this,
            items = [],
            table = [],
            i,
            ilen,
            prev,
            curr,
            next
        for (i = 0, ilen = timestamps.length; i < ilen; ++i)
            (curr = timestamps[i]),
                curr >= min && curr <= max && items.push(curr)
        if (items.length < 2)
            return [
                { time: min, pos: 0 },
                { time: max, pos: 1 },
            ]
        for (i = 0, ilen = items.length; i < ilen; ++i)
            (next = items[i + 1]),
                (prev = items[i - 1]),
                (curr = items[i]),
                Math.round((next + prev) / 2) !== curr &&
                    table.push({ time: curr, pos: i / (ilen - 1) })
        return table
    }
    _getTimestampsForTable() {
        let timestamps = this._cache.all || []
        if (timestamps.length) return timestamps
        let data = this.getDataTimestamps(),
            label = this.getLabelTimestamps()
        return (
            data.length && label.length
                ? (timestamps = this.normalize(data.concat(label)))
                : (timestamps = data.length ? data : label),
            (timestamps = this._cache.all = timestamps),
            timestamps
        )
    }
    getDecimalForValue(value) {
        return (
            (interpolate2(this._table, value) - this._minPos) / this._tableRange
        )
    }
    getValueForPixel(pixel) {
        let offsets = this._offsets,
            decimal =
                this.getDecimalForPixel(pixel) / offsets.factor - offsets.end
        return interpolate2(
            this._table,
            decimal * this._tableRange + this._minPos,
            !0,
        )
    }
}
TimeSeriesScale.id = 'timeseries'
TimeSeriesScale.defaults = TimeScale.defaults
var scales = Object.freeze({
        __proto__: null,
        CategoryScale,
        LinearScale,
        LogarithmicScale,
        RadialLinearScale,
        TimeScale,
        TimeSeriesScale,
    }),
    registerables = [controllers, elements, plugins, scales]
Chart.register(...registerables)
var auto_default = Chart
auto_default.defaults.font.family = 'var(--filament-widgets-chart-font-family)'
auto_default.defaults.color = '#6b7280'
function chart({ cachedData, options, type }) {
    return {
        chart: null,
        init: function () {
            let chart2 = this.initChart()
            this.$wire.on('updateChartData', async ({ data }) => {
                ;(chart2.data = this.applyColorToData(data)),
                    chart2.update('resize')
            }),
                this.$wire.on('filterChartData', async ({ data }) => {
                    chart2.destroy(), (chart2 = this.initChart(data))
                })
        },
        initChart: function (data = null) {
            return (this.chart = new auto_default(this.$refs.canvas, {
                type,
                data: this.applyColorToData(data ?? cachedData),
                options: options ?? {},
            }))
        },
        applyColorToData: function (data) {
            return (
                data.datasets.forEach((dataset, datasetIndex) => {
                    dataset.backgroundColor ||
                        (data.datasets[datasetIndex].backgroundColor =
                            getComputedStyle(
                                this.$refs.backgroundColorElement,
                            ).color),
                        dataset.borderColor ||
                            (data.datasets[datasetIndex].borderColor =
                                getComputedStyle(
                                    this.$refs.borderColorElement,
                                ).color)
                }),
                data
            )
        },
    }
}
export { chart as default }
/*!
 * @kurkle/color v0.2.1
 * https://github.com/kurkle/color#readme
 * (c) 2022 Jukka Kurkela
 * Released under the MIT License
 */
/*!
 * Chart.js v3.9.1
 * https://www.chartjs.org
 * (c) 2022 Chart.js Contributors
 * Released under the MIT License
 */

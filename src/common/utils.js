/**
 * Created by Win on 19/07/29.
 */
// 判断是否是IE浏览器
export function isIE () {
  let userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
  let isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 // 判断是否IE<11浏览器
  let isEdge = userAgent.indexOf('Edge') > -1 && !isIE // 判断是否IE的Edge浏览器
  let isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
  if (isIE) {
    let reIE = new RegExp('MSIE (\\d+\\.\\d+);')
    reIE.test(userAgent)
    let fIEVersion = parseFloat(RegExp['$1'])
    if (fIEVersion === 7) {
      return 7
    } else if (fIEVersion === 8) {
      return 8
    } else if (fIEVersion === 9) {
      return 9
    } else if (fIEVersion === 10) {
      return 10
    } else {
      return 6 // IE版本<=7
    }
  } else if (isEdge) {
    return 'edge' // edge
  } else if (isIE11) {
    return 11 // IE11
  } else {
    return -1 // 不是ie浏览器
  }
}
// 时间戳转化为年 月 日
export function getLocalTime (nS) {
  // 将时间戳（十三位时间搓，也就是带毫秒的时间搓）转换成时间格式
  // d.cTime = 1539083829787
  let date = new Date(nS)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  // eslint-disable-next-line no-unused-vars
  let h = date.getHours()
  // eslint-disable-next-line no-unused-vars
  let minute = date.getMinutes()
  // eslint-disable-next-line no-unused-vars
  let second = date.getSeconds()
  month = month < 10 ? '0' + month : month
  day = day < 10 ? '0' + day : day
  h = h < 10 ? ('0' + h) : h
  minute = minute < 10 ? ('0' + minute) : minute
  second = second < 10 ? ('0' + second) : second
  date = year + '-' + month + '-' + day + ' ' + h + ':' + minute + ':' + second
  return date
}
export function cleanArray (actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}
// 获取当前时间，格式YYYY-MM-DD
export function getNowFormatDate () {
  var date = new Date()
  var seperator1 = '-'
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate
  return currentdate
}
/**
 * @desc 获取url参数
 * @param {String} name  想要获取的参数名字
 */
export function getUlrParams (name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg)
  if ( r != null ){
    return decodeURI(r[2])
  } else {
    return null
  }
}

/**
 * 防抖
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce (func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * 简单的深度拷贝
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone (source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

export function uniqueArr (arr) {
  return Array.from(new Set(arr))
}

/**
 * 检查元素是否有类
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass (ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}
/**
 * 向元素添加类
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass (ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * 从元素中删除类
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass (ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}
/**
 * 算法密码加密
 * @param {string} string
 * @return {string}
 */
export function Encryptor (string) {
  function md5RotateLeft (lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits))
  }

  function md5AddUnsigned (lX, lY) {
    var lX4, lY4, lX8, lY8, lResult
    lX8 = (lX & 2147483648)
    lY8 = (lY & 2147483648)
    lX4 = (lX & 1073741824)
    lY4 = (lY & 1073741824)
    lResult = (lX & 1073741823) + (lY & 1073741823)
    if (lX4 & lY4) {
      return (lResult ^ 2147483648 ^ lX8 ^ lY8)
    }
    if (lX4 | lY4) {
      if (lResult & 1073741824) {
        return (lResult ^ 3221225472 ^ lX8 ^ lY8)
      } else {
        return (lResult ^ 1073741824 ^ lX8 ^ lY8)
      }
    } else {
      return (lResult ^ lX8 ^ lY8)
    }
  }

  function md5F (x, y, z) {
    return (x & y) | ((~x) & z)
  }

  function md5G (x, y, z) {
    return (x & z) | (y & (~z))
  }

  function md5H (x, y, z) {
    return (x ^ y ^ z)
  }

  function md5I (x, y, z) {
    return (y ^ (x | (~z)))
  }

  function md5FF (a, b, c, d, x, s, ac) {
    a = md5AddUnsigned(a, md5AddUnsigned(md5AddUnsigned(md5F(b, c, d), x), ac))
    return md5AddUnsigned(md5RotateLeft(a, s), b)
  }

  function md5GG (a, b, c, d, x, s, ac) {
    a = md5AddUnsigned(a, md5AddUnsigned(md5AddUnsigned(md5G(b, c, d), x), ac))
    return md5AddUnsigned(md5RotateLeft(a, s), b)
  }

  function md5HH (a, b, c, d, x, s, ac) {
    a = md5AddUnsigned(a, md5AddUnsigned(md5AddUnsigned(md5H(b, c, d), x), ac))
    return md5AddUnsigned(md5RotateLeft(a, s), b)
  }

  function md5II (a, b, c, d, x, s, ac) {
    a = md5AddUnsigned(a, md5AddUnsigned(md5AddUnsigned(md5I(b, c, d), x), ac))
    return md5AddUnsigned(md5RotateLeft(a, s), b)
  }

  function md5ConvertToWordArray (string) {
    var lWordCount
    var lMessageLength = string.length
    var lNumberOfWordsTemp1 = lMessageLength + 8
    var lNumberOfWordsTemp2 = (lNumberOfWordsTemp1 - (lNumberOfWordsTemp1 % 64)) / 64
    var lNumberOfWords = (lNumberOfWordsTemp2 + 1) * 16
    var lWordArray = Array(lNumberOfWords - 1)
    var lBytePosition = 0
    var lByteCount = 0
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4
      lBytePosition = (lByteCount % 4) * 8
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition))
      lByteCount++
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4
    lBytePosition = (lByteCount % 4) * 8
    lWordArray[lWordCount] = lWordArray[lWordCount] | (128 << lBytePosition)
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29
    return lWordArray
  }

  function md5WordToHex (lValue) {
    var WordToHexValue = ''; var WordToHexValueTemp = ''; var lByte; var lCount
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255
      WordToHexValueTemp = '0' + lByte.toString(16)
      WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2)
    }
    return WordToHexValue
  }

  function md5Utf8Encode (string) {
    string = string.replace(/\r\n/g, '\n')
    var utfText = ''
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n)
      if (c < 128) {
        utfText += String.fromCharCode(c)
      } else {
        if ((c > 127) && (c < 2048)) {
          utfText += String.fromCharCode((c >> 6) | 192)
          utfText += String.fromCharCode((c & 63) | 128)
        } else {
          utfText += String.fromCharCode((c >> 12) | 224)
          utfText += String.fromCharCode(((c >> 6) & 63) | 128)
          utfText += String.fromCharCode((c & 63) | 128)
        }
      }
    }
    return utfText
  }

  // eslint-disable-next-line no-array-constructor
  var x = Array()
  var k, AA, BB, CC, DD, a, b, c, d
  var S11 = 7; var S12 = 12; var S13 = 17; var S14 = 22
  var S21 = 5; var S22 = 9; var S23 = 14; var S24 = 20
  var S31 = 4; var S32 = 11; var S33 = 16; var S34 = 23
  var S41 = 6; var S42 = 10; var S43 = 15; var S44 = 21
  string = md5Utf8Encode(string)
  x = md5ConvertToWordArray(string)
  a = 1732584193
  b = 4023233417
  c = 2562383102
  d = 271733878
  for (k = 0; k < x.length; k += 16) {
    AA = a
    BB = b
    CC = c
    DD = d
    a = md5FF(a, b, c, d, x[k + 0], S11, 3614090360)
    d = md5FF(d, a, b, c, x[k + 1], S12, 3905402710)
    c = md5FF(c, d, a, b, x[k + 2], S13, 606105819)
    b = md5FF(b, c, d, a, x[k + 3], S14, 3250441966)
    a = md5FF(a, b, c, d, x[k + 4], S11, 4118548399)
    d = md5FF(d, a, b, c, x[k + 5], S12, 1200080426)
    c = md5FF(c, d, a, b, x[k + 6], S13, 2821735955)
    b = md5FF(b, c, d, a, x[k + 7], S14, 4249261313)
    a = md5FF(a, b, c, d, x[k + 8], S11, 1770035416)
    d = md5FF(d, a, b, c, x[k + 9], S12, 2336552879)
    c = md5FF(c, d, a, b, x[k + 10], S13, 4294925233)
    b = md5FF(b, c, d, a, x[k + 11], S14, 2304563134)
    a = md5FF(a, b, c, d, x[k + 12], S11, 1804603682)
    d = md5FF(d, a, b, c, x[k + 13], S12, 4254626195)
    c = md5FF(c, d, a, b, x[k + 14], S13, 2792965006)
    b = md5FF(b, c, d, a, x[k + 15], S14, 1236535329)
    a = md5GG(a, b, c, d, x[k + 1], S21, 4129170786)
    d = md5GG(d, a, b, c, x[k + 6], S22, 3225465664)
    c = md5GG(c, d, a, b, x[k + 11], S23, 643717713)
    b = md5GG(b, c, d, a, x[k + 0], S24, 3921069994)
    a = md5GG(a, b, c, d, x[k + 5], S21, 3593408605)
    d = md5GG(d, a, b, c, x[k + 10], S22, 38016083)
    c = md5GG(c, d, a, b, x[k + 15], S23, 3634488961)
    b = md5GG(b, c, d, a, x[k + 4], S24, 3889429448)
    a = md5GG(a, b, c, d, x[k + 9], S21, 568446438)
    d = md5GG(d, a, b, c, x[k + 14], S22, 3275163606)
    c = md5GG(c, d, a, b, x[k + 3], S23, 4107603335)
    b = md5GG(b, c, d, a, x[k + 8], S24, 1163531501)
    a = md5GG(a, b, c, d, x[k + 13], S21, 2850285829)
    d = md5GG(d, a, b, c, x[k + 2], S22, 4243563512)
    c = md5GG(c, d, a, b, x[k + 7], S23, 1735328473)
    b = md5GG(b, c, d, a, x[k + 12], S24, 2368359562)
    a = md5HH(a, b, c, d, x[k + 5], S31, 4294588738)
    d = md5HH(d, a, b, c, x[k + 8], S32, 2272392833)
    c = md5HH(c, d, a, b, x[k + 11], S33, 1839030562)
    b = md5HH(b, c, d, a, x[k + 14], S34, 4259657740)
    a = md5HH(a, b, c, d, x[k + 1], S31, 2763975236)
    d = md5HH(d, a, b, c, x[k + 4], S32, 1272893353)
    c = md5HH(c, d, a, b, x[k + 7], S33, 4139469664)
    b = md5HH(b, c, d, a, x[k + 10], S34, 3200236656)
    a = md5HH(a, b, c, d, x[k + 13], S31, 681279174)
    d = md5HH(d, a, b, c, x[k + 0], S32, 3936430074)
    c = md5HH(c, d, a, b, x[k + 3], S33, 3572445317)
    b = md5HH(b, c, d, a, x[k + 6], S34, 76029189)
    a = md5HH(a, b, c, d, x[k + 9], S31, 3654602809)
    d = md5HH(d, a, b, c, x[k + 12], S32, 3873151461)
    c = md5HH(c, d, a, b, x[k + 15], S33, 530742520)
    b = md5HH(b, c, d, a, x[k + 2], S34, 3299628645)
    a = md5II(a, b, c, d, x[k + 0], S41, 4096336452)
    d = md5II(d, a, b, c, x[k + 7], S42, 1126891415)
    c = md5II(c, d, a, b, x[k + 14], S43, 2878612391)
    b = md5II(b, c, d, a, x[k + 5], S44, 4237533241)
    a = md5II(a, b, c, d, x[k + 12], S41, 1700485571)
    d = md5II(d, a, b, c, x[k + 3], S42, 2399980690)
    c = md5II(c, d, a, b, x[k + 10], S43, 4293915773)
    b = md5II(b, c, d, a, x[k + 1], S44, 2240044497)
    a = md5II(a, b, c, d, x[k + 8], S41, 1873313359)
    d = md5II(d, a, b, c, x[k + 15], S42, 4264355552)
    c = md5II(c, d, a, b, x[k + 6], S43, 2734768916)
    b = md5II(b, c, d, a, x[k + 13], S44, 1309151649)
    a = md5II(a, b, c, d, x[k + 4], S41, 4149444226)
    d = md5II(d, a, b, c, x[k + 11], S42, 3174756917)
    c = md5II(c, d, a, b, x[k + 2], S43, 718787259)
    b = md5II(b, c, d, a, x[k + 9], S44, 3951481745)
    a = md5AddUnsigned(a, AA)
    b = md5AddUnsigned(b, BB)
    c = md5AddUnsigned(c, CC)
    d = md5AddUnsigned(d, DD)
  }
  return (md5WordToHex(a) + md5WordToHex(b) + md5WordToHex(c) + md5WordToHex(d)).toLocaleUpperCase()
}

/**
 * 浮点数加法运算 arg1+arg2
 * @param {number} arg1
 * @param {number} arg2
 * @return {number}
 */
export function FloatAdd (arg1, arg2) {
  var r1, r2, m
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return FloatDiv((FloatMul(arg1, m) + FloatMul(arg2, m)), m)
}

/**
 * 浮点数减法运算 arg1-arg2
 * @param {number} arg1
 * @param {number} arg2
 * @return {number}
 */
export function FloatSub (arg1, arg2) {
  var r1, r2, m, n
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  // 动态控制精度长度
  n = (r1 >= r2) ? r1 : r2
  return (FloatDiv((FloatMul(arg1, m) - FloatMul(arg2, m)), m)).toFixed(n)
}

/**
 * 浮点数乘法运算 arg1*arg2
 * @param {number} arg1
 * @param {number} arg2
 * @return {number}
 */
export function FloatMul (arg1, arg2) {
  var m = 0; var s1 = arg1.toString(); var s2 = arg2.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) {
  }
  try {
    m += s2.split('.')[1].length
  } catch (e) {
  }
  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
}

/**
 * 浮点数除法运算 arg1/arg2
 * @param {number} arg1
 * @param {number} arg2
 * @return {number}
 */
export function FloatDiv (arg1, arg2) {
  var t1 = 0; var t2 = 0; var r1; var r2
  try {
    t1 = arg1.toString().split('.')[1].length
  } catch (e) {
  }
  try {
    t2 = arg2.toString().split('.')[1].length
  } catch (e) {
  }
  r1 = Number(arg1.toString().replace('.', ''))
  r2 = Number(arg2.toString().replace('.', ''))
  return (r1 / r2) * Math.pow(10, t2 - t1)
}

/**
 * 精确浮点数位数（默认两位）
 * @param {number} val:待处理的数字
 * @param {number} pos：精确位数，default 2
 */
export function ToFixed (val, pos) {
  var p = pos || 2
  var mul = FloatMul(Number(val), Math.pow(10, p))
  return FloatDiv(Math.round(mul), Math.pow(10, p))
}

/**
 * 求数组对象中数字的和
 * @param {array} arry:为数组，数组中装的是对象
 * @param {string} attr：为对象的属性
 */
export function getSumArryObj (arry, attr) {
  var sum = 0
  for (var i in arry) {
    sum += arry[i][attr]
  }
  return ToFixed(sum, 2)
}
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal (path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL (url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/* 小写字母 */
export function validateLowerCase (str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母 */
export function validateUpperCase (str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母 */
export function validateAlphabets (str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}
/* 判断网络响应状态是否成功 */
export function isStatusSucces (status) {
  if (typeof (status) !== 'number') {
    return false
  }
  return (status >= 200 && status < 300)
}
/**/
export function downloadFile (data, fileName) {
  if (!data || !fileName) {
    console.log('下载数据解析失败，或者文件名为空')
    return
  }
  // 兼容IE浏览器
  let csvData = new Blob([data], { type: 'text/csv' })
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(csvData, fileName)
  } else {
    // 其他
    // new Blob([data],{type: ''}), 'application/zip' 'application/xlsx' ,类型未知传''
    // 转化文件类型最终以fileName后缀为准 所以blod类型可以不传
    let url = window.URL.createObjectURL(new Blob([data]))
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
  }
}
export function postExcelFile (params, url) { // params是post请求需要的参数
  var form = document.createElement('form')
  form.style.display = 'none'
  form.action = url
  form.method = 'post'
  document.body.appendChild(form)

  for (var key in params) {
    var input = document.createElement('input')
    input.type = 'hidden'
    input.name = key
    input.value = params[key]
    form.appendChild(input)
  }

  form.submit()
  form.remove()
}

// 表单校验部分
/**
 * currency: /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/, // 金额
    mobileNo: /^1[3456789]\d{9}$/, // 最新手机号
    phone: /^1(3\d|5\d|8\d|4[57]|7\d|9\d)\d{8}$/, // 手机号
    company: /^[\u4E00-\u9FA5a-zA-Z][\u4E00-\u9FA5a-zA-Z0-9\s-,-.]*$/,
    uName: /^[\u4E00-\u9FA5a-zA-Z][\u4E00-\u9FA5a-zA-Z0-9_]*$/,
    zh: /^[\u4e00-\u9fa5]+$/, // 纯中文
    card: /^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12])|91)\d{4}(((((19|20)((\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(\d{2}(0[13578]|1[02])31)|(\d{2}02(0[1-9]|1\d|2[0-8]))|(([13579][26]|[2468][048]|0[48])0229)))|20000229)\d{3}(\d|X|x))|(((\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(\d{2}(0[13578]|1[02])31)|(\d{2}02(0[1-9]|1\d|2[0-8]))|(([13579][26]|[2468][048]|0[48])0229))\d{3}))$/, // 身份证号
    int: /^[0-9]*$/,
    email: /^([a-z0-9A-Z]+[-|._]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/,
    socialCreditCode: /^[0-9A-Z]{18}$/, // 社会统一信用代码
    businessLicence: /^(\d{13}|\d{15})$/, // 营业执照号码
    organizationCode: /^([0-9A-Z]{8}-([0-9]|X))$/, // 组织机构代码证号码
    realName: /^([\u4E00-\u9FA5|a-zA-Z| ])+$/, // 中文或字母
    password: /^((?![a-z]+$)(?![A-Z]+$)(?!\d+$)(?!\W_+$)\S{6,20})$/, // 密码6-20位，至少两种字符
    acctNo: /^\d{4,32}$/, // 银行账号，最多32位
    entName: /^([\u4E00-\u9FA5a-zａ-ｚA-ZＡ-Ｚ0-9０-９()（）]{1,100})$/, // 企业名称或者推荐企业名称，中文字母数字括号,1-100位
    phoneOrTel: /^((((0\d{2,3}-?)?\d{7,8})|\d{10})|(1(3\d|5\d|8\d|4[57]|7\d|9\d)\d{8}))$/
 */
export function isCurrency (rule, value, callback) {
  const reg = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/
  if (!reg.test(value)) {
    callback(new Error('请输入最多保留两位小数格式的金额'))
  } else {
    callback()
  }
}

export function isMobileNo (rule, value, callback) {
  const reg = /^1[3456789]\d{9}$/
  if (!reg.test(value)) {
    callback(new Error('请输入正确格式的手机号'))
  } else {
    callback()
  }
}

export function isEmail (rule, value, callback) {
  const reg = /^([a-z0-9A-Z]+[-|._]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/
  if (!reg.test(value)) {
    callback(new Error('请输入正确格式的邮箱'))
  } else {
    callback()
  }
}
export function isCompany (rule, value, callback) {
  const reg = /^[\u4E00-\u9FA5a-zA-Z][\u4E00-\u9FA5a-zA-Z0-9\s-,-.]*$/
  if (!reg.test(value)) {
    callback(new Error('请输入正确格式的企业名'))
  } else {
    callback()
  }
}
export function idCard (rule, value, callback) {
  const reg = /^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12])|91)\d{4}(((((19|20)((\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(\d{2}(0[13578]|1[02])31)|(\d{2}02(0[1-9]|1\d|2[0-8]))|(([13579][26]|[2468][048]|0[48])0229)))|20000229)\d{3}(\d|X|x))|(((\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(\d{2}(0[13578]|1[02])31)|(\d{2}02(0[1-9]|1\d|2[0-8]))|(([13579][26]|[2468][048]|0[48])0229))\d{3}))$/
  if (!reg.test(value)) {
    callback(new Error('请输入正确格式的证件号'))
  } else {
    callback()
  }
}
export function isRealName (rule, value, callback) {
  const reg = /^([\u4E00-\u9FA5|a-zA-Z| ])+$/
  if (!reg.test(value)) {
    callback(new Error('请输入中英文组成的名称'))
  } else {
    callback()
  }
}

export function isAcctNo (rule, value, callback) {
  const reg = /^\d{4,32}$/
  if (!reg.test(value)) {
    callback(new Error('请输入正确格式的银行账号'))
  } else {
    callback()
  }
}

export function isInt (rule, value, callback) {
  const reg = /^0|[1-9][0-9]*$/
  if (!reg.test(value)) {
    callback(new Error('请输入非负整数'))
  } else {
    callback()
  }
}

export function isPositiveInt (rule, value, callback) {
  const reg = /^[1-9][0-9]*$/
  if (!reg.test(value)) {
    callback(new Error('请输入正整数'))
  } else {
    callback()
  }
}

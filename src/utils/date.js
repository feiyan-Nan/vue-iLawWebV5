const dateUtil = {
  format,
  toCDB,
  padStartPolyfill,
  autoFillTime
}

function format (input) {
  // 转为半角
  let res = toCDB(input)
  // 字符串长度等于2时补充 ':'
  let length = res.length
  // 将非数字和冒号替换
  res = res.replace(/[^\d|^:]/g, '0')
  switch (length) {
    case 0: break
    case 1: break
    case 2: {
      if (input.includes(':')) {
        res = `0${res}`
      } else {
        res = res < 24 ? res : '00'
      }
      break
    }
    case 3: {
      if (!input.includes(':')) {
        res = `${res.substr(0, 2)}:${res.substr(2, 2)}`
      }
      break
    }
    case 4: {
      if (!input.includes(':')) {
        res = format(`${res.substr(0, 2)}:${res.substr(2, 2)}`)
      } else {
        res = `${lessThanNum(res.split(':')[0], 24)}:${lessThanNum(res.split(':')[1], 60)}`
      }
      break
    }
    case 5: {
      if (!input.includes(':')) {
        res = format(`${res.substr(0, 2)}:${res.substr(2, 2)}`)
      } else {
        res = `${padStartPolyfill(lessThanNum(res.split(':')[0], 24))}:${padStartPolyfill(lessThanNum(res.split(':')[1], 60))}`
      }
      break
    }
    default: {
      if (!input.includes(':')) {
        res = format(`${res.substr(0, 2)}:${res.substr(2, 2)}`)
      } else {
        res = `${padStartPolyfill(lessThanNum(res.split(':')[0].substr(0, 2), 24))}:${padStartPolyfill(lessThanNum(res.split(':')[1].substr(0, 2), 60))}`
      }
      break
    }
  }
  return res
}
function lessThanNum (time, num) {
  return time < num ? time : '00'
}
function toCDB (str) {
  let tmp = ''
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) === 12288) {
      tmp += String.fromCharCode(str.charCodeAt(i) - 12256)
      continue
    }
    if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
      tmp += String.fromCharCode(str.charCodeAt(i) - 65248)
    } else {
      tmp += String.fromCharCode(str.charCodeAt(i))
    }
  }
  return tmp
}
function padStartPolyfill (text, length, padContent) {
  let padString = ''
  if (typeof text === 'string') {
    if (String.prototype.padStart) {
      return text.padStart(length, padContent)
    } else {
      let diff = Math.max(length - text.length, 0)
      if (diff) {
        for (let i = 0; i < diff; i++) {
          padString += padContent
        }
        return padString + text
      } else {
        return text
      }
    }
  } else if (!text) {
    for (let i = 0; i < length; i++) {
      padString += padContent
    }
    return padString
  } else {
    throw new Error('padStartPolyfill can not pad without String')
  }
}
// 失焦之后自动填充时间
function autoFillTime (input) {
  // 清空时不自动填充
  if (input) {
    if (input.includes(':')) {
      let arr = input.split(':')
      return `${padStartPolyfill(arr[0], 2, 0)}:${padStartPolyfill(arr[1], 2, 0)}`
    } else {
      return `${padStartPolyfill(input, 2, 0)}:00`
    }
  }
  return input || '00:00'
}
export default dateUtil

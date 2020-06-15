import DateUtil from '@/utils/date'
const MAX_MINUTE = 60
export default {

  clearInvalidInput: function (input) {
    input = DateUtil.toCDB(input)
    if (input.includes(':')) {
      let hh = input.split(':')[0]
      let mm = input.split(':')[1].substr(0, 2)
      hh = hh.replace(/\D/g, '0')
      mm = mm.replace(/\D/g, '0')
      hh = DateUtil.padStartPolyfill(hh, 2, '0')
      mm = mm < MAX_MINUTE ? mm : '00'
      input = hh + ':' + mm
    } else {
      input = input.replace(/\D/g, '0')
      if (input.length === 3) {
        input = input.substr(0, 2) + ':' + input.substr(2)
      }
    }
    return input
  },
  /**
   * 和format方法的区别，时长可以超过24小时，输入过程中不会自动补充
   * 失去焦点format，获得焦点时显示原值
   * @param input
   */
  formatForDuration: function (input) {
    let originalInput = ''
    if (input) {
      input = DateUtil.toCDB(input)
      if (input.includes(':')) {
        let hh = input.split(':')[0]
        let mm = input.split(':')[1]
        hh = hh.replace(/\D/g, '0')
        mm = mm.replace(/\D/g, '0').substr(0, 2)
        hh = hh.length > 2 ? hh.replace(/^0+/g, '') : hh
        hh = DateUtil.padStartPolyfill(hh, 2, '0')
        mm = DateUtil.padStartPolyfill(mm, 2, '0')
        mm = mm < MAX_MINUTE ? mm : '00'
        originalInput = hh + ':' + mm

        let numberhh = Number(hh.replace(/\D/g, '0'))
        hh = numberhh === 0 ? '00' : hh
        input = hh > 999 ? '999:59+' : (hh + ':' + mm)
      } else {
        input = input.replace(/\D/g, '0')
        input = input.length > 2 ? input.replace(/^0+/g, '') : input
        input = DateUtil.padStartPolyfill(input, 2, '0')
        originalInput = input + ':00'
      }
    }
    return originalInput
  }
}
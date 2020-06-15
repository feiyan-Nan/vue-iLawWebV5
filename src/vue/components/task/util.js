import { DEFAULT_RULES, CUSTOM_RULE_UNIT, WEEK_LIST, END_RULES } from '@/utils/constants'
/**
 * 获取重复描述信息
 * @param {*} repeatRule
 * @param {*} customRepeatRule
 * @param {*} dayIndexList
 */
function getRepeatRuleDesc (repeatRule, customRepeatRule, dayIndexList) {
  let res = ''
  if (repeatRule === 'custom') {
    if (customRepeatRule) {
      let arr = customRepeatRule.split('-')
      let num = arr[0] || ''
      let unit = CUSTOM_RULE_UNIT[arr[1]].label || ''
      res = '每' + ' ' + num + ' ' + unit
      let tmp = []
      if (dayIndexList) {
        dayIndexList.sort().forEach(function (i) {
          tmp.push(Object.values(WEEK_LIST)[i - 1].label)
        })
      }
      res = res + tmp.join('、')
    }
  } else {
    res = DEFAULT_RULES[repeatRule].label
  }
  return res
}
/**
 * 获取重复结束规则描述
 * @param {*} repeatData 重复数据
 */
function getRepeatEndRuleDesc (repeatData) {
  let res = ''
  // 根据选择的repeatRule判断显示的字符串内容
  switch (repeatData.endType) {
    case END_RULES.unlimited.value:
      res = '无限重复'
      break
    case END_RULES.end_by_day.value:
      res = `至${moment(repeatData.endByDate).format('YYYY-MM-DD')} 停止重复`
      break
    case END_RULES.end_by_times.value:
      res = `重复${repeatData.endByTimes}次 停止重复`
      break
    default:
      res = ''
      break
  }
  return res
}
/**
 * 获取用户自定义提醒描述
 * @param {*} timeStr 用户自定义提醒
 */
function getCustomTimeDesc (timeStr) {
  let format = 'YYYY-MM-DD (HH:mm)'
  let res = ''
  if (Number(timeStr.substring(0, 4)) === new Date().getFullYear()) {
    format = 'MM-DD (HH:mm)'
    res = moment(timeStr).format(format).replace('-', '月').replace(' ', '日')
  } else {
    res = moment(timeStr).format(format).replace('-', '年').replace('-', '月').replace(' ', '日')
  }
  return res
}
/**
 * 检查任务时间组是否发生了改变
 * @param {*} after 变化后数据
 * @param {*} before 变化前数据
 */
function checkTaskTimeChange (after, before) {
  return {
    isTimeSame: checkChange(after.time, before),
    isRepeatSame: checkChange(after.repeat, before.repeatSetting),
    isRemindSame: checkChange(after.remind, before.remindSetting)
  }
}
function checkChange (after, before) {
  let res = true
  for (let key in after) {
    if (Array.isArray(after[key]) && Array.isArray(before[key])) {
      res = after[key].sort().toString() === before[key].sort().toString()
    } else {
      res = after[key] === before[key]
    }
    if (!res) {
      break
    }
  }
  return res
}
export default {
  getRepeatRuleDesc,
  getRepeatEndRuleDesc,
  getCustomTimeDesc,
  checkTaskTimeChange
}
import solarLunar from 'solarlunar'

const calendarUtil = {
  createMonthCalendar,
  getCnMonth,
  getCnWeek,
  getFullCnWeek
}
// 将周一设为一周的第一天
moment.locale('cn', {
  weekdaysMin: '一_二_三_四_五_六_日'.split('_'),
  week: {
    dow: 1
  }
})
/**
 * 获取当月视图
 * @param {格式要求：YYYY-MM} startDate
 */
function createMonthCalendar (startDate) {
  let startMoment = startDate ? moment(startDate, 'YYYY-MM') : moment()
  let firstDayOfMonth = startMoment.startOf('month')
  let firstDay = firstDayOfMonth.startOf('week')
  // 日历有7天X6周天
  const DAYS_COUNT = 7 * 6
  let days = []
  let day
  for (let i = 0; i < DAYS_COUNT; i++, firstDay = firstDay.add(1, 'days')) {
    day = solarLunar.solar2lunar(firstDay.get('year'), firstDay.get('month') + 1, firstDay.get('date'))
    day = day === -1 ? {cDay: firstDay.get('date'), cMonth: firstDay.get('month') + 1, cYear: firstDay.get('year')} : day
    day.format = firstDay.format('YYYY-MM-DD')
    day.millisecond = firstDay.valueOf()
    days.push(day)
  }
  return days
}
function getCnMonth () {
  return [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ]
}
function getCnWeek () {
  return moment.weekdaysMin()
}
function getFullCnWeek () {
  let weekdays = getCnWeek().map(item => '周' + item)
  return weekdays
}
export default calendarUtil

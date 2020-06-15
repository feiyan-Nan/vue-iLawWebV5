<template lang="pug">
.calendar__month
    month-header
    div(@dragover="dropover" @drop="drop")
      .calendar__month-main()
        card(v-for="(day,index) in days" :key="index" :item="day" :curDate="curDate")
      .calendar__month-tasks-layer(v-for="(item,index) in weeks" :key="index" :style="{top:`${index* 156 + 80}px`}")
        week-task(:tasks="taskGroup[index]" :monday="days[index*7].millisecond" )
</template>
<script>
import MonthHeader from './Header'
import Card from './Card'
import calendarUtil from '@/utils/calendar'
import WeekTask from './WeekTask'
import Calendarmixin from '../mixins/index'
export default {
  components: {MonthHeader, Card, WeekTask},
  mixins: [Calendarmixin],
  props: {
    curDate: {
      type: String,
      default: moment().format('YYYY-MM')
    }
  },
  data () {
    return {
      days: calendarUtil.createMonthCalendar(this.curDate),
      tasks: this.$store.state.calendar.tasks,
      taskGroup: [],
      weeks: new Array(6),
      params: {},
      dargFlag: {},
      pageX: -1,
      pageY: -1
    }
  },
  methods: {
    dropover (event) {
      this.pageX = Math.floor((event.pageX - 30) / 164)
      this.pageY = Math.floor((event.pageY - 140) / 156)
      event.dataTransfer.dropEffect = 'move'
      event.preventDefault()
    },
    drop (event) {
      let draggingTask = this.$store.state.calendar.draggingTask
      this._resetTaskTime(draggingTask)
      this.pageX = -1
      this.pageY = -1
    },
    setParams () {
      this.$store.commit('updateCalendarParams', {rangeFrom: this.days[0].format, rangeTo: this.days[this.days.length - 1].format})
    },
    /**
     * 对现有任务按周分组，跨周任务会在所跨组中出现
     */
    setTaskGroup (array) {
      let results = []
      let weekNumS = 0
      let weekNumE = 0
      const firstDay = this.days[0]
      this._cDays = Object.assign({}, calendarUtil.createMonthCalendar(this.curDate))
      array.map((item) => {
        this.setTaskNumByDay(firstDay, item)
        weekNumS = Math.floor(moment(item.startTime || item.dueTime).diff(moment(firstDay.millisecond).startOf('day'), 'days') / 7)
        weekNumE = Math.floor(moment(item.endTime || item.dueTime).diff(moment(firstDay.millisecond).startOf('day'), 'days') / 7)
        for (let i = weekNumS; i < weekNumE + 1; i++) {
          results[i] = results[i] || []
          results[i].push(item)
        }
      })
      this.days = Object.assign({}, this._cDays)
      return results
    },
    /**
     * 按天统计任务数,并将任务加入到每天
     */
    setTaskNumByDay (firstDay, item) {
      const param = Math.max(moment(item.startTime || item.dueTime).diff(moment(firstDay.millisecond).startOf('day'), 'days'), 0)
      const length = moment(item.endTime || item.dueTime).diff(moment(Math.max(firstDay.millisecond, item.startTime || item.dueTime)).startOf('day'), 'days') + 1
      for (let index = 0; index < length; index++) {
        // 防止越界报错
        if (!this._cDays[param + index]) break
        this._cDays[param + index].tasks = this._cDays[param + index].tasks || []
        this._cDays[param + index].tasks.push(item)
      }
    },

  },
  watch: {
    curDate (newValue, oldValue) {
      this.days = calendarUtil.createMonthCalendar(newValue)
      this.setParams()
    },
    '$store.state.calendar.tasks': {
      handler: function (newer, older) {
        this.taskGroup = this.setTaskGroup(newer)
      },
      deep: true
    },
    pageX (after, before) {
      this._dragTaskTime(after, before)
    },
    pageY (after, before) {
      this._dragTaskTime(after, before, 7)
    }
  },
  mounted () {
    this.setParams()
  }
}
</script>
<style lang="scss" scoped>
.calendar__month{
    padding-bottom: 40px;
    position: relative;
}
.calendar__month-main{
    @include flex(row, flex-start, center, wrap);
}
.calendar__month-tasks-layer{
    position: absolute;
    width: 100%;
}
</style>

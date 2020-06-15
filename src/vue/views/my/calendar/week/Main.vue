<template lang="pug">
.calendar__week
    week-header(:curDate="curDate" @createTask="createTask")
    all-day-task(:tasks="allDayTasks" :monday="monday" @createTask="createTask")
    .calendar__week-main(ref="container")
        hours-list(:isToday="isToday")
        .calendar__week-cover
            hours-block
        current-time-line(model="week" v-if="isToday")
        .calendar__week-day-block
            day-block(:tasks="normalTasks" :monday="monday")
</template>
<script>
import WeekHeader from './Header'
import HoursList from '../components/HoursList'
import HoursBlock from '../components/HoursBlock'
import HoursLayer from '../components/HoursLayer'
import CurrentTimeLine from '../components/CurrentTimeLine'
import AllDayTask from './AllDayTask'
import DayBlock from './DayBlock'

export default {
  components: {WeekHeader, HoursList, HoursBlock, HoursLayer, CurrentTimeLine, AllDayTask, DayBlock},
  props: {
    curDate: {
      type: String,
      default: moment().format('YYYY-MM-DD')
    },
  },
  data () {
    return {
      isToday: false,
      monday: 0,
      allDayTasks: [],
      normalTasks: [],
      params: {},
      minScrollTop: 0
    }
  },
  methods: {
    setParams () {
      this.monday = moment(this.curDate, 'YYYY-MM-DD').startOf('week').valueOf()
      let rangeFrom = moment(this.monday).format('YYYY-MM-DD')
      let rangeTo = moment(this.monday).add(6, 'day').format('YYYY-MM-DD')
      this.$store.commit('updateCalendarParams', {rangeFrom, rangeTo})
    },
    setTodayLine () {
      this.isToday = moment(this.curDate, 'YYYY-MM-DD').isSame(moment(), 'week')
    },

    /**
     * 1.过滤任务，将全天任务和正常任务过滤出来，开始结束时间不在同一天的或者dayType===1的为全天任务
     * 2.按照任务开始时间或者到期时间分配到各个任务
     *
     */
    filterTasks (tasks) {
      this.allDayTasks = []
      this.normalTasks = []
      if (!tasks.length) return
      tasks.map(item => {
        if (!moment(item.endTime || item.dueTime).isSame(moment(item.startTime || item.dueTime), 'day') || item.dayType === 1) {
          this.allDayTasks.push(item)
        } else {
          let weekDay = moment(item.startTime || item.dueTime).get('day')
          weekDay = weekDay === 0 ? 6 : weekDay - 1
          this.normalTasks[weekDay] = this.normalTasks[weekDay] || []
          this.normalTasks[weekDay].push(item)
        }
      })
    },
    /**
    * 滚动到第一个任务
    */
    scrollToNow () {
      this.normalTasks.map((item, idx) => {
        let startTime = item[0].startTime || item[0].dueTime
        let top = moment(startTime).diff(moment(startTime).startOf('day'), 'minutes')
        this.minScrollTop = !idx ? top : Math.min(top, this.minScrollTop)
      })
      if (!top) return
      this.$refs.container.scrollTo(0, this.minScrollTop)
    },
    /**
     * 双击创建全天任务
     */
    createTask (params) {
      this.$analysis.track('TaskActionsSupplement', {
        action_type: 'create_task_by_double_click'
      })
      this.$store.commit('createTask', {dueTime: params, dayType: 1})
    }
  },
  watch: {
    curDate (newValue, oldValue) {
      this.setParams()
      this.setTodayLine()
      this.normalTasks = []
    },
    '$store.state.calendar.tasks': {
      handler: function (newer, older) {
        const loaded = this.normalTasks.length === 0
        this.filterTasks(newer)
        loaded && this.scrollToNow()
      },
      deep: true
    }
  },
  mounted () {
    this.setParams()
    this.setTodayLine()
  }

}
</script>
<style lang="scss" scoped>
.calendar__week-main{
    @include flex(row);
    padding-left: 15px;
    position: relative;
    height: 880px;
    overflow-y: scroll;
    overflow-x: hidden;
}
.calendar__week-cover{
    position: absolute;
    top:6px;
    height: 100%;
    left: 50px;
    width: calc(100% - 35px);
}
.calendar__week-day-block{
    margin-left: 26px;
}
.calendar__week-task-canvas{
    position: relative;
    width: 100%;
}

</style>

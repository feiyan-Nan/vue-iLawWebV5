<template lang="pug">
.calendar__day-view
    day-header(:curDate="curDate" @createTask="createAllDayTask")
    all-day-task(:tasks="allDayTasks" :curDate="curDate")
    day-view-canvas(:tasks="normalTasks" :curDate="curDate")
</template>
<script>
import AllDayTask from './AllDayTask'
import DayViewCanvas from './DayViewCanvas.vue'
import DayHeader from './Header.vue'
export default {
  components: {AllDayTask, DayViewCanvas, DayHeader},
  props: {
    curDate: {
      type: String,
      default: moment().format('YYYY-MM-DD')
    },
  },
  data () {
    return {
      items: [],
      allDayTasks: [],
      normalTasks: [],
      params: {}
    }
  },
  methods: {
    setParams () {
      this.params.rangeFrom = this.curDate
      this.params.rangeTo = this.curDate
      this.$store.commit('updateCalendarParams', {rangeFrom: this.params.rangeFrom, rangeTo: this.params.rangeTo})
    },
    /**
     * 过滤出全天任务和非全天任务
     * 开始结束时间不在同一天的任务或者dayType==1归为全天任务
     */
    filterTasks (tasks) {
      this.allDayTasks = []
      this.normalTasks = []
      tasks.map(item => {
        if (!moment(item.endTime || item.dueTime).isSame(moment(item.startTime || item.dueTime), 'day') || item.dayType === 1) {
          this.allDayTasks.push(item)
        } else {
          this.normalTasks.push(item)
        }
      })
    },
    /**
     * 创建全天任务
     */
    createAllDayTask (params) {
      this.$analysis.track('TaskActionsSupplement', {
        action_type: 'create_task_by_double_click'
      })
      const dueTime = moment(this.curDate, 'YYYY-MM-DD').valueOf()
      this.$store.commit('createTask', {dueTime, dayType: 1})
    }
  },
  watch: {
    '$store.state.calendar.tasks': {
      handler: function (newer, older) {
        this.filterTasks(newer)
      },
      deep: true
    },
    curDate () {
      this.setParams()
    }
  },
  mounted () {
    this.setParams()
  }
}
</script>

<template lang="pug">
  .calendar-year
    month-card(v-for="(month,index) in months" :key="index" :month="index" :year="selectedYear" :taskCount="taskCount")
</template>
<script>
import MonthCard from './Month'
const months = new Array(12)
export default {
  components: { MonthCard },
  props: {
    curDate: {
      type: String,
      default: moment().get('year')
    },
  },
  data () {
    return {
      months: months,
      tasks: [],
      taskCount: {}
    }
  },
  methods: {
    setParams () {
      const yearStart = moment(this.curDate, 'YYYY-MM-DD').startOf('year')
      const yearEnd = moment(this.curDate, 'YYYY-MM-DD').endOf('year')
      let rangeFrom = yearStart.startOf('week').format('YYYY-MM-DD')
      let rangeTo = yearEnd.endOf('week').format('YYYY-MM-DD')
      this.$store.commit('updateCalendarParams', {rangeFrom, rangeTo})
    },
    /**
     * 计算每天任务
     */
    setTaskCountByDay (tasks) {
      let result = {}
      tasks.map(item => {
        let startTime = moment(item.startTime || item.dueTime)
        const days = moment(item.endTime || item.dueTime).diff(moment(startTime).startOf('day'), 'days') + 1
        for (let index = 0; index < days; index++) {
          const key = moment(item.startTime || item.dueTime).add(index, 'day').format('YYYY-MM-DD')
          result[key] = result[key] || []
          result[key].push(item)
        }
      })
      return result
    }
  },
  computed: {
    selectedYear () {
      return moment([this.curDate]).get('year')
    }
  },
  watch: {
    '$store.state.calendar.tasks': {
      handler: function (newer, older) {
        this.taskCount = this.setTaskCountByDay(newer)
      },
      deep: true
    },
    curDate: function (newer, older) {
      this.setParams()
    }
  },
  mounted () {
    this.setParams()
  }
}
</script>
<style lang="scss" scoped>
.calendar-year {
  @include flex(row, flex-start, flex-start, wrap);
  padding-bottom: 60px;
}
</style>

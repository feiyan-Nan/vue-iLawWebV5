<template lang="pug">
.calendar__day-canvas
    .calendar__day-view(ref="container")
        .calendar__day-view-row
            hours-list(:isToday="isToday")
        current-time-line(v-if="isToday")
        .calendar__day-view-body-cover
            hours-block
            .calendar__day-view-body-cover-tasks
                task-block(:tasks="tasks" @createTask="createTask" @resetTask="resetTask")
</template>
<script>
import CurrentTimeLine from '../components/CurrentTimeLine'
import HoursList from '../components/HoursList'
import HoursBlock from '../components/HoursBlock'
import TaskBlock from '../components/TaskBlock'
import Util from '../mixins/index'
export default {
  components: {CurrentTimeLine, HoursList, HoursBlock, TaskBlock},
  mixins: [Util],
  props: {
    tasks: {
      type: Array,
    },
    curDate: {
      type: String,
      default: moment().format('YYYY-MM-DD')
    },
  },
  data () {
    return {
      isToday: false,
    }
  },
  methods: {
    setTodayLine () {
      this.isToday = moment(this.curDate, 'YYYY-MM-DD').isSame(moment(), 'day')
    },
    /**
     * 滑动新建任务
     */
    createTask (params) {
      const _params = this.transformDate(params, this.curDate)
      this._createTask(_params)
    },
    resetTask (params) {
      const _params = this.transformDate(params, this.curDate)
      let keys = ['id', 'timeType', 'dayType', 'repeatRule']
      keys.map((key) => {
        _params[key] = params[key]
      })
      this._resetTaskTime(_params)
    },
    /**
    * 滚动到当前时间
    */
    scrollToNow (tasks) {
      if (!tasks[0]) return
      const orderedTasks = _.orderBy(tasks, ['startTime', 'dueTime', 'endTime'], ['asc', 'asc', 'desc'])
      const startTime = orderedTasks[0].startTime || orderedTasks[0].dueTime
      const startMoment = moment(startTime)
      let top = startMoment.diff(moment(startTime).startOf('day'), 'minutes')
      this.$refs.container.scrollTo(0, top)
    }
  },
  watch: {
    curDate (newValue, oldValue) {
      this.setTodayLine()
    },
    tasks (after, before) {
      if (after && after.length) {
        const loaded = this.requestChanged || before.length === 0
        // 第一次加载时或请求参数发生变化，滚动到第一个任务
        loaded && this.scrollToNow(after)
        this.requestChanged = false
      }
    },
    '$store.state.calendar.reqParams': {
      handler: function (newer, older) {
        if (this.requstParams !== JSON.stringify({...newer, random: ''})) {
          this.requestChanged = true
        }
        this.requstParams = JSON.stringify({...newer, random: ''})
      },
      deep: true
    },
  },
  mounted () {
    this.setTodayLine()
  }
}
</script>

<style lang="scss" scoped>
.calendar__day-canvas{
    padding-left: 15px;
}
.calendar__day{
    padding-left: 15px;
}
.calendar__day-view {
    position: relative;
    height: 880px;
    overflow-y: scroll;
    margin-top: 10px;
    @include flex(row)
}

.calendar__day-view-row {
    @include flex(row)
}
.calendar__day-view-body-cover{
    position: relative;
    margin-top: 6px;
    margin-left: 5px;
    width: 100%;
}
.calendar__day-view-body-cover-tasks{
    position: absolute;
    margin-left: 18px;
    top: 0;
    bottom: 0;
    left:0;
    right: 0
}
.calendar__day-view-task-canvas{
    position: relative;
    width: 100%;
    margin-left: 32px;
}
</style>

<template lang="pug">
.calendar__allday-menu
    .calendar__allday-menu-left(v-if="tasks.length>0")
        .calendar__allday-menu-label 全天
        .calendar__allday-toggle-tasks.pointer( @click="showAll" v-show="maxTaskNumber>2")
          .ibass-arrow-up(v-if="showTaskNumber > 2")
          .ibass-arrow-down(v-else)
    .calendar__allday-menu-items(v-if="tasks.length>0" :style="{height:maxHeight}"  :class="{'calendar__allday-menu-items-transition': showTaskNumber>2}" @dragover="dropover" @drop="drop")
      .calendar__allday-block(v-for="(item,index) in weekBlock" :key="index" @dblclick="createTask(index)")
        .calendar__allday-block-wrap.pointer(v-show="taskCounter[index]>showTaskNumber && showTaskNumber===2" @click="showAll")
          .calendar__allday-block-label {{`更多 ${taskCounter[index]-showTaskNumber} 个`}}
          .ibass-trig-down
    .calendar__allday-tasks(@dragover="dropover" @drop="drop")
        week-task(:tasks="filteredTasks" :monday="monday" :size="154" :levelNum="showTaskNumber")
</template>
<script>
import TaskInfo from '../components/TaskInfo'
import WeekTask from '../month/WeekTask'
import Calendarmixin from '../mixins/index'
const DEFAULT_SHOW_NUMBER = 2
export default {
  components: {TaskInfo, WeekTask},
  mixins: [Calendarmixin],
  props: {
    tasks: {
      type: Array
    },
    monday: {
      type: Number
    }
  },
  data () {
    return {
      weekBlock: new Array(7),
      moday: '',
      taskCounter: {},
      showTaskNumber: DEFAULT_SHOW_NUMBER,
      maxTaskNumber: 0,
      pageX: -1,
    }
  },
  methods: {
    dropover (event) {
      this.pageX = Math.floor((event.pageX - 100) / 154)
      event.dataTransfer.dropEffect = 'move'
      event.preventDefault()
    },
    drop (event) {
      let draggingTask = this.$store.state.calendar.draggingTask
      this._resetTaskTime(draggingTask)
      this.pageX = -1
    },
    setWeekBlock (tasks) {
      tasks.map((task) => {
        this.setTaskNumByDay(this.monday, task)
      })
    },
    createTask (index) {
      const params = moment(this.monday).add(index, 'day').valueOf()
      this.$emit('createTask', params)
    },
    /**
     * 按天统计任务数,并将任务加入到每天
     */
    setTaskNumByDay (monday, item) {
      const param = Math.max(moment(item.startTime || item.dueTime).diff(moment(monday).startOf('day'), 'days'), 0)
      if (isNaN(param)) return
      const length = moment(moment(item.endTime || item.dueTime).startOf('day')).diff(moment(Math.max(item.startTime || item.dueTime, monday)).startOf('day'), 'days') + 1
      for (let index = 0; index < length; index++) {
        this.taskCounter[param + index] = this.taskCounter[param + index] || 0
        this.taskCounter[param + index]++
        this.maxTaskNumber = Math.max(this.taskCounter[param + index], this.maxTaskNumber)
      }
    },
    showAll () {
      this.showTaskNumber = this.showTaskNumber === this.maxTaskNumber ? DEFAULT_SHOW_NUMBER : this.maxTaskNumber
    },

  },
  watch: {
    tasks (newValue, oldValue) {
      this.taskCounter = {}
      this.maxTaskNumber = 0
      this.setWeekBlock(newValue)
    },
    pageX (after, before) {
      this._dragTaskTime(after, before)
    },
    maxTaskNumber (after, before) {
      if (this.showTaskNumber === before) this.showTaskNumber = after
    },
    monday (after, before) {
      // 日期切换，全天任务收展复位
      this.showTaskNumber = DEFAULT_SHOW_NUMBER
    }
  },
  computed: {
    filteredTasks () {
      return this.tasks.slice(0)
    },
    maxHeight () {
      let allDayHeight = `${Math.min(this.maxTaskNumber, this.showTaskNumber === DEFAULT_SHOW_NUMBER ? this.showTaskNumber + 1 : this.showTaskNumber) * 22 + 8}px`
      return allDayHeight
    }
  },
  mounted () {
    this.setWeekBlock(this.tasks)
  }
}
</script>
<style lang="scss" scoped>
.calendar__allday-menu {
    @include flex(row,flex-start,stretch);
    position: relative;
    width: 1150px;
    overflow: hidden;
    @extend %bg-gray-light;
}
.calendar__allday-menu-left {
    @extend %f-extra-small;
    @include flex(column,space-between);
    padding: 6px 0 8px 18px;
    width: 53px;
    color:$color-text-secondary;
    .calendar__allday-toggle-tasks{
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: $color-bg-light;
        @extend %f-mini;
        @include flex(row,center,center);
        [class*=ibass-]{
            color:$color-text-placeholder;
            height: 10px;
        }
    }
}
.calendar__allday-menu-items{
    @include flex(row);
}
.calendar__allday-menu-items-transition{
  transition: height .4s;
}
.calendar__allday-block{
    @include flex(column,flex-end);
    width: 153px;
    height: 100%;
    border-left: 1px solid $color-bd-regular;
}
.calendar__allday-tasks{
    position: absolute;
    margin-left: 72px;
}
.calendar__allday-block-wrap{
    @include flex(row,flex-start,center);
    [class*=ibass-]{
        color: $color-bd-light;
        @extend %f-extra-small;
        height: 12px;
    }
    padding-left: 9px;
    margin-bottom: 6px;
}
.calendar__allday-block-label{
    color:$color-text-regular;
    @extend %f-mini;
}
.calendar__allday-tasks__hidden{
    opacity: 0;
    height: 23px;
}
</style>

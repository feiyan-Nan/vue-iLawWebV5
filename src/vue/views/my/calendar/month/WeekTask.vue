<template lang="pug">
.calendar__week-task
    .calendar__month-task(v-for="(item,index) in items" :ref="`task${item.id}`" v-if="item.top<levelNum" :key="item.id "  :class="{'calendar__month-task__done':item.state===1,'calendar__month-task-expired':item.expired}" :style="{width:`${size*item.width -10}px`,left:`${item.left*size}px`,top:`${item.top*22}px`}" :draggable="item.state!==TASK_DETAIL.STATE_FINISHED" @dragstart="startDrag(item, $event)" )
        ic-popover(@dbClick="showTaskDetail(item)")
            task-info(:task="item")
            .calendar__month-task-trigger(slot="trigger" )
                .ibass-done(v-if="item.state===TASK_DETAIL.STATE_FINISHED")
                .calendar__month-task-label.ellipsis {{item.name}}
</template>

<script>
import TaskInfo from '../components/TaskInfo'
import {TASK_DETAIL} from '@/utils/constants'
export default {
  components: {TaskInfo},
  props: {
    tasks: {
      type: Array,
      default: function () {
        return []
      }
    },
    monday: {
      type: Number
    },
    size: {
      type: Number,
      default: 164
    },
    levelNum: {
      type: Number,
      default: 4
    }
  },
  data () {
    return {
      items: this.tasks,
      TASK_DETAIL,
      pageX: -1,
    }
  },
  methods: {
    startDrag (item, event) {
      // 月视图下拖拽bug处理临时方案，Tapd地址： https://www.tapd.cn/20473721/bugtrace/bugs/view?bug_id=1120473721001030978&url_cache_key=45b60dc02aa4da0c025186cff8eefbf7； https://www.tapd.cn/20473721/bugtrace/bugs/view?bug_id=1120473721001030977&url_cache_key=45b60dc02aa4da0c025186cff8eefbf7
      event.dataTransfer.setDragImage(this.$refs[`task${item.id}`][0], 10, 10)
      this.$store.commit('setDraggingTask', item)
    },
    sortTasks (array, columns, orders) {
      array = _.orderBy(array, columns, orders)
      return array
    },
    showTaskDetail (task) {
      this.$analysis.track('TaskActionsSupplement', {
        action_type: 'enter_task_by_double_click'
      })
      this.$postMessage.openTaskDetail(task.id)
    },
    setTaskPosition (array) {
      for (let i in array) {
        let minEndTime = moment.min(moment(array[i].endDay), moment(this.monday).endOf('week'))
        let maxStartTime = moment(array[i].startDay)
        array[i].width = Math.max(minEndTime.diff(maxStartTime.startOf('day'), 'days') + 1, 1)
        array[i].left = maxStartTime.diff(moment(this.monday).startOf('day'), 'days')
        array[i].top = 0
        // 将已经排完的任务按照top排序
        const topArray = this.sortTasks(array.slice(0, i), ['top'], ['asc'])
        for (let j = 0; j < i; j++) {
          if (!topArray[j].used && moment(array[i].startDay).isAfter(moment(topArray[j].endDay), 'day')) {
            array[i].top = topArray[j].top
            topArray[j].used = true
            break
          } else {
            array[i].top = topArray[j].top + 1
          }
        }
      }
      return array
    },
    /**
     * 给每个任务添加属性startDay： 开始日期，不区分时分秒
     * 给每个任务添加属性endDay： 结束日期，不区分时分秒
     * 判断任务过期
     */
    transformTask (array) {
      array.map((item) => {
        const startTime = item.startTime || item.dueTime
        const endTime = item.endTime || item.dueTime
        item.startDay = Math.max(moment(startTime).startOf('day').valueOf(), moment(this.monday).valueOf())
        item.endDay = moment(endTime).endOf('day').valueOf()
        item.used = false
        item.isSchedule = !!item.dueTime
        // if (item.endTime < new Date().getTime()) {
        //    item.expired = true 任务过期暂时去掉
        // }
      })
      return array
    },
    updateTask (tasks) {
      let tempTasks = this.transformTask(tasks)
      tempTasks = this.sortTasks(tempTasks, ['startDay', 'endDay', 'state'], ['asc', 'desc', 'asc'])
      this.items = this.setTaskPosition(tempTasks)
    }
  },
  watch: {
    tasks (newValue, oldValue) {
      this.updateTask(newValue)
    }
  }
}
</script>

<style lang="scss" scoped>
.calendar__month-task{
  position: absolute;
  background-color:$bg-calendar-task;
  border-radius: 2px;
  @extend %f-extra-small;
  margin-top: 5px;
  margin-left: 5px;
  @include flex(row);
  &.calendar__month-task__done{
    background-color: $color-bg-light;
    color: $color-text-secondary;
    border-left:none;
    .calendar__month-task-label{
      text-decoration: line-through;
    }
    [class*=ibass-]{
      color: $color-bd-lighter;
      @extend %f-mini;
      height: 12px;
      margin-right: 10px;
    }
    .triggered{
      background-color: $theme-color;
      .ibass-done{
        color: rgba(255,255,255,0.6);
      }
    }
  }
  .triggered{
    background-color: $theme-color;
    color:$color-white
  }
}
.calendar__month-task-trigger{
  height: 17px;
  padding-left: 8px;
  @include flex(row,flex-start,center);
}
.calendar__month-task-expired{
  background-color: $color-bg-base;
  color:$dangerous-color
}

</style>

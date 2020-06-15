<template lang="pug">
.calendar__popover-task-list(ref="list")
    .calendar__popover-task-list-wrap
        .calendar__popover-task-list-header
            .calendar__popover-task-list-date
                .calendar__popover-task-list-month {{`${date.cMonth} 月`}}
                .calendar__popover-task-list-day.pointer(@click="setView('day')")   {{`${date.cDay}日`}}
            .ibass-close(@click="close")
        .calendar__popover-task-list-items(v-if="tasks.length>0")
            .calendar__popover-task-list-item(v-for="(task,index) in innerTasks" :key="task.id" :class="{'calendar__popover-task-list-item__done':task.state===1}")
                ic-popover(@dbClick="showTaskDetail(task)")
                    task-info(:task="task" @close="close" @finishTask="finishTask()")
                    .calendar__popover-task-list-item-wrap.pointer(slot="trigger" )
                        .ibass-done(v-if="task.state===TASK_DETAIL.STATE_FINISHED")
                        .calendar__popover-task-list-item-label.ellipsis() {{task.name}}
        .calendar__popover-task-empty(v-else) 无事件
</template>
<script>
import TaskInfo from './TaskInfo'
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
    date: {
      type: Object
    }
  },
  data () {
    return {
      TASK_DETAIL,
      visible: false
    }
  },
  methods: {
    stop (event) {
      event.stopPropagation()
    },
    /**
     * 进入日视图
     */
    setView (type) {
      const date = moment([this.date.cYear, this.date.cMonth - 1, this.date.cDay]).valueOf()
      this.$store.commit('setCalendarViewType', {type, date})
      event.stopPropagation()
    },
    close () {
      this.$emit('close')
    },
    showTaskDetail (task) {
      this.$postMessage.openTaskDetail(task.id)
    },
    finishTask () {
      // _task.visible = false
      this.$refs.list.click()
    }
  },
  computed: {
    innerTasks () {
      return _.orderBy(this.tasks, ['state'], ['asc'])
    }
  },
}
</script>
<style lang="scss" scoped>
.calendar__popover-task-list-wrap{
    padding:15px;
    width: 154px;
}
.calendar__popover-task-list-header{
    @include  flex(row,space-between);
    [class*=ibass-]{
        @extend %f-extra-small;
        color:$color-text-secondary;
    }
}
.calendar__popover-task-list-item{
    @extend %f-extra-small;
    background-color: $bg-calendar-task;
    border-radius: 2px;
    margin-top: 5px;
    [class*=ibass-]{
        @extend %f-extra-small;
        height: 12px;
        margin-left: 4px;
        color:$color-text-placeholder;
    }
    &.calendar__popover-task-list-item__done{
        text-decoration: line-through;
        color:$color-text-secondary;
        background-color: $color-bg-light;
        .triggered{
          background-color: unset;
          color:unset
      }
    }

    .triggered{
      background-color: $theme-color;
      color:$color-white
    }
}
.calendar__popover-task-list-items{
    max-height: 176px;
    margin-top: 7px;
    overflow-y: scroll
}
.calendar__popover-task-list-month{
    @extend %f-mini;
    color:$color-text-secondary;
}
.calendar__popover-task-list-day{
    margin-top: 5px;
    @extend %f-extra-small;
    @extend %f-half;
    @include hoverLine();
}
.calendar__popover-task-empty{
    margin-top: 16px;
    color:$color-text-secondary;
    @extend %f-mini;
}
.calendar__popover-task-list-item-label{
    margin-left: 6px;
}

.calendar__popover-task-list-item-wrap{
 @include flex(row,flex-start,center);
 height: 17px;
}
</style>

<template lang="pug">
.calendar__allday-menu
    .calendar__allday-menu-left(v-if="tasks.length>0")
        .calendar__allday-menu-label 全天
        .calendar__allday-toggle-tasks.pointer( @click="showAll" v-show="tasks.length>3")
            .ibass-arrow-up(v-if="filterNum > 3")
            .ibass-arrow-down(v-else)
    .calendar__allday-menu-items(:style="{'height': maxHeight}" :class="{'calendar__allday-menu-items-transition': filterNum>2}")
        .calendar__allday-menu-item(v-for="(item,index) in filteredTasks" :key="index" :class="{'calendar__allday-menu-item__done':item.state===1}")
            ic-popover(@dbClick="showTaskDetail(item)")
                task-info(:task="item")
                .calendar__allday-menu-item-wrap(slot="trigger")
                  .ibass-done(v-show="item.state===1")
                  .calendar__allday-menu-item-label.ellipsis {{item.name}}
        .calendar__allday-more.pointer(v-show="showMore" @click="showAll")
            .calendar__allday-more-label {{`更多 ${tasks.length-filterNum} 个`}}
            .ibass-trig-down
</template>
<script>
import TaskInfo from '../components/TaskInfo.vue'
const DEFAULT_SHOW_NUMBER = 2
export default {
  components: {TaskInfo},
  props: {
    tasks: {
      type: Array
    },
    curDate: {
      type: String
    }
  },
  data () {
    return {
      filterNum: DEFAULT_SHOW_NUMBER,
    }
  },
  computed: {
    filteredTasks () {
      const _tasks = _.orderBy(this.tasks, ['state'], ['asc'])
      return this.showMore ? _tasks.slice(0, this.filterNum) : _tasks
    },
    showMore () {
      return this.tasks.length > (this.filterNum + 1)
    },
    maxHeight () {
      let allDayHeight = `${(this.showMore ? (this.filterNum + 1) : this.tasks.length) * 23}px`
      return allDayHeight
    },
  },
  methods: {
    showAll () {
      this.filterNum = this.filterNum === DEFAULT_SHOW_NUMBER ? this.tasks.length : DEFAULT_SHOW_NUMBER
    },
    showTaskDetail (task) {
      this.$analysis.track('TaskActionsSupplement', {
        action_type: 'enter_task_by_double_click'
      })
      this.$postMessage.openTaskDetail(task.id)
    }
  },
  watch: {
    curDate (after, before) {
      this.filterNum = DEFAULT_SHOW_NUMBER
    }
  },
}
</script>

<style lang="scss" scoped>
.calendar__allday-menu {
    @include flex(row,flex-start,stretch);
    @extend %bg-gray-light;
}
.calendar__allday-menu-left {
    @extend %f-extra-small;
    @include flex(column,space-between);
    padding: 6px 0 8px 18px;
    width: 57px;
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
.calendar__allday-menu-label {
  @extend %f-extra-small;
}
 .calendar__allday-menu-items{
  width: 100%;
  padding: 5px 0 2px 0;
  z-index: 3;
  overflow: hidden;
 }
 .calendar__allday-menu-items-transition{
    transition: height .3s ease-out;
 }
.calendar__allday-menu-item{
  border-radius: 2px;

  margin: 0 5px 5px 0;
  @extend %f-extra-small;
  @extend %bg-calendar-task ;
  &.calendar__allday-menu-item__done{
    background-color: $color-bg-light;
    color: $color-text-secondary;
    [class*=ibass]{
      color:$color-text-placeholder;
      line-height: 10px;
      margin-right: 5px;
      @extend %f-mini;
    }
    .calendar__allday-menu-item-label{
      text-decoration: line-through;

    }
    .triggered{
      background-color: unset;
      color: unset;
    }
  }
  .triggered{
    background-color: $theme-color;
    color:$color-white
  }
}
.calendar__allday-menu-item-wrap{
  width: 100%;
  height: 17px;

  @include flex(row,flex-start,center);
}
.calendar__allday-more{
  @include flex(row,flex-start,center);
  @extend %f-mini;
  color: $color-text-regular;
  [class*=ibass-]{
      @extend %f-extra-small;
      height: 12px;
      margin-left: 2px;
      color:$color-bd-light;
  }

}
.calendar__allday-menu-item-label{
  padding-left: 8px;
}
</style>

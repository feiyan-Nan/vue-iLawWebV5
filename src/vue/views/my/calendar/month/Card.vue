<template lang="pug">
.calendar__month-card(:class="[item.nWeek>5?'calendar__month-card__weekend':'',item.cMonth!==selectedMonth?'calendar__month-card__ohter-month':'']" @dblclick="createTask(item)")
    .calendar__month-card-header.noselect
        .calendar__month-card-sorlar {{item.dayCn === '初一'? item.monthCn: item.dayCn}}
        .calendar__month-card-day.pointer(:class="{'calendar__month-card__today':item.isToday&&selectedMonth===item.cMonth}" @click="toggleView(item)")
            span {{item.cDay}}
    .calendar__month-card-footer(v-show="item.tasks&&item.tasks.length>4")
        m-popover(v-model="visible" :triangle="false" @dbClick = "createTask(item)")
            task-list(:tasks="item.tasks" :date="item" @close="visible = false")
            .calendar__month-card-footer-trigger.pointer.noselect(slot="trigger")
                .calendar__month-card-footer-label {{`显示更多${item.tasks&&item.tasks.length-4}个`}}
                .ibass-trig-down
</template>
<script>
import TaskList from '../components/TaskList'
import MPopover from './MPopover'

export default {
  components: {TaskList, MPopover},
  props: {
    item: Object,
    curDate: {
      type: String,
      default: moment().format('YYYY-MM')
    },
  },
  data () {
    return {
      selectedMonth: 0,
      visible: false
    }
  },
  methods: {
    setActiveMonth () {
      this.selectedMonth = moment(this.curDate, 'YYYY-MM').get('month') + 1
    },
    createTask (item) {
      this.$analysis.track('TaskActionsSupplement', {
        action_type: 'create_task_by_double_click'
      })
      this.$store.commit('createTask', {dueTime: item.millisecond, dayType: 1})
    },
    toggleView (item) {
      this.$store.commit('setCalendarViewType', {type: 'day', date: item.millisecond})
    }
  },
  watch: {
    curDate (newValue, oldValue) {
      this.setActiveMonth()
    }
  },
  mounted () {
    this.setActiveMonth()
  }
}
</script>
<style lang="scss" scoped>
.calendar__month-card {
    width: 164px;
    height: 156px;
    box-shadow: inset -1px 0 0 0 #f0f0f0, inset 0 -1px 0 0 #f0f0f0;
    &:nth-child(7n){
      width: 168px;
    }
}
.calendar__month-card-header{
    @include flex(row, space-between,center);
    height: 30px;
    margin-top: 10px;
    padding:0 15px 0 10px;
    @extend %f-small;
    .calendar__month-card-sorlar {
        color: $color-text-secondary
    };
    .calendar__month-card-day.calendar__month-card__today{
        @include background(50%,$theme-color);
        span{
            @include hoverLine(2px,$color-white);
       }
    }
    .calendar__month-card-day {
        @include center(30px);
        @extend %color-text-primary;
        width: 30px;
       span{
            @include hoverLine();
       }
    }
}
.calendar__month-card__ohter-month{
    .calendar__month-card-header .calendar__month-card-sorlar, .calendar__month-card-day{
        color:$color-bd-base
    }
}
.calendar__month-card__weekend{
    background-color: #fbfbfb;
    .calendar__month-card-header .calendar__month-card-sorlar, .calendar__month-card-day{
        @extend %color-bd-light;
    }
}
.calendar__month-card-footer{
    margin-top: 95px;
    @extend %f-mini;
    padding-left: 13px;
    color:$color-text-regular;
    [class*=ibass-]{
        margin-left: 3px;
        @extend %f-extra-small;
        color:$color-bd-light;
        height: 14px;;
    }
}
.calendar__month-card-footer-trigger{
    @include flex(row,flex-start,center);
}
</style>

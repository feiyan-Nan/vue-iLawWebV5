<template lang="pug">
div(:class="[isToday?'calendar-year-month-card__today':'', tasks.length?'calendar-year-month-card-item__has-task':'',`task-count__${tasks.length}`,visible?'visible':'']")
    y-popover(v-model="visible" :triangle="false" @dbClick="setView")
        task-list(:tasks="tasks" :date="day" @close="visible = false")
        .calendar-year-month-card-item-label(slot="trigger" ) {{day.cDay}}
</template>

<script>
import TaskList from '../components/TaskList'
import YPopover from './YPopover'
export default {
  components: {TaskList, YPopover},
  props: {
    tasks: {
      type: Array,
      default: function () {
        return []
      }
    },
    day: {
      type: Object
    },
    isToday: {
      type: Boolean
    }
  },
  data () {
    return {
      visible: false,
      // innerIsToday: this.isToday
    }
  },
  methods: {
    setView () {
      const date = moment([this.day.cYear, this.day.cMonth - 1, this.day.cDay]).valueOf()
      this.$store.commit('setCalendarViewType', {type: 'day', date})
    },
  },
}
</script>

<style lang="scss" scoped>
.calendar-year-month-card__today{
    @include background(50%,$theme-color);
    @extend %f-half;
    .triggered{
      @include background(50%,$theme-color);
    }
}
.triggered{
  @include background(50%)
}
.calendar-year-month-card-item__has-task:not(.visible){
    position: relative;
    &::after{
        content:'';
        position: absolute;
        top: calc(100% - 2px);
        left:50%;
        transform: translate(-50%,-100%);
        border-radius: 50%;
        width:4px;
        height: 4px;
    }

    @for $i from 1 through 30{
      &.task-count__#{$i}::after{
        background-color: darken($color: $color-bd-regular, $amount: $i *1.4);
      }

    }
    &.calendar-year-month-card__today::after{
      background-color: $color-white;
    }
}
</style>

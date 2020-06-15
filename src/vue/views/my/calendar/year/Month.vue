`<template lang="pug">
    .calendar-year-month-card
        .calendar-year-month-card__month.pointer(@click="setViewToMonth" :class="[isCurrMonth?'curr-month':'']") {{cnMonth[month]}}
        week
        .calendar-year-month-card__items
            .calendar-year-month-card-item.pointer( v-for="(day, index) in days" :key="index" :class="[ day.cMonth!==month+1?'calendar-year-month-card__noactive':'']")
                day(:tasks="taskCount[day.format]" :day="day" :isToday="day.cMonth===month+1&&day.isToday")
</template>
<script>
import Week from './Week'
import Day from './Day'
import calendarUtil from '@/utils/calendar'
const cnMonth = calendarUtil.getCnMonth()
export default {
  components: {Week, Day},
  props: {
    month: Number,
    year: Number,
    taskCount: Object,
  },
  data () {
    return {
      days: this.getMonth(),
      cnMonth: cnMonth,
      visible: []
    }
  },
  watch: {
    year (newValue, oldValue) {
      this.days = this.getMonth()
    }
  },
  methods: {
    getMonth () {
      const thisMonth = `${this.year}-${this.month + 1}`
      return calendarUtil.createMonthCalendar(thisMonth)
    },
    /**
     * 进入到月视图
     */
    setViewToMonth () {
      const date = moment([this.year, this.month]).valueOf()
      this.$store.commit('setCalendarViewType', {type: 'month', date})
    },
  },
  computed: {
    isCurrMonth () {
      return moment().isSame(moment([this.year, (this.month)]), 'month')
    }
  },
}
</script>
<style lang="scss" scoped>
.calendar-year-month-card {
    width: 287px;
    height: 257px;
    padding: 15px 0 20px 0;
    .calendar-year-month-card__items{
        padding: 0 14px 0 15px;
        @include flex(row, flex-start, flex-start, wrap);
    }
}
.calendar-year-month-card-item{
    margin-top: 11px;
    margin-right: 15px;
    width: 24px;
    @include center(24px);
    border-radius: 50%;
    @extend %f-light;
    @extend %f-extra-small;
}
.calendar-year-month-card-item:nth-child(7n){
    margin-right: 0;
}
.calendar-year-month-card__noactive {
    color: $color-bd-base;
}

.calendar-year-month-card__month{
    @extend %f-subtitle;
    color: $color-text-primary;
    margin-bottom: 7px;
    margin-left: 15px;
    display: inline-block;
    @include hoverLine();
    &.curr-month{
      color: $theme-color
    }
}
</style>

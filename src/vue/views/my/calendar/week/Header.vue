<template lang="pug">
.calendar__week-header.noselect
    .calendar__week-header-num.calendar__week-header-item {{`第 ${nWeek} 周`}}
    .calendar__week-header-item(v-for="(item,index) in days" :key="index" @dblclick="createTask(item)")
        .calendar__week-header-item-date.pointer(:class="[item.isToday?'calendar__week-header-item-date__active':'']" @click="toggleView(item)")
            span {{item.cDay}}
        .calendar__week-header-item-weekday {{weekDays[index]}}
        .calendar__week-header-item-sorlar {{item.dayCn === '初一'? item.monthCn: item.dayCn}}
</template>
<script>
import solarLunar from 'solarlunar'
import calendarUtil from '@/utils/calendar'
export default {
  props: {
    curDate: {
      type: String,
      default: moment().format('YYYY-MM-DD')
    },
  },
  data () {
    return {
      days: [],
      weekDays: calendarUtil.getFullCnWeek(),
      nWeek: 0
    }
  },
  methods: {
    getDays () {
      let firstDayOfWeek = moment(this.curDate, 'YYYY-MM-DD').startOf('week')
      this.nWeek = firstDayOfWeek.weeks()
      let day
      let days = []
      for (let i = 0; i < 7; i++, firstDayOfWeek = firstDayOfWeek.add(1, 'days')) {
        day = solarLunar.solar2lunar(firstDayOfWeek.get('year'), firstDayOfWeek.get('month') + 1, firstDayOfWeek.get('date'))
        day = day === -1 ? {cDay: firstDayOfWeek.get('date'), cMonth: firstDayOfWeek.get('month') + 1, cYear: firstDayOfWeek.get('year')} : day
        days.push(day)
      }
      this.days = days
    },
    createTask (item) {
      const params = moment([item.cYear, item.cMonth - 1, item.cDay]).valueOf()
      this.$emit('createTask', params)
    },
    /**
     * 进入到日视图
     */
    toggleView (item) {
      const date = moment([item.cYear, item.cMonth - 1, item.cDay]).valueOf()
      this.$store.commit('setCalendarViewType', {type: 'day', date})
    }
  },
  mounted () {
    this.getDays()
  },
  watch: {
    curDate (newValue, oldValue) {
      this.getDays()
    }
  },
}
</script>
<style lang="scss" scoped>
.calendar__week-header {
    @include flex(row);
}
.calendar__week-header-item{
    @include flex(row,center,center);
    @extend %f-extra-small;
    width: 154px;
    height: 38px;
    box-shadow: inset -1px 0 0 0 $color-bd-regular, inset 0 -1px 0 0 $color-bd-regular;
    color: $color-text-primary;
    &:last-child{
          box-shadow: inset 0 -1px 0 0 $color-bd-regular;
    }
    &.calendar__week-header-num{
        width:72px;
        color: $color-text-secondary;
    }
}
.calendar__week-header-item-weekday{
    margin:0 10px 0 6px;
}
.calendar__week-header-item-date{
    height:30px;
    width: 30px;
    margin-top: 2px;
    @include flex(row,center,center);
    span{
        @include hoverLine();
    }
}
.calendar__week-header-item-date__active{
    border-radius: 50%;
    background-color: $theme-color;
    color: $color-white;
    span{
        @include hoverLine(2px,$color-white);
    }
}
.calendar__week-header-item-sorlar {
  color: $color-text-secondary
}
</style>
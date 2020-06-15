<template lang="pug">
.calendar__day-header
    .calendar__day-header-label.noselect(@dblclick="createTask")
        span.weekday {{weekday}}
        span.solar-lunar {{solarLunar}}
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
      weekday: '',
      solarLunar: '',
      weekdays: calendarUtil.getFullCnWeek()
    }
  },
  methods: {
    updatelabel () {
      const currMoment = moment(this.curDate, 'YYYY-MM-DD')
      const item = solarLunar.solar2lunar(currMoment.get('year'), currMoment.get('month') + 1, currMoment.get('date'))
      this.weekday = `${this.weekdays[currMoment.weekday()]}`
      this.solarLunar = `${item.dayCn === '初一' ? item.monthCn : item.dayCn || ''}`
    },
    createTask () {
      this.$emit('createTask')
    }
  },
  mounted () {
    this.updatelabel()
  },
  watch: {
    curDate (newValue, oldValue) {
      this.updatelabel(newValue)
    }
  },
}
</script>
<style lang="scss" scoped>
.calendar__day-header{
    // border-top: solid 1px $color-bd-extra-light;
    box-shadow:  inset 0 -1px 0 0 $color-bd-regular$color-bd-regular;
}
.calendar__day-header-label{
    height: 38px;
    margin-left: 72px;
    border-left: solid 1px $color-bd-regular;
    @include flex(row,flex-start,center);
    padding-left: 20px;
    @extend %f-extra-small;
    color:$color-bg-normal;
    .solar-lunar{
        margin-left: 10px;
        color: $color-text-secondary
    }
}
</style>

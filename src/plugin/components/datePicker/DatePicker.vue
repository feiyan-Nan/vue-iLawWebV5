<template lang="pug">
.ic__date-picker
    ic-date-picker-header(:label='label' @pre="pre" @next="next")
    .ic__date-picker-month-week
        .ic__date-picker-month-week-item(v-for="(item,index) in items" :key="index") {{item}}
    .ic__date-picker-month-day
        .ic__date-picker-month-day-item(v-for="(item,index) in days" :key="index" @click="selectDate(item)"
          :class="[item.cMonth !== curMonthIndex + 1 || item.millisecond > end || item.millisecond < start ?'ic__date-picker-month-day-item__noactive':'', item.isToday?'ic__date-picker-month-day-item__today':'', `${item.format}`===curDate?'ic__date-picker-month-day-item__active':'']") {{item.cDay}}
    .back-today.ibass-back.pointer(v-if="hasBackToday" @click="backToday") 今天
    slot
</template>
<script>
import calendarUtil from '@/utils/calendar'
import IcDatePickerHeader from './Header.vue'
const weedays = calendarUtil.getCnWeek()
const cnMonth = calendarUtil.getCnMonth()
export default {
  name: 'ic-date-picker',
  componentName: 'IcDatePicker',
  components: {IcDatePickerHeader},
  props: {
    curDate: {
      type: String,
      default: moment().format('YYYY-MM-DD')
    },
    startDate: {
      type: [String, Number],
      default: ''
    },
    endDate: {
      type: [String, Number],
      default: ''
    },
    hasBackToday: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    start () {
      return moment(this.startDate).valueOf() || 0
    },
    end () {
      return moment(this.endDate).valueOf() || Infinity
    }
  },
  data () {
    return {
      label: '测试',
      items: weedays,
      days: '',
      curMonthIndex: 0,
      curMonth: moment(this.curDate, 'YYYY-MM-DD'),
      curYear: 0,
    }
  },
  methods: {
    setCurMonth () {
      this.curMonthIndex = this.curMonth.get('month')
      this.label = cnMonth[this.curMonthIndex] + ' ' + this.curMonth.get('year')
    },
    getDays () {
      this.days = calendarUtil.createMonthCalendar(this.curMonth)
    },
    pre (ev) {
      this.curMonth = this.curMonth.subtract(1, 'month')
      this.getDays()
      this.setCurMonth()
      ev.stopPropagation()
    },
    next (ev) {
      this.curMonth = this.curMonth.add(1, 'month')
      this.getDays()
      this.setCurMonth()
      ev.stopPropagation()
    },
    backToday () {
      this.$emit('click', moment().format('YYYY-MM-DD'))
    },
    selectDate (item) {
      if (item.millisecond <= this.end && item.millisecond >= this.start) {
        this.$emit('click', item.format)
      }
    }
  },
  watch: {
    curDate (newValue, oldValue) {
      this.curMonth = moment(newValue, 'YYYY-MM-DD')
      this.setCurMonth()
      this.getDays()
    }
  },
  mounted () {
    this.setCurMonth()
    this.getDays()
  }
}
</script>
<style lang="scss" scoped>
%hover-black{
    background-color: $color-black;
    border-radius: 5px;
}
.ic__date-picker{
    margin-top: 5px;
    width: 240px;
    font-weight: unset;
}
.ic__date-picker-month-week{
    margin-top: 12px;
    @include flex(row);
    border-bottom: solid 1px #464646;
    margin: 0 15px;
}
.ic__date-picker-month-week-item{
    @extend %f-extra-small;
    @include flex(row,center,center);
    width: 30px;
    height: 30px;
    color: $color-text-secondary;
}
.ic__date-picker-month-day{
    @include flex(row,flex-start,flex-start,wrap);
    margin: 0 15px;
}
.ic__date-picker-month-day-item{
    width: 30px;
    height: 30px;
    color:$color-white;
}
 .ic__date-picker-month-day-item{
     @include flex(row,center,center);
     &:hover:not(.ic__date-picker-month-day-item__today){
        @extend %hover-black;
     }
 }
 .ic__date-picker-month-day-item__noactive{
    color: $color-text-secondary;
 }
 .ic__date-picker-month-day-item__today{
    border-radius: 50%;
    background-color: $dangerous-color;
 }
.ic__date-picker-month-day-item__active:not(.ic__date-picker-month-day-item__today){
     background-color: $theme-color-light;
     border-radius: 3px;

 }
   .back-today{
    text-align: center;
    color: $color-white;
    &.ibass-back{
      &:before{
        margin: 0.5rem;
        vertical-align: -1px;
      }
    }
    &:hover{
      background: $color-black;
    }
  }
</style>

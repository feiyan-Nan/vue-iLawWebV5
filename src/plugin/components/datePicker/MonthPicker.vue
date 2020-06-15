<template lang="pug">
.ic__month-picker
    ic-date-picker-header(:label="label" @pre="pre" @next="next")
    .ic__date-picker-items
        .ic__date-picker-item(v-for="(item,index) in cnMonth" :key="index" :class="[(index===thisMonth&&thisYear===label)?'ic__date-picker-item__today':'',(index===selectedMonth&&selectedYear===label)?'ic__date-picker-item__active':'']" @click="select(index,$event)") {{`${index+1}月`}}
</template>
<script>
import IcDatePickerHeader from './Header.vue'
import calendarUtil from '@/utils/calendar'
const CN_MONTH = calendarUtil.getCnMonth()
export default {
  name: 'ic-month-picker',
  componentName: 'IcMonthPicker',
  components: {IcDatePickerHeader},
  props: {
    curDate: {
      type: String,
      default: moment().format('YYYY-MM')
    },
  },
  data () {
    return {
      label: '月视图',
      cnMonth: CN_MONTH,
      thisYear: 0,
      thisMonth: 0,
      selectedYear: 0,
      selectedMonth: 0
    }
  },
  methods: {
    setCurDate () {
      this.label = this.innerCurDate.get('year').toString()
    },
    select (index, ev) {
      this.$emit('click', `${this.innerCurDate.get('year')}-${index + 1}`)
    },
    pre (ev) {
      this.innerCurDate = this.innerCurDate.subtract(1, 'year')
      this.setCurDate()
      ev.stopPropagation()
    },
    next (ev) {
      this.innerCurDate = this.innerCurDate.add(1, 'year')
      this.setCurDate()
      ev.stopPropagation()
    },
    initData () {
      this.innerCurDate = moment(this.curDate, 'YYYY-MM')
      this.selectedYear = this.innerCurDate.get('year').toString()
      this.selectedMonth = this.innerCurDate.get('month')
    }

  },
  watch: {
    curDate (newValue, oldValue) {
      this.initData()
      this.setCurDate()
    }
  },
  mounted () {
    this.thisYear = moment().get('year').toString()
    this.thisMonth = moment().get('month')
    this.initData()
    this.setCurDate()
  }
}
</script>
<style lang="scss" scoped>
%hover-black{
    background-color: #000000;
    border-radius: 3px;
}
.ic__month-picker {
    margin-top: 10px;
    width: 240px;
    font-weight: unset;
}
.ic__date-picker-items{
    @include flex(row,space-between ,center, wrap);
    margin: 10px 0;
    padding: 0 15px;
}
.ic__date-picker-item{
    width: 50px;
    height: 30px;
    margin: 10px 0;
    @include flex(row,center,center);
    color:$color-white;
    &:hover:not(.ic__date-picker-item__active){
      @extend %hover-black;
    }
}
.ic__date-picker-item__today{
    background-color: $dangerous-color;
    border-radius: 5px;
}
.ic__date-picker-item__active:not(.ic__date-picker-item__today){
    background-color: $theme-color-light;
    border-radius: 5px;
}
</style>

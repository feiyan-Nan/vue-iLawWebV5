<template lang="pug">
.ic__month-picker
    ic-date-picker-header(:label="label" @pre="pre" @next="next")
    .ic-date-picker-items
        .ic-date-picker-item(v-for="(item,index) in yearList" :key="index" @click="select(index)" :class="[originYear===yearStart+index?'ic-date-picker-item__active':'',index===0||index===11?'ic-date-picker-item__noactive':'',yearStart+index===thisYear?'ic-date-picker-item__today':'',yearStart+index===curYear?'ic-date-picker-item__active':'']") {{yearStart+index}}
</template>
<script>
import IcDatePickerHeader from './Header.vue'
export default {
  name: 'ic-year-picker',
  componentName: 'IcYearPicker',
  components: {IcDatePickerHeader},
  props: {
    curDate: {
      type: String,
      default: moment().format('YYYY-MM-DD')
    },
  },
  data () {
    return {
      label: '年视图',
      yearStart: 0,
      yearList: new Array(12),
      curYear: moment(this.curDate, 'YYYY-MM-DD'),
      originYear: 0,
      thisYear: 0
    }
  },
  methods: {
    setStartYear () {
      this.curYearNum = this.curYear.get('year')
      this.yearStart = Math.floor(this.curYearNum / 10) * 10 - 1
      this.label = `${this.yearStart + 1}-${this.yearStart + 10}`
    },
    pre (ev) {
      this.curYear = this.curYear.subtract(10, 'year')
      this.setStartYear()
      ev.stopPropagation()
    },
    next (ev) {
      this.curYear = this.curYear.add(10, 'year')
      this.setStartYear()
      ev.stopPropagation()
    },
    select (index) {
      this.$emit('click', (index + this.yearStart).toString())
    }
  },
  watch: {
    curDate (newValue, oldValue) {
      this.originYear = moment(this.curDate, 'YYYY-MM-DD').get('year')
      this.setStartYear()
    }
  },
  mounted () {
    this.originYear = moment(this.curDate, 'YYYY-MM-DD').get('year')
    this.thisYear = moment().get('year')
    this.setStartYear()
  }
}
</script>
<style lang="scss" scoped>
%hover-black{
    background-color: $color-black;
    border-radius: 5px;
}
.ic__month-picker {
    margin-top: 10px;
    width: 240px;
    // padding: 0 15px;
    @extend %f-weight-normal;
    font-size: 13px;
}
.ic-date-picker-items{
    @include flex(row,space-between ,center, wrap);
    margin-top: 10px;
    padding: 0 15px;
}
.ic-date-picker-item{
    width: 48px;
    height: 40px;
    @include flex(row,center,center);
    color:$color-white;
    margin-bottom: 5px;
    border-radius: 5px;
    &:hover:not(.ic-date-picker-item__active):not(.ic-date-picker-item__today){
      @include background(5px)
    }
}
.ic-date-picker-item__active{
    background-color: $theme-color-light;
}
.ic-date-picker-item__noactive{
    color:$color-bd-lighter
}
.ic-date-picker-item__today{
    background-color: $dangerous-color;
}
</style>

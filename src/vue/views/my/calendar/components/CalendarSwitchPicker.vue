<template lang="pug">
.calendar__header-switch-picker.pointer
    .calendar__header-switch-picker-left.ibass-arrow-left(@click="pre")
    ic-dropdown(:visible="datePickerState" @visiableChange="visiableChange")
        .calendar__header-switch-picker-main(@click="toggleVisable")
            .calendar__header-switch-picker-label {{label}}
            .ibass-trig-down
        ic-dropdown-menu(slot="dropdown" :theme="'black'" :isNailed="false")
            component(:is="currPicker" :curDate="curDate" @click="selectDate")
    .calendar__header-switch-picker-right.ibass-arrow-right(@click="next")
</template>
<script>
import BackToday from './BackToday.vue'
const pickerMap = {'day': 'date', 'week': 'date', 'month': 'month', 'year': 'year'}
export default {
  components: {BackToday},
  props: {
    type: {
      type: String,
      default: 'month',
    },
    date: {
      type: String,
      default: moment().format('YYYY-MM-DD')
    }
  },
  data () {
    return {
      label: '',
      datePickerState: false,
      curDate: this.date,
      currPicker: ``,
      labelAdaptor: {
        YEAR: function (date) {
          return moment(date, 'YYYY-MM-DD').format('YYYY年')
        },
        MONTH: function (date) {
          return moment(date, 'YYYY-MM-DD').format('YYYY年MM月')
        },
        WEEK: function (date) {
          const _date = moment(date, 'YYYY-MM-DD').startOf('week')
          return `${_date.format('YYYY年MM月DD日')}-${_date.add(6, 'day').format('MM月DD日')}`
        },
        DAY: function (date) {
          return moment(date, 'YYYY-MM-DD').format('YYYY年MM月DD日')
        }
      }
    }
  },
  methods: {
    pre () {
      this.curDate = moment(this.curDate, 'YYYY-MM-DD').subtract(1, this.type).format('YYYY-MM-DD')
      this.updateLabel()
    },
    next () {
      this.curDate = moment(this.curDate, 'YYYY-MM-DD').add(1, this.type).format('YYYY-MM-DD')
      this.updateLabel()
    },
    toggleVisable () {
    },
    visiableChange () {
      this.datePickerState = !this.datePickerState
    },
    backToday (ev) {
      this.selectDate(moment().format('YYYY-MM-DD'))
      this.datePickerState = false
      ev.stopPropagation()
    },
    getLabel (type = 'month') {
      type = type.toUpperCase()
      this.label = this.labelAdaptor[type](this.curDate)
      this.currPicker = `ic-${pickerMap[type.toLowerCase()]}-picker`
    },

    selectDate (item) {
      this.curDate = item
      this.updateLabel()
    },
    updateLabel () {
      this.getLabel(this.type)
      this.$emit('click', this.curDate)
    }
  },
  watch: {
    type (newValue, oldValue) {
      this.getLabel(this.type)
    },
    date (newValue, oldValue) {
      this.curDate = newValue
      this.getLabel(this.type)
    }
  },
  mounted () {
    this.getLabel(this.type)
  }
}
</script>
<style lang="scss" scoped>
.calendar__header-switch-picker, .calendar__header-switch-picker-main{
    @include flex(row,center,center);
    @extend %f-half;
    @extend %f-small;
    [class*=ibass-]{
        color: $color-bd-light;
        &:hover{
          color: $theme-color;
        }
    }
}
.calendar__header-switch-picker-left{
    margin-right: 25px;
}
.calendar__header-switch-picker-right{
margin-left: 12px;
}
.calendar__header-switch-picker-main{
    // margin: 0 25px;
     .ibass-trig-down{
        margin-left: 2px;
        height: 14px;
    };
}
</style>

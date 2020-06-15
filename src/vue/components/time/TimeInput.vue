<template lang="pug">
  .ib__time-input-group
      ic-dropdown(:visible="showDatePicker")
        .ib__time-input-group-item
          ic-input.ib__time-input-group-item(
            ref="dateInput"
            slot="trigger"
            width="130" type="normal" label="日期:"
            v-model="workDate"
            @focus="openDatePicker")
        ic-dropdown-menu(slot="dropdown"  :theme="'black'"  :isNailed="false")
          ic-date-picker.pointer.noselect(:endDate="Date.now()"  :curDate="workDate" @click="selectDate" :hasBackToday="true")
      .ib__time-input-group-item
        ic-input(
          type="normal" width="130" label="时长:"
          v-model="timeInput.duration"
          @keyup="onDurationChange"
          @blur="onDurationBlur(),autoCalc('duration')")
      .ib__time-input-group-item
        ic-input(
          type="normal" width="130" label="开始时间:"
          v-model="timeInput.startTime"
          @keyup="onTimeChange('startTime')"
          @blur="onAutofill('startTime'),autoCalc('startTime')")
      .ib__time-input-group-item
        ic-input(
          type="normal" width="130" label="结束时间:"
          v-model="timeInput.endTime"
          @keyup="onTimeChange('endTime')"
          @blur="onAutofill('endTime'),autoCalc('endTime')")
        .ib__timer-enddate__days.noselect(v-if="crossingDay && timeInput.endTime")
          i.ibass-add
          span {{crossingDay > 99 ? '99' : crossingDay}}
          i.ibass-add.ib__timer-extra-small-icon(v-if="crossingDay > 99")
          span 天
</template>
<script>
import util from './util.js'
import DateUtil from '@/utils/date'
export default {
  data: function () {
    return {
      workDate: moment().format('YYYY-MM-DD'),
      showDatePicker: false,
      timeInput: {
        startTime: '',
        endTime: '',
        duration: ''
      },
      timeValue: {
        startTime: null,
        endTime: null,
        duration: null,
      },
      weight: ['startTime', 'endTime'], // 点击队列，左侧入队
      calcName: ''
    }
  },
  computed: {
    crossingDay () {
      const {startTime, endTime} = this.timeInput
      let days = Math.floor(moment.duration(this.timeInput.duration).asDays())
      if (endTime < startTime) days++
      return days
    }
  },
  methods: {
    openDatePicker () {
      // 时间输入框不允许编辑
      this.$refs.dateInput.$refs.input.blur()
      this.showDatePicker = !this.showDatePicker
    },
    selectDate (date) {
      this.workDate = date
      this.showDatePicker = !this.showDatePicker
    },

    onTimeChange (type) {
      this.timeInput[type] = DateUtil.format(this.timeInput[type])
      this.timeInput[type].length === 5 && this.onAutofill(type)
    },
    onDurationChange () {
      this.timeInput.duration = util.clearInvalidInput(this.timeInput.duration)
      let duration = this.timeInput.duration.split(':')[0]
      if (duration > 2400 || duration.length > 4) {
        this.timeInput.duration = '2400:00'
      }
      this.timeInput.duration.match(/[:|：](\d){2,}$/) && this.onDurationBlur()
    },
    // 自动填充时长
    onDurationBlur () {
      this.setWeight('duration')
      if (this.timeInput.duration) {
        this.timeInput.duration = util.formatForDuration(this.timeInput.duration)
      }
      this.setDurationValue()
    },
    // 记录权重、自动填充
    onAutofill (type) {
      this.setWeight(type)
      if (this.timeInput[type]) {
        this.timeInput[type] = DateUtil.autoFillTime(this.timeInput[type])
      }
      type === 'startTime' ? this.setStartValue() : this.setEndValue()
    },
    setWeight (type) {
      const allType = ['startTime', 'endTime', 'duration']
      if (this.timeInput[type] && this.weight[0] !== type) {
        if (this.weight.some(item => type === item)) {
          this.weight.reverse()
        } else {
          this.weight.pop()
          this.weight.unshift(type)
        }
      }
      let calcName = allType.filter(item => {
        return !this.weight.some(subItem => subItem === item)
      })
      this.calcName = calcName[0]
    },
    calcStartTime () {
      if (this.timeInput.endTime && this.timeInput.duration) {
        this.timeInput.startTime = moment(this.timeValue.endTime - this.timeValue.duration).format('HH:mm')
        this.setStartValue()
      }
    },
    calcEndTime () {
      if (this.timeInput.startTime && this.timeInput.duration) {
        this.timeInput.endTime = moment(this.timeValue.startTime + this.timeValue.duration).format('HH:mm')
        this.setEndValue()
      }
    },
    calcDuration () {
      if (this.timeInput.startTime && this.timeInput.endTime) {
        const duration = moment.duration(this.timeValue.endTime - this.timeValue.startTime)
        const hour = DateUtil.padStartPolyfill(Math.floor(duration.asHours()) + '', 2, '0')
        const minute = DateUtil.padStartPolyfill(duration.minutes() + '', 2, '0')
        this.timeInput.duration = hour + ':' + minute
        this.setDurationValue()
      }
    },
    autoCalc (type) {
      if (this.calcName === type && !this.timeInput[type]) return
      switch (this.calcName) {
        case 'startTime': this.calcStartTime(); break
        case 'endTime': this.calcEndTime(); break
        case 'duration': this.calcDuration(); break
        default:break
      }
    },
    setStartValue () {
      if (this.timeInput.startTime) {
        this.timeValue.startTime = moment(`${this.workDate} ${this.timeInput.startTime}`.trim()).valueOf()
      }
    },
    setEndValue () {
      if (this.timeInput.endTime) {
        this.timeValue.endTime = moment(`${this.workDate} ${this.timeInput.endTime}`.trim()).add(this.crossingDay, 'd').valueOf()
      }
    },
    setDurationValue () {
      this.timeValue.duration = moment.duration(this.timeInput.duration).asMilliseconds()
    }
  },
  watch: {
    timeValue: {
      handler (after) {
        this.$emit('getInput', after, this.workDate)
      },
      deep: true
    },
    workDate (after) {
      this.timeInput.startTime && this.setStartValue()
      this.timeInput.endTime && this.setEndValue()
      this.timeInput.duration && this.setDurationValue()
    }
  }
}
</script>
<style lang="scss" scoped>
  .ib__time-input-group{
    @include flex(row,space-between,center,wrap);
    .ib__time-input-group-item{
      position:relative;
      margin:10px 0;
      /deep/ .ic-input{
        margin:0
      }
      /deep/ .ic-input__label{
        color:$color-text-light;
        margin-bottom: 0.5rem;
        @extend %f-extra-small;
      }
      .ib__timer-enddate__days{
        @include flex(row,center,center);
        height:28px;
        position:absolute;
        right:6px;
        bottom:0;
        @extend %f-extra-small;
        color:$color-bd-light;
        .ibass-add{
          display: block;
          font-size:20px;
          width:16px;
          transform: scale(0.5);
        }
        .ib__timer-extra-small-icon{
          width:12px;
          transform: scale(0.35) translateY(-50%);
          color:$dangerous-color;
        }
      }
    }
  }
</style>

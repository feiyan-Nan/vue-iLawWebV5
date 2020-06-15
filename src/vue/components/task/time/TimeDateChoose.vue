<template lang="pug">
  .ib__task__time__date__choose
    label {{label}}
    .date-time
      .date.pointer
        ic-dropdown(:visible="visible" @visiableChange="visiableChange")
          span {{date}}
          ic-dropdown-menu(slot="dropdown" :theme="'black'" :isNailed="false")
            ic-date-picker(:curDate="date" @click="changeDate")
      .time(v-show="!isFullDay")
        time-input(:value="time" @setTime="setTime")
</template>
<script>
import TimeInput from './TimeInput'
export default {
  components: { TimeInput },
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: Number,
      default: Date.now()
    },
    isFullDay: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    }
  },
  created () {
    this.initial()
  },
  data () {
    return {
      visible: false,
      date: null,
      time: null,
    }
  },
  methods: {
    initial () {
      if (this.value) {
        this.date = moment(this.value).format('YYYY-MM-DD')
        this.time = moment(this.value).format('HH:mm')
      } else {
        this.date = moment(this.value).format('YYYY-MM-DD')
        this.time = moment(this.value).set('seconds', 0).format('HH:mm')
      }
    },
    visiableChange () {
      this.visible = !this.visible
    },
    changeDate (val) {
      this.date = val
      this.$emit('changeTime', {type: this.type, value: moment(`${this.date} ${this.time}`).valueOf()})
    },
    setTime (val) {
      this.time = val
      this.$emit('changeTime', {type: this.type, value: moment(`${this.date} ${this.time}`).valueOf()})
    }
  },
  watch: {
    value (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.initial()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .ib__task__time__date__choose {
    display: flex;
    line-height: 2rem;
    .date-time {
      display: flex;
      .date {
        padding: 0 0.3125rem;
        // margin-right: 1rem;
        &:hover {
          background: $color-bg-base;
        }
      }
    }
  }
</style>

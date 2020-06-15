<template lang="pug">
.calendar__day-view-left
    .calendar__day-view-hour(v-for="item in hoursPoints")
        .calendar__day-view-hour-label.noselect
            span(v-show="!isToday||item.visiable") {{item.label}}
</template>
<script>
const hoursPoints = [{label: '00:00', visiable: true}, {label: '01:00', visiable: true}, {label: '02:00', visiable: true}, {label: '03:00', visiable: true}, {label: '04:00', visiable: true}, {label: '05:00', visiable: true}, {label: '06:00', visiable: true}, {label: '07:00', visiable: true}, {label: '08:00', visiable: true}, {label: '09:00', visiable: true}, {label: '10:00', visiable: true}, {label: '11:00', visiable: true}, {label: '12:00', visiable: true}, {label: '13:00', visiable: true}, {label: '14:00', visiable: true}, {label: '15:00', visiable: true}, {label: '16:00', visiable: true}, {label: '17:00', visiable: true}, {label: '18:00', visiable: true}, {label: '19:00', visiable: true}, {label: '20:00', visiable: true}, {label: '21:00', visiable: true}, {label: '22:00', visiable: true}, {label: '23:00', visiable: true}, {label: '24:00', visiable: true}]
export default {
  props: {
    isToday: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      hoursPoints: hoursPoints,
    }
  },
  methods: {
    setHourLabel () {
      hoursPoints.forEach((item) => {
        item.visiable = Math.abs(moment(item.label, 'HH:mm').diff(moment(), 'minute')) > 9
      })
    }
  },
  mounted () {
    this.setHourLabel()
    this.interval = setInterval(() => {
      this.setHourLabel()
    }, 1000 * 30)
  },
  beforeDestroy () {
    this.interval && clearInterval(this.interval)
  },
}
</script>
<style lang="scss" scoped>
.calendar__day-view-hour {
    height: 60px;
    &:last-child{
        height: unset;
    }
}
.calendar__day-view-hour-label {
    @extend %f-extra-small;
    @extend %color-calendar-hour;
}
</style>

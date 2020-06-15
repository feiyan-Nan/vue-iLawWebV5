<template lang="pug">
.calendar__day-view-hour__now.noselect(:style="{top:`${nowPosition}px`}")
    .calendar__day-view-hour-label {{now}}
    .calendar__day-view-hour-line
    .calendar_today-point(:style="{left:`${pointLeft}px`}")
</template>

<script>
export default {
  props: {
    model: {
      type: String,
      default: 'day'
    },
  },
  data () {
    return {
      nowPosition: Number,
      now: String,
      left: 0
    }
  },
  methods: {
    getCurrLine () {
      this.now = moment().format('HH:mm')
      this.nowPosition = moment().diff(moment().startOf('day'), 'minute')
    },
    setPoint () {
      if (this.model === 'week') this.left = moment().weekday()
    }
  },
  mounted () {
    this.getCurrLine()
    this.ingterval = setInterval(() => {
      this.getCurrLine()
    }, 1000 * 60)
    this.setPoint()
  },
  beforeDestroy () {
    clearInterval(this.ingterval)
  },
  computed: {
    pointLeft () {
      return this.left * 154 + 54
    }
  },
}
</script>

<style lang="scss" scoped>
.calendar__day-view-hour-line {
    height: 1px;
    width: 100%;
    background-color: $theme-color;
    margin-left: 5px;

}
.calendar__day-view-hour__now{
    @include flex(row,flex-start,center);
    position: absolute;
    z-index: 100;
    width: 100%;
    .calendar__day-view-hour-label {
        color: $theme-color;
    };
}
.calendar__day-view-hour-label {
    @extend %f-extra-small;
    @extend %color-calendar-hour;
}
 .calendar_today-point{
     position: absolute;
     height: 5px;
     width: 5px;
     background-color:$theme-color;
     border-radius: 50%;
 }
</style>
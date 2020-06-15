<template lang="pug">
.calendar__day-view-hour-block-wrap
    .calendar__day-view-hour-block(v-for="item in hoursLine")
</template>
<script>
const hoursLine = new Array(25)
export default {
  data () {
    return {
      hoursLine: hoursLine,
    }
  },
}
</script>
<style lang="scss" scoped>
.calendar__day-view-hour-block-wrap{
    top:0;
}
.calendar__day-view-hour-block{
    height: 59px;
    border-top: solid 1px #f0f0f0;
    &:last-child{
        height: unset;
    }
}
</style>

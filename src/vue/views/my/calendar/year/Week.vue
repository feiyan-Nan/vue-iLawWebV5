<template lang="pug">
  .calendar-year-header
    .week(v-for="(day, index) in items" :key="index") {{day}}
</template>
<script>
import calendarUtil from '@/utils/calendar'
export default {
  data () {
    return {
      items: calendarUtil.getCnWeek()
    }
  }
}
</script>
<style lang='scss' scoped>
.calendar-year-header {
  padding: 0 19px;
  @include flex(row,space-between);
  @extend %f-extra-small;
  color: $color-bd-base;
  .week {
    @extend %f-half;
  }
}
</style>

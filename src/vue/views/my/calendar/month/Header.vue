<template lang="pug">
    div.container
        div.task-date(v-for="(day,index) in days" ::key="index")  {{day}}
</template>
<script>
import calendarUtil from '@/utils/calendar'
export default {
  data () {
    return {
      days: calendarUtil.getFullCnWeek()
    }
  }
}
</script>
<style lang="scss" scoped>
.container{
    @include flex(row);
}
.task-date{
    @extend %f-extra-small;
    @extend %color-text-primary  ;
    @include flex(row,center,center);
    line-height: 1.33;
    width: 164px;
    height: 38px;
    box-shadow: inset -1px 0 0 0 #f0f0f0, inset 0 -1px 0 0 #f0f0f0;
    &:nth-child(7n){
      width: 168px;
    }
}
</style>

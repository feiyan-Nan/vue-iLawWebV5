<template lang="pug">
.calendar__header__back-today.pointer(@click="handler")
    .calendar__header__back.ibass-back
    .calendar__header__today.today 今天
</template>
<script>
export default {
  methods: {
    handler (ev) {
      this.$emit('click', ev)
    }
  },
}
</script>
<style lang="scss" scoped>
.calendar__header__back-today {
    // margin-left: 30px;
    height: 100%;
    @include flex(row, center, center);
    @extend %f-small;
    .calendar__header__today {
        margin-left: 5px;
    }
}
.calendar__header__back{
    height: 14px;;
}
</style>

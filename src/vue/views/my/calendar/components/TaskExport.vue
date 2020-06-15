<template lang="pug">
.calendar__footer
     .calendar__footer-export.pointer(@click="exportCalendar") 同步任务到其他日历
</template>

<script>
export default {
  methods: {
    exportCalendar () {
      this.$postMessage.exportTaskToCalendar('')
      // this.instance = this.$modal.open({component: TaskConfirm, width: 350, cb: this.confirm})
    },
    confirm (event) {
      this.instance.close()
    }
  },
}
</script>

<style lang="scss" scoped>
.calendar__footer{
      @include flex(row,flex-end);
      @extend %f-small;
      color:$color-text-secondary;
  }
  .calendar__footer-export{
      &:hover{
          color: $theme-color
      }
  }
</style>

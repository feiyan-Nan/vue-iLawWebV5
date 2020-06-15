<template lang="pug">
.calendar__header-task-remind-wrap
    .calendar__header-task-remind(v-show="!readed")
        .calendar__header-task-remind-label {{label}}
        .calendar__header-task-remind-label__active.pointer(@click="readTask") 日历中查看
        .ibass-close(@click="close")
</template>
<script>
import IlawService from '@/vue/service/ilaw'

export default {
  props: {
    newTasks: {
      type: Array,
      default: function () {
        return []
      }
    },
  },
  data () {
    return {
      readed: false
    }
  },
  methods: {
    close () {
      const ids = this.newTasks
      IlawService.setNewTasksReaded(ids).then(() => { this.readed = true })
    },
    /**
     * 跳转到任务类别查看
     */
    readTask () {
      this.$postMessage.viewNewTaskInList(this.newTasks)
    }
  },
  computed: {
    label () {
      return `你有${this.newTasks.length}个新任务`
    }
  },
}
</script>

<style lang="scss" scoped>
.calendar__header-task-remind-wrap{
    min-width: 230px;
}
.calendar__header-task-remind{
    @extend %f-small;
    @include flex(row,flex-start,center);
    @include background(16px,$color-bg-light,$color-text-primary);
    padding: 0 13px 0 15px;
    height: 30px;
    [class*=ibass-]{
        color:$color-text-secondary;
        @extend %f-mini;
        height: 10px;;
    }
}
.calendar__header-task-remind-label {
}
.calendar__header-task-remind-label__active{
    color: $theme-color;
    margin: 0 8px 0 10px;

}
</style>

<template lang="pug">
.calendar__week-day-wrap
    .calendar__week-day-block(v-for="(item, index) in dayLines" :key="index")
        .calendar__week-tasks
            task-block(:tasks="tasks[index]"  @createTask="createTask($event,index)" @resetTask="resetTask($event,index)" )
</template>
<script>
import TaskBlock from '../components/TaskBlock'
import Util from '../mixins/index'
const dayLines = new Array(7)
export default {
  components: {TaskBlock},
  mixins: [Util],
  props: {
    tasks: {
      type: Array,
    },
    monday: {
      type: Number
    }
  },
  data () {
    return {
      dayLines: dayLines,
      curIndex: 0,
    }
  },
  methods: {

    // 创建任务
    createTask (params, index) {
      params = this.transformDate(params, this.monday, index)
      this._createTask(params)
    },
    // 修改任务时间
    resetTask (params, index) {
      let _params = this.transformDate(params, this.monday, index)
      let keys = ['id', 'timeType', 'dayType', 'repeatRule']
      keys.map((key) => {
        _params[key] = params[key]
      })
      this._resetTaskTime(_params)
    },
  },
}
</script>
<style lang="scss" scoped>
.calendar__week-day-wrap {
    position: absolute;
    top:0;
    @include flex(row);
    height: 1446px;
}
.calendar__week-day-block{
    height: 100%;
    width: 153px;
    z-index: 2;
    border-left: solid 1px $color-bd-regular;
    .calendar__week-tasks{
        position: relative;
        margin-top: 6px;
        height: 100%;
    }
}
</style>

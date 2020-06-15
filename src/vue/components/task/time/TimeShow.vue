<template lang="pug">
  .ib__task__time__show(v-html="content")
</template>
<script>
import {TASK_DAYTYPE, TASK_TIMETYPE} from '@/utils/constants'
export default {
  props: {
    task: {
      type: Object
    },
    listShow: {
      type: Boolean
    }
  },
  methods: {
    getDateFormat (time) {
      let moTime = moment(time)
      let curYear = new Date().getFullYear()
      let startYear = moment(curYear + '-01-01')
      let endYear = moment(curYear + '-12-31')
      return moTime.isBetween(startYear, endYear) ? 'MM-DD' : 'YYYY-MM-DD'
    },
    getTimeStr (time, isFullDay, text) {
      let dateFormat = this.getDateFormat(time)
      let format = isFullDay ? dateFormat : dateFormat + ' HH:mm'
      return `${moment(time).format(format)} ${text || ''}`
    }
  },
  computed: {
    content () {
      let res = '未设置'
      // 先判断权限状态
      if (this.task.valid !== undefined && !this.task.valid) { // 已删除状态
        res = this.getTimeStr(this.task.gmtModified || this.task.updateTime, true)
      } else if (this.task.state !== undefined && this.task.valid && this.task.state) { // 已完成状态
        res = this.getTimeStr(this.task.finishTime, true)
      } else if ((this.task.valid && !this.task.state) || (this.task.valid === undefined && this.task.state === undefined)) { // 未完成状态和创建任务
        let isFullDay = this.task.dayType === TASK_DAYTYPE.FULL.value
        if (this.task.timeType === TASK_TIMETYPE.DUE.value && this.task.dueTime) { // 显示到期时间
          res = this.getTimeStr(this.task.dueTime, isFullDay, '到期')
        } else if (this.task.timeType === TASK_TIMETYPE.STARTEND.value && this.task.startTime && this.task.endTime) { // 根据规则显示开始和结束时间
          if (!this.listShow) {
            res = this.getTimeStr(this.task.startTime, isFullDay, '开始') + '\r\n' + this.getTimeStr(this.task.endTime, isFullDay, '结束')
          } else {
            let text = '结束'
            let time = this.task.endTime
            if (this.listShow && this.task.startTime && Date.now() <= this.task.startTime) {
              text = '开始'
              time = this.task.startTime
            }
            res = this.getTimeStr(time, isFullDay, text)
          }
        }
      }
      return res
    }
  }
}
</script>
<style lang="scss" scoped>
  .ib__task__time__show {
    white-space: pre;
  }
</style>

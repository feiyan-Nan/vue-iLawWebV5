<template lang="pug">
  .ib__time-remind
    label 提醒
    .ib__time-remind__columns
      .ib__time-remind__column(v-for="(remind, index) in reminds")
        time-remind(:remind="remind" :defaultReminds="defaultReminds" :reminds="reminds" @changeRemind="changeRemind")
        .ibass-add-round.pointer(v-show="(index === reminds.length-1) && remind.value!==''" @click="addRemind")
</template>
<script>
import TimeRemind from './TimeRemind'
import {TASK_TIMETYPE, TASK_DAYTYPE, REMIND_DAY_OPTIONS, REMIND_TIME_OPTIONS} from '@/utils/constants'
import ToolUtil from '../../util'
const remindOptions = Object.assign({}, REMIND_TIME_OPTIONS, REMIND_DAY_OPTIONS)

export default {
  components: { TimeRemind },
  props: {
    task: {
      type: Object
    }
  },
  data () {
    return {
      adding: false
    }
  },
  methods: {
    /**
     * 获取提醒描述
     */
    getRemindDesc (value, type) {
      if (type === 'customTime') {
        return ToolUtil.getCustomTimeDesc(value)
      } else {
        // value是0DB
        return `${this.preText()}${remindOptions[value].label}`
      }
    },
    /**
     * 提醒添加对前缀文本
     */
    preText () {
      return this.task.timeType === TASK_TIMETYPE.DUE.value ? '到期' : '开始'
    },
    /**
     * 修改提醒数据
     */
    changeRemind (data) {
      let remindSetting = _.cloneDeep(this.task.remindSetting)
      if (data.before.value === '' && data.after.value !== '') { // 设置值
        remindSetting[data.after.type].push(data.after.value)
      } else if (data.before.value !== '' && data.after.value !== '') { // 修改值
        if (data.before.type !== data.after.type) { // 如果前后类型不一致
          remindSetting[data.before.type] = remindSetting[data.before.type].filter(r => r !== data.before.value)
          remindSetting[data.after.type].push(data.after.value)
        } else {
          let index = remindSetting[data.before.type].indexOf(data.before.value)
          remindSetting[data.before.type][index] = data.after.value
        }
      } else if (data.before.value !== '' && data.after.value === '') { // 取消值
        remindSetting[data.before.type] = remindSetting[data.before.type].filter(r => r !== data.before.value)
      }
      this.adding = false
      this.$emit('changeRemind', remindSetting)
    },
    addRemind () {
      this.adding = true
    }
  },
  computed: {
    /**
     * 当前任务设置的提醒
     */
    reminds () {
      let res = []
      let {ruleTime, customTime} = this.task.remindSetting
      if (Array.isArray(ruleTime)) {
        ruleTime.forEach(r => {
          // console.log(r, 'KKKKKK')
          res.push({
            value: r,
            type: 'ruleTime',
            desc: this.getRemindDesc(r, 'ruleTime')
          })
        })
      }
      if (Array.isArray(customTime)) {
        customTime.forEach(r => {
          res.push({
            value: r,
            type: 'customTime',
            desc: this.getRemindDesc(r, 'customTime')
          })
        })
      }
      // 如果没有任何设置，默认增加一个无的选项
      if (res.length === 0) {
        res = [{value: '', type: '', desc: '无'}]
      }
      if (this.adding) {
        res.push({value: '', type: '', desc: '无'})
      }
      return res
    },
    defaultReminds () {
      let res = []
      // 如果没有选择时间，直接返回
      if (this.task.dueTime || this.task.startTime || this.task.endTime) {
        if (this.task.dayType === TASK_DAYTYPE.FULL.value) {
          res = Object.values(REMIND_DAY_OPTIONS)
        } else {
          res = Object.values(REMIND_TIME_OPTIONS).concat(Object.values(REMIND_DAY_OPTIONS))
        }
      }
      // 处理结果中对描述字段
      res.forEach(r => {
        // console.log(r)
        r.type = 'ruleTime'
        r.desc = `${this.preText()}${r.label}`
      })
      return res
    }
  }
}
</script>
<style lang="scss" scoped>
.ib__time-remind {
  display: flex;
  .ib__time-remind__columns {
    .ib__time-remind__column {
        display: flex;
        height: 2rem;
        line-height: 2rem;
        .ibass-add-round {
            @extend %f-normal;
            color: $color-bd-regular;
            transition: all .2s;
            &:before {
              vertical-align: -3px
            }
            &:hover {
              color: $theme-color-lighter;
            }
        }
        /deep/ .ic__tooltip-content {
          top: 0
        }
    }
  }
}
</style>

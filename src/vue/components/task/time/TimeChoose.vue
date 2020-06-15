<template lang="pug">
  .ib__task__time__choose(@mouseover="hover=true" @mouseout="hover=false")
    template(v-if="editable && (!listShow || display || hover)")
      ic-popover(position="bottom" :triangle="false" :scrollable="true" :appendToBody="appendToBody" :positionX="positionX" :positionY="positionY" v-model="visible" @afterChangeVisible="afterChangeVisible")
        .ib__task__time__popover
          .ib__task__time__header
            .ib__task__time__title.pointer(v-for="type in taskTimeTypes" @click="changeTimeType(type.value)" :class="{'active': tmpTask.timeType === type.value}") {{type.text}}
          .ib__task__time__time
            .ib__task__time__fullday
              label 全天
              .icon(:class="{'ibass-checkbox': !isFullDay, 'ibass-checked': isFullDay}" @click="changeFullDay")
            .ib__task__time__date
              template(v-if="tmpTask.timeType === TASK_TIMETYPE.DUE.value")
                time-date-choose(label="到期时间" :value="tmpTask.dueTime" :isFullDay="isFullDay" type="dueTime" @changeTime="changeTime")
              template(v-else)
                time-date-choose(label="开始时间" :value="tmpTask.startTime" :isFullDay="isFullDay" type="startTime" @changeTime="changeTime")
                .end__time__date(:class="{'unavailable': storedOffset}")
                  time-date-choose(label="结束时间" :value="tmpTask.endTime" :isFullDay="isFullDay" type="endTime" @changeTime="changeTime")
          .ib__task__time__repeat
            time-repeat-choose(:task="tmpTask" @changeRepeatRule="changeRepeatRule")
          .ib__task__time__remind
            time-remind-choose(:task="tmpTask" @changeRemind="changeRemind")
          .ib__task__time__footer
            .ib__task__time__operate
              span.pointer(@click="clearTime") 清空
              ic-button.ib__task__time__confirm(@click="confirm" :class="{'unavailable': storedOffset}") 确定
        .ib__task__time__choose__trigger(slot="trigger" :class="{'active': timeChooseActive}")
          time-show(:task="task" :listShow="listShow")
          .ibass-trig-down(v-if="isOverTime" :style="{'color': '#F72B44'}" :class="{'active': !listShow}")
          .ibass-trig-down(v-else :style="{'color': '#FA8919'}" :class="{'active': !listShow}")
    template(v-else)
      .ib__task__time__choose__trigger(:class="{'active': timeChooseActive}")
        time-show(:task="task" :listShow="listShow")
</template>
<script>
import TimeShow from './TimeShow'
import TimeDateChoose from './TimeDateChoose'
import TimeRepeatChoose from './repeat/TimeRepeatChoose'
import TimeRemindChoose from './remind/TimeRemindChoose'
import { TASK_DAYTYPE, TASK_TIMETYPE, REMIND_TIME_OPTIONS } from '@/utils/constants'
import TaskService from '@/vue/service/task'

export default {
  components: {
    TimeShow,
    TimeDateChoose,
    TimeRepeatChoose,
    TimeRemindChoose
  },
  props: {
    task: {
      type: Object
    },
    editable: { // 是否可编辑
      type: Boolean,
      default: false
    },
    listShow: { // 是否列表展示
      type: Boolean,
      default: false
    },
    appendToBody: { // 是否添加到Body
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      TASK_TIMETYPE,
      TASK_DAYTYPE,
      tmpTask: _.cloneDeep(this.task),
      visible: false,
      storedOffset: 0,
      settingRemind: null,
      positionX: 0,
      positionY: 0,
      hover: false,
      display: false
    }
  },
  mounted () {
    if (this.listShow) {
      this.positionX = -60
      this.positionY = 50
    }
  },
  methods: {
    afterChangeVisible (visible) {
      this.$emit('afterChangeVisible', visible)
    },
    initialTime () {
      this.tmpTask = _.cloneDeep(this.task)
      if (!this.tmpTask.dueTime && !this.tmpTask.startTime && !this.tmpTask.endTime) {
        this.tmpTask.dueTime = this.addHour(Date.now(), 1)
        this.tmpTask.dayType = TASK_DAYTYPE.UN_FULL.value
        this.tmpTask.timeType = TASK_TIMETYPE.DUE.value
      }
    },
    /**
     * 修改时间类型
     */
    changeTimeType (val) {
      if (this.tmpTask.timeType !== val) {
        this.tmpTask.timeType = val
        // 如果没有设置时间则重新设置时间，如果设置了时间，那么不做处理了
        if (this.isDueTimeType) {
          this.tmpTask.dueTime = this.tmpTask.dueTime || this.tmpTask.endTime
          this.storedOffset = 0
        } else {
          if (this.isFullDay) {
            this.tmpTask.endTime = this.tmpTask.endTime || this.keepDate(this.tmpTask.dueTime)
            this.tmpTask.startTime = this.tmpTask.startTime || this.tmpTask.endTime
          } else {
            this.tmpTask.endTime = this.tmpTask.endTime || this.tmpTask.dueTime
            this.tmpTask.startTime = this.tmpTask.startTime || this.addHour(this.tmpTask.endTime, -1)
          }
          this.storedOffset = Math.min(0, this.tmpTask.endTime - this.tmpTask.startTime)
        }
      }
    },
    /**
     * 修改全天类型
     */
    changeFullDay () {
      this.tmpTask.dayType = this.isFullDay ? TASK_DAYTYPE.UN_FULL.value : TASK_DAYTYPE.FULL.value
      // 处理全天和非全天切换的时间显示，全天和非全天切换的时候，到期/结束时间默认填为17点，开始时间填充为9点
      this.tmpTask.dueTime = this.isFullDay ? this.keepDate(this.tmpTask.dueTime || this.tmpTask.endTime) : this.addHour(this.keepDate(this.tmpTask.dueTime || this.tmpTask.endTime), 17)
      this.tmpTask.startTime = this.isFullDay ? this.keepDate(this.tmpTask.startTime || this.tmpTask.dueTime) : this.addHour(this.keepDate(this.tmpTask.startTime || this.tmpTask.dueTime), 9)
      this.tmpTask.endTime = this.isFullDay ? this.keepDate(this.tmpTask.endTime || this.tmpTask.dueTime) : this.addHour(this.keepDate(this.tmpTask.endTime || this.tmpTask.dueTime), 17)
      this.storedOffset = this.isDueTimeType ? 0 : Math.min(0, this.tmpTask.endTime - this.tmpTask.startTime)
    },
    /**
     * 清空时间
     */
    clearTime () {
      if (this.task.id && this.task.repeatSetting && this.task.repeatSetting.repeatRule && this.task.repeatSetting.repeatRule !== 'none') {
        this.$postMessage.toast({msg: '重复任务无法清空时间信息'})
        return
      }
      // 清空时间相关
      let timeData = {
        dueTime: null,
        startTime: null,
        endTime: null,
        dayType: TASK_DAYTYPE.UN_FULL.value,
        timeType: TASK_TIMETYPE.DUE.value
      }
      Object.assign(this.tmpTask, timeData)
      this.storedOffset = 0
      // 清空重复相关
      Object.assign(this.tmpTask.repeatSetting, {
        repeatRule: 'none',
        customRepeatRule: null,
        endType: null,
        endByDate: null,
        endByTimes: null,
        dayIndexList: []
      })
      // 清空默认规则，不清空用户自定义内容
      if (this.tmpTask.remindSetting) {
        this.tmpTask.remindSetting.ruleTime = []
      }
      this.$emit('setTime', {
        time: timeData,
        repeat: this.tmpTask.repeatSetting,
        remind: this.tmpTask.remindSetting
      })
      this.visible = false
    },
    changeTime (data) {
      let curVal = this.tmpTask[data.type]
      this.tmpTask[data.type] = data.value
      // 根据type类型进行联动
      if (data.type === 'startTime') {
        let offset = this.storedOffset || this.tmpTask.endTime - curVal
        if (offset !== 0) {
          this.tmpTask.endTime = this.tmpTask.startTime + offset
        }
      } else if (data.type === 'endTime') {
        // 去更小的值来作为时间间隔
        this.storedOffset = Math.min(this.tmpTask.endTime - this.tmpTask.startTime, 0)
      }
    },
    confirm () {
      if (this.storedOffset !== 0) {
        return
      }
      let timeData = {
        timeType: this.tmpTask.timeType,
        dayType: this.tmpTask.dayType
      }
      if (this.isDueTimeType) {
        timeData.dueTime = this.isFullDay ? this.keepDate(this.tmpTask.dueTime) : this.tmpTask.dueTime
      } else {
        timeData.startTime = this.isFullDay ? this.keepDate(this.tmpTask.startTime) : this.tmpTask.startTime
        timeData.endTime = this.isFullDay ? this.keepDate(this.tmpTask.endTime) : this.tmpTask.endTime
      }
      this.$emit('setTime', {
        time: timeData,
        repeat: this.tmpTask.repeatSetting,
        remind: this.tmpTask.remindSetting
      })
      this.visible = false
    },
    addHour (time, hours) {
      let date = this.keepHour(time)
      date.setHours(date.getHours() + hours)
      return date.getTime()
    },
    // 只保留日期的时间戳
    keepDate (time) {
      let date = this.keepHour(time)
      date.setHours(0)
      return date.getTime()
    },
    keepHour (time) {
      let date = new Date(time)
      date.setMinutes(0)
      date.setSeconds(0)
      date.setMilliseconds(0)
      return date
    },
    changeRepeatRule (data) {
      Object.assign(this.tmpTask.repeatSetting, data)
    },
    changeRemind (data) {
      Object.assign(this.tmpTask.remindSetting, data)
    },
    async initialRemind () {
      if (!this.settingRemind) {
        // 获取配置好的提醒信息
        let res = await TaskService.querySettingRemind()
        this.settingRemind = res.data
      }
      // 查询任务的提醒
      if (this.task.id && !this.tmpTask.remindSetting.ruleTime && !this.tmpTask.remindSetting.customTime) {
        let res = await TaskService.queryTaskRemind(this.task.id)
        this.tmpTask.remindSetting = {
          ruleTime: res.data && res.data.ruleTime ? res.data.ruleTime : [],
          customTime: res.data && res.data.customTime ? res.data.customTime : []
        }
      }
      // 如果没有任务没有设置时间（也就是创建任务的时候才会默认填充）
      if (!this.task.dueTime && !this.task.startTime && !this.task.endTime) {
        this.setSettingRemind()
      }
    },
    /**
     * 设置用户设置的提醒
     */
    setSettingRemind () {
      if (this.settingRemind) {
        if (this.isFullDay) {
          this.tmpTask.remindSetting.ruleTime = this.tmpTask.remindSetting.ruleTime.filter(r => {
            return !Object.keys(REMIND_TIME_OPTIONS).includes(r)
          })
        }
        let {status, allDayTaskReminderTime, notAllDayTaskReminderTime} = this.settingRemind
        let rules = this.tmpTask.dayType === TASK_DAYTYPE.FULL.value ? allDayTaskReminderTime : notAllDayTaskReminderTime
        if (status && rules) {
          rules.forEach(r => {
            if (!this.tmpTask.remindSetting.ruleTime.includes(r)) {
              this.tmpTask.remindSetting.ruleTime.push(r)
            }
          })
        }
      }
    },
  },
  computed: {
    taskTimeTypes () {
      return Object.values(TASK_TIMETYPE)
    },
    isFullDay () {
      return this.tmpTask.dayType === TASK_DAYTYPE.FULL.value
    },
    isDueTimeType () {
      return this.tmpTask.timeType === TASK_TIMETYPE.DUE.value
    },
    timeChooseActive () {
      return this.visible || !this.listShow || this.task.dueTime || this.task.startTime || this.task.endTime || !this.task.valid || this.task.state
    },
    isOverTime () {
      // 获得当前系统的时间
      let currentDate = new Date()
      let res = false
      // 只有在任务设置了时间，且为非完成，非删除状态下才会进行超时的显示处理
      if (this.task.valid && !this.task.state) {
        // 如果是全天任务
        if (this.task.dayType === TASK_DAYTYPE.FULL.value) {
          currentDate.setHours(0)
          currentDate.setMinutes(0)
          currentDate.setSeconds(0)
          currentDate.setMilliseconds(0)
        }
        let currentTime = currentDate.getTime()
        res = (this.task.dueTime && this.task.dueTime < currentTime) || (this.task.endTime && this.task.endTime < currentTime)
      }
      return res
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.initialTime()
        this.initialRemind()
      }
      this.$nextTick(() => {
        this.display = newVal
      })
    },
    'tmpTask.dayType': {
      handler: function (newer, older) {
        // 添加判断，必须要有时间范围的时候才进行请求
        if (newer !== older) {
          this.setSettingRemind()
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .ib__task__time__choose {
    width: fit-content;
  }
  .ib__task__time__choose__trigger {
    display: flex;
    align-items: flex-end;
    opacity: 0;
    transition: all .2s;
    &.active {
      opacity: 1;
    }
    &:hover {
      .ibass-trig-down {
        opacity: 1
      }
    }
    .ibass-trig-down {
      opacity: 0;
      position: relative;
      top: 2px;
      transition: all 0.2s;
      color: $theme-color-light;
      &.active {
        opacity: 1;
      }
    }
  }
  .ib__task__time__popover {
    width: 18.75rem;
    @extend %f-small;
    .ib__task__time__header {
      display: flex;
      border-top-left-radius: 0.625rem;
      border-top-right-radius: 0.625rem;
      overflow: hidden;
      .ib__task__time__title {
        width: 50%;
        height: 2.5rem;
        line-height: 2.5rem;
        background: $color-bg-light;
        text-align: center;
        @extend %f-extra-small;
        transition: all 0.2s;
        &.active {
          background: $color-white;
          color: $theme-color-light;
        }
        &:hover {
          color: $theme-color-light;
        }
      }
    }
    .ib__task__time__time {
      padding: 0.625rem 0;
      border-bottom: 1px solid $color-bd-title;
      /deep/ label {
        width: 5rem;
        height: 2rem;
        line-height: 2rem;
        text-align: right;
        margin-right: 1.4375rem;
        color: $color-text-placeholder;
      }
      .ib__task__time__fullday {
        display: flex;
        line-height: 2rem;
        .icon {
          padding: 0 0.3125rem;
          &:before {
            vertical-align: -2px;
          }
          &.ibass-checked {
            color: $theme-color-light;
          }
        }
      }
      .ib__task__time__date {
        .end__time__date {
          &.unavailable {
            /deep/ .date-time {
              background-color: $dangerous-color-light;
            }
          }
        }
      }
    }
    .ib__task__time__repeat, .ib__task__time__remind {
      border-bottom: 1px solid $color-bd-title;
      padding: 0.625rem 0;
      /deep/ label {
        width: 5rem;
        height: 2rem;
        line-height: 2rem;
        text-align: right;
        margin-right: 1.4375rem;
        color: $color-text-placeholder;
      }
    }
    .ib__task__time__footer {
      padding: 0.5rem 1.5625rem;
      // border-top: 1px solid $color-bd-title;
      color: $color-text-secondary;
      line-height: 1.5rem;
      .ib__task__time__operate {
        display: flex;
        width: fit-content;
        transition: all .2s;
        span {
          margin-right: 4rem;
          line-height: 2rem;
          &:hover {
            color: $theme-color-light;
          }
        }
        .ib__task__time__confirm {
          width: 5rem;
          height: 1.125rem;
          &.unavailable {
            background: $color-bd-title;
            border-color: $color-bd-title;
            cursor: default;
            &:hover{
                box-shadow: none;
            }
          }
        }
      }
    }
  }
</style>

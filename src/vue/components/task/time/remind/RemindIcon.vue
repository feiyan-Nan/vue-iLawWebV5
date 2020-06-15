<template lang="pug">
  .ib__remind__icon__tooltip
    ic-tooltip
      .icon.ibass-alarm(:class="{'active': remindDescs.length > 0}")
      .remind__ooltip(slot="content")
        span(v-if="remindDescs.length === 0") 未设置
        div(v-else)
          .title 已设置提醒:
          ul
            li(v-for="desc in remindDescs")
              .ibass-dot
              span {{desc}}
</template>
<script>
import { TASK_TIMETYPE, REMIND_DAY_OPTIONS, REMIND_TIME_OPTIONS } from '@/utils/constants'
import ToolUtil from '../../util'
export default {
  props: {
    timeType: {
      type: String | Number
    },
    remindSetting: {
      type: Object,
    }
  },
  computed: {
    remindDescs () {
      let res = []
      let preText = this.timeType === TASK_TIMETYPE.DUE ? '到期' : '开始'
      let {ruleTime, customTime} = this.remindSetting
      const remindOptions = Object.assign({}, REMIND_TIME_OPTIONS, REMIND_DAY_OPTIONS)
      ruleTime && ruleTime.forEach(r => {
        let desc = `${preText}${remindOptions[r].label}`
        res.push(desc)
      })
      customTime && customTime.forEach(r => {
        res.push(ToolUtil.getCustomTimeDesc(r))
      })
      return res
    }
  }
}
</script>
<style lang="scss" scoped>
  .ib__remind__icon__tooltip {
    .icon {
      margin: 0 5px;
      transition: all 0.2s;
      &.active {
        color: $theme-color-light;
      }
    }
    .remind__ooltip {
      ul {
        width: max-content;
        li {
          display: flex;
          word-break: keep-all;
          .ibass-dot {
            vertical-align: -0.125rem;
          }
        }
      }
    }
  }
</style>

<template lang="pug">
  .ib__repeat__icon__tooltip
    ic-tooltip
      .icon.ibass-loop(:class="{'active': repeatDesc}")
      .repeat__tooltip(slot="content")
        span(v-if="!repeatDesc") 未设置
        ul(v-else)
          li {{repeatDesc}}
          li {{endRuleDesc}}
</template>
<script>
import ToolUtil from '../../util'
export default {
  props: {
    repeatSetting: {
      type: Object,
    }
  },
  computed: {
    repeatDesc () {
      let res = ''
      if (this.repeatSetting.repeatRule && this.repeatSetting.repeatRule !== 'none') {
        let { repeatRule, customRepeatRule, dayIndexList } = this.repeatSetting
        let desc = ToolUtil.getRepeatRuleDesc(repeatRule, customRepeatRule, dayIndexList)
        res = `${desc}重复`
      }
      return res
    },
    endRuleDesc () {
      let res = ''
      if (this.repeatSetting.repeatRule && this.repeatSetting.repeatRule !== 'none') {
        res = ToolUtil.getRepeatEndRuleDesc(this.repeatSetting)
      }
      return res
    }
  }
}
</script>
<style lang="scss" scoped>
  .ib__repeat__icon__tooltip {
    .icon {
      margin: 0 5px;
      transition: all 0.2s;
      &.active {
        color: $theme-color-light;
      }
    }
    .repeat__tooltip {
      ul {
        max-width: 7.5rem;
        width: max-content;
      }
    }
  }
</style>

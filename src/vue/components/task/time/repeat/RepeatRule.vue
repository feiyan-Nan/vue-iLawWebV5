<template lang="pug">
  .ib__repeat-rule
    ic-popover(position="bottom" :triangle="false" :appendToBody="false" :positionY="positionY" :scrollable="true" v-model="visible")
      .items(v-if="!customChoosing")
        .item.pointer(v-for="rule in defaultRules" @click="changeRepeatRule(rule.value)" :class="{'active': repeatSetting.repeatRule === rule.value}")
          .ibass-checkmark
          span {{rule.label}}
        .split-line
        .item.pointer(:class="{'active': repeatSetting.repeatRule === 'custom'}" @click="gotoCustom")
          .ibass-checkmark
          span {{repeatSetting.repeatRule !== 'custom' ? '添加自定义' : '自定义'}}
      custom-repeat(
        v-else
        :customRepeatRule="repeatSetting.customRepeatRule"
        :dayIndexList="repeatSetting.dayIndexList"
        @changeCustomRule="changeCustomRule"
      )
      .ib__repeat-rule__trigger(slot="trigger" :class="{'choosed': repeatSetting.repeatRule !== 'none'}")
        .text {{repeatRuleDesc}}
        .ibass-arrow-down
</template>
<script>
import {DEFAULT_RULES, END_RULES} from '@/utils/constants'
import CustomRepeat from './CustomRepeat'
import ToolUtil from '../../util'
export default {
  components: { CustomRepeat },
  props: {
    task: {
      type: Object
    }
  },
  data () {
    return {
      visible: false,
      customChoosing: false,
      positionY: 0
    }
  },
  methods: {
    changeRepeatRule (val) {
      this.visible = false
      // 如果为无则清空重复数据
      if (val === 'none') {
        this.$emit('changeRepeatRule', {
          repeatRule: val,
          customRepeatRule: null,
          endType: null,
          endByDate: null,
          endByTimes: null,
          dayIndexList: []
        })
      } else {
        this.$emit('changeRepeatRule', {
          repeatRule: val,
          customRepeatRule: null,
          endType: this.repeatSetting.endType || END_RULES.unlimited.value,
          dayIndexList: []
        })
      }
    },
    changeCustomRule (rule) {
      this.visible = false
      if (rule) {
        this.$emit('changeRepeatRule', {
          repeatRule: 'custom',
          customRepeatRule: rule.customRepeatRule,
          dayIndexList: rule.dayIndexList,
          endType: this.repeatSetting.endType || END_RULES.unlimited.value,
        })
      }
    },
    getPositionY () {
      let ind = 0
      this.defaultRules.forEach((rule, index) => {
        if (rule.value === this.repeatSetting.repeatRule) {
          ind = index
        }
      })
      return this.customChoosing ? -8 : -ind * 32 - 8
    },
    gotoCustom () {
      this.customChoosing = true
      this.positionY = -8
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.customChoosing = false
        this.positionY = this.getPositionY()
      }
    }
  },
  computed: {
    repeatSetting () {
      return this.task.repeatSetting
    },
    defaultRules () {
      return Object.values(DEFAULT_RULES)
    },
    repeatRuleDesc () {
      return ToolUtil.getRepeatRuleDesc(this.repeatSetting.repeatRule, this.repeatSetting.customRepeatRule, this.repeatSetting.dayIndexList)
    },
  }
}
</script>
<style lang="scss" scoped>
  .ib__repeat-rule {
    .items {
      width: 10rem;
      padding: 0.5rem 0;
      .item {
        display: flex;
        height: 2rem;
        line-height: 2rem;
        padding: 0 1rem;
        transition: all .2s;
        &:hover {
          background: $color-bg-light;
        }
        &.active {
          background: $color-bg-light;
          .ibass-checkmark {
            opacity: 1;
          }
        }
        .ibass-checkmark {
          opacity: 0;
          color: $theme-color-light;
        }
        span {
          margin-left: 1rem;
        }
      }
      .split-line {
        width: 100%;
        height: 1px;
        margin: 0.5rem 0;
        background: $color-bd-title;
      }
    }
    .ib__repeat-rule__trigger {
      display: flex;
      max-width: 11.25rem;
      padding: 0 0.3125rem;
      transition: all .2s;
      align-items: flex-end;
      color: $color-text-placeholder;
      &:hover {
          background: $color-bg-light;
          .ibass-arrow-down {
              opacity: 1;
          }
      }
      &.choosed {
          color: $color-text-primary;
          .ibass-arrow-down {
              opacity: 1;
          }
      }
      .ibass-arrow-down {
        transform: scale(0.5);
        opacity: 0;
      }
    }
  }
</style>

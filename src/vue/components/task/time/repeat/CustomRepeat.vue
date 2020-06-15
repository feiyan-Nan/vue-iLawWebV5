<template lang="pug">
  .ib__custom-repeat
    .ib__custom-repeat__unit
      label 周期
      custom-repeat-rule(:ruleUnit="unit" @changeUnit="changeUnit")
    .ib__custom-repeat__frequence
      label 频率
      custom-repeat-frequence(:frequence="frequence" :unit="unit" @changeFrequnece="changeFrequnece")
    .ib__custom-repeat__weeklist(v-if="unit === CUSTOM_RULE_UNIT.W.value")
      .week__item.pointer(v-for="day in weekDays" @click="changeWeekDay(day.value)" :class="{'active': tmpDayIndexList.includes(day.value)}") {{day.name}}
    .ib__custom-repeat__operate
      a.cancel.pointer(@click="cancel") 取消
      a.confirm.pointer(@click="confirm") 确定
</template>
<script>
import { CUSTOM_RULE_UNIT, WEEK_LIST } from '@/utils/constants'
import CustomRepeatFrequence from './CustomRepeatFrequence'
import CustomRepeatRule from './CustomRepeatRule'
export default {
  components: {CustomRepeatFrequence, CustomRepeatRule},
  props: {
    customRepeatRule: {
      type: String
    },
    dayIndexList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  created () {
    this.initial()
  },
  data () {
    return {
      unit: CUSTOM_RULE_UNIT.D.value,
      frequence: 1,
      CUSTOM_RULE_UNIT,
      tmpDayIndexList: _.cloneDeep(this.dayIndexList) || []
    }
  },
  methods: {
    initial () {
      if (this.customRepeatRule) {
        let arr = this.customRepeatRule.split('-')
        this.frequence = Number(arr[0]) || 1
        this.unit = arr[1] || CUSTOM_RULE_UNIT.D.value
      }
    },
    changeUnit (val) {
      this.unit = val
      this.frequence = 1
      // 修改自定义规则时候清空自定义重复星期
      if (val === CUSTOM_RULE_UNIT.W.value) {
        let currentDay = new Date().getDay()
        currentDay = currentDay === 0 ? 7 : currentDay
        this.tmpDayIndexList = [currentDay]
      } else {
        this.tmpDayIndexList = []
      }
    },
    changeFrequnece (val) {
      this.frequence = val
    },
    cancel () {
      this.$emit('changeCustomRule')
    },
    confirm () {
      this.$emit('changeCustomRule', {customRepeatRule: `${this.frequence}-${this.unit}`, dayIndexList: this.tmpDayIndexList.sort()})
    },
    changeWeekDay (val) {
      // 有这个时间就移除，没有就添加
      if (this.tmpDayIndexList.includes(val)) {
        // 至少保留一个数据
        if (this.tmpDayIndexList.length > 1) {
          this.tmpDayIndexList = this.tmpDayIndexList.filter(day => {
            return day !== val
          })
        }
      } else {
        this.tmpDayIndexList.push(val)
      }
    }
  },
  computed: {
    weekDays () {
      return Object.values(WEEK_LIST)
    }
  },
  watch: {
    customRepeatRule () {
      this.initial()
    }
  }
}
</script>
<style lang="scss" scoped>
  .ib__custom-repeat {
    width: 13.75rem;
    padding: 0.5rem 1rem;
    .ib__custom-repeat__unit, .ib__custom-repeat__frequence {
      display: flex;
      label {
        text-align: left;
        width: 2rem;
      }
    }
    .ib__custom-repeat__weeklist {
      display: flex;
      margin: 0.5rem 0;
      @extend %f-extra-small;
      .week__item {
        width: 1.5rem;
        height: 1.5rem;
        line-height: 1.5rem;
        border: 1px solid $color-bd-regular;
        border-right: 0;
        text-align: center;
        &:last-child {
            border-right: 1px solid $color-bd-regular;
        }
        &.active {
          background: $color-text-light;
          color: $color-white;
        }
      }
    }
    .ib__custom-repeat__operate {
      display: flex;
      justify-content: flex-end;
      margin: 0.5rem 0;
      line-height: 2rem;
      a {
        display: block;
        height: 2rem;
        padding: 0 1rem;
        margin-right: 0.5rem;
        border-radius: 0.125rem;
        &.cancel {
          box-sizing: border-box;
          border: 1px solid $color-bd-light;
        }
        &.confirm {
          background: $theme-color-light;
          color: $color-white;
        }
      }
    }
  }
</style>

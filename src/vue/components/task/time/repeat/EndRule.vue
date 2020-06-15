<template lang="pug">
  .ib__task__time-repeat__end-rule__main
    .ib__task__time-repeat__end-rule__main__popover
      ic-popover(position="bottom" :triangle="false" :appendToBody="false" :positionY="positionY" :scrollable="true" v-model="visible")
        .items
          .item.pointer(v-for="rule in endRules" @click="changeRepeatEndRule(rule.value)" :class="{'active': task.repeatSetting.endType === rule.value}")
            .ibass-checkmark
            span {{rule.label}}
        .ib__task__time-repeat__trigger(slot="trigger" :class="{'choosed': task.repeatSetting.endType}")
            .text {{repeatEndRuleStr}}
            .ibass-arrow-down
    .ib__task__time-repeat__end-rule__attach
      .ib__task__time-repeat__end-rule__date.pointer(v-if="task.repeatSetting.endType === END_RULES.end_by_day.value")
        ic-dropdown(:visible="dateVisible" @visiableChange="dateVisibleChange")
          span {{endByDate}}
          ic-dropdown-menu(slot="dropdown" :theme="'black'" :isNailed="false")
            ic-date-picker(:curDate="endByDate" :startDate="limitStartDate" :endDate="maxEndDate" @click="changeDate")
      .ib__task__time-repeat__end-rule__times(v-if="task.repeatSetting.endType === END_RULES.end_by_times.value")
        ic-input(width="35" :maxlength="2" v-model="endByTimes" @keyup="keyup" @blur="blur")
        span 次
</template>
<script>
import {END_RULES} from '@/utils/constants'
export default {
  props: {
    task: {
      type: Object
    }
  },
  data () {
    return {
      visible: false,
      dateVisible: false,
      END_RULES,
      endByTimes: this.task.repeatSetting.endByTimes,
      positionY: 0,
      endByDate: moment(this.task.repeatSetting.endByDate).format('YYYY-MM-DD'),
      maxEndDate: moment().add(3, 'year').format('YYYY-MM-DD') // 最大时间限制为3年
    }
  },
  methods: {
    changeRepeatEndRule (val) {
      this.visible = false
      if (this.task.repeatSetting.repeatRule !== 'none') {
        let endType = val
        let endByDate = ''
        let endByTimes = ''
        if (val === END_RULES.end_by_day.value) {
          endByDate = this.limitStartDate
          this.endByDate = this.limitStartDate
        } else if (val === END_RULES.end_by_times.value) {
          endByTimes = 10
          this.endByTimes = 10
        }
        this.$emit('changeRepeatRule', {
          endType,
          endByDate,
          endByTimes
        })
      }
    },
    keyup (val) {
      this.endByTimes = val.replace(/\D/g, '').replace(/^0*/g, '')
      this.$emit('changeRepeatRule', {
        endByTimes: this.endByTimes
      })
    },
    blur () {
      if (!this.endByTimes || this.endByTimes === 0) {
        this.endByTimes = 1
      }
    },
    getPositionY () {
      let ind = 0
      this.endRules.forEach((rule, index) => {
        if (rule.value === this.task.repeatSetting.endType) {
          ind = index
        }
      })
      return -ind * 32 - 8
    },
    changeDate (val) {
      this.endByDate = val
      this.$emit('changeRepeatRule', {
        endByDate: this.endByDate
      })
    },
    dateVisibleChange () {
      this.dateVisible = !this.dateVisible
    }
  },
  computed: {
    endRules () {
      return Object.values(END_RULES)
    },
    repeatEndRuleStr () {
      return END_RULES[this.task.repeatSetting.endType] ? END_RULES[this.task.repeatSetting.endType].label : '无'
    },
    limitStartDate () {
      return moment(this.task.dueTime || this.task.startTime).format('YYYY-MM-DD')
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.positionY = this.getPositionY()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .ib__task__time-repeat__end-rule__main {
    display: flex;
    .ib__task__time-repeat__end-rule__main__popover {
      margin-right: 0.625rem;
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
      }
    }
    .ib__task__time-repeat__end-rule__attach {
      .ib__task__time-repeat__end-rule__date {
        padding: 0 .3125rem;
        &:hover {
          background: $color-bg-base;
        }
      }
    }
    .ib__task__time-repeat__trigger {
      display: flex;
      padding: 0 0.3125rem;
      transition: all .2s;
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
    .ib__task__time-repeat__end-rule__times {
      display: flex;
      /deep/ .ic-input {
        input {
          padding: 0.3rem 0.5rem;
        }
      }
    }
  }
</style>

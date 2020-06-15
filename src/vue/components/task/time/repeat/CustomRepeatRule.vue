<template lang="pug">
  .ib__custom-repeat-rule
    ic-popover(position="bottom" :triangle="false" :appendToBody="false" :positionY="positionY" :scrollable="true" v-model="visible")
      .items
        .item.pointer(v-for="unit in ruleUnits" @click="changeUnit(unit.value)" :class="{'active': ruleUnit === unit.value}")
          .ibass-checkmark
          span 每{{unit.label}}
      .ib__custom-repeat-rule__trigger(slot="trigger")
        span 每{{CUSTOM_RULE_UNIT[ruleUnit].label}}
        .ibass-arrow-down
</template>
<script>
import {CUSTOM_RULE_UNIT} from '@/utils/constants'
export default {
  props: {
    ruleUnit: {
      type: String,
      default: CUSTOM_RULE_UNIT.D.value
    }
  },
  data () {
    return {
      visible: false,
      CUSTOM_RULE_UNIT,
      positionY: 0
    }
  },
  methods: {
    changeUnit (val) {
      this.visible = false
      this.$emit('changeUnit', val)
    },
    getPositionY () {
      let ind = 0
      this.ruleUnits.forEach((rule, index) => {
        if (rule.value === this.ruleUnit) {
          ind = index
        }
      })
      return -ind * 32 - 8
    },
  },
  computed: {
    ruleUnits () {
      return Object.values(CUSTOM_RULE_UNIT)
    },
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
  .ib__custom-repeat-rule {
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
    .ib__custom-repeat-rule__trigger {
      display: flex;
      padding: 0 0.3125rem;
      transition: all .2s;
      color: $color-text-primary;
      line-height: 2rem;
      &:hover {
        background: $color-bg-light;
      }
      .ibass-arrow-down {
        transform: scale(0.5);
      }
    }
  }
</style>

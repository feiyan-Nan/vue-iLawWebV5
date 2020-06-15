<template lang="pug">
  .ib__time-remind__popover
    ic-popover(position="bottom" :triangle="false" :appendToBody="false" :positionY="positionY" :scrollable="true" v-model="visible")
      .items(v-if="!customChoosing")
        .item.pointer(@click="changeRemind()" :class="{'active': remind.value === ''}")
          .ibass-checkmark
          span 无
        .item.pointer(v-for="r in remindList" @click="changeRemind(r)" :class="{'active': remind.value === r.value}")
          .ibass-checkmark
          span {{r.desc}}
        .split-line
        .item.pointer(:class="{'active': remind.type === 'customTime'}" @click="gotoCustom")
          .ibass-checkmark
          span 自定义
      custom-remind(v-else :remind="remind" @confirm="confirmCustom" @cancel="cancelCustom")
      .ib__time-remind__trigger.pointer(slot="trigger" :class="{'active': remind.value !== ''}")
        .text {{remind.desc || '无'}}
        .ibass-arrow-down
</template>
<script>
import CustomRemind from './CustomRemind'
export default {
  components: { CustomRemind },
  props: {
    remind: {
      type: Object,
    },
    reminds: {
      type: Array,
    },
    defaultReminds: {
      type: Array
    }
  },
  data () {
    return {
      customChoosing: false,
      visible: false,
      positionY: -8
    }
  },
  methods: {
    changeRemind (r) {
      let after = r || {value: ''}
      this.$emit('changeRemind', {before: this.remind, after})
      this.visible = false
    },
    getPositionY () {
      let ind = 0
      // 如果是用户自定义对时候直接偏移到最后一行，否则根据数据偏移
      if (this.remind.type === 'customTime') {
        ind = this.remindList.length
      } else {
        this.remindList.forEach((r, index) => {
          if (r.value === this.remind.value) {
            ind = index
          }
        })
      }
      return -(ind + 1) * 32 - 8
    },
    gotoCustom () {
      this.customChoosing = true
      this.positionY = 0
    },
    confirmCustom (val) {
      let data = {type: 'customTime', value: val}
      this.$emit('changeRemind', {before: this.remind, after: data})
      this.visible = false
    },
    cancelCustom () {
      this.visible = false
    }
  },
  computed: {
    remindList () {
      // 过滤掉已经选中非当前数据
      return this.defaultReminds.filter(dr => {
        return !this.reminds.some(r => {
          return r.type === 'ruleTime' && r.value === dr.value && dr.value !== this.remind.value
        })
      })
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.customChoosing = false
        this.positionY = this.getPositionY()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.ib__time-remind__popover {
  .items {
    width: 12rem;
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
  .ib__time-remind__trigger {
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
      &.active {
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

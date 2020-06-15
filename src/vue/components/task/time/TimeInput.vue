<template lang="pug">
  .ib__time-input
    ic-popover(position="bottom" :triangle="false" :appendToBody="false" :positionY="34" :scrollable="true" v-model="visible" ref="range")
      .time-input__range
        .item.pointer(v-for="time in timeRange" @click="chooseTime(time)") {{time}}
      .ib__time-input__trigger(slot="trigger")
        .text(v-if="!curEditMode" @click="changeEditMode") {{value}}
        ic-input(v-else v-model="curValue" @blur="blur" @keyup="keyup" width="50" ref="timeInput")
</template>
<script>
import DateUtil from '@/utils/date'
export default {
  props: {
    value: {
      type: String,
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: false,
      timeRange: [],
      curValue: this.value,
      curEditMode: this.editMode
    }
  },
  created () {
    this.setTimeRange()
  },
  methods: {
    blur () {
      if (!this.editMode) {
        this.curEditMode = false
      }
      let val = DateUtil.autoFillTime(this.curValue)
      this.curValue = val
      this.$emit('setTime', val)
    },
    keyup (value, ev) {
      let val = DateUtil.format(this.curValue)
      this.curValue = val
      if (val.length >= 5) {
        this.scrollTime(this.curValue)
      }
      if (ev.keyCode === 13) {
        this.visible = false
        this.$refs.timeInput.$el.querySelector('input').blur()
      }
    },
    changeEditMode () {
      this.curEditMode = true
      this.$nextTick(() => {
        this.$refs.timeInput.$el.querySelector('input').focus()
      })
    },
    chooseTime (val) {
      this.visible = false
      this.$emit('setTime', val)
    },
    setTimeRange () {
      let res = []
      for (let i = 0; i < 24; i++) {
        let tmpHour = i > 9 ? i : `0${i}`
        res.push(`${tmpHour}:00`)
        res.push(`${tmpHour}:30`)
      }
      this.timeRange = res
    },
    scrollTime (time) {
      // 如果是打开组件的时候，组件需要滚动且时间完整才会尝试滚动
      if (time.length === 5) {
        let arr = time.split(':')
        let hour = Number(arr[0])
        let minute = Number(arr[1])
        let n = minute > 30 && hour < 23 ? 2 * hour : 2 * hour - 1
        this.$refs.range.$slots.default[0].elm && this.$refs.range.$slots.default[0].elm.scroll(0, n * 32)
      }
    }
  },
  watch: {
    value (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.curValue = newVal
        if (!this.editMode) {
          this.curEditMode = false
        }
      }
    },
    visible (newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.scrollTime(this.curValue)
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .ib__time-input {
    line-height: 2rem;
    .time-input__range {
      overflow: scroll;
      height: 10rem;
      .item {
        height: 2rem;
        line-height: 2rem;
        text-align: left;
        padding: 0 0.875rem;
        &:hover {
          background: $color-bg-base;
        }
        &:first-child {
          border-top-left-radius: 0.5625rem;
          border-top-right-radius: 0.5625rem;
        }
        &:last-child {
          border-bottom-left-radius: 0.5625rem;
          border-bottom-right-radius: 0.5625rem;
        }
      }
    }
    .ib__time-input__trigger {
      .text {
        padding: 0 0.3125rem;
        &:hover {
          background: $color-bg-base;
        }
      }
      /deep/ .ic-input {
        margin: 0;
        input {
          @extend %f-small;
          height: 2rem;
          padding: 0;
          text-align: center;
          border-radius: 0.25rem;
          border-color: $color-bd-title;
          &:focus {
            border-color: $theme-color-lighter;
          }
        }
      }
    }
  }
</style>

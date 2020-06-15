<template lang="pug">
  .ib__custom-remind
    .ib__custom-remind__main
      .ib__custom-remind__date.pointer
        ic-dropdown(:visible="visible" @visiableChange="visiableChange")
          span {{date}}
          ic-dropdown-menu(slot="dropdown" :theme="'black'" :isNailed="false")
            ic-date-picker(:curDate="date" @click="changeDate")
      .ib__custom-remind__time
        time-input(v-model="time" :editMode="true" @setTime="changeTime")
    .ib__custom-remind__operate
      a.cancel.pointer(@click="cancel") 取消
      a.confirm.pointer(@click="confirm") 确定
</template>
<script>
import TimeInput from '../TimeInput'
export default {
  components: { TimeInput },
  props: {
    remind: {
      type: Object
    }
  },
  created () {
    if (this.remind.type === 'customTime') {
      this.date = moment(this.remind.value).format('YYYY-MM-DD')
      this.time = moment(this.remind.value).format('HH:mm')
    }
  },
  data () {
    return {
      date: moment().format('YYYY-MM-DD'),
      time: moment().set('minute', 0).format('HH:mm'),
      visible: false
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    confirm () {
      this.$emit('confirm', `${this.date} ${this.time}:00`)
    },
    visiableChange () {
      this.visible = !this.visible
    },
    changeDate (val) {
      this.date = val
    },
    changeTime (val) {
      this.time = val
    }
  },
  computed: {
  },
}
</script>
<style lang="scss" scoped>
  .ib__custom-remind {
    width: 12.5rem;
    padding: 0.5rem 1rem;
    .ib__custom-remind__main {
      display: flex;
      .ib__custom-remind__date {
        position: relative;
        width: 7.5rem;
        height: 2rem;
        border: 1px solid $color-bd-title;
        text-align: center;
        border-radius: 0.25rem;
      }
      .ib__custom-remind__time {
        margin-left: 1.25rem;
        width: 3.75rem;
      }
    }
    .ib__custom-remind__operate {
      display: flex;
      justify-content: flex-end;
      margin: 1.5rem 0 0.5rem;
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

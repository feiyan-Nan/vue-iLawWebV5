<template lang="pug">
  .ib__multiple__user__confirm
    ic-popover(position="top" theme="black" :scrollable="true" :triangle="false" :appendToBody="false" :positionX="-20" :positionY="40" v-model="visible")
      .ib__multiple_uesr__confirm__popover
        .ib__multiple__confirm__text
          span 该任务有多人负责，确认完成？
        .ib__multiple__operate
          ic-button.btn(type="normal" @click="cancel") 取消
          ic-button.btn(@click="confirm") 确定
      .ib__task__icon__trigger(slot="trigger")
        slot(name="trigger")
</template>
<script>
export default {
  data () {
    return {
      visible: false
    }
  },
  methods: {
    cancel () {
      this.visible = false
    },
    confirm () {
      this.visible = false
      this.$emit('confirm')
    }
  }
}
</script>
<style lang="scss" scoped>
  .ib__multiple__user__confirm {
    .ib__multiple_uesr__confirm__popover {
      color: $color-white;
      width: 15rem;
      padding: 0.5rem;
      .ib__multiple__confirm__text {
        text-align: center;
        height: 2rem;
        line-height: 2rem;
        margin-bottom: 0.5rem;
      }
      .ib__multiple__operate {
        display: flex;
        justify-content: space-around;
        height: 2rem;
        .btn {
          @extend %f-extra-small;
          width: 5.625rem;
        }
      }
    }
  }
</style>

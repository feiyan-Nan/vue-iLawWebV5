<template lang="pug">
  .ib__task__time-repeat
    .ib__task__time-repeat__rule
      label 重复
      repeat-rule(:task="task" @changeRepeatRule="changeRepeatRule")
    .ib__task__time-repeat__end-rule
      label 结束重复
      end-rule(:task="task" @changeRepeatRule="changeRepeatRule")

</template>
<script>
import RepeatRule from './RepeatRule'
import EndRule from './EndRule'
export default {
  components: {RepeatRule, EndRule},
  props: {
    task: {
      type: Object
    }
  },
  methods: {
    changeRepeatRule (val) {
      this.$emit('changeRepeatRule', val)
    }
  }
}
</script>
<style lang="scss" scoped>
  .ib__task__time-repeat {
    .ib__task__time-repeat__rule {
      display: flex;
      line-height: 2rem;
    }
    .ib__task__time-repeat__end-rule{
      display: flex;
      line-height: 2rem;
    }
  }
</style>

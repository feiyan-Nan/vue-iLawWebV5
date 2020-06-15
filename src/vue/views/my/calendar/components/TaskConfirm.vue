<template lang="pug">
  .calendar-confirm__wrap
    .calendar-confirm__title 编辑重复任务
    .calendar-confirm__body
      .calendar-confirm__body-item(v-for="(item, index) in items" :key="index" @click="toggleSelected(item)")
        .ibass-done.pointer(v-if="item===selectedItem")
        .ibass-task-check.pointer(v-else)
        span.calendar-confirm__body-label.pointer {{item.label}}
    .calendar-confirm__footer
      ic-button(@click="confrim")
</template>

<script>
const ITEMS = [{label: '当前任务', selected: false}, {label: '编辑当前任务及后续重复任务', selected: false}]
export default {
  data () {
    return {
      items: ITEMS,
      selectedItem: ITEMS[0]
    }
  },
  methods: {
    toggleSelected (item) {
      this.selectedItem = item
    },
    confrim () {
      this.$emit('cb', this.selectedItem)
    }
  },
}
</script>
<style lang="scss" scoped>
.calendar-confirm__wrap{
  padding: 10px 10px 0 10px;
}
.calendar-confirm__title{
  @include flex(row, center);
}
.calendar-confirm__body{
  margin-top: 18px;
}
.calendar-confirm__body-item{
  @include flex(row, flex-start,center);
  margin-top: 13px;
  [class*=ibass-]{
    margin-right: 6px;
    line-height: 12px;
    color: $color-bd-light;
    &.ibass-done{
      color: $theme-color-light
    }
  }
}
.calendar-confirm__footer{
  width: 150px;
  height: 32px;
  margin: 30px auto 3px;
}
</style>

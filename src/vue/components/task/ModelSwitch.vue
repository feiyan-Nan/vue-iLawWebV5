<template lang="pug">
.ib__task__header__switch-model
    .pointer(v-for="(item, index) in items" :key="index" :class="[`ibass-${item.value}`,item.value===active? 'ib__task__header__switch-model-active':'']" @click="toggleActive(item)")
</template>
<script>
const data = [{label: '列表视图', value: 'list'}, {label: '日历视图', value: 'calendar'}]
export default {
  props: {
    activated: {
      type: String,
      default: 'calendar'
    },
  },
  data () {
    return {
      items: data,
      active: this.activated
    }
  },
  methods: {
    toggleActive (item) {
      if (item.value === 'list') {
        if (this.$route.path === '/app/my/task/calendar') {
          this.$postMessage.stateGo('app.my.task.list')
        } else if (this.$route.path.indexOf('/app/matter/find') > -1) {
          this.$postMessage.stateGo('app.matter.find.task')
        }
      } else if (item.value === 'calendar') {
        if (this.$route.path === '/app/my/task/list') {
          this.$postMessage.stateGo('app.my.task.calendar')
        } else if (this.$route.path.indexOf('/app/matter/find') > -1) {
          this.$postMessage.stateGo('app.matter.find.calendar')
        }
      }
      this.active = item.value
    }
  },
}
</script>
<style lang="scss" scoped>
.ib__task__header__switch-model {
    @include flex(row);
    [class*=ibass] {
        width: 36px;
        height: 30px;
        @include flex(row, center,center);
        @extend %bg-white-light;
        border-radius: 20px;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
        border: solid 1px $color-bd-light;
        color:$color-bd-light;
        &:first-child {
            border-top-right-radius: unset;
            border-bottom-right-radius: unset;
        }
        &:last-child {
            border-top-left-radius: unset;
            border-bottom-left-radius: unset;
            border-left: unset;
        }
    };
    .ib__task__header__switch-model-active{
        background-color: $color-white;
        color:$theme-color;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05) , inset 0 3px 2px 0 rgba(0, 0, 0, 0.05);
    }
};

</style>

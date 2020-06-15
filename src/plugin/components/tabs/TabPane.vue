<template lang="pug">
    li.ic-tab__pane(@click="clickHandle" :name="name" :class="$parent.value === name ? 'c__tab__pane--active' : ''")
        slot
</template>

<script>
export default {
  name: 'IcTabPane',
  componentName: 'IcTabPane',
  props: {
    name: {
      type: String,
      required: true
    },
  },
  methods: {
    clickHandle (e) {
      this.$parent.__change(this.name, this, e)
    }
  },
  created () {
    this.$parent.__initChildData(this)
  }
}
</script>

<style lang="scss" scoped>
.ic-tab__pane {
    &[class$=--active] {
      color: $theme-color-light;
    }
    &:hover{
      color: $theme-color-light;
    }
}
</style>

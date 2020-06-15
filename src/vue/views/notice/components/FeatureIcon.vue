<template>
<i class="notice_feature_icon"
   :class="iconClass"
   @click="onClick">

</i>
</template>
<script>
export default {
  props: {
    type: {
      required: true,
      type: String
    }
  },
  computed: {
    iconClass (val) {
      return 'ibass ibass-' + this.type
    }
  },
  methods: {
    onClick () {
      this.$emit('clicked')
    }
  }
}
</script>
<style lang="scss" scoped>
.notice_feature_icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    text-align: center;
}
</style>

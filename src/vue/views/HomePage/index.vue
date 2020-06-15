<template lang="pug">
    router-view
</template>

<script>
import yx from '@/vue/ws'
export default {
  data () {
    return {

    }
  },
  created () {
    // 初始化云信通知
    if (!yx.instance) {
      yx.instantiate()
    }
  },
  mounted () {
    // 加载正在进行的计时
    this.$store.dispatch('SYNC.TIMING_INITIAL')
  }
}
</script>

<style lang="scss" scoped>

</style>

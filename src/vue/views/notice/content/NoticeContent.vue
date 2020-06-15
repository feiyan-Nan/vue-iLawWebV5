<template>
<div class="notice_content-wrap">
  <keep-alive>
    <component :is="curActivedFeatureType"></component>
  </keep-alive>
</div>
</template>
<script>
import Notification from './type/Notification'
import Atme from './type/Atme.vue'
import NotificationDetail from './detail/NotificationDetail'
export default {
  components: {
    Notification,
    Atme,
    NotificationDetail
  },
  watch: {
    '$store.state.noticeCenter.curActivedFeature' (newVal, oldVal) {
      if (this.typeWithComponent.includes(newVal)) {
        this.curActivedFeatureType = newVal
      }
    }
  },
  data: () => ({
    curActivedFeatureType: 'NotificationDetail',
    typeWithComponent: [
      'Notification', 'Atme', 'NotificationDetail'
    ]
  })
}
</script>
<style lang="scss" scoped>
.notice_content-wrap {
    width: 360px;
    height: 100%;
    background: $color-bg-light;
    overflow-y: scroll;
}
</style>

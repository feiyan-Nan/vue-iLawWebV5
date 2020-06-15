<template>
<div class="notification_detail-wrap">
  <div class="notification_detail-header">
    <i class="ibass ibass-arrow-left"
       @click="backToNotification"></i>
    <p class="notification_detail-header-title">项目概览通知</p>
    <i class="ibass ibass-notification"></i>
  </div>
</div>
</template>
<script>
export default {
  data: () => ({}),
  methods: {
    backToNotification () {
      this.$store.commit('changeActivedFeature', 'Notification')
    }
  }
}
</script>
<style lang="scss" scoped>
.notification_detail-header {
    border-bottom: 1px solid $color-bd-extra-light;
    @include flex(row, space-between, center);
    padding: 16px;
    & > .ibass {
        height: 16px;
        width: 16px;
        vertical-align: middle;
        text-align: center;
        color: $color-text-placeholder;
        cursor: pointer;
    }
    .notification_detail-header-title {
        color: $color-text-almost-black;
        height: 16px;
        line-height: 16px;
        font-size: 14px;
    }
}
</style>

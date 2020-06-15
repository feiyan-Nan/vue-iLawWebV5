<template>
<div class="notice_content_type_notification">
  <div class="nct_notification-header">
    <div class="nct_notification-header-filter">
      <span>全部通知</span>
      <i class="ibass ibass-trig-down"></i>
    </div>
    <div class="nct_notification-header-operation">
      <i class="ibass ibass-more"></i>
    </div>
  </div>
  <NotificationCard :notificationRead="true"
                    @click.native="onClickNotification"></NotificationCard>
  <NotificationCard></NotificationCard>
  <NotificationCard></NotificationCard>
  <NotificationCard></NotificationCard>
  <NotificationCard></NotificationCard>
  <NotificationCard></NotificationCard>
  <NotificationCard></NotificationCard>
  <NotificationCard></NotificationCard>
  <NotificationCard></NotificationCard>
</div>
</template>
<script>
import NotificationCard from '../../components/NotificationCard'
export default {
  name: 'notice_content_type_notification',
  components: {
    NotificationCard
  },
  data: () => ({}),
  methods: {
    onClickNotification () {
      this.$store.commit('changeActivedFeature', 'NotificationDetail')
    }
  }
}
</script>
<style lang="scss" scoped>
.nct_notification-header {
  height: 48px;
    margin: 0 16px;

    @include flex(row, space-between, center);
    .ibass {
        vertical-align: middle;
    }
    .nct_notification-header-filter {
        font-size: 12px;
        color: $color-text-almost-black;
    }
    .nct_notification-header-operation {
        .ibass-more {
            line-height: 16px;
        }
    }
}
</style>

<template>
<div class="notification_card-wrap">
  <div class="notification_card-header">
    <div class="notification_card-header-left">
      <i class="ibass ibass-task-pad"
         :style="{'color': colors.typeIcon}"></i>
      <span class="notification_card-type"
            :style="{'color': colors.typeText}">任务提醒</span>
    </div>
    <div class="notification_card-header-right">
      <span class="notification_card-time">XX分钟前</span>
      <i class="ibass ibass-more"></i>
    </div>
  </div>
  <div class="notification_card-body">
    <div class="notification_card-body-title"
         :style="{'color': colors.title}"> 6月9日需求评审6月9日需求评审6月9日需求评审6月9日需求评审6月9日需求评审6月9日需求评审6月9日需求评审 </div>
    <div class="notification_card-body-detail">
      <div class="notification_card-body-text"
           :style="{'color': colors.detail}"> 王储将唐利明、山峥加入到该任务中。王储将唐利明、山峥加入到该任务中。王储将唐利明、山峥加入到该任务中。王储将唐利明、山峥加入到该任务中。王储将唐利明、山峥加入到该任务中。王储将唐利明、山峥加入到该任务中。
        </div>
      <div class="notification_card-body-count">99+</div>
    </div>
  </div>
</div>
</template>
<script>
export default {
  props: {
    notificationRead: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    colors () {
      let activedColors = {
        typeIcon: '#07cfda',
        typeText: '#212121',
        title: '#212121',
        detail: '#4a4a4a'
      }
      let inactivedColors = {
        typeIcon: 'rgba(169, 169, 169, 0.6)',
        typeText: '#a9a9a9',
        title: '#a9a9a9',
        detail: '#a9a9a9'
      }
      return this.notificationRead ? inactivedColors : activedColors
    }
  },
  data: () => ({})
}
</script>
<style lang="scss" scoped>
.notification_card-wrap {
    margin: 0 8px 8px;
    min-height: 140px;
    border-radius: 6px;
    background-color: $color-white;
    &:hover {
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.12);
        .notification_card-header .notification_card-header-right {
            .ibass-more {
                display: inline-block;
            }
            .notification_card-time {
                display: none;
            }
        }
    }
    .ibass {
        vertical-align: middle;
    }
    .notification_card-header {
        height: 36px;
        padding: 0 10px;
        @include flex(row, space-between, center);
        border-bottom: 1px solid $color-bg-base;
        .notification_card-header-left {
            height: 100%;
            @include flex(row, flex-start, center);
            .ibass {
                height: 16px;
            }
            .notification_card-type {
                margin-left: 8px;
                font-size: 12px;
            }
        }
        .notification_card-header-right {
            position: relative;
            color: $color-text-placeholder;
            .notification_card-time {
                font-size: 12px;
            }
            .ibass-more {
                display: none;
            }
        }
    }
    .notification_card-body {
        padding: 16px;
        .notification_card-body-title {
            font-size: 14px;
            font-weight: 500;
            line-height: 20px;
            margin-bottom: 8px;
            @include multiEllipsis();
        }
        .notification_card-body-detail {
            display: flex;
            position: relative;
            .notification_card-body-text {
                width: 266px;
                font-size: 13px;
                @include multiEllipsis(3);
            }
            .notification_card-body-count {
                box-sizing: border-box;
                height: 18px;
                min-width: 18px;
                padding: 0 3px;
                background: $dangerous-color;
                color: $color-white;
                font-size: 12px;
                font-weight: 500;
                line-height: 18px;
                text-align: center;
                border-radius: 10px;
                position: absolute;
                right: 0;
                bottom: 0;
            }
        }
    }
}
</style>

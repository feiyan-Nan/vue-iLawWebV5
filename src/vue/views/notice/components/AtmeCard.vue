<template>
<div class="atme_card-wrap">
  <div class="atme-card-avatar"
       :style="{'background-image': avatar}"
       :class="{'atme-card-avatar-inactive': messageRead}"></div>
  <div class="atme_card-content">
    <div class="atme-card-content-header">
      <div class="acch-name"
           :style="{'color': colors.name}">谁啊</div>
      <div class="acch-time">刚刚</div>
    </div>
    <div class="atme-card-content-body">
      <div class="accb-message"
           :style="{'color': colors.message}">@大可 啥时候进行设计评审？</div>
      <div class="accb-origin">
        <i class="accb-origin-icon ibass ibass-task-pad"
           :style="{'color': colors.icon}"></i>
        <div class="accb-origin-name"
             :style="{'color': colors.origin}"> ※[项目管理事业部][三端] 通知二期 </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
export default {
  props: {
    messageRead: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    colors () {
      let activedColors = {
        name: '#212121',
        message: '#4a4a4a',
        icon: '#07cfda',
        origin: '#4a4a4a'
      }
      let inactivedColors = {
        name: '#a9a9a9',
        message: '#a9a9a9',
        icon: 'rgba(169, 169, 169, 0.6)',
        origin: '#a9a9a9'
      }
      return this.messageRead ? inactivedColors : activedColors
    }
  },
  data: () => ({
    avatar: 'url("https://thirdwx.qlogo.cn/mmopen/vi_32/fr1mnwRrmwJ7AWHLEccjURCGnV2TGw8hAlGU0qLkC9RFoRsA3b2A4SdbCExfaykCibYJqGMA41CrpwtM09fFxYA/132")'
  })
}
</script>
<style lang="scss" scoped>
.atme_card-wrap {
    background: $color-white;
    margin: 0 8px 8px;
    padding: 16px;
    border-radius: 6px;
    @include flex();
    .atme-card-avatar {
        width: 32px;
        height: 32px;
        background-size: cover;
        background-position: center;
        border-radius: 50%;
        overflow: hidden;
    }
    .atme-card-avatar-inactive {
        opacity: 0.6;
    }
    .atme_card-content {
        width: 272px;
        margin-left: 8px;
        .atme-card-content-header {
            height: 32px;

            @include flex(row, space-between);
            .acch-name {
                font-weight: 500;
                font-size: 14px;
                line-height: 20px;
            }
            .acch-time {
                font-size: 12px;
                color: $color-text-placeholder;
                line-height: 20px;
            }
        }
        .atme-card-content-body {
            .accb-message {
                font-size: 13px;
                line-height: 20px;
            }
            .accb-origin {
                border-radius: 4px;
                overflow: hidden;
                min-height: 40px;
                padding: 10px;
                box-sizing: border-box;
                @include flex(row, flex-start);
                .accb-origin-icon {
                    line-height: 20px;
                    font-size: 16px;
                    &::before {
                        vertical-align: middle;
                    }
                }
                .accb-origin-name {
                    line-height: 20px;
                    font-size: 13px;
                    margin-left: 8px;
                }
            }
        }
    }

}
</style>

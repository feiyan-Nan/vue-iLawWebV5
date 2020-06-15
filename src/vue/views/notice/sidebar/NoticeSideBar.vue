<template>
<div class="notice_sidebar-wrap">
  <div class="notice_sidebar-header"> </div>
  <div class="notice_sidebar-body">
    <div v-for="(feature, index) in features"
         :key="index"
         @mouseover="featureHover(feature, index)"
         @mouseleave="featureMouseLeave(feature, index)">
      <div class="notice_sidebar-feature"
           @click="featureClick(feature, index)"
           v-if="feature.type!=='_split'">
        <i class="ibass notice_sidebar-feature-icon"
           :class="[feature.icon, {'notice_sidebar-feature-active': feature.type === curActivedFeature}]"></i>
      </div>
      <div class="notice_sidebar-split"
           v-else> </div>
    </div>
  </div>
  <div class="notice_sidebar-footer"> </div>
</div>
</template>
<script>
export default {
  data: () => ({
    curActivedFeature: '',
    features: [
      {
        type: 'Notification',
        icon: 'ibass-sidebar-notification',
        tip: '通知',
        canActive: true
      },
      {
        type: 'Atme',
        icon: 'ibass-sidebar-at',
        tip: '@我',
        canActive: true
      },
      {
        type: '_split',
      },
      {
        type: 'Retrieval',
        icon: 'ibass-sidebar-research',
        tip: '检索案例'
      },
      {
        type: 'Task',
        icon: 'ibass-sidebar-add-task',
        tip: '新增任务'
      },
      {
        type: 'Timing',
        icon: 'ibass-sidebar-timer',
        tip: '计时'
      },
      {
        type: '_split',
      },
      {
        type: 'CustomerService',
        icon: 'ibass-customer-service',
        tip: '在线客服'
      }
    ]
  }),
  methods: {
    featureClick (feature, index) {
      // 抛给parentWindow
      if (feature.type === this.curActivedFeature) {
        if (feature.canActive) {
          this.curActivedFeature = ''
          this.$store.commit('changeActivedFeature')
        }
        this.$postMessage.noticeCenterCommunication({
          scenes: 'featureInactived',
        })
      } else {
        if (feature.canActive) {
          this.curActivedFeature = feature.type
          this.$store.commit('changeActivedFeature', feature.type)
        }
        this.$postMessage.noticeCenterCommunication({
          scenes: 'featureActived',
          featureType: feature.type
        })
      }
    },
    featureHover (feature, index) {
      // 计算距离顶部的高度
      let top = 'calc(25% + ' + this.calculateTop(index) + ')'
      this.$postMessage.noticeCenterCommunication({
        scenes: 'featureHover',
        style: {
          display: 'block',
          top: top
        },
        tip: feature.tip
      })
    },
    featureMouseLeave (feature, index) {
      this.$postMessage.noticeCenterCommunication({
        scenes: 'featureMouseLeave',
        style: {
          display: 'none'
        },
        tip: feature.tip
      })
    },
    calculateTop (hoverIndex) {
      const FEATURE_MARGIN = 8
      const FEATURE_HEIGHT = 40
      const TIP_HEIGHT = 24
      const SPLIT_HEIGHT = 1
      let relativeTop = -FEATURE_MARGIN / 2
      this.features.some((feature, index) => {
        if (index) {
          if (feature.type !== '_split') {
            relativeTop += (FEATURE_HEIGHT + FEATURE_MARGIN)
          } else {
            relativeTop += (SPLIT_HEIGHT + FEATURE_MARGIN)
          }
        }
        return hoverIndex === index
      })
      return relativeTop + (TIP_HEIGHT / 2) + 'px'
    }
  }
}
</script>
<style lang="scss" scoped>
.notice_sidebar-wrap {
    width: 40px;
    height: 100%;
    background: $color-white;
    position: relative;
    & > div {
        position: absolute;
        left: 0;
        width: 100%;
    }
    .notice_sidebar-body {
        top: 25%;
        .notice_sidebar-feature {
            height: 40px;
            position: relative;
            margin-bottom: 8px;
            color: $color-text-purple-grey;
            &:hover {
                background: $color-bg-light;
            }
            & > .notice_sidebar-feature-icon {
                display: inline-block;
                width: 100%;
                height: 100%;
                font-size: 22px;
                line-height: 40px;
                text-align: center;
                cursor: pointer;
                &::before {
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                    font-size: 20px;
                    line-height: 40px;
                    text-align: center;
                }
            }
        }
        .notice_sidebar-split {
            margin: 0 8px 8px;
            height: 1px;
            background: $color-bd-extra-light;
        }
        .notice_sidebar-feature-active {
            background: $theme-color-light;
            color: $color-white;
        }
    }
}
</style>

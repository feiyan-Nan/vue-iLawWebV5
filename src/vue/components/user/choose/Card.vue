<template lang="pug">
  .ib__user__card
    .ib__user__card__info
      img.ib__user__card__img(:src="user.pic || user.avatar || user.userPic")
      .ib__user__card__name {{user.name}}
    .ib__user__card__footer(v-if="editable")
      .ib__user__card__text.pointer(@click="clearUser")
        .ibass-close
        span 从任务中删除
</template>
<script>
export default {
  props: {
    user: {
      type: Object,
      default () {
        return {}
      }
    },
    editable: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    clearUser (ev) {
      this.$emit('clearUser', this.user)
      ev.stopPropagation()
    }
  }
}
</script>
<style lang="scss" scoped>
  .ib__user__card {
    width: 11.25rem;
    .ib__user__card__info {
      display: flex;
      padding: 0.875rem;
      line-height: 2rem;
      img {
        &.ib__user__card__img {
          width: 2rem;
          height: 2rem;
          margin-right: 0.625rem;
          text-align: center;
          @extend %f-giant;
          border-radius: 2rem;
          overflow: hidden;
        }
      }
    }
    .ib__user__card__footer {
      border-top: 1px solid $color-bd-title;
      padding: 0.5rem 1rem;
      height: 2rem;
      line-height: 2rem;
      color: $color-bd-light;
      @extend %f-small;
      .ib__user__card__text {
        display: flex;
        &:hover {
          color: $theme-color-light;
        }
        .ibass-close {
          margin-right: 0.5rem;
          &:before {
            vertical-align: -2px;
          }
        }
      }
    }
  }
</style>

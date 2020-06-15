<template lang="pug">
  .ib__user__multi__img
    ul
      li(v-for="user in users")
        ic-popover(position="bottom" v-model="user.visible" :scrollable="true")
          user-card(:user="user" @clearUser="clearUser" :editable="editable")
          img.user__img(slot="trigger" :src="user.pic || user.avatar || user.userPic")
    .ib__user__multi__img__footer(v-if="editable")
      .ib__user__multi__img__text.pointer(@click="clearAllUser")
        .ibass-close
        span 清除所有人员

</template>
<script>
import UserCard from './Card'
export default {
  components: { UserCard },
  props: {
    users: {
      type: Array,
      default () {
        return []
      }
    },
    editable: { // 判断是否可以进行编辑
      type: Boolean,
      default: true
    }
  },
  methods: {
    clearUser (user) {
      this.$emit('clearUser', user)
    },
    clearAllUser () {
      this.$emit('clearAllUser')
    }
  }
}
</script>
<style lang="scss" scoped>
  .ib__user__multi__img {
    width: 10rem;
    ul {
      display: flex;
      flex-wrap: wrap;
      padding: 0.5rem;
    }
    .user__img {
      overflow: hidden;
      width: 1.5rem;
      height: 1.5rem;
      text-align: center;
      border-radius: 1.5rem;
      border: 2px solid $color-white;
    }
    .ib__user__multi__img__footer {
      border-top: 1px solid $color-bd-title;
      padding: 0.5rem 1rem;
      height: 2rem;
      line-height: 2rem;
      color: $color-bd-light;
      @extend %f-small;
      .ib__user__multi__img__text {
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

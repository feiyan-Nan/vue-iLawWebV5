<template lang="pug">
  ul.ib__user__imgs(v-if="selectedUsers && selectedUsers.length > 0")
    li(v-for="user in users" :style="{'margin-left': `${offsetX}px`}")
      template(v-if="clickable")
        ic-popover(position="bottom" v-model="user.visible" :scrollable="true")
          user-card(:user="user" @clearUser="clearUser" :editable="editable")
          //- 如果上传了头像
          img.user__img.pointer(slot="trigger" :src="user.pic || user.avatar || user.userPic" v-if="user.pic || user.avatar || user.userPic")
          //- 如果没有上传头像
          span.user__img.no__user__img.pointer(slot="trigger" v-else)
      template(v-else)
        img.user__img(slot="trigger" :src="user.pic || user.avatar || user.userPic" v-if="user.pic || user.avatar || user.userPic")
        span.user__img.no__user__img.pointer(slot="trigger" v-else)
    li(v-if="selectedUsers && selectedUsers.length > maxSize" :style="{'margin-left': `${offsetX}px`}")
      .user__img.user__num.pointer(v-if="clickable")
        ic-popover(position="bottom" :scrollable="true")
          multi-user-img(:users="selectedUsers" @clearUser="clearUser" @clearAllUser="clearAllUser" :editable="editable")
          .user__img__num__choose(slot="trigger")
            span {{selectedUsers.length}}
            .ibass-trig-down
      .user__img.user__num(v-else)
        span {{selectedUsers.length}}
</template>
<script>
import UserCard from './Card'
import MultiUserImg from './MultiUserImg'
export default {
  components: { UserCard, MultiUserImg },
  props: {
    selectedUsers: { // 选中用户列表
      type: Array,
      default () {
        return []
      }
    },
    maxSize: {
      type: Number,
      default: 4
    },
    clickable: { // 判断每一个头像是否可以进行点击（包括数字显示的内容）
      type: Boolean,
      default: true
    },
    editable: {
      type: Boolean, // 判断每一个头像是否可以进行操作
      default: true
    },
    offsetX: { // img图片x方向上的偏移
      type: Number,
      default: -2
    }
  },
  methods: {
    clearUser (user) {
      this.$emit('clearUser', user)
      user.visible = false
    },
    clearAllUser () {
      this.$emit('clearAllUser')
    }
  },
  computed: {
    users () {
      return this.selectedUsers.slice(0, this.maxSize)
    },
  }
}
</script>
<style lang="scss" scoped>
  .ib__user__imgs {
    display: flex;
    align-content: center;
    li {
      z-index: 1;
    }
    .user__img {
      display: inline-block;
      width: 1.5rem;
      height: 1.5rem;
      text-align: center;
      border-radius: 1.5rem;
      background: #dadada;
      &.user__num {
        background: $theme-color-light;
        color: $color-white;
        // line-height: 1.5rem;
        border: 2px solid $color-white;
      }
      span {
        position: relative;
        top: -4px;
        .clickable {
          display: block;
        }
      }
      &.pointer {
        &:hover {
          span {
            display: none;
          }
          .ibass-trig-down {
            display: block;
          }
        }
      }
      .ibass-trig-down {
        display: none;
        color: $color-white;
      }
    }
    img, .no__user__img {
      @extend %f-giant;
      border: 2px solid $color-white;
    }
    .ibass-trig-down {
      color: $theme-color-light;
      &:before {
        line-height: 1.5rem;
        vertical-align: -3px;
      }
    }
  }
</style>

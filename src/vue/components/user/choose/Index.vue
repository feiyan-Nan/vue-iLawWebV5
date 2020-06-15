<template lang="pug">
  .ib__user__choose
    ic-popover(:position="arrows" :scrollable="true" :appendToBody="false" :positionX="-74" :positionY="50" v-model="curVisible" @afterChangeVisible="afterChangeVisible")
      .ib__user__choose__popover
        .ib__user__choose__header
          .ib__user__choose__search
            ic-search(placeholder="搜索成员" @search="search" :defaultValue="searchVal")
        .ib__user__choose__list__wrapper(v-ic-loading="loading")
          ul.ib__user__choose__list(v-if="users.length > 0")
            li.ib__user__choose__list__item.pointer(@click="selectAll" :class="{'active': isSelectAll}" v-if="!searchVal")
              .icon.ibass-team
              .name 所有项目成员
              .ibass-done
            li.ib__user__choose__list__item.pointer(v-for="user in users" :key="user.id" :class="{'active': selectedUsers && selectedUsers.some(item => item.id === user.id)}" @click="selectItem(user)")
              img.icon(:src="user.pic || user.avatar || user.userPic" v-if="user.pic || user.avatar || user.userPic")
              span.icon.no__user__src(v-else)
              .name.ellipsis(v-html="user.name")
              .ibass-done
          .ib__user__choose__list__none(v-else)
            .ibass-search
            .text 暂无符合条件用户
        //- 自定义footer
        .ib__user__choose__footer
          slot(name="footer")
      .ib__user__choose__text(slot="trigger")
        slot(name="trigger")
</template>
<script>
import LeftPopover from '@/vue/components/LeftPopover'
import IlawService from '@/vue/service/ilaw'
export default {
  props: {
    selectedUsers: { // 选中用户列表
      type: Array,
      default () {
        return []
      }
    },
    defaultUsers: { // 传入用户列表
      type: Array,
      default () {
        return []
      }
    },
    matterId: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    requestUser: {
      type: Boolean
    },
    arrows: {
      type: String,
      default: 'bottom'
    }
  },
  components: { LeftPopover },
  data () {
    return {
      searchVal: '',
      loading: false,
      tmpDefaultUsers: [],
      curVisible: this.visible
    }
  },
  mounted () {
    // console.log(this.defaultUsers, '$$$$$$$')
    if (this.requestUser) {
      this.buildTmpDefaultUsers()
    }
  },
  methods: {
    afterChangeVisible (visible) {
      this.$emit('afterChangeVisible', visible)
    },
    search (value) {
      this.searchVal = value
    },
    async buildTmpDefaultUsers () {
      // 如果传入了默认用户选择集合，则使用，如果没有默认用户传入，尝试通过项目id获取项目下用户
      if (this.defaultUsers && this.defaultUsers.length > 0) {
        this.tmpDefaultUsers = _.cloneDeep(this.defaultUsers)
      } else if (this.matterId) {
        let params = {
          id: this.matterId,
        }
        // console.log('HHHHH')
        this.loading = true
        let res = await IlawService.searchMatterUsers(params)
        this.loading = false
        this.tmpDefaultUsers = res.data
        // console.log(this.selectedUsers)
      } else {
        this.tmpDefaultUsers = []
      }
    },
    selectItem (user) {
      let users = _.cloneDeep(this.selectedUsers)
      let flag = this.selectedUsers.find(item => item.id === user.id)
      if (!flag) {
        users.push(user)
      } else {
        users = users.filter(item => item.id !== user.id)
      }
      this.$emit('selectItem', users)
    },
    selectAll () {
      let users
      if (this.selectedUsers.length === this.users.length) {
        users = []
      } else {
        users = _.cloneDeep(this.users)
      }
      this.$emit('selectItem', users)
    }
  },
  computed: {
    users () {
      let res = this.tmpDefaultUsers.filter(user => {
        return user.name.includes(this.searchVal) || !this.searchVal
      })
      // 如果有当前用户，将当前登陆用户，将当前登陆用户放到第一个
      let index = 0
      for (let i = 0; i < res.length; i++) {
        if (res[i].id === this.$store.state.user.user.id) {
          index = i
          break
        }
      }
      if (index > 0) {
        res.unshift(res.splice(index, 1)[0])
      }
      return res
    },
    isSelectAll () {
      return this.selectedUsers && this.selectedUsers.length === this.users.length
    }
  },
  watch: {
    curVisible (newVal) {
      // console.log(this.curVisible, 'HHHHH')
      if (newVal) {
        this.buildTmpDefaultUsers()
      } else {
        this.$emit('closePopover')
      }
      this.$emit('changeVisible', newVal)
    }
  }
}
</script>
<style lang="scss" scoped>
  .ib__user__choose {
    position: relative;
    .ib__user__choose__popover {
      width: 12.5rem;
      padding: 0.5rem 0;
      .ib__user__choose__header {
        display: flex;
        position: relative;
        padding: 0 0.625rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid $color-bd-title;
        .ib__user__choose__search {
          width: 11.25rem;
        }
      }
      .ib__user__choose__list__wrapper {
        overflow: hidden;
      }
      .ib__user__choose__list {
        height: 16.25rem;
        overflow: auto;
        li {
          display: flex;
          position: relative;
          line-height: 2rem;
          min-height: 2rem;
          padding: 0.3rem 0.875rem;
          transition: all .2s;
          &.active {
            .ibass-done {
              display: block;
            }
          }
          &:hover {
            background: $color-bg-light;
          }
          .icon {
            width: 1.5rem;
            height: 1.5rem;
            margin-right: 0.625rem;
            text-align: center;
            @extend %f-giant;
            &.ibass-team {
              color: $theme-color;
              &:before {
                vertical-align: -3px;
              }
            }
          }
          img {
            &.icon {
              border-radius: 0.75rem;
              overflow: hidden;
              margin-top: 0.25rem;
            }
          }
          .no__user__src {
            display: inline-block;
            width: 1.5rem;
            height: 1.5rem;
            text-align: center;
            border-radius: 1.5rem;
            background: #dadada;
            margin-top: 3px;
          }
          .name {
            max-width: 7rem;
            word-wrap: break-word;
          }
          .ibass-done {
            display: none;
            position: absolute;
            right: 1.5625rem;
            color: $theme-color-light;
          }
        }
      }
      .ib__user__choose__list__none {
        height: 16.25rem;
        text-align: center;
        color: $color-text-placeholder;
        .ibass-search {
          padding-top: 5rem;
          font-size: 4rem;
        }
      }
      .ib__user__choose__footer {
        padding: 0.5rem 1.5625rem 0 1.5625rem;
        border-top: 1px solid $color-bd-title;
        color: $color-text-secondary;
        line-height: 1.5rem;
      }
    }
    .ib__user__choose__text {
      display: flex;
      margin-left: 0.625rem;
      span {
        max-width: 9.375rem;
      }
      .ibass-add {
        margin-top: 3px;
      }
    }
  }
</style>

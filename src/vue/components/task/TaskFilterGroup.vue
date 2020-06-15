<template lang="pug">
.ib__task-filter.pointer
    .ib__task-filter-member(v-if="showMember")
        ic-dropdown(:visible="dropdownState" @visiableChange="visiableChange" @handleClose="handleSelectUserClose")
            div.ib__task-filter-member-inner(@click="toggleVisable")
                .ib__task-filter-member-imgs
                  img(v-for="(selectUser,index) in showSelectUsers" :src="selectUser.userPic" v-if="selectUser.userPic")
                  span.no__img__src(v-for="(selectUser,index) in showSelectUsers" v-if="!selectUser.userPic")
                  .ib__task-filter-member-num(v-if="selectedUsers.length > 3")
                    span {{selectedUsers.length}}
                div
                  span(v-if="selectedUsers.length === 0") 无
                  span(v-if="selectedUsers.length === 1 && selectedUsers[0].userId === $store.state.user.user.id") 我
                  i.ibass-trig-down
            ic-dropdown-menu(slot="dropdown")
                user-selector(:users="users" :defaultUsers="selectedUsers" @selectUser="handleUserSelect")
    .ib__task-filter-matter(v-if="showMatter")
        ic-dropdown(:visible="matterState" @handleClose="handleSelectMatterClose")
            div(@click="matterVisibleChange")
                span {{matterLabel}}
                i.ibass-trig-down
            ic-dropdown-menu(slot="dropdown")
                matter-selector(:matters="matters" :defaultMatters="selectedMatters" @matterChange="matterChange")
    .ib__task-filter-status(v-if="showStatus")
      ic-dropdown(:visible="statusState")
        div(@click="statusVisibleChange")
            span {{statusLabel}}
            i.ibass-trig-down
        ic-dropdown-menu(slot="dropdown" theme="black")
          .ib__status-selector
            .ib__status-selector-item(v-for="(status, key) in defaultStatus" :key="status.value" @click="statusChange(status)")
              span {{status.label}}
</template>
<script>
import UserSelector from '@/vue/components/UserSelector'
import MatterSelector from '@/vue/components/MatterSelector'
import TaskService from '@/vue/service/task'
import {TASK_STATUS} from '@/utils/constants'
export default {
  components: {UserSelector, MatterSelector},
  props: {
    users: {
      type: Array,
    },
    showMember: {
      type: Boolean,
      default: false
    },
    showMatter: {
      type: Boolean,
      default: false
    },
    showStatus: {
      type: Boolean,
      default: false
    },
    defaultStatus: {
      type: Array,
      default () {
        return Object.values(TASK_STATUS)
      }
    }
  },
  data () {
    return {
      dropdownState: false,
      matterState: false,
      statusState: false,
      selectedMatters: [],
      selectedUsers: [],
      matters: [],
      TASK_STATUS
    }
  },
  methods: {
    toggleVisable () {
      this.dropdownState = !this.dropdownState
    },
    matterVisibleChange () {
      this.matterState = !this.matterState
    },
    statusVisibleChange () {
      this.statusState = !this.statusState
    },
    handleClose () {
      this.dropdownState = false
    },
    visiableChange (e) {
    },
    matterChange (selectedMatter) {
      // console.log('selectedMatter: ', selectedMatter)
      this.$store.commit('updateCalendarParams', {matters: _.cloneDeep(selectedMatter)})
      this.selectedMatters = selectedMatter
    },
    statusChange (status) {
      if (status.value !== this.$store.state.calendar.reqParams.status) {
        this.$store.commit('updateCalendarParams', {status: status.value})
        this.statusState = false
      }
    },
    handleUserSelect (selectedUsers) {
      this.selectedUsers = selectedUsers
      this.commitSelectedUser()
    },
    // 默认选中自身，第零个对象
    handleSelectUserClose () {
      if (this.selectedUsers.length === 0) {
        this.selectedUsers = this.users.slice(0, 1)
        this.commitSelectedUser()
      }
    },
    commitSelectedUser () {
      if (this.selectedUsers.length > 0) {
        // 需要使用lodash.cloneDeep，否则，在建立对象引用以后每一次修改都会触发updateCalendarParams对应对象的检查，导致报错
        this.$store.commit('updateCalendarParams', {users: _.cloneDeep(this.selectedUsers), matters: []})
      }
    },
    handleSelectMatterClose () {
      if (this.selectedMatters && this.selectedMatters[0] && this.selectedMatters[0].id === 'none') {
        this.selectedMatters = _.cloneDeep(this.matters)
        this.$store.commit('updateCalendarParams', {matters: _.cloneDeep(this.matters)})
      }
    },
    async getMatters () {
      let res
      // 根据选择的用户Id判断调用哪一个接口
      if (this.selectedUsers.length > 1 || (this.selectedUsers.length === 1 && this.selectedUsers[0].userId !== this.$store.state.user.user.id)) {
        res = await TaskService.getMattersByTaskAttendees({userIds: this.selectedUsers.map(user => user.userId)})
      } else if (this.selectedUsers.length === 1 && this.selectedUsers[0].userId === this.$store.state.user.user.id) {
        res = await TaskService.getMyMattersByTaskAttendees()
      }
      this.matters = res && res.data ? res.data : []
      if (this.selectedUsers.some(user => user.userId === this.$store.state.user.user.id)) {
        this.matters.unshift({name: '个人任务', id: 'personal_task'})
      }
    },
  },
  watch: {
    users () {
      // 初始化选中的人，初始化项目查询
      this.selectedUsers = this.users.filter(user => this.$store.state.calendar.reqParams.users.some(ruser => ruser.userId === user.userId))
      this.getMatters()
    },
    matters () {
      // 初始化选中的项目
      this.selectedMatters = this.matters.filter(matter => this.$store.state.calendar.reqParams.matters.some(rmatter => rmatter.id === matter.id))
    },
    '$store.state.calendar.reqParams.users': {
      handler: function (newer, older) {
        this.getMatters()
      },
      deep: true
    }
  },
  computed: {
    showSelectUsers () {
      return this.selectedUsers.slice(0, 3)
    },
    matterLabel () {
      return (this.selectedMatters.length === this.matters.length || this.selectedMatters.length === 0) ? '所有项目' : `已选${this.selectedMatters.filter(matter => matter.id !== 'none').length}个项目`
    },
    statusLabel () {
      return this.$store.state.calendar.reqParams.status ? Object.values(TASK_STATUS).find(item => item.value === this.$store.state.calendar.reqParams.status).label : '全部'
    }
  }
}
</script>
<style lang="scss" scoped>
.ib__task-filter{
    @extend %f-small;
    @extend %color-text-primary ;
    @include flex(row);
    margin-left: 16px;
    color: $color-text-regular;
    line-height: 28px;
    [class*=ibass] {
      @extend %f-extra-small;
      margin-left: 5px;
    };
    [class*=ib__task-filter-]{
      margin-right: 20px;
    }
    .ibass-trig-down{
      color:$color-bd-light;
      position: relative;
      top: 2px;
    }
    .ib__task-filter-member {
      .ib__task-filter-member-inner {
        @include flex(row);
        margin-right: 0;
        .ib__task-filter-member-imgs {
          @include flex(row);
          margin-right: 5px;
          img, .no__img__src {
            display: inline-block;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #dadada;
            border: 2px solid $color-white;
            &:not(:first-child) {
              margin-left: -6px;
            }
          }
          .ib__task-filter-member-num {
            margin-right: 0;
            margin-left: -6px;
            span {
              display: inline-block;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              text-align: center;
              background: $theme-color-light;
              color: $color-white;
              line-height: 24px;
              border: 2px solid $color-white;
            }
          }
        }
      }
    }
    .ib__task-filter-status {
      .ib__status-selector{
          @include flex(column);
          @extend %f-small;
          @extend %color-text-primary ;
          width: 6.25rem;
        .ib__status-selector-item{
            @extend %f-extra-small;
            @include flex(row,flex-start,center);
            color: #d9d9d9;
            padding: 0 0.625rem;
            height: 2.25rem;
            box-sizing: border-box;
            width: 100%;
            transition: all .2s;
            &:hover{
                background-color: $color-black;
            }
        }
      }
    }
}
</style>

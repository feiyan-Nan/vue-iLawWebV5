<template lang="pug">
  .ib__task__create(v-ic-loading="loading")
    .ib__task__create__wrapper(:class="{'collapse': collapse}")
      .ib__task__title__content
        .ib__task__name
          ic-input(:placeholder="collapse ? '任务标题' : '从这里新建任务'" v-model="name" @focus="inputFocus" @keyup="saveEnter" ref="nameInput")
        .ib__task__name__opts
          .name__count
            span(:class="{name__count__warning : nameCount > 200}") {{nameCount}}
            span /200
          .enter__save.pointer(@click="save")
            .ibass-return
            span 回车保存
          favorite-star(:choosed="favorite" @toggle="changeFavorite")
      transition(name="fade-slide")
        .ib__task__main(v-if="collapse")
          .ib__task__main_info
            .ib__matter__relate.relate__column
              .ib__matter__title
                span 所属项目
              .ib__task__matter__group
                .ib__task__matter__choose
                  matter-choose(@selectItem="selectMatter" :selectedMatters="selectedMatters" v-if="!!selectedMatters")
                .ib__task__group__choose(v-if="selectedMatters.length > 0 && selectedMatters[0].pkId")
                  task-group-choose(:matterId="selectedMatters[0].pkId" @selectItem="selectGroup" :selectedTaskGroups="selectedTaskGroups")
            .ib__attendees__relate.relate__column
              .ib__attendees__title
                span 负责人
              .ib__attendees__choose
                .ib__attendees__imgs(v-if="selectedUsers.length > 0")
                  user-img(:selectedUsers="selectedUsers" :editable="isSelectMatter" :clickable="isSelectMatter" @clearUser="clearUser" @clearAllUser="clearAllUser") 44
                  .user__name(v-if="selectedUsers.length === 1") {{selectedUsers[0].name}}
                .ib__attendees__none(v-else)
                  span 未分配
                .ib__attendees__popover__main(:class="{'ml': selectedMatters.length === 0 || selectedMatters[0].pkId === ''}")
                  user-choose(v-if="isSelectMatter" :matterId="matterId" :selectedUsers="selectedUsers" :defaultUsers="defaultUsers" @selectItem="selectUser")
                    .ib__attendees__operate.pointer(slot="footer" @click="clearAllUser")
                      .ibass-close
                      span 清除所选人员
                    .ib__attendees__trigger(slot="trigger")
                      .ibass-add
                  .ib__attendees__trigger.pointer(v-else @click="selectUserNoneMatter")
                      .ibass-add
            .ib__time__relate.relate__column
              .ib__time__title
                span 时间
                .ib__time__other
                  remind-icon(:remindSetting="curTask.remindSetting" :timeType="curTask.timeType")
                  repeat-icon(:repeatSetting="curTask.repeatSetting")
              .ib__time__choose
                time-choose(:task="curTask" :editable="true" @setTime="setTime")
          .ib__task__opts
            ic-button.button(type="normal" @click="cancel") 取消
            ic-button.button(@click="save") 保存
</template>
<script>
import MatterChoose from '@/vue/components/matter/choose/Index'
import TaskGroupChoose from '@/vue/components/taskgroup/choose/Index'
import UserChoose from '@/vue/components/user/choose/Index'
import UserImg from '@/vue/components/user/choose/UserImg'
import TimeChoose from '@/vue/components/task/time/TimeChoose'
import RemindIcon from '@/vue/components/task/time/remind/RemindIcon'
import RepeatIcon from '@/vue/components/task/time/repeat/RepeatIcon'
import IlawService from '@/vue/service/ilaw'
import TaskService from '@/vue/service/task'
import { TASK_DAYTYPE, TASK_TIMETYPE } from '@/utils/constants'
import rules from '@/utils/validation/rules'
import FavoriteStar from '@/vue/components/FavoriteStar'
export default {
  components: { MatterChoose, TaskGroupChoose, UserChoose, UserImg, TimeChoose, FavoriteStar, RemindIcon, RepeatIcon },
  props: {
    matter: {
      type: Object
    },
    taskGroup: {
      type: Object
    },
    time: {
      type: Object
    }
  },
  data () {
    return {
      collapse: false,
      selectedMatters: [],
      selectedTaskGroups: [],
      selectedUsers: [],
      defaultUsers: [],
      name: '',
      favorite: false,
      workTypeId: null,
      curTask: {},
      loading: false
    }
  },
  methods: {
    /**
     * 初始化新建数据
     */
    initial () {
      // 构建时间相关数据结构
      this.curTask = {
        dueTime: null,
        startTime: null,
        endTime: null,
        dayType: TASK_DAYTYPE.UN_FULL.value,
        timeType: TASK_TIMETYPE.DUE.value,
        repeatSetting: {
          repeatRule: 'none',
          customRepeatRule: null,
          endType: null,
          endByDate: null,
          endByTimes: null,
          dayIndexList: []
        },
        remindSetting: { // 提醒时间
          ruleTime: [],
          customTime: []
        }
      }
      if (this.time) {
        Object.assign(this.curTask, {
          dueTime: this.time.dueTime || null,
          startTime: this.time.startTime || null,
          endTime: this.time.endTime || null,
          dayType: this.time.dayType ? this.time.dayType : TASK_DAYTYPE.UN_FULL,
          timeType: this.time.startTime && this.time.endTime ? TASK_TIMETYPE.STARTEND : TASK_TIMETYPE.DUE,
        })
      }
      this.name = ''
      this.favorite = false
      this.workTypeId = null
      this.selectedMatters = []
      this.selectedTaskGroups = []
      this.selectedUsers = [this.$store.state.user.user]
    },
    inputFocus () {
      this.collapse = true
    },
    cancel () {
      this.collapse = false
    },
    selectMatter (matter) {
      this.selectedMatters = [matter]
      // 清空任务组数据
      this.selectedTaskGroups = []
      // 选择项目以后重新获取用户列表
      let params = {
        id: matter.pkId,
      }
      IlawService.searchMatterUsers(params).then(res => {
        this.defaultUsers = res.data || []
        // 判断当前用户是否在列表中，如果在则选中，不在则清除
        let flag = this.defaultUsers.some(u => u.id === this.$store.state.user.user.id)
        this.selectedUsers = flag ? [this.$store.state.user.user] : []
      })
    },
    selectGroup (group) {
      this.selectedTaskGroups = [group]
    },
    selectUser (users) {
      this.selectedUsers = users
    },
    clearUser (user) {
      this.selectedUsers = this.selectedUsers.filter(item => item.id !== user.id)
    },
    clearAllUser () {
      this.selectedUsers = []
    },
    saveEnter (data, ev) {
      if (ev.keyCode === 13) {
        this.$refs.nameInput.$el.querySelector('input').blur()
        this.save()
      }
    },
    save () {
      let postData = this.buildPostData()
      if (this.validate(postData)) {
        this.loading = TaskService.createTask(postData).then(res => {
          this.setToast(res.data, '任务创建成功')
          this.initial()
          this.$emit('refresh')
          this.collapse = false
        })
      } else {
        this.$refs.nameInput.$el.querySelector('input').focus()
      }
    },
    /**
     * 设置时间,提醒,重复数据
     */
    setTime (data) {
      Object.assign(this.curTask, data.time)
      Object.assign(this.curTask.repeatSetting, data.repeat)
      Object.assign(this.curTask.remindSetting, data.remind)
    },
    /**
     * 构建提交数据
     */
    buildPostData () {
      // 构建参与人
      let attendeeIds = this.selectedUsers.map(attendee => attendee.id)
      let timeSetting = {
        timeType: this.curTask.timeType,
        dueTime: this.curTask.dueTime,
        startTime: this.curTask.startTime,
        endTime: this.curTask.endTime,
        dayType: this.curTask.dayType
      }
      return {
        matterId: this.selectedMatters[0] && this.selectedMatters[0].pkId ? this.selectedMatters[0].pkId : '',
        taskGroupId: this.selectedTaskGroups[0] && this.selectedTaskGroups[0].id ? this.selectedTaskGroups[0].id : '',
        name: this.name || '新建任务',
        favorite: this.favorite,
        workTypeId: this.workTypeId,
        timeSetting: timeSetting,
        attendeeIds: attendeeIds,
        repeatSetting: this.curTask.repeatSetting.repeatRule === 'none' ? null : _.cloneDeep(this.curTask.repeatSetting),
        remindSetting: _.cloneDeep(this.curTask.remindSetting)
      }
    },
    /**
     * 保存数据验证
     */
    validate (postData) {
      // 任务标题不能为空
      if (postData.name === '') {
        this.$postMessage.toast({msg: '请输入具体内容'})
        return true
      }
      // 任务名不能使用emoji
      if (!rules().noEmoji.validate(postData.name)) {
        this.$postMessage.toast({msg: '任务标题不能包含Emoji'})
        return false
      }
      // 任务名标题长度限制200
      if (postData.name.length > 200) {
        this.$postMessage.toast({msg: '任务标题内容长度大于了最大限制'})
        return false
      }
      return true
    },
    setToast (task, desc, isNewPage) {
      // 跳转到任务列表（项目/个人）页面并查看该任务的详情
      let url = task.matterId ? `/#/app/matter/find/${task.matterId}/U/task?viewtaskid=${task.id}` : `/#/app/my/task/list/?viewtaskid=${task.id}`
      let notifyHtml = isNewPage ? `<div><span>${desc}</span><div class="notify-for-new-task"><a href="${url}" target="_blank">查看</a></div></div>` : `<div><span>${desc}</span><div class="notify-for-new-task"><a href="${url}">查看</a></div></div>`
      this.$postMessage.toast({msg: notifyHtml, type: 'success', symbolFilter: false})
    },
    changeFavorite (favorite) {
      this.favorite = favorite
    },
    selectUserNoneMatter () {
      this.$postMessage.toast({msg: '请先选择所属项目'})
    }
  },
  mounted () {
    // if (this.matter) {
    //   this.selectedMatters = [{pkId: this.matter.pkId, name: this.matter.name}]
    // }
    // this.selectedMatters = [{pkId: 1, name: '1234567'}]
    this.initial()
  },
  computed: {
    isSelectMatter () {
      return !!(this.selectedMatters[0] && this.selectedMatters[0].pkId)
    },
    nameCount () {
      return this.name.length
    },
    matterId () {
      if (this.matter) {
        return this.matter['pkId']
      } else {
        return this.selectedMatters[0].pkId
      }
    }
  },
  watch: {
    matter (newValue) {
      this.selectedMatters = [{pkId: newValue.pkId, name: newValue.name}]
    }
  }
}
</script>
<style lang="scss">
  .ib__task__create {
    border-radius: 5px;
    padding: 0.625rem;
    background: $color-bg-light;
    .ib__task__create__wrapper {
      background: $color-white;
      padding: 0 1.5625rem;
      transition: padding .2s;
      &.collapse {
        padding: 1.25rem 1.5625rem;
        .ib__task__name {
          /deep/ .ic-input {
            .ic-input__inner {
              border-bottom: 1px solid $color-bd-input;
              &:focus {
                  border-color: $theme-color-lighter;
              }
            }
          }
        }
        .ib__task__name__opts {
          display: flex;
        }
      }
      .ib__task__title__content {
        position: relative;
      }
      .ib__task__name {
        /deep/ .ic-input {
          margin: 0;
          .ic-input__inner {
            @extend %f-small;
            width: 100%;
            padding: 1.125rem 10.875rem 1.125rem 0;
            border: 0;
            border-radius: 0;
            border-color: $color-bd-input;
          }
        }
      }
      .ib__task__name__opts {
        display: none;
        position: absolute;
        top: 1.125rem;
        right: 0;
        @extend %f-small;
        .name__count{
          display:flex;
          align-items: center;
          margin-right: 0.5rem;
          color: $color-text-placeholder;
          .name__count__warning{
            color:$dangerous-color;
          }
        }
        .enter__save {
          display: flex;
          color: $color-text-placeholder;
          transition: all 0.2s;
          .ibass-return {
            margin-right: 0.25rem;
            &:before {
              vertical-align: -0.25rem;
            }
          }
          &:hover {
            color: $theme-color-light;
          }
        }
      }
      .ib__task__main_info {
        @include flex(row, flex-start, center);
        padding-top: 1rem;
        .relate__column {
          width: 33.33%;
          padding: 0 0.625rem 0 1.25rem ;
          height: 4.375rem;
          &:not(:last-child){
            border-right: 1px solid $color-bd-input;
          }
        }
        .ib__matter__title, .ib__attendees__title, .ib__time__title {
          position: relative;
          height: 50%;
          color: $color-text-placeholder;
          @extend %f-extra-small;
        }
        .ib__task__matter__group, .ib__attendees__choose, .ib__time__choose {
          position: relative;
          height: 50%;
          @extend %f-small;
          line-height: 1.5rem;
        }
        .ib__matter__relate {
          padding-left: 0;
          .ib__task__matter__group {
            display: flex;
            .ib__task__matter__choose, .ib__task__group__choose {
              width: 50%;
            }
          }
        }
        .ib__attendees__choose {
          display: flex;
          .ib__attendees__popover__main {
            // position: absolute;
            // left: 70px;
            // top: 0;
            float: left;
            margin-top: -2px;
            width: 26px;
          }
          // 解决不修改内部组件的样式问题
          .ml{
            margin-left: .625rem;
          }
          .ib__attendees__imgs {
            float: left;
            display: flex;
            .user__name {
              line-height: 1.8rem;
              margin-left: 0.3125rem;
            }
          }
          .ib__attendees__trigger {
            line-height: 1.5rem;
            margin-top: 0.2rem;
            .ibass-add {
              width: 1.5rem;
              height: 1.5rem;
              text-align: center;
              border: 1px dashed $color-bd-regular;
              border-radius: 1.5rem;
              color: $color-text-placeholder;
              // margin-left: 0.3125rem;
              transition: all 0.2s;
              &:before {
                vertical-align: -2px;
              }
              &:hover {
                color: $theme-color-light;
                border-color: $theme-color-light;
              }
            }
          }
          .ib__attendees__none {
            line-height: 1.5rem;
          }
          .ib__attendees__operate {
            display: flex;
            width: fit-content;
            transition: all .2s;
            .ibass-close {
              @extend %f-normal;
              &:before {
                vertical-align: -3px;
              }
            }
            span {
              margin-left: 0.625rem;
            }
            &:hover, &.active {
              color: $theme-color-light;
            }
          }
        }
        .ib__time__relate {
          .ib__time__title {
            position: relative;
            @include flex(row);
            .ib__time__other {
              @include flex(row);
              position: absolute;
              right: 0;
              top: 3px;
            }
          }
          .ib__time__choose {
            /deep/ .ib__task__time__choose__trigger {
              line-height: 1.5rem;
            }
            /deep/ .ib__task__time__choose__text {
              line-height: 1.5rem;
            }
          }
        }
      }
      .ib__task__opts {
        @include flex(row, center);
        border-top: 1px solid $color-bd-input;
        margin-top: 1rem;
        .button {
          margin: 1rem;
          width: 6.25rem;
        }
      }
    }
  }
</style>

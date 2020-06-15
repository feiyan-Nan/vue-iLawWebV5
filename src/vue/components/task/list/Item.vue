<template lang="pug">
  .ib__task__column(:class="{'overtime': isOverTime, 'can-hover': canHover}" @mouseover="itemOver=true;userChooseHover=true" @mouseleave="itemOver=false;")
    .ib__task__icon__area
      template(v-if="!task.valid || task.state || !task.attendees || (!task.state && task.attendees.length <= 1)")
        .ib__task__icon.pointer(:class="{'ibass-restore': !task.valid, 'ibass-warning': isOverTime, 'ibass-done': task.valid && task.state, 'ibass-task-check': !isOverTime}" @click="changeTaskStatus")
      template(v-else)
        multiple-user-confirm(@confirm="changeTaskStatus" :activated="itemOver")
          .ib__task__icon.pointer(slot="trigger" :class="{'ibass-warning': isOverTime, 'ibass-task-check': !isOverTime}")
    .ib__task__content.pointer(@click="openTaskDetail")
      .ib__task__name__group
        .ib__task__name.ellipsis(:class="{'del-line': task.state && task.valid}")
          span(:title="task.name") {{task.name}}
        .ib__task__subname.ellipsis
          template(v-if="!task.matterId")
            span 个人任务
          template(v-else)
            span {{task.matterName }}
            span(v-if="task.taskGroupName") -{{task.taskGroupName}}
      .ib__task__taskitem_num
        template(v-if="task.itemCount > 0")
          .icon.ibass-list
          span {{task.finishedTaskItemCount || task.completedItemCount || task.doneItemCount || 0}}/{{task.itemCount}}
      .ib__task__attachment_num
        template(v-if="task.attachmentCount > 0")
          .icon.ibass-attachment
          span {{task.attachmentCount}}
      .ib__task__comment_num
        template(v-if="task.commentCount > 0")
          .icon.ibass-comment
          span {{task.commentCount}}
    .ib__task__time
      //- 项目下
      time-choose(v-if="isMatter" :task="task" :listShow="true" :editable="isUnFinish && task.state === 0 && isPermission('task:edit')" :appendToBody="false" @setTime="changeTime" @afterChangeVisible="afterChangeVisible")
      //- 我的下
      time-choose(v-if="!isMatter" :task="task" :listShow="true" :editable="isUnFinish && task.state === 0" :appendToBody="false" @setTime="changeTime" @afterChangeVisible="afterChangeVisible")
    .ib__task__attendees(@mouseover="userChooseHover=true" @mouseleave="userChooseHover=false")
      user-choose(v-if="task.matterId && isUnFinish && task.state === 0 && (userChooseHover || userChooseVisible) && (isMatter?isPermission('task:edit'):true)" :visible="userChooseVisible" :selectedUsers="attendees" :matterId="task.matterId" @selectItem="selectUser" @closePopover="closeUserPopover" ref="userChoose" @changeVisible="changeUserChooseVisible" @afterChangeVisible="afterChangeVisible")
        .ib__task__attendees__operate(slot="footer")
          span.pointer(@click="clearAllUser") 清除
          ic-button.ib__task__attendees__confirm(@click="changeUser") 确定
        .ib__task__attendees__trigger(slot="trigger")
          .ib__task__attendees__imgs(:class="{'single': task.attendees && task.attendees.length === 1 && task.attendees[0].id === currentUser.id}")
            user-img(:selectedUsers="task.attendees" :maxSize="2" :clickable="false" :offsetX="-6")
          .ib__task__attendees__none(v-if="!task.attendees || task.attendees.length === 0")
            span 未分配
          .ibass-trig-down
      .ib__task__attendees__imgs.mr-10(v-else :class="{'single': task.attendees && task.attendees.length === 1 && task.attendees[0].id === currentUser.id}")
        user-img(:selectedUsers="task.attendees" :maxSize="2" :clickable="false" :offsetX="-6")
        .ib__task__attendees__none.mt-10(v-if="!task.attendees || task.attendees.length === 0")
            span 未分配
    .ib__task__timelog(v-if="!isDeleted")
      time-log(:taskInfo="task" :activated="itemOver")
    .ib__task__favorite
      favorite-star(:choosed="task.favorite" @toggle="changeFavorite")
    .ib__task__more(v-if="!isDeleted")
      more-option(:taskInfo="task" @deleteTask="deleteTask")
</template>
<script>
import FavoriteStar from '@/vue/components/FavoriteStar'
import TimeChoose from '../time/TimeChoose'
import UserChoose from '../../user/choose/Index'
import UserImg from '../../user/choose/UserImg'
import TaskService from '@/vue/service/task'
import TimeLog from '../../time/TimeLog'
import MoreOption from './MoreOption'
import MultipleUserConfirm from './MultipleUserConfirm'
import IlawService from '@/vue/service/ilaw'
import { TASK_DAYTYPE, TASK_STATUS } from '@/utils/constants'
import ToolUtil from '../util'
export default {
  components: { TimeChoose, UserChoose, UserImg, TimeLog, MoreOption, FavoriteStar, MultipleUserConfirm },
  props: {
    task: {
      type: Object
    },
    canHover: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      currentUser: this.$store.state.user.user || {},
      attendees: _.cloneDeep(this.task.attendees) || [],
      loading: false,
      multiUserVisible: false,
      isUnFinish: this.$store.state.calendar.reqParams.status === TASK_STATUS.UN_FINISH.value,
      isDeleted: this.$store.state.calendar.reqParams.status === TASK_STATUS.DELETED.value,
      userChooseHover: false,
      userChooseVisible: false,
      isExecuting: false,
      itemOver: false,
      // 判断是不是项目还是我的
      isMatter: this.$store.state.matter.mark === 'matter',
    }
  },
  created () {
    // console.log(this.task.attendees)
  },
  methods: {
    afterChangeVisible (visible) {
      this.$emit('afterChangeVisible', visible)
    },
    // 判断权限
    isPermission (args) {
      // 当前用户ID
      const curUserId = this.$store.state.user.user.id
      // 项目状态不是已完结的 && 如果权限 || 我在这个任务中  ||  这是任务是我创建的
      return this.$store.state.matter.curMatter.status !== 4 && (this.$store.state.matter.matterTaskPermission.includes(args) || (this.task.attendees && this.task.attendees.some(attendee => { return attendee.id === curUserId })) || this.task.createUserId === curUserId)
    },
    openTaskDetail () {
      this.$emit('getOpenTaskDetailGroupId', this.task.taskGroupId)
      this.$postMessage.openTaskDetail(this.task.id, true)
    },
    selectUser (users) {
      this.attendees = users
    },
    clearAllUser () {
      this.attendees = []
      this.updateTaskAttendees()
    },
    changeUser () {
      this.updateTaskAttendees()
    },
    /**
     * 更新任务的责任人
     */
    updateTaskAttendees () {
      // 判断当前操作是否进行中
      if (!this.loading) {
        let curAtIds = this.attendees.map(at => at.id)
        let defAtIds = (this.task.attendees || []).map(at => at.id)
        // 判断是否发生了变化
        if (curAtIds.sort().join(',') !== defAtIds.sort().join(',')) {
          this.loading = true
          let obj = {
            attendeeIds: this.attendees.map(at => at.id),
            effectRepeats: false
          }
          TaskService.updateTaskAttendees(this.task.id, obj).then(() => {
            this.$postMessage.toast({msg: '当前任务操作成功', type: 'success'})
            this.task.attendees = _.cloneDeep(this.attendees)
            this.loading = false
            this.$refs.userChoose.curVisible = false
          })
        } else {
          this.$refs.userChoose.curVisible = false
        }
      } else {
        this.$postMessage.toast({msg: '操作进行中，请稍后...'})
      }
    },
    closeUserPopover () {
      this.attendees = _.cloneDeep(this.task.attendees)
    },
    /**
     * 修改任务关注和未关注状态
     */
    changeFavorite (favorite) {
      let p
      if (this.isExecuting) {
        this.$postMessage.toast({msg: '操作进行中,请稍后...'})
      } else {
        if (favorite) {
          p = IlawService.attentionTask(this.task.id)
        } else {
          p = IlawService.cancelAttentionTask(this.task.id)
        }
        this.isExecuting = true
        p.then(res => {
          this.task.favorite = favorite
          this.$emit('updateFavorite', this.task)
          this.$postMessage.toast({msg: '当前任务操作成功', type: 'success'})
          this.isExecuting = false
        })
      }
    },
    /**
     * 修改当前任务状态
     */
    changeTaskStatus () {
      let p
      if (!this.task.valid) { // 被删除
        p = TaskService.recoverTask(this.task.id, false)
      } else if (this.task.valid && this.task.state) { // 未删除，已完成
        p = TaskService.restartTask(this.task.id)
      } else if (this.task.valid && !this.task.state) { // 未删除，未完成
        p = TaskService.finishTask(this.task.id)
      }
      p.then(res => {
        this.$postMessage.toast({msg: '当前任务操作成功', type: 'success'})
        this.$emit('updateStatus', this.task)
      })
    },
    /**
     * 更新时间
     */
    async changeTime (data) {
      if (this.isExecuting) {
        this.$postMessage.toast({msg: '操作进行中,请稍后...'})
        return
      }
      let sameRes = ToolUtil.checkTaskTimeChange(data, this.task)
      // 所有都没有变化，不执行操作
      if (sameRes.isTimeSame && sameRes.isRemindSame && sameRes.isRepeatSame) {
        return
      }
      this.isExecuting = true
      let isEmptyTime = false
      if (!sameRes.isTimeSame) {
        if (!data.time.dueTime && !data.time.startTime && !data.time.endTime) { // 清空时间操作
          isEmptyTime = true
        }
        await this.updateTime(data)
      }
      if (!isEmptyTime && !sameRes.isRemindSame) {
        await this.updateRemind(data)
      }
      if (!isEmptyTime && !sameRes.isRepeatSame) {
        await this.updateRepeat(data)
      }
      this.$postMessage.toast({msg: '当前任务操作成功', type: 'success'})
      this.isExecuting = false
      this.$emit('updateTask', this.task)
    },
    updateTime (data) {
      let p
      if (!data.time.dueTime && !data.time.startTime && !data.time.endTime) { // 清空时间
        p = TaskService.emptyTaskTime(this.task.id, false)
      } else { // 更新时间
        let timeObj = Object.assign({}, data.time, {effectRepeats: false})
        p = TaskService.editTaskTime(this.task.id, timeObj)
      }
      return p.then(() => {
        Object.assign(this.task, data.time)
      })
    },
    updateRemind (data) {
      // 调用接口更新提醒时间
      let remindObj = Object.assign({}, data.remind, {effectRepeats: false})
      return TaskService.setTaskRemind(this.task.id, remindObj).then(() => {
        Object.assign(this.task.remindSetting, data.remind)
      })
    },
    updateRepeat (data) {
      let p
      let repeatObj = {
        repeatRule: data.repeat.repeatRule,
        customRepeatRule: data.repeat.customRepeatRule,
        endType: data.repeat.endType,
        endByDate: data.repeat.endByDate,
        endByTimes: data.repeat.endByTimes,
        dayIndexList: data.repeat.dayIndexList
      }
      if (!this.task.repeatSetting.repeatRule || this.task.repeatSetting.repeatRule === 'none') {
        p = TaskService.setTaskRepeat(this.task.id, repeatObj)
      } else {
        p = TaskService.updateTaskRepeat(this.task.id, repeatObj)
      }
      return p.then(() => {
        Object.assign(this.task.repeatSetting, data.repeat)
      })
    },
    changeUserChooseVisible (val) {
      this.userChooseVisible = val
    },
    deleteTask (taskId) {
      this.$emit('deleteTask', taskId)
      // console.log('deleteTask', taskId, '++++++++++++++++')
    }
  },
  computed: {
    isOverTime () {
      // 获得当前系统的时间
      let currentDate = new Date()
      let res = false
      // 只有在任务设置了时间，且为非完成，非删除状态下才会进行超时的显示处理
      if (this.task.valid && !this.task.state) {
        // 如果是全天任务
        if (this.task.dayType === TASK_DAYTYPE.FULL.value) {
          currentDate.setHours(0)
          currentDate.setMinutes(0)
          currentDate.setSeconds(0)
          currentDate.setMilliseconds(0)
        }
        let currentTime = currentDate.getTime()
        res = (this.task.dueTime && this.task.dueTime < currentTime) || (this.task.endTime && this.task.endTime < currentTime)
      }
      return res
    }
  },
  watch: {
    task () {
      this.attendees = _.cloneDeep(this.task.attendees)
    }
  }
}
</script>
<style lang="scss">
  .task-fade-enter-active {
    overflow: hidden;
    animation: task-fade-in .3s;
  }
  .task-fade-leave-active {
    overflow: hidden;
    animation: task-fade-in .3s ease-out reverse;
  }
  @keyframes task-fade-in {
    0% {
      height: 0;
      opacity: 0;
      // transform: scaleY(0);
    }
    100% {
      height: 3.125rem;
      opacity: 1;
    }
  }
  .ib__task__column {
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    @include flex(row);
    height: 3.125rem;
    line-height: 3.125rem;
    // border-bottom: 0.0625rem solid $color-bd-extra-light;
    box-shadow: inset 0 -1px 0 0 $color-bd-extra-light;
    transition: all .2s;
    padding: 0 0.625rem;
    @extend %f-small;
    &.can-hover:hover {
      background: $color-bg-light;
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.15);
      .ib__task__icon__area{
        .ib__task__icon {
          transform: scale(1.3);
          color: $theme-color-light;
        }
      }
      .ib__task__attendees {
        .ib__task__attendees__none {
          visibility: visible;
        }
        .mt-10{
          margin-top: -2px;
        }
        .ib__task__attendees__imgs {
          &.single {
            opacity: 1;
          }
        }
      }
      .ib__task__more{
        visibility:visible;
      }
      .ib__task__timelog /deep/{
        .ib__time-timelog-icon__hidden{
          visibility:visible;
        }
      }
      .ib__task__time {
        /deep/ .ib__task__time__choose__trigger {
          opacity: 1;
        }
      }
      .ib__task__favorite {
        opacity: 1
      }
    }
    &.overtime {
      .ib__task__content, .ib__task__time {
        color: $dangerous-color;
      }
      .ib__task__icon__area{
        .ib__task__icon {
          color: $dangerous-color;
        }
      }
    }
    .ib__task__icon__area {
      width: 1rem;
      height: 1rem;
      margin-top: 1rem;
      margin-right: 0.625rem;
      .ib__task__icon {
        width: 18px;
        height: 18px;
        transition: all .2s;
        @extend %f-giant;
        color: $color-bd-light;
        &:before{
          position: absolute;
        }
        &.ibass-done {
          color: $theme-color-light;
        }
      }
    }
    .ib__task__content {
      @include flex(row);
      width: 30.5rem;
      .ib__task__name__group {
        line-height: 1.3rem;
        width: 18.25rem;
        padding: 0.3rem 0;
        .del-line{
          text-decoration: line-through;
        }
        .ib__task__name {
          width: 18rem;
          @extend %f-small;
        }
        .ib__task__subname {
          width: 18rem;
          @extend %f-extra-small;
          color: #8a94a0;
        }
      }
      .ib__task__attachment_num, .ib__task__taskitem_num, .ib__task__comment_num {
        @include flex(row);
        color: $color-bd-light;
        @extend %f-small;
        margin-left: 0.375rem;
        span {
          color: $color-text-placeholder;
          margin-left: 0.375rem;
        }
        .icon {
          &:before {
            vertical-align: -0.125rem;
          }
        }
      }
      .ib__task__taskitem_num {
        width: 5rem;
      }
      .ib__task__attachment_num {
        width: 4rem;
      }
      .ib__task__comment_num {
        width: 4rem;
        margin-right: 10px;
      }
    }
    .ib__task__time {
      width: 12.5rem;
    }
    .ib__task__attendees {
      @include flex(row);
      width: 120px;
      .ib__task__attendees__imgs {
        height: 2rem;
        line-height: 2rem;
        margin-top: 0.75rem;
        transition: all .2s;
        &.single {
          opacity: 0;
        }
        &.mr-10 {
          margin-left: 0.635rem;
        }
      }
      .ib__task__attendees__trigger {
        display: flex;
        .ibass-trig-down {
          opacity: 0;
          padding-left: 4px;
          color: $theme-color-light;
          &:before {
            vertical-align: -2px;
          }
        }
      }
      &:hover {
        .ib__task__attendees__trigger {
          .ibass-trig-down {
            opacity: 1;
          }
        }
      }
      .ib__task__attendees__none {
        visibility: hidden;
      }
      .mt-10{
        margin-top: -2px;
      }
      .ib__task__attendees__operate {
        display: flex;
        width: fit-content;
        transition: all .2s;
        span {
          margin-right: 1.5rem;
          line-height: 2rem;
          &:hover {
            color: $theme-color-light;
          }
        }
        .ib__task__attendees__confirm {
          width: 5rem;
          height: 1.125rem;
        }
      }
    }
    .ib__task__timelog{
      width: 4.5rem;
      /deep/ .ib__time-timelog-icon__hidden{
        visibility: hidden;
      }
    }
    .ib__task__favorite{
      width: 3.5rem;
      opacity: 0;
      transition: all .2s;
      /deep/ .ibass-star {
        color: $theme-color-light;
      }
    }
    .ib__task__more{
      visibility: hidden;
      width: 2rem;
    }
  }
</style>

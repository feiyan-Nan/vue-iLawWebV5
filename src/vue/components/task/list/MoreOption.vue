<template lang="pug">
  .ib__more-option(:class="{'active': popVisibility}")
    ic-popover(:scrollable="true" theme="black" position="no" v-model="popVisibility" :positionX="-68" :positionY="40" :appendToBody="false" @afterChangeVisible="afterChangeVisible")
      i.ibass-ellipses(slot="trigger")
      .ib__more-option-content
        .ib__more-option-item.pointer(@click="copyTask") 复制任务
        .ib__more-option-item.pointer(@click="copyTaskLink") 复制任务链接
        .ib__more-option-item.pointer(@click="deleteTaskConfirm" v-if="isPermission('task:delete')") 删除任务
        //- .ib__more-option-item.pointer(@click="deleteTaskConfirm" v-if="!isMatter") 删除任务
</template>
<script>
import taskService from '@/vue/service/task/index'
import emitter from '@/plugin/emitter'
export default {
  props: {
    taskInfo: Object
  },
  mixins: [emitter],
  data () {
    return {
      popVisibility: false,
      isRemoving: false,
      // 判断是不是项目还是我的
      isMatter: this.$store.state.matter.mark === 'matter',
    }
  },
  computed: {
    // 判断是不是重复任务的标示 true：是重复任务
    isRepeatTask () {
      return this.taskInfo.repeatSetting && this.taskInfo.repeatSetting.repeatRule && this.taskInfo.repeatSetting.repeatRule !== 'none'
    }
  },
  methods: {
    afterChangeVisible ({ type, visible }) {
      if (type === 'toggle') {
        setTimeout(() => {
          this.taskInfo.disableDrag = visible
        }, 0)
      } else {
        this.taskInfo.disableDrag = visible
      }
    },
    isPermission (args) {
      // 当前用户ID
      const curUserId = this.$store.state.user.user.id
      // 项目状态不是已完结的 && 如果有权限 || 我在这个任务中  ||  这是任务是我创建的
      return this.$store.state.matter.curMatter.status !== 4 && (this.$store.state.matter.matterTaskPermission.includes(args) || (this.taskInfo.attendees && this.taskInfo.attendees.some(attendee => { return attendee.id === curUserId })) || this.taskInfo.createUserId === curUserId)
    },
    copyTask () {
      this.$postMessage.openTaskCopyPanel(this.taskInfo.id)
      this.popVisibility = false
    },
    copyTaskLink () {
      const link = `${this.taskInfo.name}：${location.protocol}//${location.host}/third/task-share-link/index.html?id=${this.taskInfo.id}`
      this.copy(link, '复制任务链接成功')
      this.popVisibility = false
    },
    deleteTaskConfirm () {
      // const matterTaskPermission = this.$store.state.matter.matterTaskPermission
      // 判断有没有删除的权限，（这里只有项目这边的权限）
      // if (!matterTaskPermission.includes('task:delete')) {
      //   return false
      // }
      // console.log(this.$store.state.matter.curMatter.status)
      if (this.isRepeatTask) {
        this.$postMessage.deleteRepeatTaskConfirm(this.taskInfo, this.deleteRepeatTask)
      } else {
        this.$postMessage.deleteTaskConfirm(this.taskInfo, this.deleteTask)
      }
      this.popVisibility = false
      if (this.isRemoving) {
        this.$postMessage.toast({msg: '正在处理中,请稍后...'})
      }
    },
    // cd: 只删除当前任务cb返回false，如果删除当前任务及后续重复任务返回true
    async deleteRepeatTask (task, cd) {
      // console.log(task)
      this.isRemoving = true
      await taskService.deleteTask(task.id, cd)
      this.$postMessage.toast({msg: '当前任务操作成功', type: 'success'})
      this.dispatch('taskGroup', 'deleteTask', task.id)
      this.isRemoving = false
    },
    copy (text, notifyText) {
      let copyArea = document.createElement('input')
      copyArea.style.position = 'absolute'
      copyArea.style.top = '-9999em'
      copyArea.value = text
      document.body.appendChild(copyArea)
      copyArea.select()
      try {
        document.execCommand('copy')
        this.$postMessage.toast({msg: '复制任务链接成功', type: 'success'})
      } catch (err) {
        this.$postMessage.toast({msg: '复制失败'})
      }
      document.body.removeChild(copyArea)
    },
    async deleteTask (taskId) {
      this.isRemoving = true
      await taskService.deleteTask(taskId, false)
      this.$postMessage.toast({msg: '当前任务操作成功', type: 'success'})
      // console.log('deleteTask', taskId, '----')
      // console.log(this.$parent)
      // this.$emit('deleteTask', taskId)
      this.dispatch('taskGroup', 'deleteTask', taskId)
      this.isRemoving = false
    }
  }
}
</script>
<style lang="scss" scoped>
  [class*=ibass]{
    &:before{
      vertical-align: -.125rem;
    }
  }
  .ibass-ellipses{
    @extend %f-normal;
    color:$theme-color-lighter;
    &:hover{
      color: $theme-color;
    }
  }
  .ib__more-option {
    &.active {
      visibility: visible
    }
  }
  .ib__more-option-content {
    &::before{
      content: ' ';
      width: 0;
      height: 0;
      border: 10px solid $color-bg-normal;
      position: absolute;
      top: -20px;
      left: 64px;
      border-top-color: transparent;
      border-right-color: transparent;
      border-left-color: transparent;
    }
    width: 120px;
    padding: 8px 0;
    @extend %f-extra-small;
    color: $color-white;
    .ib__more-option-item {
      padding: 0 10px;
      height: 36px;
      line-height: 36px;
      &:hover {
        background: $color-black;
      }
      &.topline {
        border-top: 1px solid $color-bd-extra-light;
      }
    }
  }
</style>

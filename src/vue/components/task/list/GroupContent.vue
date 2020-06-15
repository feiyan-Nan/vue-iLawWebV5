<template lang="pug">
  .ib__task__group__content(@mouseenter="operateShow" @mouseleave="isOperate=false")
    .ib__task__group__collapse__icon.pointer(
      :class="{'ibass-arrow-down': taskGroup.value !== 'favorite' &&  taskGroup.collapse, 'ibass-arrow-right': taskGroup.value !== 'favorite' && !taskGroup.collapse, 'ibass-star-fill': taskGroup.value === 'favorite' || taskGroup.name=='我关注的'}"
      @click="GrouptoggleCollapse(taskGroup)"
    )
    .ib__task__group__name
      .name__input.ellipsis(:class="{'editable': editable, 'underline__right__10': mark}" :contenteditable="editable" @keydown="pressTaskGroupName(taskGroup.id, $event)" @blur="blurTaskGroupName(taskGroup.id, $event)") {{taskGroup.name}}
    .ib__task__group__tasknum
      //- span {{taskGroup.tasks ? taskGroup.tasks.length + '个任务' : '' }}
      span(v-if="isUnFinish && mark && SearchOrRealData") {{taskGroup.unfinishedTaskCount + '个任务'}}
      //- span(v-else) {{taskGroup.tasks===null || taskGroup.tasks.length===0 ? '0 个任务':taskGroup.tasks.length + '个任务'}}
      span(v-else) {{taskGroup.tasks ? taskGroup.tasks.length + '个任务' : '0个任务' }}
      //- span.loading(ref="loading") 加载中
      //-   i.dot
      //- span(@click="toggleCompleted(taskGroup.id, toggleText, groupIndex)" ref="finishedTask" v-if="isUnFinish && mark && SearchOrRealData") {{toggleText + "已完成任务（"+taskGroup.finishedTaskCount+"）"}}
    .ib__task__group__operate(v-if="isOperate")
      slot(name="operate")
</template>
<script>
import MatterService from '@/vue/service/matter'
import { TASK_STATUS } from '@/utils/constants'
export default {
  componentName: 'taskGroupContent',
  data () {
    return {
      toggleText: '显示',
      mark: this.$store.state.matter.mark === 'matter',
      isOperate: false,
      // 如果是搜索，这个值就为false
      SearchOrRealData: true,
    }
  },
  props: {
    taskGroup: {
      type: Object
    },
    editable: {
      type: Boolean
    },
    groupIndex: {
      type: Number
    }
  },
  methods: {
    operateShow () {
      this.isOperate = true
      window.document.body.click()
      this.$emit('userChooseHide')
    },
    toggleCompleted (groupId, toggleText, groupIndex) {
      // console.log(groupId)
      this.$emit('toggleCompleted', groupId, toggleText, groupIndex)
      if (toggleText === '隐藏') {
        this.toggleText = '显示'
      } else {
        this.toggleText = '隐藏'
      }
    },
    pressTaskGroupName (taskGroupId, event) {
      if (event.keyCode === 13) {
        event.preventDefault()
        event.target.blur()
      }
    },
    blurTaskGroupName (taskGroupId, event) {
      let param = {name: event.target.textContent}
      MatterService.changeGroupName(taskGroupId, param).then(res => {
        this.$postMessage.toast({msg: '操作成功', type: 'success'})
      })
    },
    GrouptoggleCollapse (taskGroup) {
      this.$emit('GrouptoggleCollapse', taskGroup)
      // 实现触发的话需要把collapse单独作为控制值传入
      // this.taskGroup.collapse = !this.taskGroup.collapse
    }
  },
  computed: {
    isUnFinish () {
      return this.$store.state.calendar.reqParams.status === TASK_STATUS.UN_FINISH.value
    }
  },
  watch: {
    '$store.state.matter.SearchOrRealData' (curVal, oldVal) {
      if (curVal === 'searchData') {
        this.SearchOrRealData = false
      } else {
        this.SearchOrRealData = true
      }
    }
  }
}
</script>
<style lang="scss">
  .ib__task__group__content {
    cursor: pointer;
    position: relative;
    @include flex(row);
    height: 2.5em;
    line-height: 2.5rem;
    border-bottom: 1px solid $color-bd-regular;
    padding: 0 0.625rem;
    .ib__task__group__collapse__icon {
      margin-right: 0.625rem;
      &:before{
        margin-top: 0.75rem;
        color: $color-fresh;
      }
      &.ibass-star-fill {
        &:before{
          color: $theme-color-light;
        }
      }
    }
    .ib__task__group__name {
      position: relative;
      max-width: 26rem;
      @extend %f-small;
      @extend %f-heavy;
      &:after {
        content: '';
        position: absolute;
        top: 2.4rem;
        left: 0;
        display: block;
        width: 100%;
        height: 3px;
        background: $theme-color-light;
      }
      .name__input{
        &.editable {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          cursor: text;
        }
        &:focus {
          outline: none;
        }
      }
      .underline__right__10 {
        padding-right: 10px;
      }
    }
    .ib__task__group__tasknum {
      span {
        @extend %f-small;
        padding: 1px 0.625rem;
        margin-left: 0.625rem;
        line-height: 16px;
        border-left: 1px solid $color-bd-regular;
        color: $color-text-placeholder;
      }
      .loading {
        display: none;
      }
      .dot{
        display: inline-block;
        height: 1em;
        line-height: 1;
        text-align: left;
        vertical-align: -.25em;
        overflow: hidden;
      }
      .dot:before {
          display: block;
          content: '...\A..\A.';
          white-space: pre-wrap;
          animation: dot 3s infinite step-start both;
      }
      @keyframes dot {
          33% { transform: translateY(-2em); }
          66% { transform: translateY(-1em); }
      }
    }
    .ib__task__group__operate{
      position: absolute;
      right: 1rem;
      display: block;
    }
    &:hover{
      background-color: $color-bg-light;
      .ib__task__group__operate {
        display: block;
      }
    }
  }
</style>

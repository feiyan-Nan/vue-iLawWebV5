<template lang="pug">
  .ib__task__group__column
    sort.ib__task__group__content__sort(
      :draggable="draggable"
      @start="onDragStart"
      @drag="onDrag"
      @end="onDragEnd"
      @over="onDragOver"
      @leave="onDragLeave"
      @drop="onDrop"
    )
      group-content(
        :taskGroup="taskGroup"
        :editable="editable"
        :groupIndex="groupIndex"
        ref="groupContent"
        @toggleCompleted="toggleCompleted"
        @userChooseHide="userChooseHide"
        @GrouptoggleCollapse="GrouptoggleCollapse"
      )
        slot(name="operate" slot="operate")
    .ib__task__group__tasks(v-show="taskGroup.collapse")
      transition-group(name="task-fade")
        sort-task-item(
          v-for="task in taskGroup.tasks"
          :key="task.id"
          :task="task"
          @setCurDragItem="setCurDragItem"
          @dropMoveTask="dropMoveTask"
          @updateFavorite="updateFavorite"
          @updateStatus="updateStatus"
          @updateTask="updateTask"
          @deleteTask="deleteTask"
          @getOpenTaskDetailGroupId="getOpenTaskDetailGroupId"
        )
      slot(name="notask" v-if="taskGroup.tasks===null || taskGroup.tasks.length===0")
      .ib__toggle__completed.pointer.noselect(v-show="!taskGroup.toggle" v-if="isUnFinish && mark && SearchOrRealData" @click="toggleCompleted(taskGroup.id, toggleText, groupIndex)") {{toggleText + "已完成任务（"+taskGroup.finishedTaskCount+"）"}}
      .ib__toggle__dot(v-show="taskGroup.toggle") 加载中
        i.dot
      .ib__load__more(v-if="taskGroup.isBeyondTwoHundred" @click="loadMore") 加载更多...
</template>
<script>
import GroupContent from './GroupContent'
import SortTaskItem from './SortItem'
import { TASK_STATUS } from '@/utils/constants'

const pos = {
  x: 0,
  y: 0,
  valid: false
}

export default {
  components: { GroupContent, SortTaskItem },
  componentName: 'taskSortGroup',
  props: {
    taskGroup: {
      type: Object
    },
    editable: {
      type: Boolean
    },
    groupIndex: {
      type: Number
    },
    // 任务组是否可以被拖动
    draggable: {
      type: Boolean
    }
  },
  data () {
    return {
      toggleText: '显示',
      mark: this.$store.state.matter.mark === 'matter',
      // 如果是搜索，这个值就为false
      SearchOrRealData: true
    }
  },
  computed: {
    isUnFinish () {
      return this.$store.state.calendar.reqParams.status === TASK_STATUS.UN_FINISH.value
    }
  },
  methods: {
    loadMore () {
      this.$emit('loadMore', this.taskGroup)
    },
    getOpenTaskDetailGroupId (taskGroupId) {
      this.$emit('getOpenTaskDetailGroupId', taskGroupId)
    },
    userChooseHide () {
      this.$emit('userChooseHide')
    },
    toggleCompleted (groupId, toggleText, groupIndex) {
      this.$emit('toggleCompleted', groupId, toggleText, groupIndex)
      if (toggleText === '隐藏') {
        this.toggleText = '显示'
      } else {
        this.toggleText = '隐藏'
      }
    },
    // toggleCompleted (groupId, toggleText, groupIndex) {
    //   this.$emit('toggleCompleted', groupId, toggleText, groupIndex)
    // },
    setCurDragItem (val) {
      this.$emit('setCurDragItem', val)
    },
    dropMoveTask (task, index) {
      this.$emit('dropMoveTask', task, index)
    },
    GrouptoggleCollapse (taskGroup) {
      this.$emit('GrouptoggleCollapse', taskGroup)
    },
    // 防止误操作引起任务组折叠，导致的任务组排序
    isFolding (ev) {
      return pos.valid && (Math.abs(pos.x - ev.clientX) > 100 || Math.abs(pos.y - ev.clientY) > 15)
    },
    onDragStart (ev) {
      pos.x = ev.clientX
      pos.y = ev.clientY
      pos.valid = true
    },
    onDrag (ev) {
      if (this.isFolding(ev)) {
        pos.valid = false
        this.$emit('setCurDragItem', {
          type: 'group',
          item: this.taskGroup,
          index: this.groupIndex
        })
        this.$emit('foldTG')
      }
    },
    onDragEnd (ev) {

    },
    onDragOver (ev) {

    },
    onDragLeave (ev) {

    },
    onDrop (ev) {
      this.$emit('dropMoveGroup', this.taskGroup, this.groupIndex)
    },
    updateFavorite (task) {
      this.$emit('updateFavorite', task)
    },
    updateStatus (task) {
      this.$emit('updateStatus', task)
    },
    updateTask (task) {
      this.$emit('updateTask', task)
    },
    deleteTask (taskId) {
      this.$emit('deleteTask', taskId)
    },
    search (taskId) {
      this.$emit('search', taskId)
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
  .ib__task__group__column {
    margin-top: 0.75rem;
    .ib__task__group__tasks {
      .ib__load__more {
        margin: 10px auto 0;
        @extend %f-extra-small;
        width: 120px;
        line-height: 34px;
        border-radius: 20px;
        background: $theme-color-light;
        color: $color-white;
        cursor: pointer;
        text-align: center;
        &:hover{
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: box-shadow 0.2s
        }
      }
      .ib__toggle__completed, .ib__toggle__dot {
        @extend %f-small;
        padding: 1px 0.625rem;
        margin-left: 1.625rem;
        margin-top: 10px;
        line-height: 16px;
        // border-left: 1px solid $color-bd-regular;
        color: $color-text-placeholder;
      }
      .ib__toggle__dot {
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
    }
  }
  .ib__task__group__content__sort {
    &.ic-droppable--hover {
      .ib__task__group__content {
        border-bottom-color: $theme-color-light;
        box-shadow: inset 0 -1px 0 0 $theme-color-light;
      }
    }
  }
</style>

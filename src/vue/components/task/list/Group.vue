<template lang="pug">
  .ib__task__group__column()
    group-content(
      :taskGroup="taskGroup"
      :editable="editable"
      ref="groupContent"
      @toggleCompleted="toggleCompleted"
      @GrouptoggleCollapse="GrouptoggleCollapse"
    )
      slot(name="operate" slot="operate")
    .ib__task__group__tasks(v-show="taskGroup.collapse")
      transition-group(name="task-fade")
        task-item(v-for="task in taskGroup.tasks" :key="task.id" :task="task" @updateFavorite="updateFavorite" @updateStatus="updateStatus" @updateTask="updateTask" @deleteTask="deleteTask" @getOpenTaskDetailGroupId="getOpenTaskDetailGroupId")
      .ib__toggle__completed.pointer.noselect(v-show="!taskGroup.toggle" v-if="isUnFinish && mark && SearchOrRealData" @click="toggleCompleted(taskGroup.id, toggleText, 0)") {{toggleText + "已完成任务（"+taskGroup.finishedTaskCount+"）"}}
      .ib__toggle__dot(v-show="taskGroup.toggle") 加载中
        i.dot
      .ib__load__more(v-if="taskGroup.isBeyondTwoHundred" @click="loadMore") 加载更多...
</template>
<script>
import GroupContent from './GroupContent'
import TaskItem from './Item'
import { TASK_STATUS } from '@/utils/constants'
export default {
  components: { GroupContent, TaskItem },
  componentName: 'taskGroup',
  props: {
    taskGroup: {
      type: Object
    },
    editable: {
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
    getOpenTaskDetailGroupId (taskGroupId) {
      this.$emit('getOpenTaskDetailGroupId', taskGroupId)
    },
    loadMore () {
      this.$emit('loadMore', this.taskGroup)
    },
    // toggleCompleted (groupId, toggleText, groupIndex) {
    //   this.$emit('toggleCompleted', groupId, toggleText, groupIndex)
    // },
    toggleCompleted (groupId, toggleText, groupIndex) {
      this.$emit('toggleCompleted', groupId, toggleText, groupIndex)
      if (toggleText === '隐藏') {
        this.toggleText = '显示'
      } else {
        this.toggleText = '隐藏'
      }
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
    GrouptoggleCollapse (taskGroup) {
      this.$emit('GrouptoggleCollapse', taskGroup)
    },
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
</style>
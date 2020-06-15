<template lang="pug">
  sort.ib__task__column__sort(
    :draggable="isPermission('task:edit') && task.state === 0 && task.valid === 1 && !task.disableDrag && SearchOrRealData"
    @start="onDragStart"
    @drag="onDrag"
    @end="onDragEnd"
    @over="onDragOver"
    @leave="onDragLeave"
    @drop="onDrop"
  )
    task-item(
      :task="task"
      :canHover="!isDragging"
      @updateFavorite="updateFavorite"
      @updateStatus="updateStatus"
      @updateTask="updateTask"
      @deleteTask="deleteTask"
      @afterChangeVisible="afterChangeVisible"
      @getOpenTaskDetailGroupId="getOpenTaskDetailGroupId"
    )
</template>
<script>
import TaskItem from './Item'
export default {
  components: { TaskItem },
  componentName: 'taskGroup',
  props: {
    task: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      isDragging: false,
      // 如果是搜索，这个值就为false
      SearchOrRealData: true
    }
  },
  computed: {
    enableDrag () {
      return this.$store.state.task.enableDrag
    }
  },
  methods: {
    // 根据点击popover 的状态 控制 可拖拽状态
    afterChangeVisible ({ type, visible }) {
      if (type === 'toggle') {
        setTimeout(() => {
          this.task.disableDrag = visible
        }, 0)
      } else {
        this.task.disableDrag = visible
      }
    },
    // 判断权限
    isPermission (args) {
      return this.$store.state.matter.matterTaskPermission.includes(args)
    },
    getOpenTaskDetailGroupId (taskGroupId) {
      this.$emit('getOpenTaskDetailGroupId', taskGroupId)
    },
    onDragStart (ev) {
      document.body.click()
      // ev.dataTransfer.setDragImage(ev.target, ev.offsetX, ev.offsetY)
      this.isDragging = true
      this.$emit('setCurDragItem', {
        type: 'task',
        item: this.task,
        index: this.index
      })
    },
    onDrag (ev) {

    },
    onDragEnd (ev) {
      this.isDragging = false
    },
    onDragOver (ev) {

    },
    onDragLeave (ev) {

    },
    onDrop (ev) {
      this.$emit('dropMoveTask', this.task, this.index)
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
  .ib__task__column__sort {
    &.ic-dragging {
      overflow: hidden;
      box-shadow: inset 0 -1px 0 0 $color-bd-extra-light;
      .ib__task__column {
        opacity: .3;
        background-color: $color-bg-base;
      }
    }
    &.ic-droppable--hover {
      .ib__task__column {
        box-shadow: inset 0 -2px 0 0 $theme-color-light;
      }
    }
  }
</style>

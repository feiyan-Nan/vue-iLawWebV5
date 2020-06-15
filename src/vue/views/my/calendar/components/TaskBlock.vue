<template lang="pug">
.calendar__task-block( @click.self="createTask" v-clickoutside='cleanLayer' @drop="dropHandler" @dragover="dragoverHandler" @dragleave = "dragleaveHandler" ref="wrap")
    .calendar__task-block-wrap(v-for="(item, pindex) in results" :key="pindex")
        .calendar__task-block-item.pointer(v-for="(task,index) in item.tasks" :key="task.id" :class="{'calendar__task-block-item__schedule':task.isSchedule,'calendar__task-block-item__stick':task.stick,'calendar__task-block-item__done':task.state===1,'calendar__task-block-item__dragging':task.id===daraggingTask}" :style="{'top':`${task.ptop}px`, height:`${task.height}px`,width:`calc(${100/item.width}% - 4px)`,left:`calc(${task.pleft*100/item.width}% + 2px)`}"
        :draggable="task.state === TASK_DETAIL.STATE_UN" @drag="dragItem(task,$event)" @dragstart="startDragItem(task,$event)" @dragend="stopDragItem(task,$event)")
            .calendar__task-block-item-drag.top(v-if="task.state===0&&!task.dueTime" draggable="true" @dragstart="startResize(task,$event)" @drag="handlerResize(task,$event,'top')" @dragend="endResize(task,$event)")
            ic-popover(@dbClick="showTaskDetail(task,$event)")
                task-info(:task="task")
                .calendar__task-block-item-wrap(slot="trigger" :class="{'short-task':task.isShort}" @click="cleanLayer")
                    .ibass-done(v-show="task.state===1")
                    .calendar__task-block-item-label
                      .label {{task.name}}
            .calendar__task-block-item-drag.bottom(v-if="task.state===0&&!task.dueTime" draggable="true" @dragstart="startResize(task,$event)" @drag="handlerResize(task,$event)" @dragend="endResize(task,$event)")
    hours-layer(:iLayerY="iLayerY" :iLayerH="iLayerH" :iLabel="label" @dragEnd="createTaskBySlide" @click="comfirCreate" :theme="theme")
</template>
<script>
import TaskInfo from './TaskInfo.vue'
import HoursLayer from './HoursLayer'
import clickoutside from '@/plugin/directives/clickoutside'
import {TASK_DETAIL} from '@/utils/constants'
import Util from '../mixins/index'
export default {
  components: {TaskInfo, HoursLayer},
  directives: {
    clickoutside
  },
  mixins: [Util],
  props: {
    tasks: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      results: [],
      visible: false,
      targetNode: {},
      iLayerY: 0,
      iLayerH: 0,
      label: '',
      daraggingTask: 0,
      TASK_DETAIL,
      theme: ''
    }
  },
  methods: {
    /**
      * 拖拽任务块整体修改时间
      * 已完成的任务不可拖拽
      */
    startDragItem (task, ev) {
      ev.dataTransfer.effectAllowed = 'move'
      ev.target.style.cursor = 'move'
      this.theme = 'theme-icourt'
      ev.dataTransfer.setDragImage(document.querySelector('#dragImage'), 0, 0)
      this.daraggingTask = task.id
      const dragInfo = {oPageY: ev.pageY, id: task.id, ptop: task.ptop, height: task.height, name: task.name, timeType: task.timeType, dayType: task.dayType, repeatRule: !!task.repeatSetting}
      this.$store.commit('setDraggingTask', dragInfo)
      ev.stopPropagation()
    },
    dragItem (task, ev) {
      ev.stopPropagation()
    },
    stopDragItem (task, event) {
      this.daraggingTask = ''
    },
    dropHandler (event) {
      this.$analysis.track('TaskActionsSupplement', {
        action_type: 'task_drag'
      })
      this.$emit('resetTask', this.$store.state.calendar.draggingTask)
      this.$store.commit('setDraggingTask', {})
      event.stopPropagation()
    },
    dragoverHandler (event) {
      let taskInfo = this.$store.state.calendar.draggingTask
      if (!taskInfo.id || !taskInfo.height) return
      let _iLayerY = Math.min(1440 - taskInfo.height, event.pageY - taskInfo.oPageY + taskInfo.ptop)
      this.iLayerY = this.transformDate(_iLayerY)
      this.iLayerH = taskInfo.height
      const label = `${moment().startOf('day').add(this.iLayerY, 'minutes').format('HH:mm')} - ${moment().startOf('day').add(this.iLayerY + this.iLayerH, 'minutes').format('HH:mm')}`
      this.label = this.iLayerH === 30 ? label : label + ` <br/> ${taskInfo.name}`
      this.theme = 'theme-icourt'
      taskInfo.startTime = this.iLayerY
      // this._updateScrollView(this.iLayerY, this.iLayerH)
      this.$store.commit('setDraggingTask', taskInfo)
      event.preventDefault()
    },
    dragleaveHandler (event) {
      let taskInfo = this.$store.state.calendar.draggingTask
      if (!taskInfo.id) return
      this.iLayerH = 0
    },

    showTaskDetail (task, event) {
      this.$analysis.track('TaskActionsSupplement', {
        action_type: 'enter_task_by_double_click'
      })
      this.$postMessage.openTaskDetail(task.id)
      event.stopPropagation()
    },
    /**
     * 创建任务
     * 如果当前有任务详情弹出框，则返回;
     * 如果点击时页面存在其他要新建的任务，则置空
     */
    createTask (event, fromParent = false) {
      if (this.$refs.wrap.querySelectorAll('.triggered').length) return
      this.iLayerY = this.transformDate(event.layerY)
      this.iLayerH = this.iLayerH ? 0 : 30
      this.label = '点此新建任务'
      this.theme = 'theme-create'
    },
    comfirCreate (event) {
      this.$analysis.track('TaskActionsSupplement', {
        action_type: 'create_task_by_click_here'
      })
      this.$emit('createTask', {startTime: this.iLayerY, height: this.iLayerH})
    },
    cleanLayer () {
      this.iLayerH = 0
      this.theme = ''
    },
    stopPropagation (event) {
      event.stopPropagation()
    },
    // 拖拽区域的增减最小单位为30分钟
    transformDate (y) {
      y = Math.min(y, 24 * 60)
      y = Math.max(0, y)
      return Math.floor(y / 30) * 30
    },
    /**
     * 滑动新建任务
     */
    createTaskBySlide (params) {
      params.timeType = TASK_DETAIL.TIME_TYPE_CALENDAR
      this.$emit('createTask', params)
    },
    /**
     * 设置任务排列规则：1按照开始时间排序，2，分组，3组内调整顺序
     */
    setTopAndHeight () {
      let temp = this.sortArray(this.items)
      let gTemp = this.groupBySartTime(temp)
      this.results = this.setOrder(gTemp)
    },
    /**
     * 拖拽上下边距改变任务起止时间开始
     */

    startResize (task, ev) {
      this.daraggingTask = task.id
      this.iLayerY = task.ptop
      this.iLayerH = task.height
      this.label = task.name
      this.theme = 'theme-icourt'
      ev.dataTransfer.setDragImage(document.querySelector('#dragImage'), 0, 0)
      ev.stopPropagation()
    },

    handlerResize (task, ev, direction) {
      if (ev.screenX === 0 && ev.screenY === 0) return
      const originLayerY = direction === 'top' ? task.ptop + task.height : task.ptop
      let _y
      if (direction === 'top') _y = Math.max(-task.ptop, Math.min(24 * 60 - task.ptop, ev.layerY))
      else {
        _y = Math.max(-task.ptop - task.height, Math.min(24 * 60 - task.ptop - task.height, ev.layerY))
      }
      let _layerY = Math.floor(_y / 30) * 30
      if (direction === 'top') {
        this.iLayerY = _layerY >= task.height ? originLayerY : Math.min(task.ptop + _layerY, originLayerY - 30)
        this.iLayerH = Math.max(Math.abs(task.height - _layerY), 30)
      } else {
        this.iLayerY = -_layerY <= task.height ? originLayerY : Math.min(originLayerY - 30, task.ptop + task.height + _layerY)
        this.iLayerH = Math.max(Math.abs(task.height + _layerY), 30)
      }
      this._updateScrollView(this.iLayerY, this.iLayerH)
      ev.preventDefault()
    },
    /**
     * 结束拖拽
     */
    endResize (task, ev) {
      this.daraggingTask = ''
      this.$analysis.track('TaskActionsSupplement', {
        action_type: 'task_edge_drag'
      })
      this.$emit('resetTask', {id: task.id, startTime: this.iLayerY, height: Math.min(this.iLayerH, 24 * 60 - 1 - this.iLayerY), repeatRule: !!task.repeatSetting, dayType: task.dayType, timeType: task.timeType})
      ev.stopPropagation()
    },
    /**
     * 组内排序
     */
    setOrder (arr) {
      let gTemp = arr
      for (let i = 0; i < gTemp.length; i++) {
        gTemp[i].width = gTemp[i].tasks.length
        let _tasks = gTemp[i].tasks
        for (let j = 0; j < _tasks.length; j++) {
          _tasks[j].pleft = j
          _tasks[j].height = Math.max(moment(_tasks[j].iEndTime).diff(moment(_tasks[j].iStartTime), 'minute'), 30)
          _tasks[j].ptop = moment(_tasks[j].iStartTime).diff(moment(_tasks[j].iStartTime).startOf('day'), 'minute')
          // 再次根据pleft字段排序
          const leftArray = _.orderBy(_tasks.slice(0, j), ['pleft'], ['asc'])
          for (let k = 0; k < leftArray.length; k++) {
            leftArray[k].stick = leftArray[k].stick || _tasks[j].iStartTime === leftArray[k].iEndTime
            if (!leftArray[k].used && _tasks[j].iStartTime >= leftArray[k].iEndTime) {
              _tasks[j].pleft = Math.min(leftArray[k].pleft, _tasks[j].pleft || 0)
              gTemp[i].width--
              leftArray[k].used = true
              break
            } else {
              _tasks[j].pleft = leftArray[k].pleft + 1
            }
          }
        }
      }
      return gTemp
    },
    /**
     * 根据指定字段排序
     */
    sortArray (array) {
      array.map(item => {
        // 判断日程
        item.isSchedule = !!item.dueTime
        item.used = false
        item.isShort = !!item.dueTime || moment(item.endTime).diff(moment(item.startTime), 'minute') <= 30
        const dueMoment = moment(Math.floor(item.dueTime / 1000 / 60 / 30) * 1000 * 60 * 30)
        item.iStartTime = item.startTime || dueMoment.valueOf()
        item.iEndTime = item.endTime ? Math.max(moment(item.iStartTime).add(30, 'minutes').valueOf(), item.endTime) : dueMoment.add(30, 'minutes').valueOf()
      })
      return _.orderBy(array, ['iStartTime', 'iEndTime'], ['asc', 'desc'])
    },
    /**
     * 按照任务开始时间分组
     */
    groupBySartTime (arr) {
      let pointer = -1
      let max = 0
      let result = []
      let maxItems = []
      arr.map((item) => {
        if (item.iStartTime >= max) {
          result[++pointer] = {}
          result[pointer].tasks = [].concat(item)
          if (item.iStartTime === max) {
            maxItems.map((item) => { item.stick = true })
            maxItems = []
          }
        } else {
          result[pointer].tasks.push(item)
        }
        max = Math.max(item.iEndTime, max)
        if (item.iEndTime === max) maxItems.push(item)
      })
      return result
    },
    boundParentClick () {
      this.$refs.wrap.parentNode.parentNode.addEventListener('click', event => {
        // 只有点击外部延伸小时块才触发创建任务
        if (!event.target.classList.contains('calendar__day-view-hour-block')) return
        setTimeout(() => {
          this.createTask(event)
        }, 0)
      })
    }
  },
  watch: {
    tasks (newValue, oldValue) {
      this.iLayerH = 0
      this.items = newValue
      this.setTopAndHeight()
    },
  },
  mounted () {
    this.targetNode = this.$refs.resizeNode
    this.scrollParent = this._getScrollParent(this.$refs.wrap)
    this.boundParentClick()
  }
}
</script>
<style lang="scss" scoped>
.calendar__task-block{
    position: absolute;
    left: 2px;
    width: calc(100% - 4px);
    height: 100%;
    top:0;
    z-index: 20;
}
.calendar__task-block-wrap{
    position: relative;
    @include flex(row);
    @extend %f-small;
}
.calendar__task-block-item{
    position: absolute;
    background-color: #fef4eb; //Todo
    color:$theme-color;
    &.calendar__task-block-item__done{
        background-color: $color-bg-base;
        border:unset;
        color: $color-text-secondary;
        .calendar__task-block-item-label{
            text-decoration: line-through;
        }
        .triggered .ibass-done{
          color: rgba(255,255,255,0.6);
          background-color: unset
        }
    }
    &.calendar__task-block-item__schedule:not(.calendar__task-block-item__done){
        @include flex(row,center, center);
        &::after{
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background-color: rgba(237,108,0,0.6);
        }
    }
    .triggered{
        background-color: $theme-color-light;
        color:$color-white
    }

}
.calendar__task-block-item-wrap{
    [class*=ibass-]{
        color:$color-text-placeholder;
        @extend %f-mini;
        margin-top:4px;
        margin-left: 3px;
    }
    @include flex(row);
    height: 100%;
  &.short-task{
      @include flex(row,center,center);
      .label{
        @include multiEllipsis(1);
      }
  }
}
.calendar__task-block-item-label{
    width: 100%;
    margin-left: 8px;
    @extend %f-half;
    .label{
      @include multiEllipsis(2);
    }

}
.calendar__task-block-item__stick{
    &::after{
        bottom: 2px;
    }
    &::before{
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background-color: $color-white
    }
}
.calendar__task-block-item-drag{
    height:5px;
    position: absolute;
    left: 0;
    right: 0;
    z-index: 2;
    cursor:row-resize;
    &.bottom{
        bottom:0
    }
    &.top{
        top: 0
    }
}
.calendar__task-block-item__dragging{
    opacity: 0.4;
}
</style>

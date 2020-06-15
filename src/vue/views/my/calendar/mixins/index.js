import TaskService from '@/vue/service/task'
import {TASK_DETAIL} from '@/utils/constants'
export default{
  methods: {
    _createTask (_params) {
      _params.matter = {id: this.$route.params.matterId}
      this.$postMessage.createTask(_params, data => {
        if (data && data.status === 'success') {
          this.$store.commit('updateCalendarParams')
        }
        this.$store.commit('clearCalendarDragDrop')
      })
    },
    async _resetTaskTime (_params) {
      if (_params.repeatRule || !!_params.repeatSetting) {
        this.$postMessage.resetTaskTime(_params, data => {
          // 不论返回结果都进行刷新
          this.$store.commit('updateCalendarParams')
        })
      } else {
        await TaskService.resetTaskTime(_params)
        this.$store.commit('updateCalendarParams')
      }
    },
    transformDate (params, monday, index = 0) {
      const curDay = moment(monday).add(index, 'day').startOf('day')
      const startTime = curDay.add(params.startTime, 'minute').valueOf()
      const endTime = curDay.add(params.height, 'minute').valueOf()
      const result = params.timeType === TASK_DETAIL.TIME_TYPE_CALENDAR ? {startTime, endTime} : {dueTime: startTime}
      return result
    },
    /**
     * 月视图、周视图全天任务区域的任务拖拽修改时间
     * @param {Number} after
     * @param {Number} before
     * @param {Number} cycle  修改周期，天或周
     */
    _dragTaskTime (after, before, cycle = 1) {
      const mapTime = ['startTime', 'endTime', 'dueTime']
      let draggingTask = this.$store.state.calendar.draggingTask
      if (before > -1 && after > -1) {
        mapTime.map(item => {
          if (draggingTask[item]) { draggingTask[item] += 1000 * 60 * 60 * 24 * cycle * (after - before) }
        })
      }
    },
    /**
     *  拖拽任务边缘修改日期
     * @param {Number} after
     * @param {Number} before
     * @param {Number} cycle
     */
    _resizeTask (after, before, cycle = 1) {
      let draggingTask = this.$store.state.calendar.draggingTask
      const mapTime = ['startTime']
      if (before > -1 && after > -1) {
        mapTime.map(item => {
          if (draggingTask[item]) { draggingTask[item] += 1000 * 60 * 60 * 24 * cycle * (after - before) }
        })
      }
    },
    _getScrollParent: function (element) {
      let parent = element.parentNode
      if (!parent) {
        return element
      }

      if (parent === window.document) {
        if (window.document.body.scrollTop || window.document.body.scrollLeft) {
          return window.document.body
        } else {
          return window.document.documentElement
        }
      }

      // Firefox want us to check `-x` and `-y` variations as well
      if (
        ['scroll', 'auto'].indexOf(this._getStyleComputedProperty(parent, 'overflow')) !== -1 ||
            ['scroll', 'auto'].indexOf(this._getStyleComputedProperty(parent, 'overflow-x')) !== -1 ||
            ['scroll', 'auto'].indexOf(this._getStyleComputedProperty(parent, 'overflow-y')) !== -1
      ) {
        return parent
      }
      return this._getScrollParent(element.parentNode)
    },
    _getStyleComputedProperty: function (element, property) {
      let css = window.getComputedStyle(element, null)
      return css[property]
    },
    _updateScrollView (_layerY, _layerH) {
      if (_layerY < this.scrollParent.scrollTop + 61) {
        this.scrollParent.scrollTo({top: this.scrollParent.scrollTop - 60, behavior: 'smooth'})
      }
      if ((_layerY + _layerH) > (this.scrollParent.clientHeight + this.scrollParent.scrollTop - 61)) {
        this.scrollParent.scrollTo({top: this.scrollParent.scrollTop + 60, behavior: 'smooth'})
      }
    }
  },
}

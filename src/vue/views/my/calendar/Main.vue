<template lang="pug">
    .calendar__container(v-ic-loading="loading")
        .calendar__header__filter
            model-switch
            .calendar__header__filter-line(v-if="!matterId")
            task-filter-group(:showMember="!matterId" :showMatter="!matterId" :users="users" :showStatus="true" :defaultStatus="defaultStatus")
        .calendar__header__switch
            .calendar__header__switch-left
                calendar-switch(@click="toggleDateType" :curType="curViewType")
                .calendar__header__switch-back
                    back-today(@click="backToday")
            .calendar__header__switch-picker
                calendar-switch-picker(:type="dateType" @click="updateDate" :date="curDate")
            .calendar__header__switch-export
              task-export(v-if="!matterId")
        component(:is="currCalendar" :curDate="curDate")
</template>
<script>
import YearCalendar from './year/Main'
import MonthCalendar from './month/Main'
import WeekCalendar from './week/Main'
import DayCalendar from './day/Main'
import CalendarSwitch from './components/CalendarSwitch'
import ModelSwitch from '@/vue/components/task/ModelSwitch'
import TaskFilterGroup from '@/vue/components/task/TaskFilterGroup'
import IlawService from '@/vue/service/ilaw'
import CalendarSwitchPicker from './components/CalendarSwitchPicker'
import BackToday from './components/BackToday'
import TaskExport from './components/TaskExport'
import TaskService from '@/vue/service/task'
import HotKey from './mixins/HotKey'
import { STORAGE, TASK_STATUS } from '@/utils/constants'
export default {
  components: {YearCalendar, MonthCalendar, WeekCalendar, DayCalendar, CalendarSwitch, ModelSwitch, CalendarSwitchPicker, TaskFilterGroup, IlawService, BackToday, TaskExport},
  name: 'Mine',
  mixins: [HotKey],
  data () {
    return {
      currCalendar: '',
      dateType: 'month',
      users: [],
      tasks: [],
      newTasks: [],
      params: {},
      curDate: moment().format('YYYY-MM-DD'),
      curViewType: '',
      loading: Boolean,
      storeKey: `calendar_${this.$route.params.matterId ? 'matter' : 'my'}_type`
    }
  },
  computed: {
    /**
     * 任务下的日历中，路由中会带有项目ID
     */
    matterId () {
      return this.$route.params.matterId || ''
    },
    defaultStatus () {
      // 过滤条件
      let res = Object.values(TASK_STATUS).filter(status => status.value !== TASK_STATUS.DELETED.value)
      res.unshift({value: '', label: '全部'})
      return res
    }
  },
  methods: {
    async getTasks (reqParams) {
      // 查询的时候设置查询参数
      let params = {
        matterIds: reqParams.matters.map(matter => matter.id),
        matterId: this.matterId,
        userIds: this.matterId ? [this.$store.state.user.user.id] : reqParams.users.map(user => user.userId),
        rangeFrom: reqParams.rangeFrom,
        rangeTo: reqParams.rangeTo,
        random: reqParams.random,
        state: reqParams.status === '' ? '' : reqParams.status - 1
      }
      this.loading = true
      let result
      if (this.matterId) {
        result = await TaskService.getMatterCalendarTask(params)
      } else if (params.userIds.length === 1 && params.userIds[0] === this.$store.state.user.user.id) {
        result = await TaskService.getMyTasks(params)
      } else {
        result = await TaskService.getCalendarTask(params)
      }
      this.loading = false
      this.tasks = result.data || []
      this.$store.commit('updateCalendarTasks', this.tasks)
    },
    toggleDateType (item) {
      this.$store.commit('setCalendarViewType', {type: item})
    },
    // 切换日历组件
    setDateType (item) {
      let _item = item.replace(/^\S/, (L) => L.toUpperCase())
      this.currCalendar = `${_item}Calendar`
      this.dateType = _item
      this.curViewType = item
    },
    updateDate (item) {
      this.curDate = item
    },
    /**
     * 获取未读新消息
     */
    async getNewTasks () {
      const result = await IlawService.getNewTasks()
      this.newTasks = result.result
    },
    async getAttorney () {
      let result = await IlawService.searchByCreateUserId()
      let _users = []
      let _idsSet = new Set()
      result.result.forEach(item => {
        item.members.forEach(member => {
          if (!_idsSet.has(member.userId)) {
            _users.push(member)
            _idsSet.add(member.userId)
          }
        })
      })
      _users.unshift({
        userId: this.$store.state.user.user.id,
        userName: this.$store.state.user.user.name,
        userPic: this.$store.state.user.user.pic
      })
      this.users = _users
    },
    backToday () {
      this.curDate = moment().format('YYYY-MM-DD HH:mm:ss')
    },
    // 分别记录个人和项目下已选择的日历视图模式
    storeCalendarType (type) {
      this.db.ls.set(this.storeKey, type)
    },
    initReqParams () {
      let reqParams = {}
      if (!this.matterId) {
        let filters = db.ls.get(STORAGE.TRANS_TASK_FILTERS)
        reqParams = {
          matters: filters && filters.matters && filters.matters.length > 0 ? filters.matters : [],
          users: filters && filters.users && filters.users.length > 0 ? filters.users : [this.$store.state.user.user],
        }
      } else {
        reqParams = {
          matterId: this.matterId
        }
      }
      this.$store.commit('updateCalendarParams', reqParams)
    }
  },
  watch: {
    '$store.state.calendar.reqParams': {
      handler: function (newer, older) {
        // 添加判断，必须要有时间范围的时候才进行请求
        if (this.$store.state.calendar.reqParams.rangeFrom && this.$store.state.calendar.reqParams.rangeTo) {
          this.getTasks(newer)
        }
      },
      deep: true
    },
    '$store.state.calendar.createTaskParams': {
      handler: function (newer, older) {
        // TODO 迁移到最外层
        newer.matter = {id: this.$route.params.matterId}
        this.$postMessage.createTask(newer, (data) => {
          if (data && data.status === 'success') {
            this.$store.commit('updateCalendarParams')
          }
        })
      },
      deep: true
    },
    '$store.state.calendar.viewType': {
      handler: function (newer, older) {
        this.setDateType(newer.type)
        this.storeCalendarType(newer.type)
        if (newer.date) this.curDate = moment(newer.date).format('YYYY-MM-DD')
      },
      deep: true
    }
  },

  mounted () {
    this.getAttorney()
    this.initReqParams()
    const _curViewType = this.db.ls.get(this.storeKey) || 'month'
    this.setDateType(_curViewType)
  }
}
</script>
<style lang="scss" scoped>
.calendar__container{
  padding-bottom: 80px;
}
.calendar__header__filter {
    @include flex(row, flex-start, center);
}
.calendar__header__filter {
    margin-bottom: 20px;
}
.calendar__header__switch {
    @include flex(row, space-between);
    height: 30px;
    padding-bottom: 20px;
    border-bottom: solid 1px $color-bd-regular;
}

.calendar__header__filter-line {
    width: 2px;
    height: 14px;
    margin-left: 14px;
    @extend %bg-gray-normal;
}

 .calendar__header__switch-left{
    @include flex(row,flex-start,center);
 }
 .calendar__header__switch-back{
     margin-left: 30px;
      /deep/ .ibass-back{
        color: $color-bd-light;
     }
 }
 .calendar__header__switch-export{
   width: 200px;
 }

</style>

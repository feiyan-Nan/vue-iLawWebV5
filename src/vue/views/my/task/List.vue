<template lang="pug">
  .my__task(v-ic-loading="loading" data-load-class="top__loader")
    .my__task__header
      model-switch(activated="list")
      .header__filter-line
      task-filter-group(:users="users" :showMember="true" :showMatter="true" :showStatus="true")
      .hater__opearte
        .header__search__input(v-show="isSearchInput")
          input.search__input(type="text" :class="{'search__input__hover':searchKey, 'search__input__blur':isBlur}" autofocus="autofocus"  @blur="showSearchText" ref="searchInput" placeholder="页内搜索任务..." v-model="searchKey")
          span.ibass-search.search__icon(v-show="SearchIcon")
          span.i-close-module(v-show="searchKey" @click="closeSearch")
            i.ibass-close
        .header__search.pointer.noselect(v-if="isSearch" @click="showSearch")
          span.ibass-search
          span 搜索
        .header__group-collapse.pointer.noselect(@click="toggleCollapse")
          span.ibass-minus-square
          span 任务组收展
        .header__clear__task.pointer(v-if="isDeleted && deleteTaskCount.length" @click="clearAll")
          .ibass-delete
          span 清空
    .my__task__create(v-if="isUnfinish")
      task-create(@refresh="search(1)")
    .my__task__list(v-if="hasData")
      group(v-for="taskGroup in taskGroupsFilter" :key="taskGroup.id"  :taskGroup="taskGroup" :editable="false" @updateFavorite="updateFavorite" @updateStatus="updateStatus" @updateTask="updateTask" @deleteTask="deleteTask"  @GrouptoggleCollapse="GrouptoggleCollapse")
        .group__opearate.pointer(v-if="taskGroup.value === 'new'" slot="operate" @click="readNew(taskGroup)")
          .ibass-checkmark
          span 知道了
      .my__task__pagination
        ic-pagination(v-if="page.count>page.pageSize" @change="search" :currPage="page.pageIndex" :pageSize="page.pageSize" :totalCount="page.count")
    .my__task__list__none(v-if="!hasData || taskGroupsFilter.length===0")
      .ibass-task
      .none__text 暂无任务
</template>
<script>
import TaskFilterGroup from '@/vue/components/task/TaskFilterGroup'
import ModelSwitch from '@/vue/components/task/ModelSwitch'
import TaskCreate from '@/vue/components/task/create/Index'
import Group from '@/vue/components/task/list/Group'
import TaskService from '@/vue/service/task'
import IlawService from '@/vue/service/ilaw'
import { STORAGE, TASK_STATUS } from '@/utils/constants'
export default {
  components: {
    ModelSwitch,
    TaskFilterGroup,
    TaskCreate,
    Group
  },
  data () {
    return {
      filters: [],
      taskGroups: [],
      page: {
        pageIndex: 1,
        pageSize: 300,
        count: 0
      },
      loading: false,
      users: [],
      hasData: false,
      isSearchInput: false,
      searchKey: '',
      isSearch: true,
      SearchIcon: false,
      isBlur: false
    }
  },
  created () {
    // 设置标示，标示着此时我进去了matter
    this.$store.commit('updateMark', 'my')
  },
  mounted () {
    // this.$postMessage.initPermission('', (res) => {
    //   // console.log(res)
    //   if (res.success) {
    //     this.matterTaskPermission = res.matterTaskPermission
    //     // 将权限添加到store
    //     console.log(res.matterTaskPermission)
    //     this.$store.state.matter.matterTaskPermission = res.matterTaskPermission
    //   }
    // })
    this.getAttorney()
    this.initReqParams()
  },
  methods: {
    showSearchText () {
      this.isBlur = false
      if (this.searchKey === '') {
        this.isSearch = true
        this.SearchIcon = false
        this.isBlur = true
      }
    },
    showSearch () {
      this.isSearch = false
      this.isSearchInput = true
      this.SearchIcon = true
      this.$refs.searchInput.focus()
      // 搜的时候展开任务组
      this.taskGroups.forEach(item => {
        item.collapse = true
      })
    },
    closeSearch () {
      this.searchKey = ''
      this.$refs.searchInput.focus()
      // this.showSearchText()
    },
    /**
     * 列表查询
     */
    queryTasks () {
      let taskGroups = [
        { id: 1, name: '我关注的', value: 'favorite', collapse: true },
        { id: 2, name: '新任务', value: 'new', collapse: true },
        { id: 3, name: '今天', value: 'today', collapse: true },
        { id: 4, name: '即将进行', value: 'coming_soon', collapse: true },
        { id: 5, name: '未来', value: 'future', collapse: true },
        { id: 6, name: '未指定时间', value: 'not_specify_time', collapse: true }
      ]
      let proarr = []
      if (this.isSingleUnFinish()) {
        // 查询新任务
        proarr.push(this.queryNewTasks(taskGroups))
      }
      // 查询关注的任务
      proarr.push(this.queryFollowedTasks(taskGroups))
      // 查询任务内容
      proarr.push(this.queryMyTaskForList(taskGroups))
      this.loading = Promise.all(proarr).then(() => {
        this.taskGroups = this.dealData(_.cloneDeep(taskGroups)).filter(item => item.tasks.length > 1)
        this.hasData = this.taskGroups && this.taskGroups.filter(group => group.tasks && group.tasks.length > 0).length > 0
      })
    },
    search (pageIndex) {
      this.page.pageIndex = pageIndex
      this.queryTasks()
    },
    toggleCollapse () {
      const collapse = this.taskGroups
        .every(item => item.collapse)
      this.taskGroups.map(item => {
        item.collapse = !collapse
      })
    },
    // 具体任务组的收展情况
    GrouptoggleCollapse (taskGroup) {
      this.taskGroups.forEach(item => {
        if (item.id === taskGroup.id) {
          item.collapse = !item.collapse
        }
      })
    },
    queryFollowedTasks (taskGroups) {
      let params = {
        matterIds: [],
        userIds: [this.$store.state.user.user.id],
        status: this.$store.state.calendar.reqParams.status,
        pageIndex: 1,
        pageSize: 999
      }
      // 查询关注的任务
      return TaskService.queryFollowedTasks(params).then(res => {
        taskGroups.find(group => group.value === 'favorite').tasks = res.data.data && res.data.data.length > 0 ? res.data.data : null
      })
    },
    queryNewTasks (taskGroups) {
      return TaskService.queryNewTasks().then(res => {
        taskGroups.find(group => group.value === 'new').tasks = res.data.data && res.data.data.length > 0 ? res.data.data : null
      })
    },
    queryMyTaskForList (taskGroups) {
      let promise
      // 查询负责对任务
      let params = {
        matterIds: this.$store.state.calendar.reqParams.matters.map(matter => matter.id),
        userIds: this.$store.state.calendar.reqParams.users.map(user => user.userId),
        status: this.$store.state.calendar.reqParams.status,
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize
      }
      if (this.$store.state.calendar.reqParams.users.length === 1 &&
          this.$store.state.calendar.reqParams.users[0].userId === this.$store.state.user.user.id) {
        promise = TaskService.queryMyTaskForList(params)
      } else {
        promise = TaskService.queryResponsibleTasks(params)
      }
      return promise.then(res => {
        this.classifyGroup(res, taskGroups)
      })
    },
    classifyGroup (res, taskGroups) {
      if (res && res.data && res.data.data) {
        this.page.count = res.data.count
        res.data.data.forEach(data => {
          let key = data.displayGroup
          // 完成和已删除需要根据时间来进行处理
          if (this.$store.state.calendar.reqParams.status === TASK_STATUS.FINISHED.value) {
            key = moment().isSame(moment(data.finishTime), 'day') ? '今天' : moment(data.finishTime).format('MM月DD日')
          } else if (this.$store.state.calendar.reqParams.status === TASK_STATUS.DELETED.value) {
            key = moment().isSame(moment(data.gmtModified), 'day') ? '今天' : moment(data.gmtModified).format('MM月DD日')
          }
          // 判断组是否在已经设置对默认组对范围内
          let flag = taskGroups.some(temp => {
            return temp.value === key
          })
          if (flag) {
            taskGroups.forEach(group => {
              group.tasks = group.tasks || []
              if (group.value === key) {
                group.tasks.push(data)
              }
            })
          } else {
            taskGroups.push({
              name: key,
              value: key,
              tasks: [data],
              collapse: true
            })
          }
        })
      }
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
    // 处理所有的任务数据，对任务数据中的时间相关数据初始化
    dealData (taskGroups) {
      if (Array.isArray(taskGroups)) {
        taskGroups.forEach(group => {
          if (Array.isArray(group.tasks)) {
            group.tasks.forEach(task => {
              if (!task.repeatSetting) {
                task.repeatSetting = {
                  repeatRule: 'none',
                  customRepeatRule: null,
                  endType: null,
                  endByDate: null,
                  endByTimes: null,
                  dayIndexList: []
                }
              }
              task.remindSetting = {
                ruleTime: null,
                customTime: null
              }
              task.timing = false
            })
          }
        })
      }
      return taskGroups
    },
    initReqParams () {
      // 获取默认查询条件用于赋值
      let filters = db.ls.get(STORAGE.TRANS_TASK_FILTERS)
      let reqParams = {
        matters: filters && filters.matters && filters.matters.length > 0 ? filters.matters : [],
        users: filters && filters.users && filters.users.length > 0 ? filters.users : [this.$store.state.user.user],
        status: (filters && filters.status) || TASK_STATUS.UN_FINISH.value
      }
      // 这里必须得有改变store中的status的操作，要不我的中的逻辑就会出错
      this.$store.commit('updateCalendarParams', reqParams)
    },
    /**
     * 在有Favorite需要显示的时候更新favorite，不刷新页面
     */
    updateFavorite (task) {
      let fGroup = this.taskGroups.find(group => group.id === 1)
      // 如果显示favorite，则需要从favorite中移除
      if (this.isSingleUnFinish()) {
        fGroup.tasks = fGroup.tasks || []
        if (task.favorite) {
          fGroup.tasks.push(task)
        } else {
          fGroup.tasks = fGroup.tasks.filter(item => item.id !== task.id)
        }
        // 遍历所有任务任务组找到相同ID的数据设置
        this.taskGroups.forEach(group => {
          if (group.tasks) {
            group.tasks.forEach(item => {
              if (item.id === task.id) {
                item.favorite = task.favorite
              }
            })
          }
        })
      }
    },
    /**
     * 更新任务状态时，不刷新页面
     */
    updateStatus (task) {
      // 从列表中找到该任务并从列表中移除，因为操作成功以后要更新状态，所以肯定会从当前状态条件列表里移除
      this.taskGroups.forEach(group => {
        if (group.tasks) {
          group.tasks = group.tasks.filter(item => item.id !== task.id)
        }
      })
    },
    /**
     * 更新所有分组中相同任务数据
     */
    updateTask (task) {
      this.taskGroups.forEach(group => {
        if (group.tasks) {
          group.tasks.forEach(item => {
            if (item.id === task.id) {
              Object.assign(item, task)
            }
          })
        }
      })
    },
    /**
     * 未完成，第一页且只选择当前用户时查询新任务和关注的任务
     */
    isSingleUnFinish () {
      let reqParams = this.$store.state.calendar.reqParams
      return reqParams.status === TASK_STATUS.UN_FINISH.value &&
          reqParams.users.length === 1 &&
          reqParams.users[0].userId === this.$store.state.user.user.id &&
          this.page.pageIndex === 1
    },
    /**
     * 设置新任务为已读
     */
    async readNew (taskGroup) {
      let ids = taskGroup.tasks.map(task => task.id).join(',')
      await IlawService.readNewTask(ids)
      taskGroup.tasks = []
    },
    /**
     * 清空所有的任务
     */
    clearAll () {
      let matterIds = this.$store.state.calendar.reqParams.matters.map(matter => matter.id)
      this.$postMessage.clearDeletedTask(() => {
        TaskService.clearMyTaskByMatterIds(matterIds).then(() => {
          this.$postMessage.toast({msg: '操作成功', type: 'success'})
          this.queryTasks()
        })
      })
    },
    deleteTask (taskId) {
      for (let item of this.taskGroups) {
        item.tasks = item.tasks.filter(subItem => subItem.id !== taskId)
      }
    }
  },
  computed: {
    // 筛选过滤后的列表
    taskGroupsFilter () {
      const key = this.searchKey
      if (key) {
        const temGroups = _.cloneDeep(this.taskGroups)
        const taskGroups = temGroups.filter((group, index) => {
          if (group.tasks) {
            group.tasks = group.tasks.filter(task => task.name.toLowerCase().indexOf(key.toLowerCase()) > -1)
            if (group.tasks.length !== 0) {
              return true
            } else {
              group.tasks = null
            }
          }
        })
        return taskGroups
      }
      return this.taskGroups
    },
    isUnfinish () {
      return this.$store.state.calendar.reqParams.status === TASK_STATUS.UN_FINISH.value
    },
    isDeleted () {
      return this.$store.state.calendar.reqParams.status === TASK_STATUS.DELETED.value
    },
    deleteTaskCount () {
      return this.taskGroups.flatMap(item => item.tasks).filter(item => item)
    }
  },
  watch: {
    '$store.state.calendar.reqParams': {
      handler: function (newer, older) {
        this.page.pageIndex = 1
        this.queryTasks()
      },
      deep: true
    },
    '$store.state.task.refresh' () {
      this.queryTasks()
    },
    '$store.state.task.update' (after) {
      this.taskGroups.forEach(item => item.tasks && item.tasks
        .filter(subItem => subItem.id === this.$store.state.task.data.id)
        .forEach(subItem => Object.assign(subItem, this.$store.state.task.data))
      )
    }
  }
}
</script>
<style lang="scss" scoped>
  .my__task {
    width: 60.5rem;
    padding: 0 1rem 6.54rem;
    margin: auto;
    .my__task__header {
      @include flex(row, flex-start, center);
      position:relative;
      padding-bottom: 1.25rem;
      .header__filter-line {
          width: 0.125rem;
          height: 0.875rem;
          margin-left: 0.875rem;
          @extend %bg-gray-normal;
      }
      .hater__opearte {
        @extend %f-half;
        @include flex(row,center,center);
        position: absolute;
        right: 1.5rem;
        .header__search__input {
          position: relative;
          .search__input {
            background-color: #fefeff;
            // border: 1px solid #d5d5d5;
            border-radius: 12px;
            height: 24px;
            width: 0;
          }
          .search__icon {
            @extend %f-small;
            position: absolute;
            top: 7px;
            left: 5px;
          }
          .i-close-module {
            position: absolute;
            top: 5px;
            right: 5px;
            background-color: #909090;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            .ibass-close{
              color: $color-white;
              position: absolute;
              top: 0px;
              left: 0px;
              transform: scale(0.7);
            }
          }
          .search__input:focus{
            padding: 0 10px 0 22px;
            width: 120px;
            box-shadow: inset 0 1px 4px 0 rgba(0, 0, 0, 0.1);
            border: 1px solid #ffb387;
            transition: .3s all;
          }
          .search__input__hover {
            padding: 0 10px 0 22px;
            width: 120px;
            box-shadow: inset 0 1px 4px 0 rgba(0, 0, 0, 0.1);
            border: 1px solid #ffb387;
          }
        }
        .header__group-collapse, .header__search {
          @include flex(row,center,center);
          @extend %f-small;
          transition: all 0.2s;
          margin-left: 10px;
          &:hover {
            color: $theme-color-light;
          }
          .ibass-minus-square, .ibass-search{
            margin-right:0.5rem;
            color: $theme-color-light;
          }
        }
        .header__clear__task {
          @include flex(row,center,center);
          @extend %f-small;
          margin-left: 1rem;
          transition: all 0.2s;
          &:hover {
            color: $theme-color-light;
          }
          .ibass-delete{
            margin-right:0.5rem;
            color: $theme-color-light;
          }
        }
      }
    }
    .my__task__pagination {
      display: flex;
      justify-content: flex-end;
      padding: 2rem 0 0;
    }
    .my__task__list {
      .group__opearate {
        @extend %f-small;
        display: flex;
        color: $theme-color-light;
        transition: all .2s;
        &:hover {
          color: $theme-color;
        }
        .ibass-checkmark {
          &:before {
            vertical-align: -0.125rem;
          }
        }
      }
    }
    .my__task__list__none {
      text-align: center;
      margin: 10rem;
      color: $color-text-placeholder;
      .ibass-task {
        font-size: 3.125rem;
      }
      .none__text {

      }
    }
  }
</style>
<style lang="scss">
.top__loader {
  &.loading{
    .loading_content {
      top: 5rem;
    }
  }
}
</style>

<template lang="pug">
  .matter__task(v-ic-loading="loading" data-load-class="top__loader")
    .matter__task__header
      //- 任务与日历的切换
      model-switch(activated="list")
      //- 任务的状态切换
      .ib__task-filter-status.pointer.noselect
        ic-dropdown(:visible="statusState")
          div(@click="statusVisibleChange")
              span {{statusLabel}}
              i.ibass-trig-down
          ic-dropdown-menu(slot="dropdown" theme="black")
            .ib__status-selector
              .ib__status-selector-item(v-for="(status, key) in defaultStatus" :key="status.value" @click="statusChange(status)")
                span {{status.label}}
      .hater__opearte
        //- 任务搜索
        .header__search__input.noselect(v-show="isSearchInput")
          input.search__input(type="text" :class="{'search__input__hover':searchKey, 'search__input__blur':isBlur}" autofocus="autofocus" @blur="showSearchText" ref="searchInput" placeholder="页内搜索任务..." v-model="searchKey")
          span.ibass-search.search__icon(v-show="SearchIcon")
          span.i-close-module(v-show="searchKey" @click="closeSearch")
            i.ibass-close
        .header__search.pointer.noselect(v-if="isSearch" @click="showSearch")
          span.ibass-search
          span 搜索
        .header__group-collapse.pointer.noselect(@click="toggleCollapse")
          span.ibass-minus-square
          span 任务组收展
        ic-dropdown(:visible="newConstructionState" v-if="unFinished&&isPermission('task:add')")
          .header__new__construction.pointer.noselect(@click="newConstruction")
            span.ibass-add
            span 新建
            ic-dropdown-menu(slot="dropdown" theme="black" :positionX="27")
              .ib__status-selector
                .ib__status-selector-item(@click="createNewTask") 任务
                .ib__status-selector-item(@click="createNewTaskGroup") 任务组
        ic-dropdown(:visible="moreState" v-if="unFinished&&isPermission('showMoreButton')")
          .header_more.pointer.noselect(@click="more")
            span.ibass-ellipses
            span 更多
            ic-dropdown-menu(slot="dropdown" theme="black" :positionX="27" v-if="importAndExportStatus")
              .ib__status-selector
                .ib__status-selector-item(@click.stop="importTasksList" v-if="isPermission('taskAdd')") 导入任务列表
                  span.ibass-arrow-right
                .ib__status-selector-item(@click="exportTaskLists" v-if="isPermission('taskExport')") 导出任务列表
            ic-dropdown-menu(slot="dropdown" theme="black" :positionX="27" v-if="importStatus")
              .ib__title
                span.ibass-arrow-left(@click.stop="goBack")
                span.title 导入任务列表
              .ib__status-selector
                .ib__status-selector-item(@click="importTaskListFromTemplate") 从项目模板导入
                .ib__status-selector-item(@click="importTaskListFromGroup") 从任务组模板导入
        .header__clear.pointer.noselect(@click="clearDeletedTaskConfirm" v-if="deleted && hasData && isPermission('task:delete')")
          span.ibass-delete
          span 清空
    //- 任务创建
    .matter__task__create(v-if="unFinished && isPermission('task:add')")
      task-create(@refresh="search(1)" :matter="matter" ref="taskCreate")
    //- 任务组创建
    .my__group__create(v-if="isCreateGroup && unFinished")
      group-create(:matter="matter" @hideCreateGroup="hideCreateGroup" ref="groupCreate" @refresh="search(1)")
    //- 任务列表
    .matter__task__list(v-if="hasData" :class="{'prevent-animation': preventAnimation}")
      //- 关注的
      group(:taskGroup="taskGroupsFilter[0]" ref="group" v-if="taskGroupsFilter[0].tasks.length!==0" :editable="false" @deleteTask="deleteTask" @updateTask="updateTask" @updateFavorite="updateFavorite" @updateStatus="updateStatus" @toggleCompleted="toggleCompleted" @GrouptoggleCollapse="GrouptoggleCollapse" @loadMore="loadMore" @getOpenTaskDetailGroupId="getOpenTaskDetailGroupId")
      //- 除去关注的任务列表
      SortGroup(
        v-for="(taskGroup, index) in taskGroupsFilter"
        v-if="index>0"
        ref="SortGroup"
        :taskGroup="taskGroup"
        :key="taskGroup.id"
        :editable="unFinished && isPermission('task:edit') && taskGroup.name!== '未分组'"
        :draggable="SearchOrRealData && unFinished && isPermission('task:edit') && !taskGroup.disableDrag && taskGroup.name!== '未分组'"
        :groupIndex="index"
        @setCurDragItem="setCurDragItem"
        @foldTG="foldTG"
        @removeGroup="removeGroup"
        @dropMoveTask="dropMoveTask"
        @dropMoveGroup="dropMoveGroup"
        @deleteTask="deleteTask"
        @updateTask="updateTask"
        @updateFavorite="updateFavorite"
        @updateStatus="updateStatus"
        @toggleCompleted="toggleCompleted"
        @userChooseHide="userChooseHide"
        @GrouptoggleCollapse="GrouptoggleCollapse"
        @loadMore="loadMore"
        @getOpenTaskDetailGroupId="getOpenTaskDetailGroupId"
      )
        .ib__create__task__and__delete__task__group(slot="operate" v-if="unFinished")
          ic-popover.ib__more(
            :hover="true"
            :scrollable="true"
            theme="black"
            :positionX="-48"
            :positionY="36"
            :appendToBody="false"
            position="no"
            @mouseenter.native="taskGroup.disableDrag = true" @mouseleave.native="taskGroup.disableDrag = false"
            v-if="SearchOrRealData && taskGroup.name!=='未分组' && (isPermission('task:edit')||isPermission('task:delete'))"
          )
            span.pointer.ibass-ellipses(slot="trigger") 更多
            .ib__more__operate
              .ib__more__option__item.pointer(@click="batchDistribute" v-if="isPermission('task:edit') && taskGroup.tasks") 批量分配
              .ib__more__option__item.pointer(@click="finishedAllConfirm(taskGroup)" v-if="isPermission('task:edit')") 全部完成
              .ib__more__option__item.pointer(@click="deleteTaskGroup(taskGroup, index)" v-if="isPermission('task:delete')") 删除任务组
          //- 筛选排序
          ic-popover.ib__sort__task(:hover="true" :scrollable="true" position="no" theme="black" :positionX="-77" :positionY="36" :appendToBody="false" @mouseenter.native="taskGroup.disableDrag = true" @mouseleave.native="taskGroup.disableDrag = false")
            .pointer.ibass-sort(slot="trigger") 筛选排序
            .ib__sort__operate
              .ib__sort__operate__item.pointer(@click="sort(taskGroup, 'sortDefault')") 默认排序
                span.ibass-done(v-if="taskGroup.sort === 'sortDefault'")
              .ib__sort__operate__item.pointer(@click="sort(taskGroup, 'sortName')") 按名称排序
                span.ibass-done(v-if="taskGroup.sort === 'sortName'")
              .ib__sort__operate__item.pointer(@click="sort(taskGroup, 'sortCreateTime')") 按创建时间倒序
                span.ibass-done(v-if="taskGroup.sort === 'sortCreateTime'")
              .ib__sort__operate__item.pointer(@click="sort(taskGroup, 'sortExpirationTime')") 按到期时间倒序
                span.ibass-done(v-if="taskGroup.sort === 'sortExpirationTime'")
          span.pointer.ibass-add.ib__create__task(@click="createTask(taskGroup)" v-if="SearchOrRealData && isPermission('task:add') && taskGroup.name !== '未分组'") 新建任务
          .ib__group__attendees(v-if="isUseChoose" @mouseleave="isUseChoose=false")
            user-choose(arrows="no" :visible="userChooseVisible" :selectedUsers="attendees" @selectItem="selectUser" :matterId="matterId" :requestUser="true" @changeVisible="changeUserChooseVisible" ref="userChoose")
              .ib__group__attendees__operate(slot="footer")
                span.pointer(@click="clearAllUser") 清除
                ic-button.ib__group__attendees__confirm(@click="changeUser(taskGroup.id)") 确定
          //- span.pointer.ibass-delete(@click="deleteTaskGroup(taskGroup, index)" v-if="isPermission('task:delete')")
        .ib__create__task__and__delete__task__group(slot="operate" v-if="taskGroup.name!=='未分组'&&taskGroup.state===1 && finished && isPermission('task:edit')")
          span.pointer.ibass-restore.ib__task__group__restart(@click="restartFinishedTaskGroup(taskGroup.id)" v-if="isPermission('task:delete')") 全部取消完成
        //- 已经删除的任务组恢复
        .ib__create__task__and__delete__task__group(slot="operate" v-if="taskGroup.name!=='未分组' && taskGroup.valid===0 && deleted && isPermission('task:delete')")
          span.pointer.ibass-restore.ib__task__group__restart(@click="recoverDeleteTaskGroup(taskGroup.id)")
        .ib__task__group__no__tasks.pointer(slot="notask" v-if="unFinished")
          span.ib__no__task 该任务组下暂无任务
          span.ib__new__create(@click="createTask(taskGroup)" v-if="SearchOrRealData && isPermission('task:add') && taskGroup.name !== '未分组'") 新建任务
          //- span.ibass-task-check(@click="changeTaskGroupStatus(taskGroup.id, true)" v-if="isPermission('task:edit')")
          //- span.ib__done 将任务组标记为已完成
        .ib__task__group__no__tasks.pointer(slot="notask" v-if="finished")
          span.ib__no__task 该任务组下暂无任务
          //- span.ibass-done(@click="changeTaskGroupStatus(taskGroup.id, false)" v-if="isPermission('task:edit')")
          //- span.ib__done 取消完成
        .ib__task__group__no__tasks.pointer(slot="notask" v-if="deleted")
          span.ib__no__task 该任务组下暂无任务
      //- 在搜索的情况下，不显示分页情况
      .matter__task__pagination
        ic-pagination(v-if="page.count>page.pageSize" @change="search" :currPage="page.pageIndex" :pageSize="page.pageSize" :totalCount="page.count")
      .matter__task__list__none(v-if="taskGroupsFilter.length === 1 && taskGroupsFilter[0].tasks.length===0")
        .ibass-task
        .none__text 无匹配结果
    .matter__task__list__none(v-else)
      .ibass-task
      .none__text 暂无任务
</template>
<script>
import postMessage from '@/utils/postMessage'
import ModelSwitch from '@/vue/components/task/ModelSwitch'
import TaskFilterGroup from '@/vue/components/task/TaskFilterGroup'
import {TASK_STATUS, sortRule, TASK_FINISH_STATUS, PAGE, UN_GROUP_ID, GUANZHU} from '@/utils/constants'
import TaskCreate from '@/vue/components/task/create/Index'
import MatterService from '@/vue/service/matter'
import Group from '@/vue/components/task/list/Group'
import SortGroup from '@/vue/components/task/list/SortGroup'
import GroupCreate from '@/vue/components/taskgroup/create'
import UserChoose from '@/vue/components/user/choose/Index'
const {FINISHED, UN_FINISH} = TASK_FINISH_STATUS
export default {
  components: {
    ModelSwitch,
    TaskFilterGroup,
    TaskCreate,
    Group,
    SortGroup,
    GroupCreate,
    UserChoose
  },
  data () {
    return {
      loading: false,
      users: [],
      statusState: false,
      newConstructionState: false,
      moreState: false,
      statusLabel: '未完成',
      // statusType 表示状态（1:未完成；2:完成 3:已删除）
      statusType: TASK_STATUS.UN_FINISH.value,
      hasData: false,
      taskGroups: [],
      matter: null,
      curDragItem: null,
      // 是否显示创建任务组，默认为不显示
      isCreateGroup: false,
      importStatus: false,
      importAndExportStatus: true,
      matterTaskPermission: '',
      preventAnimation: false,
      searchKey: '',
      // 默认选中的用户
      attendees: [],
      isUseChoose: false,
      userChooseVisible: false,
      isSearchInput: false,
      SearchOrRealData: true,
      isSearch: true,
      SearchIcon: false,
      isBlur: false,
      page: {
        // 默认从第几页开始
        pageIndex: 1,
        // 每页显示多少条
        pageSize: PAGE.PAGESIZE,
        // 任务总数（能够计算出分多少页）
        count: 0
      },
      // 任务总数
      tasksSumTotal: 0,
      // 打开任务细节的时候记录他的任务组id
      originalGroupId: ''
    }
  },
  created () {
    // 在创建的时候，将筛选状态设置为未完成的
    this.$store.commit('updateStatusType', TASK_STATUS.UN_FINISH.value)
    // 设置标示，标示着此时我进去了matter(项目不是我的)
    this.$store.commit('updateMark', 'matter')
    // console.log(this.$store.state.matter.mark)
  },
  mounted () {
    // 先进行权限认证
    this.loading = new Promise((resolve, reject) => {
      this.$postMessage.initPermission('', (res) => {
        // console.log(res)
        if (res.success) {
          this.matterTaskPermission = res.matterTaskPermission
          // 将权限添加到store
          this.$store.commit('updateMatterTaskPermission', res.matterTaskPermission)
          // 将当前的项目信息存到store中
          this.$store.commit('updateCurMatter', res.curMatter)
          // 查询任务列表数据
          this.queryTasks(resolve)
        }
      })
    })
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
            if (group.tasks.length !== 0 || index === 0) {
              return true
            } else {
              group.tasks = null
            }
          }
        })
        // 如果是查询状态
        this.$store.commit('updateSearchOrRealData', 'searchData')
        return taskGroups
      }
      // 如果是真实的数据状态
      this.$store.commit('updateSearchOrRealData', 'realData')
      return this.taskGroups
    },
    // 从路由中获取项目id
    matterId () {
      return this.$route.params.matterId || ''
    },
    // 默认的三种状态
    defaultStatus () {
      return Object.values(TASK_STATUS)
    },
    // 未完成状态
    unFinished () {
      return TASK_STATUS.UN_FINISH.value === this.statusType
    },
    // 已完成状态
    finished () {
      return TASK_STATUS.FINISHED.value === this.statusType
    },
    // 删除状态
    deleted () {
      return TASK_STATUS.DELETED.value === this.statusType
    }
  },
  methods: {
    // 传递权限字段进行权限认证
    isPermission (args) {
      return this.matterTaskPermission.includes(args)
    },
    setCurDragItem (val) {
      this.curDragItem = val
    },
    // 当失去焦点的时候，判断是否将搜索框隐藏
    showSearchText () {
      this.isBlur = false
      if (this.searchKey === '') {
        this.isSearch = true
        this.SearchIcon = false
        this.isBlur = true
      }
    },
    // 点击搜索文字，展示搜素框
    showSearch () {
      this.isSearchInput = true
      this.isSearch = false
      this.SearchIcon = true
      this.$refs.searchInput.focus()
      // 搜的时候展开任务组
      this.taskGroups.forEach(item => {
        item.collapse = true
      })
    },
    // 点击搜索中的关闭
    closeSearch () {
      this.searchKey = ''
      this.$refs.searchInput.focus()
      // this.showSearchText()
    },
    // 批量分配
    batchDistribute () {
      this.isUseChoose = true
      this.userChooseVisible = true
    },
    // 辅助批量分配用户的
    userChooseHide () {
      this.isUseChoose = false
    },
    changeUserChooseVisible (val) {
      this.userChooseVisible = val
    },
    selectUser (users, groupId) {
      this.attendees = users
    },
    clearAllUser () {
      this.attendees = []
    },
    // 任务组批量添加任务负责人
    changeUser (groupId) {
      let userIds = ''
      this.isUseChoose = false
      if (this.attendees && this.attendees.length > 0) {
        userIds = this.attendees.map(item => item.id).join(',')
        MatterService.batchAddAttendee(groupId, userIds).then(res => {
          postMessage.toast({
            msg: '操作成功',
            type: 'success'
          })
          // 将选择的状态滞空
          this.attendees = []
          // 请求一下这组的数据
          this.queryGroupByGroupId(groupId)
        })
      }
    },
    // 通过任务组id，请求这个组的数据，实现局部刷新
    queryGroupByGroupId (groupId) {
      // 未完成任务的请求
      const unFinishedRequest = MatterService.getTaskListsByGroup(this.matterId, groupId)
      // 已完成任务的请求
      const finishedRequest = MatterService.getTaskListsByGroup(this.matterId, groupId, TASK_STATUS.FINISHED.value)
      unFinishedRequest.then(res => {
        this.taskGroups.forEach(item => {
          if (item.id === groupId) {
            // 查看现在是否是显示的已完成的任务呢，finished为true，则需要查询已完成的数据
            const finished = Array.isArray(item.tasks) && this.stateFind(item.tasks, FINISHED)
            if (finished) {
              finishedRequest.then(res1 => {
                // 未完成任务
                item.tasks = this.dealGroupData(res.data[0].tasks.data.sort(sortRule[item.sort]))
                // 完成的任务
                item.tasks.push(...res1.data[0].tasks.data.sort(sortRule[item.sort]))
                item.finishedTaskCount = res1.data[0].tasks.count
              })
            } else {
              // 没有显示已完成的
              item.tasks = this.dealGroupData(res.data[0].tasks.data.sort(sortRule[item.sort]))
            }
            item.unfinishedTaskCount = res.data[0].tasks.count
          }
        })
      })
    },
    // 完成所有的任务的确认（调用angular）
    finishedAllConfirm (taskGroup) {
      this.$postMessage.finishedAllConfirm(taskGroup, this.finishedAll)
    },
    // 完成所有任务的操作
    finishedAll (taskGroup) {
      MatterService.changeAllToFinished(taskGroup.id).then(res => {
        postMessage.toast({
          msg: '操作成功',
          type: 'success'
        })
        // 这里直接通过dom移除掉就可以
        this.taskGroups = this.taskGroups.filter(item => item.id !== taskGroup.id)
      })
    },
    // 将完成的任务组批量的设为未完成状态
    restartFinishedTaskGroup (groupId) {
      MatterService.restartFinishedTaskGroup(groupId).then(res => {
        postMessage.toast({
          msg: '操作成功',
          type: 'success'
        })
        // 这里直接通过dom移除掉就可以
        this.taskGroups = this.taskGroups.filter(item => item.id !== groupId)
      })
    },
    // 筛选排序
    sort (taskGroup, rule) {
      // 将排序规则都存放到constants.js中
      this.taskGroups.forEach(item => {
        if (item.id === taskGroup.id) {
          // 保存这个任务组的排序规则（每一个组维护一个规则）
          item.sort = rule
          // 如果有任务就进行排序
          if (Array.isArray(item.tasks) && item.tasks.length !== 0) {
            // 由于有的任务是没有到期时间的
            let finished = ''
            let unfinished = ''
            if (rule === 'sortExpirationTime') {
              // 找到有到期时间的完成的任务
              let temp = this.stateFilter(item.tasks, FINISHED).filter(item => !item.dueTime).sort(sortRule['sortName'])
              finished = this.stateFilter(item.tasks, FINISHED).filter(item => item.dueTime).sort(sortRule[rule])
              finished.push(...temp)
              let temp1 = this.stateFilter(item.tasks, UN_FINISH).filter(item => !item.dueTime).sort(sortRule['sortName'])
              unfinished = this.stateFilter(item.tasks, UN_FINISH).filter(item => item.dueTime).sort(sortRule[rule])
              unfinished.push(...temp1)
            } else {
              // 筛选已完成的数据
              finished = this.stateFilter(item.tasks, FINISHED).sort(sortRule[rule])
              unfinished = this.stateFilter(item.tasks, UN_FINISH).sort(sortRule[rule])
            }
            item.tasks = []
            item.tasks.unshift(...unfinished)
            item.tasks.push(...finished)
          }
        }
      })
    },
    // drop任务
    dropMoveTask (task, index) {
      const dragTaskId = this.curDragItem.item.id
      if (this.curDragItem.type !== 'group' && dragTaskId !== task.id) {
        const dragTaskGroupId = this.curDragItem.item.taskGroupId
        // 判断是否为重复任务
        // if (this.curDragItem.item.repeatId) {
        //   // 实现重复任务拖拽逻辑
        // } else {
        //   moveCommonTask(dragTaskId, dragTaskGroupId, task)
        // }
        // console.log(this.curDragItem.item)
        this.moveCommonTask(dragTaskId, dragTaskGroupId, task, this.curDragItem.item.repeatId)
      }
    },
    // drop任务组
    dropMoveGroup (taskGroup, groupIndex) {
      const id = this.curDragItem.item.id
      if (id !== taskGroup.id) {
        if (this.curDragItem.type !== 'group') {
          this.unfoldTG()
          this.moveCommonTask(id, this.curDragItem.item.taskGroupId, {id: '', taskGroupId: taskGroup.id}, this.curDragItem.item.repeatId)
        } else if (taskGroup.id !== UN_GROUP_ID) {
          this.unfoldTG()
          this.moveTaskGroup(id, taskGroup.id)
        }
      }
    },
    moveCommonTask (dragTaskId, dragTaskGroupId, task, isRepeat) {
      if (dragTaskGroupId === task.taskGroupId) {
        this.moveTaskNoCrossGroup(dragTaskId, task.id, dragTaskGroupId, task.taskGroupId)
      } else {
        this.moveTaskCrossGroup(dragTaskId, task.id, dragTaskGroupId, task.taskGroupId, !!isRepeat)
      }
    },
    async moveTaskNoCrossGroup (srcTaskId, destTaskId, srcParent, destParent) {
      await MatterService.moveTaskNoCrossGroup(srcTaskId, destTaskId)
      postMessage.toast({
        msg: '操作成功',
        type: 'success'
      })
      this.queryTasks()
      this.changeText()
    },
    async moveTaskCrossGroup (srcTaskId, destTaskId, srcParent, destParent, effectRepeats) {
      await MatterService.moveTaskCrossGroup(srcTaskId, destTaskId, destParent, effectRepeats)
      postMessage.toast({
        msg: '操作成功',
        type: 'success'
      })
      this.queryTasks()
      this.changeText()
    },
    async moveTaskGroup (taskGroupId, destGroupId) {
      await MatterService.moveTaskGroup(taskGroupId, destGroupId)
      postMessage.toast({
        msg: '操作成功',
        type: 'success'
      })
      this.queryTasks()
      this.changeText()
    },
    // 状态切换之后，隐藏下面的状态选择框
    statusVisibleChange () {
      this.statusState = !this.statusState
    },
    newConstruction () {
      this.newConstructionState = !this.newConstructionState
    },
    more () {
      this.moreState = !this.moreState
    },
    // 导入任务列表
    importTasksList () {
      this.importAndExportStatus = false
      this.importStatus = true
    },
    goBack () {
      this.importAndExportStatus = true
      this.importStatus = false
    },
    // 根据不同的条件进行刷选
    statusChange (status) {
      this.moreState = false
      this.newConstructionState = false
      // 阻止重复点击一个状态时，进行数据重新请求
      if (this.statusType !== status.value) {
        // 改变文字
        this.statusLabel = status.label
        // 改变发送请求的标示
        this.statusType = status.value
        // 改变store中的值
        this.$store.commit('updateStatusType', this.statusType)
        // 不需要动画效果，并清除数据再渲染，防止跳动感
        // this.hasData = false
        this.queryTasks()
        // 选择条件结束后--隐藏
        this.statusVisibleChange()
      }
    },
    foldTG () {
      this.taskGroups.forEach(item => {
        item.collapse = false
      })
    },
    unfoldTG () {
      this.taskGroups.forEach(item => {
        item.collapse = true
      })
    },
    // 当数据全部刷新时，将显示已完成的状态更改为“显示”
    changeText () {
      this.taskGroups.filter(item => item.id !== GUANZHU).forEach((item, index) => {
        this.$refs.SortGroup[index].toggleText = '显示'
      })
      if (this.$refs.group) {
        this.$refs.group.toggleText = '显示'
      }
    },
    // 全部任务组的统一收展情况
    toggleCollapse () {
      const collapse = this.taskGroups
      // 如果任务组下的任务为null,这里就会报错
        // .filter(item => item.tasks.length)
        // 这里遍历所有的任务组节点，如果某个任务组的collapse为false返回false，如果都为true则返回true
        .every(item => item.collapse)
      this.taskGroups.forEach(item => {
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
    // 创建新任务
    createNewTask () {
      // 弹出新建任务
      this.$refs.taskCreate.inputFocus()
      // 获取焦点
      this.$refs.taskCreate.$refs.nameInput.$refs.input.focus()
    },
    createNewTaskGroup () {
      this.isCreateGroup = true
    },
    hideCreateGroup () {
      this.isCreateGroup = false
    },
    // 删除任务（默认传递）
    deleteTask (taskId) {
      let task = ''
      // 通过taskId找到这个任务（因为需要用到组id，需要获取到任务的信息）
      for (let item of this.taskGroups) {
        if (Array.isArray(item.tasks) && item.tasks.length !== 0) {
          task = item.tasks.find(subItem => subItem.id === taskId)
          if (task) {
            break
          }
        }
      }
      // 未分组
      if (!task.taskGroupId) {
        task.taskGroupId = UN_GROUP_ID
      }
      // 循环的删除任务
      for (let item of this.taskGroups) {
        if (Array.isArray(item.tasks) && item.tasks.length !== 0) {
          item.tasks = item.tasks.filter(subItem => subItem.id !== taskId)
        }
      }
      // 重复任务的判断条件
      const reapeatTask = task.repeatSetting && task.repeatSetting.repeatRule && task.repeatSetting.repeatRule !== 'none'
      // 未完成任务的请求
      const unFinishedRequest = MatterService.getTaskListsByGroup(this.matterId, task.taskGroupId)
      // 如果是未完成的，并且是重复任务（这里需要重新请求一下未完成的）
      if (!task.state && reapeatTask) {
        unFinishedRequest.then(res => {
          this.taskGroups.forEach(item => {
            if (item.id === task.taskGroupId) {
              // 如果有已完成的，就直接加到上面，没有就是空数组
              item.tasks = this.stateFilter(item.tasks, FINISHED)
              // 将请求来的未完成的数据拼接上
              item.tasks.unshift(...this.dealGroupData(res.data[0].tasks.data.sort(sortRule[item.sort])))
            }
          })
        })
        if (task.favorite) {
          this.taskGroups[0].unfinishedTaskCount--
        }
      }
      // 如果这个任务是未完成, 不是重复任务
      if (!task.state && !reapeatTask) {
        this.taskGroups.forEach(item => {
          if (item.id === task.taskGroupId) {
            item.unfinishedTaskCount--
          }
        })
        // 如果这个任务被关注了
        if (task.favorite) {
          this.taskGroups[0].unfinishedTaskCount--
        }
      }
      // 如果这个任务是已完成的任务
      if (task.state) {
        this.taskGroups.forEach(item => {
          if (item.id === task.taskGroupId) {
            item.finishedTaskCount--
          }
        })
        // 如果这个任务被关注
        if (task.favorite) {
          this.taskGroups[0].finishedTaskCount--
        }
      }
    },
    /**
     * 1.已完成的状态恢复到未完成
     * 2.将任务组标记为已完成
     */
    changeTaskGroupStatus (groupId, state) {
      const params = {id: groupId, state: state, valid: true}
      MatterService.changeTaskGroupStatus(params).then(res => {
        this.$postMessage.toast({msg: '操作成功', type: 'success'})
        // 将组id传递出去，去把那个组移除掉
        this.removeGroup(groupId)
      })
    },
    /**
     * 将删除的任务组恢复
     */
    recoverDeleteTaskGroup (groupId) {
      MatterService.recoverDeleteTaskGroup(groupId).then(res => {
        this.$postMessage.toast({msg: '操作成功', type: 'success'})
        // 将组id传递出去，去把那个组移除掉
        this.removeGroup(groupId)
      })
    },
    /**
     * 删除任务组
     */
    deleteTaskGroup (taskGroup, groupIndex) {
      this.$postMessage.deleteTaskGroup({taskGroup, groupIndex}, res => {
        // deleteChild 为true标示删除任务组以及任务组下的任务，为false则将任务放到未分组中
        if (res.deleteChild) {
          // 删除任务组执行后，
          this.taskGroups.splice(groupIndex, 1)
        } else {
          // 因为此时任务放到未分组中，所以需要请求一下未分组的数据（这里就不用请求已完成的了）
          this.queryTasks()
          this.changeText()
          // MatterService.getTaskListsByGroup(this.matterId, 'UN_GROUP_ID', TASK_STATUS.UN_FINISH.value).then(res => {
          //   console.log('res: ', res)
          // })
        }
      })
    },
    /**
     * 创建新任务
     */
    createTask (taskGroup) {
      const taskData = {
        matter: this.matter,
        taskGroup: taskGroup
      }
      this.$postMessage.createTask(taskData, res => {
        if (res && res.status === 'success') {
          this.queryTasks()
          setTimeout(() => {
            this.changeText()
          }, 0)
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
    // 移除指定任务组ID的项目
    removeGroup (GroupId) {
      this.taskGroups = this.taskGroups.filter(group => group.id !== GroupId)
    },
    // 清空已经删除的确认框
    clearDeletedTaskConfirm () {
      this.$postMessage.clearDeletedTask(this.clearDeletedTask)
    },
    /**
     * 清空所有已经删除的
     */
    async clearDeletedTask () {
      const res = await MatterService.clearDeletedTask(this.matterId)
      if (res.isSuccess === true) {
        this.$postMessage.toast({msg: '操作成功', type: 'success'})
        this.queryTasks()
      }
    },
    /**
     * 导出任务列表(调用的angular中的方法)
     */
    exportTaskLists () {
      this.$postMessage.exportTaskLists()
    },
    /**
     * 从项目模板导入(调用的angular中的方法)
     */
    importTaskListFromTemplate () {
      this.$postMessage.importTaskListFromTemplate()
    },
    /**
     * 从任务组模板导入(调用的angular中的方法)
     */
    importTaskListFromGroup () {
      this.$postMessage.importTaskListFromGroup('', (res) => {
        if (res && res.result === true) {
          this.queryTasks()
          this.changeText()
        }
      })
    },
    /**
     * 在有Favorite需要显示的时候更新favorite，不刷新页面
     */
    updateFavorite (task) {
      // 获取到关注的任务组
      let fGroup = this.taskGroups.find(group => group.name === '我关注的')
      // console.log(task)
      // console.log(fGroup)
      // 如果是关注就添加进去，否则就从关注中移除掉
      if (task.favorite) {
        fGroup.tasks.push(task)
        fGroup.unfinishedTaskCount++
      } else {
        fGroup.tasks = fGroup.tasks.filter(item => item.id !== task.id)
        fGroup.unfinishedTaskCount--
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
    },
    deleteTaskAndGroup (task) {
      // 去掉任务
      for (let item of this.taskGroups) {
        if (Array.isArray(item.tasks) && item.tasks.length !== 0) {
          item.tasks = item.tasks.filter(subItem => subItem.id !== task.id)
        }
      }
      // 去掉任务组(目前已知只有已删除是需要删除任务组的)
      // task.valid==1表示这个任务已经被删除了已删除的任务
      if (!task.valid && this.deleted) {
        // 我关注的是一直留着的，还有那些有任务的任务组
        this.taskGroups = this.taskGroups.filter(item => {
          return item.name === '我关注的' || (Array.isArray(item.tasks) && item.tasks.length !== 0)
        })
      }
    },
    // 这两个为任务状态的辅助方法
    stateFilter (arr, state) {
      return arr.filter(item => item.state === state)
    },
    stateFind (arr, state) {
      return arr.find(item => item.state === state)
    },
    /**
     * 更新任务状态时，不刷新页面（完成任务）
     */
    updateStatus (task) {
      if (!task.taskGroupId) {
        task.taskGroupId = UN_GROUP_ID
      }
      // 是否是重复任务的判断条件
      const reapeatTask = task.repeatSetting && task.repeatSetting.repeatRule && task.repeatSetting.repeatRule !== 'none'
      // 未完成任务的请求
      const unFinishedRequest = MatterService.getTaskListsByGroup(this.matterId, task.taskGroupId)
      // 已完成任务的请求
      const finishedRequest = MatterService.getTaskListsByGroup(this.matterId, task.taskGroupId, TASK_STATUS.FINISHED.value)
      // 请求关注的，未完成的数据promise
      const unFinishedAttentionRequest = MatterService.getFavoriteTasks(this.matterId, TASK_STATUS.UN_FINISH.value)
      // 请求关注的，已完成的数据promise
      const finishedAttentionRequest = MatterService.getFavoriteTasks(this.matterId, TASK_STATUS.FINISHED.value)
      this.deleteTaskAndGroup(task)
      // 如果是 重复任务,未删除，未完成,则请求这个任务组的数据
      if (reapeatTask && task.valid && !task.state) {
        unFinishedRequest.then(res => {
          if (res.isSuccess) {
            this.taskGroups.forEach(item => {
              if (item.id === task.taskGroupId) {
                // 查看现在是否是显示的已完成的任务呢，finished为true，则需要查询已完成的数据
                const finished = this.stateFind(item.tasks, FINISHED)
                if (finished) {
                  finishedRequest.then(res1 => {
                    // 未完成任务
                    item.tasks = this.dealGroupData(res.data[0].tasks.data.sort(sortRule[item.sort]))
                    // 完成的任务
                    item.tasks.push(...res1.data[0].tasks.data.sort(sortRule[item.sort]))
                  })
                } else {
                  // 没有显示已完成的
                  item.tasks = this.dealGroupData(res.data[0].tasks.data.sort(sortRule[item.sort]))
                }
                // item.tasks.push(...finished)
                // item.finishedTaskCount++
                item.finishedTaskCount = res.data[0].finishedTaskCount
              }
            })
            // 判断一下这个任务是不是关注的任务
            if (task.favorite) {
              this.taskGroups[0].finishedTaskCount++
              this.taskGroups[0].unfinishedTaskCount--
            }
          }
        })
      }
      // 不是重复任务，,未删除，未完成
      if (!reapeatTask && task.valid && !task.state) {
        // 如果不是重复任务
        this.taskGroups.forEach(item => {
          if (item.id === task.taskGroupId) {
            item.unfinishedTaskCount--
            item.finishedTaskCount++
            // 判断如果有已完成的
            const finished = this.stateFind(item.tasks, FINISHED)
            // 先把所有当前未完成的拿出来
            item.tasks = this.stateFilter(item.tasks, UN_FINISH).sort(sortRule[item.sort])
            // console.log(item.task)
            if (finished) {
              finishedRequest.then(res => {
                item.tasks.push(...res.data[0].tasks.data.sort(sortRule[item.sort]))
              })
            }
          }
        })
        // 判断一下这个任务是不是关注的任务
        if (task.favorite) {
          // 判断此时是否显示的已完成的
          const finished = this.stateFind(this.taskGroups[0].tasks, FINISHED)
          if (finished) {
            // 请求一下已完成的关注的任务
            finishedAttentionRequest.then(res => {
              // 获取到未完成的, 关注的
              this.taskGroups[0].tasks = this.stateFilter(this.taskGroups[0].tasks, UN_FINISH)
              this.taskGroups[0].tasks.push(...res.data.tasks.data)
              this.taskGroups[0].finishedTaskCount = res.data.finishedTaskCount
              this.taskGroups[0].unfinishedTaskCount = res.data.unfinishedTaskCount
            })
          } else {
            this.taskGroups[0].finishedTaskCount++
            this.taskGroups[0].unfinishedTaskCount--
          }
        }
      }
      // 不是重复任务，未删除,已完成, 此时的筛选状态是未完成
      if (!reapeatTask && task.valid && task.state && this.unFinished) {
        // 这种情况一定是打开了已完成的，所以就不判断的了
        // 需要从新获取一下，这组的未完成,已完成的dom已经移除掉了，下次点击会自动刷新的
        // 如果这个任务是已关注的任务
        if (task.favorite) {
          // 获取一下未完成，已关注的
          unFinishedAttentionRequest.then(res => {
            // 已完成， 关注的
            const finished = this.stateFilter(this.taskGroups[0].tasks, FINISHED)
            // 如果已关注的已完成的任务数为0
            if (finished.length === 0) {
              this.$refs.group.toggleText = '显示'
            }
            this.taskGroups[0].tasks = this.dealGroupData(res.data.tasks.data)
            this.taskGroups[0].tasks.push(...finished)
            this.taskGroups[0].finishedTaskCount = res.data.finishedTaskCount
            this.taskGroups[0].unfinishedTaskCount = res.data.unfinishedTaskCount
          })
        }
        this.taskGroups.filter(item => item.id !== GUANZHU).forEach((item, index) => {
          if (item.id === task.taskGroupId) {
            unFinishedRequest.then(res => {
              // 已完成的
              item.tasks = this.stateFilter(item.tasks, FINISHED).sort(sortRule[item.sort])
              // 如果将已完成的都完成了,则需要将这个组的隐藏已完成变为显示已完成
              if (item.tasks.length === 0) {
                this.$refs.SortGroup[index].toggleText = '显示'
              }
              // 未完成的
              item.tasks.unshift(...this.dealGroupData(res.data[0].tasks.data.sort(sortRule[item.sort])))
              item.unfinishedTaskCount = res.data[0].unfinishedTaskCount
              item.finishedTaskCount = res.data[0].finishedTaskCount
            })
          }
        })
      }
    },
    // 分页重新请求数据
    search (pageIndex) {
      // console.log(pageIndex)
      this.page.pageIndex = pageIndex
      this.queryTasks()
    },
    // 通过项目id获取项目信息
    queryMatter () {
      MatterService.getMatterByMatterId(this.matterId).then(res => {
        this.matter = res.data[0]
      })
    },
    queryTasks (resolve) {
      // 存储要渲染的数据
      let _taskGroups = []
      // 进行异步到请求
      let proarr = []
      // 查询项目信息
      this.queryMatter()
      // 查询任务组和任务
      proarr.push(this.queryGroupAndTask(_taskGroups))
      // 查询关注的任务
      proarr.push(this.queryFavoriteTasks(_taskGroups))
      const tasksPromise = Promise.all(proarr).then(() => {
        if (resolve) resolve()
        _taskGroups.forEach((item) => {
          // 未分组
          if (item.id === null) {
            item.id = UN_GROUP_ID
          }
          // 控制任务组的收展
          item['collapse'] = true
          item['value'] = '123'
          // 排序规则
          item['sort'] = 'sortDefault'
          // 任务组已完成任务数是否大于200
          item['isBeyondTwoHundred'] = false
          // 标示第几页（用在加载更多）
          item['pageIndex'] = item.id === GUANZHU ? PAGE.FAVORITE_TASKS_PAGEINDEX() : PAGE.COMMON_TASK_PAGEINDEX()
          // 显示已完成任务加载中切换
          item['toggle'] = false
          item.disableDrag = false
        })
        this.preventAnimation = true
        setTimeout(() => {
          this.preventAnimation = false
        }, 1000)
        // 处理数据加上一些定义的字段
        this.taskGroups = this.dealData(_taskGroups)
        // console.log(this.taskGroups)
        // hasData判断有没有数据
        // this.hasData = this.taskGroups && this.taskGroups.filter(group => group.tasks && group.tasks.length > 0).length > 0
        this.hasData = this.taskGroups.length > 1
      }).catch(e => { if (resolve) resolve() })
      if (!resolve) {
        this.loading = tasksPromise
      }
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
              task.disableDrag = false
            })
          }
        })
      }
      return taskGroups
    },
    // 传递任务的数组，处理任务的数据
    dealGroupData (tasks) {
      tasks.forEach(task => {
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
        task.disableDrag = false
      })
      return tasks
    },
    // 查询任务组和任务
    queryGroupAndTask (_taskGroups) {
      return MatterService.getGroupAndTask(this.matterId, this.statusType, this.page.pageIndex, this.page.pageSize).then(res => {
        // 得知页码的总数（可以计算分几页）
        this.page.count = res.data.count
        // _taskGroups = _.cloneDeep(res.data.data)
        _taskGroups.push(...res.data.data)
      })
    },
    // 查询关注的任务
    queryFavoriteTasks (_taskGroups) {
      return MatterService.getFavoriteTasks(this.matterId, this.statusType, 1, PAGE.UN_FINISH_FAVORITE_TASKS_NUM).then(res => {
        // 构建关注的任务组以及任务(如果没有任务也构建任务组)
        const FavoriteTasks = {
          name: '我关注的',
          unfinishedTaskCount: res.data.unfinishedTaskCount,
          finishedTaskCount: res.data.finishedTaskCount,
          tasks: res.data.tasks.data,
          matterId: this.matterId,
          id: GUANZHU
        }
        // 将关注的任务组添加到
        _taskGroups.unshift(FavoriteTasks)
        // taskGroups.find(group => group.value === 'favorite').tasks = res.data.data && res.data.data.length > 0 ? res.data.data : null
      })
    },
    tāsksSum () {
      this.tasksSumTotal = 0
      this.taskGroups.forEach(item => {
        // item.tasks 是可能为null的
        if (Array.isArray(item.tasks)) {
          this.tasksSumTotal += item.tasks.length
        }
      })
      // console.log(this.tasksSumTotal)
      // (+1000)
      if (this.tasksSumTotal > PAGE.REMINDER_TASK_SNUM) {
        postMessage.toast({
          msg: '您好！你的任务数已到达1000条，为了更好的用户体验，请隐藏已完成的任务',
          type: 'warning',
          timeout: 5000
        })
      }
    },
    loadMore (taskGroup) {
      if (taskGroup.id !== GUANZHU) {
        // 加载更多每次加载100条 (100)
        MatterService.getTaskListsByGroup(this.matterId, taskGroup.id, TASK_STATUS.FINISHED.value, taskGroup.pageIndex, PAGE.COMMON_TASK_LOAD_NUM).then(res => {
          this.taskGroups.forEach(item => {
            if (item.id === taskGroup.id) {
              if (Array.isArray(item.tasks)) {
                item.tasks.push(...res.data[0].tasks.data.sort(sortRule[item.sort]))
              } else {
                // item.tasks === null时
                item.tasks = res.data[0].tasks.data.sort(sortRule[item.sort])
              }
              // 任务数超过1000的提示
              this.tāsksSum()
              // 判断这次加载的任务数，如果等于100，就认为还有已完成的任务,出现加载更多的按钮 (100)
              if (res.data[0].tasks.data.length >= PAGE.COMMON_TASK_LOAD_NUM) {
                item.isBeyondTwoHundred = true
                item.pageIndex++
              } else {
                // 如果加载完成
                item.isBeyondTwoHundred = false
              }
            }
          })
        })
      } else {
        MatterService.getFavoriteTasks(this.matterId, TASK_STATUS.FINISHED.value, taskGroup.pageIndex, PAGE.FAVORITE_TASKS_LOAD_NUM).then(res => {
          // 将请求回来以关注的已完成的添加到后面
          this.taskGroups[0].tasks.push(...res.data.tasks.data)
          // 任务数超过1000的提示
          this.tāsksSum()
          // 判断关注的（100）
          if (res.data.tasks.data.length >= PAGE.FAVORITE_TASKS_LOAD_NUM) {
            this.taskGroups[0].isBeyondTwoHundred = true
            this.taskGroups[0].pageIndex++
          } else {
            // 如果加载完成
            this.taskGroups[0].isBeyondTwoHundred = false
          }
        })
      }
    },
    toggleCompleted (groupId, toggleText, groupIndex) {
      if (toggleText === '显示') {
        for (let item of this.taskGroups) {
          if (item.id === groupId) {
            // 如果已完成任务数为 0 就不发送请求了
            if (item.finishedTaskCount === 0) {
              return false
            }
            item.toggle = true
            break
          }
        }
        if (groupId !== GUANZHU) {
          // let _groupIndex = groupIndex - 1
          // this.$refs.SortGroup[_groupIndex].$refs.groupContent.$refs.loading.style.display = 'inline-block'
          // this.$refs.SortGroup[_groupIndex].$refs.groupContent.$refs.finishedTask.style.display = 'none'
          // (+200)
          MatterService.getTaskListsByGroup(this.matterId, groupId, TASK_STATUS.FINISHED.value, 1, PAGE.COMMON_TASK_SHOW_FINISHED_NUM).then(res => {
            if (res.isSuccess) {
              this.taskGroups.forEach(item => {
                if (item.id === groupId) {
                  if (Array.isArray(item.tasks)) {
                    item.tasks.push(...res.data[0].tasks.data.sort(sortRule[item.sort]))
                  } else {
                    item.tasks = res.data[0].tasks.data.sort(sortRule[item.sort])
                  }
                  // 任务数超过1000的提示
                  this.tāsksSum()
                  // 判断这次加载的任务数，如果等于200，就认为还有已完成的任务,出现加载更多的按钮 (200)
                  if (res.data[0].tasks.data.length >= PAGE.COMMON_TASK_SHOW_FINISHED_NUM) {
                    item.isBeyondTwoHundred = true
                  }
                  item.toggle = false
                  // this.$refs.SortGroup[_groupIndex].$refs.groupContent.$refs.loading.style.display = 'none'
                  // this.$refs.SortGroup[_groupIndex].$refs.groupContent.$refs.finishedTask.style.display = 'inline-block'
                }
              })
            }
          })
        } else {
          // 关注的
          // this.$refs.group.$refs.groupContent.$refs.loading.style.display = 'inline-block'
          // this.$refs.group.$refs.groupContent.$refs.finishedTask.style.display = 'none'
          // (200)
          MatterService.getFavoriteTasks(this.matterId, TASK_STATUS.FINISHED.value, 1, PAGE.FAVORITE_TASKS_SHOW_FINISHED_NUM).then(res => {
            // 将请求回来以关注的已完成的添加到后面
            this.taskGroups[0].tasks.push(...res.data.tasks.data)
            // 任务数超过1000的提示
            this.tāsksSum()
            // 判断关注的（200）
            if (res.data.tasks.data.length >= PAGE.FAVORITE_TASKS_SHOW_FINISHED_NUM) {
              this.taskGroups[0].isBeyondTwoHundred = true
            }
            this.taskGroups[0].toggle = false
            // this.$refs.group.$refs.groupContent.$refs.loading.style.display = 'none'
            // this.$refs.group.$refs.groupContent.$refs.finishedTask.style.display = 'inline-block'
          })
        }
      } else {
        this.taskGroups.forEach(item => {
          if (item.id === groupId) {
            item.pageIndex = groupId === GUANZHU ? PAGE.FAVORITE_TASKS_PAGEINDEX() : PAGE.COMMON_TASK_PAGEINDEX()
            item.isBeyondTwoHundred = false
            // 只显示未完成的
            if (Array.isArray(item.tasks)) {
              item.tasks = this.stateFilter(item.tasks, UN_FINISH)
            }
          }
        })
      }
    },
    getOpenTaskDetailGroupId (taskGroupId) {
      this.originalGroupId = taskGroupId
    }
  },
  watch: {
    '$store.state.matter.isUpdateTaskLists' (curVal, oldVal) {
      if (curVal === true) {
        this.queryTasks()
        this.changeText()
        // console.log('==================================')
        // 从新查询数据后,需要将store的值改为false,已满足下一次导入项目模板后的刷新
        this.$store.commit('updateTasksList', false)
      }
    },
    '$store.state.task.refresh' () {
      this.queryTasks()
      this.changeText()
    },
    // 当关闭任务详情时触发任务详情更新
    '$store.state.task.update' (after) {
      let task = this.$store.state.task.data
      this.taskGroups.forEach(item => item.tasks && item.tasks
        .filter(subItem => subItem.id === task.id)
        .forEach(subItem => Object.assign(subItem, task))
      )
      // 说明重新移动了任务组
      if (this.originalGroupId !== task.taskGroupId) {
        // 此时关注中的不用管，只把任务中的删除掉
        for (let item of this.taskGroups) {
          if (Array.isArray(item.tasks) && item.tasks.length !== 0 && item.id !== GUANZHU) {
            item.tasks = item.tasks.filter(subItem => subItem.id !== task.id)
          }
          if (item.id === this.originalGroupId) {
            item.unfinishedTaskCount--
          }
        }
        this.queryGroupByGroupId(this.$store.state.task.data.taskGroupId)
      }
    },
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
  .prevent-animation {
    .task-fade-enter-active {
      animation: none;
    }
    .task-fade-leave-active {
      animation: none;
    }
  }
  .matter__task {
    min-height: 900px;
    width: 60.5rem;
    padding: 0 1rem 6.54rem;
    margin: auto;
    .matter__task__header {
      @include flex(row, flex-start, center);
      position:relative;
      padding-bottom: 1.25rem;
      .ibass-trig-down {
        @extend %f-extra-small;
        margin-left: 5px;
      }
      [class*=ib__task-filter-]{
          margin-right: 20px;
      }
      .hater__opearte {
        @extend %f-half;
        @include flex(row,center,center);
        position: absolute;
        right: 1.5rem;
        [class*=ibass] {
          @extend %f-small;
          margin-left: 20px;
        };
        .header__group-collapse, .header__clear, .header__search {
          @include flex(row,center,center);
          @extend %f-small;
          transition: all 0.2s;
          // &:hover {
          //   color: $color-black;
          // }
          .ibass-search, .ibass-minus-square, .ibass-delete {
            margin-right:0.5rem;
            color: $theme-color-light;
          }
        }
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
            position: absolute;
            top: 7px;
            left: -14px;
          }
          .i-close-module {
            position: absolute;
            top: 5px;
            right: 6px;
            background-color: #909090;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            .ibass-close{
              color: $color-white;
              position: absolute;
              top: 1px;
              left: -19px;
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
          .search__input__blur {
            width: 0;
            transition: .3s all;
          }
        }
        .header__new__construction {
          @include flex(row,center,center);
          @extend %f-small;
          transition: all 0.2s;
          // &:hover {
          //   color: $theme-color-light;
          // }
          .ibass-add{
            margin-right:0.5rem;
            color: $theme-color-light;
          }
          .ib__status-selector{
            @include ib__status-selector(130px);
          }
        }
        .header_more {
          @include flex(row,center,center);
          @extend %f-small;
          transition: all 0.2s;
          // &:hover {
          //   color: $theme-color-light;
          // }
          .ibass-ellipses{
            margin-right:0.5rem;
            color: $theme-color-light;
          }
          .ib__status-selector{
            @include ib__status-selector(130px);
            .ibass-arrow-right{
              position: absolute;
              right: 6px;
            }
          }
          .ib__title{
            position: relative;
            line-height: 36px;
            @extend %f-extra-small;
            @extend %f-half;
            color: $color-white;
            .title{
              cursor: text;
              display: block;
              width: 68%;
              margin: 0 auto;
              text-align: center;
            }
            .ibass-arrow-left{
              @extend %f-small;
              display: block;
              position: absolute;
              left: -15px;
              top: 2px;
              width: 26px;
            }
          }
          // .ic__dropdown__menu {
          //   &:before,
          //   &::after {
          //     left: auto;
          //     right: 30%;
          //     transform: translate(0, -100%);
          //   }
          // }
        }
      }
      .ib__task-filter-status {
        @extend %f-small;
        @extend %color-text-primary ;
        margin-left: 16px;
        color: $color-text-light;
        line-height: 28px;
        .ibass-trig-down {
          color: $color-bd-light;
          position: relative;
          top: 2px;
        }
        .ib__status-selector{
          @include ib__status-selector(6.25rem);
        }
      }
    }
    .matter__task__list {
      .ib__create__task__and__delete__task__group{
        color: $color-text-light;
        @extend %f-small;
        @extend %f-half;
        line-height: 2.5rem;
        position: relative;
        top: 2px;
        .ib__task__group__restart{
          &::before {
            position: relative;
            color: $theme-color;
            top: 2px;
            right: 6px;
          }
        }
        .ib__create__task{
          // position: absolute;
          // right: 56px;
          // top: 0;
          float: right;
          width: 90px;
          &::before{
            position: relative;
            right: 5px;
            top: 2px;
            color: $theme-color;
          }
        }
        .ib__sort__task{
          // position: absolute;
          // right: 150px;
          // top: 0;
          float: right;
          width: 90px;
          .ibass-sort::before{
            position: relative;
            right: 5px;
            top: 2px;
            color: $theme-color;
          }
        }
        .ib__more{
          float: right;
          width: 48px;
          .ibass-ellipses {
            &::before{
              padding-right: 6px;
              vertical-align: middle;
              color: $theme-color;
            }
          }
          .ib__more__operate {
            color: $color-white;
            padding: 10px 0;
            &::before{
              content: ' ';
              width: 0;
              height: 0;
              border: 10px solid $color-bg-normal;
              position: absolute;
              top: -20px;
              left: 45px;
              border-top-color: transparent;
              border-right-color: transparent;
              border-left-color: transparent;
            }
            .ib__more__option__item {
              @extend %f-weight-normal;
              width: 80px;
              @extend %f-extra-small;
              padding: 0 15px;
              height: 36px;
              line-height: 36px;
              &:hover {
                background: $color-black;
              }
            }
          }
        }
        .ib__sort__operate {
          color: $color-white;
          padding: 10px 0;
          &::before{
            content: ' ';
            width: 0;
            height: 0;
            border: 10px solid $color-bg-normal;
            position: absolute;
            top: -20px;
            left: 65px;
            border-top-color: transparent;
            border-right-color: transparent;
            border-left-color: transparent;
          }
          .ib__sort__operate__item {
            @extend %f-weight-normal;
            width: 120px;
            @extend %f-extra-small;
            padding: 0 15px;
            height: 36px;
            line-height: 36px;
            &:hover {
              background: $color-black;
            }
            .ibass-done {
              color: $theme-color;
              float: right;
            }
          }
        }
        .ibass-delete{
          position: relative;
          top: 2px;
          @extend %f-giant;
          color: $theme-color-lighter;
        }
        .ib__group__attendees {
          position: absolute;
          right: 175px;
          top: 38px;
          .ib__group__attendees__operate{
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
            .ib__group__attendees__confirm {
              width: 5rem;
              height: 1.125rem;
            }
          }
          &::before {
            content: ' ';
            display: block;
            position: absolute;
            width: 0px;
            height: 0px;
            border: 15px solid #ffffff;
            border-top-color: transparent;
            border-right-color: transparent;
            border-left-color: transparent;
            top: -24px;
            left: 130px;
            z-index: 3000;
          }
          &::after {
            content: ' ';
            display: block;
            position: absolute;
            width: 0px;
            height: 0px;
            border: 15px solid $color-bd-extra-light;
            border-top-color: transparent;
            border-right-color: transparent;
            border-left-color: transparent;
            top: -26px;
            left: 130px;
            z-index: 2000;
          }
        }
      }
      .ib__task__group__no__tasks{
        @extend %f-small;
        position: relative;
        display: flex;
        height: 50px;
        box-shadow: inset 0 -1px 0 0 #eeeeee;
        line-height: 50px;
        padding: 0 15px;
        color: $color-text-placeholder;
        &:hover {
          box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.15);
        }
        .ib__no__task {
          padding: 0 15px;
        }
        .ib__new__create{
          color: $theme-color;
        }
        .ibass-task-check{
          position: absolute;
          right: 160px;
          top: 4px;
          font-size: 20px;
          color:$color-bd-light;
        }
        .ib__done{
          position: absolute;
          right: 10px;
        }
        .ibass-done{
          position: absolute;
          right: 60px;
          &::before{
            position: relative;
            top: 2px;
            color: $theme-color;
            margin-right: 10px;
          }
        }
      }
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
    .matter__task__pagination {
      display: flex;
      justify-content: flex-end;
      padding: 2rem 0 0;
    }
    .matter__task__list__none {
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

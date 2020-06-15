/**
 * 和父页面通信
 */
// const path = require('path')

// const env = process.env.NODE_ENV
const MESSAGE_TYPE = {
  STATE_GO: 'stageGo',
  OPEN_TASK_DETAIL: 'openTaskDetail',
  CREATE_TASK: 'createTask',
  EXPORT_TASK_TO_CALENDAR: 'exportTaskToCalendar',
  VIEW_NEW_TASK_IN_LIST: 'viewNewTaskInList',
  RESET_TASK_TIME: 'updateTimeConfirm',
  NOTICE_CENTER: 'noticeCenter',
  TOAST: 'toast',
  SENDUSERINFO: 'sendUserInfo',
  SETISREFRESH: 'setIsRefresh',
  LOCATION_SEARCH: 'locationSearch',
  DELETE_TASK_CONFIRM: 'deleteTaskConfirm',
  OPEN_TASK_COPY_PANEL: 'openTaskCopyPanel',
  CLEAR_DELETED_TASK: 'clearDeletedTask',
  EXPORT_TASK_LISTS: 'exportTaskLists',
  IMPORT_TASK_LIST_FROM_TEMPLATE: 'importTaskListFromTemplate',
  INIT_PERMISSION: 'initPermission',
  IMPORT_TASK_LIST_FROM_GROUP: 'importTaskListFromGroup',
  DELETE_REPEAT_TASK_CONFIRM: 'deleteRepeatTaskConfirm',
  CDELETE_TASK_GROUP: 'deleteTaskGroup',
  FINISHED_ALL_CONFIRM: 'finishedAllConfirm',
  TO_CLOCK_REFRESH: 'toClockRefresh'
}
// const parentURL = window.parent.location
const parentWindow = window.parent

function handlerPostMessage (message) {
  parentWindow.$$messageManage(message)
}
const messageManager = {
  /**
   * 父页面的路由跳转
   * 第二个参数 callback 传递 state.go 的路由参数
   */
  stateGo: (url, config) => {
    const message = {type: MESSAGE_TYPE.STATE_GO, content: url, callback: config}
    handlerPostMessage(message)
  },
  // 打开任务详情
  openTaskDetail: (taskId, isFromTask) => {
    const message = {type: MESSAGE_TYPE.OPEN_TASK_DETAIL, content: {taskId, isFromTask}}
    handlerPostMessage(message)
  },
  // 新建任务弹窗
  createTask: (message = {}, cb = () => {}) => {
    const _message = {type: MESSAGE_TYPE.CREATE_TASK, content: message, callback: cb}
    handlerPostMessage(_message)
  },
  // 删除任务组
  deleteTaskGroup: (message = {}, cb = () => {}) => {
    const _message = {type: MESSAGE_TYPE.CDELETE_TASK_GROUP, content: message, callback: cb}
    handlerPostMessage(_message)
  },
  // 导出任务到其他日历
  exportTaskToCalendar: () => {
    const message = {type: MESSAGE_TYPE.EXPORT_TASK_TO_CALENDAR, content: ''}
    handlerPostMessage(message)
  },
  // 查看新任务
  viewNewTaskInList: taskIds => {
    const message = {type: MESSAGE_TYPE.VIEW_NEW_TASK_IN_LIST, content: taskIds}
    handlerPostMessage(message)
  },
  // 修改任务的时间
  resetTaskTime: (params, cb) => {
    const message = {type: MESSAGE_TYPE.RESET_TASK_TIME, content: params, callback: cb}
    handlerPostMessage(message)
  },
  // 通知中心事件通信
  noticeCenterCommunication (content, callback) {
    const message = {type: MESSAGE_TYPE.NOTICE_CENTER, content: content, callback: callback}
    handlerPostMessage(message)
  },
  toast (content, callback) {
    const message = {type: MESSAGE_TYPE.TOAST, content: content, callback: callback}
    handlerPostMessage(message)
  },
  sendUserInfo (content) {
    const message = {type: MESSAGE_TYPE.SENDUSERINFO, content}
    handlerPostMessage(message)
  },
  setIsRefresh (isRefresh) {
    const message = {type: MESSAGE_TYPE.SETISREFRESH, content: {isRefresh}}
    handlerPostMessage(message)
  },
  locationSearch (params) {
    const message = {type: MESSAGE_TYPE.LOCATION_SEARCH, content: params}
    handlerPostMessage(message)
  },
  deleteTaskConfirm (content, callback) {
    const message = {type: MESSAGE_TYPE.DELETE_TASK_CONFIRM, content: content, callback: callback}
    handlerPostMessage(message)
  },
  finishedAllConfirm (content, callback) {
    const message = {type: MESSAGE_TYPE.FINISHED_ALL_CONFIRM, content: content, callback: callback}
    handlerPostMessage(message)
  },
  deleteRepeatTaskConfirm (content, callback) {
    const message = {type: MESSAGE_TYPE.DELETE_REPEAT_TASK_CONFIRM, content: content, callback: callback}
    handlerPostMessage(message)
  },
  openTaskCopyPanel (taskId, callback) {
    const message = {type: MESSAGE_TYPE.OPEN_TASK_COPY_PANEL, content: taskId, callback: callback}
    handlerPostMessage(message)
  },
  // 清除已删除任务
  clearDeletedTask (callback) {
    const message = {type: MESSAGE_TYPE.CLEAR_DELETED_TASK, callback: callback}
    handlerPostMessage(message)
  },
  // 导出任务列表
  exportTaskLists () {
    const message = {type: MESSAGE_TYPE.EXPORT_TASK_LISTS, content: ''}
    handlerPostMessage(message)
  },
  // 从项目模板导入
  importTaskListFromTemplate () {
    const message = {type: MESSAGE_TYPE.IMPORT_TASK_LIST_FROM_TEMPLATE, content: ''}
    handlerPostMessage(message)
  },
  // 权限验证
  initPermission (message = {}, cb = () => {}) {
    const _message = {type: MESSAGE_TYPE.INIT_PERMISSION, content: message, callback: cb}
    handlerPostMessage(_message)
  },
  importTaskListFromGroup: (message = {}, cb = () => {}) => {
    const _message = {type: MESSAGE_TYPE.IMPORT_TASK_LIST_FROM_GROUP, content: message, callback: cb}
    handlerPostMessage(_message)
  },
  // 同步通知计时
  toClockRefresh () {
    handlerPostMessage({ type: MESSAGE_TYPE.TO_CLOCK_REFRESH })
  }
}

export default messageManager

import {TASK_DETAIL} from '@/utils/constants'
export default {
  /**
   *
   * 日历任务查询接口（负责的，创建的，关注的）
   * @param {请求参数} params
   * @param {responsible:我负责的（默认），created:我创建的，favorite:我关注的} type
   */
  getCalendarTask (params = {}) {
    const url = `/taskserver/api/v1/tasks/calendar/responsibleTasks`
    return request.post(url, params)
  },
  /**
   * 项目下日历任务查询接口
   * @param {*} params
   */
  getMatterCalendarTask (params = {}) {
    const url = `/taskserver/api/v1/tasks/calendar/matterTasks`
    return request.get(url, params)
  },
  /**
   * 修改任务的起止时间
   * 只设置非重复任务和日程
   * @param {Object} params
   */
  resetTaskTime (params) {
    const url = `/taskserver/api/v1/tasks/${params.id}/time`
    params.effectRepeats = false
    return request.put(url, params)
  },
  /**
   * 查询所选用户负责的任务的项目列表
   * @param {userIds} params 负责人的id
   */
  getMattersByTaskAttendees (params = {}) {
    return request.post('/taskserver/api/v1/tasks/getMattersByTaskAttendees', params)
  },
  /**
   * 查询当前用户负责的任务的项目列表
   */
  getMyMattersByResponsible () {
    return request.get('/taskserver/api/v1/tasks/getMattersByMyTaskAttendees')
  },
  /**
   * 查询当前用户创建的任务的项目列表
   */
  getMyMattersByCreated () {
    return request.get('/taskserver/api/v1/tasks/getMattersByMyCreatedTasks')
  },
  /**
   * 查询当前用户关注的任务的项目列表
   */
  getMyMattersByFavorite () {
    return request.get('/taskserver/api/v1/tasks/getMattersByMyFavoriteTasks')
  },
  /**
   * 修改任务状态
   * @param {*} taskId
   * @param {*} state
   */
  changeTaskState (taskId, state) {
    const url = `/taskserver/api/v1/tasks/${taskId}/${state === TASK_DETAIL.STATE_FINISHED ? 'finish' : 'restart'}`
    return request.put(url, {})
  },
  /**
   * 获取我的任务（负责的、创建的、关注的）所在的项目
   */
  getMyMattersByTaskAttendees () {
    return request.get('/taskserver/api/v1/tasks/getMyMattersByTaskAttendees')
  },
  /**
   * 查询我的项目（负责的、创建的、关注的）
   */
  getMyTasks (params = {}) {
    return request.post('/taskserver/api/v1/tasks/calendar/myTasks', params)
  },
  /**
   * 查询关注的任务列表
   * @param {*} params 查询条件
   */
  queryFollowedTasks (params) {
    return request.post('/taskserver/api/v1/tasks/favoriteTasks', params)
  },
  /**
   * 查询新任务列表
   */
  queryNewTasks () {
    return request.get('/taskserver/api/v1/tasks/newtasks', {})
  },
  /**
   * 查询我的列表信息
   * @param {*} params 查询条件
   */
  queryMyTaskForList (params) {
    return request.post('/taskserver/api/v1/tasks/myTasks', params)
  },
  /**
   * 查询我负责的任务列表
   * @param {*} params 查询条件
   */
  queryResponsibleTasks (params) {
    return request.post('/taskserver/api/v1/tasks/responsibleTasks', params)
  },
  /**
   * 更新任务的负责人
   * @param {*} obj 传递对象
   */
  updateTaskAttendees (taskId, obj) {
    return request.put(`/taskserver/api/v1/tasks/${taskId}/attendee`, obj)
  },
  /**
   * 查询当前用户设置的提醒数据
   */
  querySettingRemind () {
    return request.get('/taskserver/api/v1/tasks/setting/remind')
  },
  /**
   * 获取任务提醒设置
   * @param {*} taskId 任务id
   */
  queryTaskRemind (taskId) {
    return request.get(`/taskserver/api/v1/tasks/${taskId}/remind`)
  },
  /**
   * 删除任务
   * @param {*} taskId  任务id
   */
  deleteTask (taskId, effectRepeats) {
    return request.delete(`/taskserver/api/v1/tasks/${taskId}?effectRepeats=${effectRepeats}`)
  },
  /*
   * 创建任务
   * @param {*} obj 任务对象
   */
  createTask (obj) {
    return request.post(`/taskserver/api/v1/tasks/`, obj)
  },
  /**
   * 完成当前任务
   * @param {*} taskId 任务ID
   */
  finishTask (taskId) {
    return request.put(`/taskserver/api/v1/tasks/${taskId}/finish`)
  },
  /**
   * 重启任务
   * @param {*} taskId 任务Id
   */
  restartTask (taskId) {
    return request.put(`/taskserver/api/v1/tasks/${taskId}/restart`)
  },
  /**
   * 恢复任务
   * @param {*} taskId 任务Id
   * @param {*} recoverParent 是否恢复任务组
   */
  recoverTask (taskId, recoverParent) {
    return request.put(`/taskserver/api/v1/tasks/${taskId}/recover?recoverParent=${recoverParent}`)
  },
  /**
   * 清空任务时间
   * @param {*} taskId 任务Id
   * @param {*} effectRepeats 是否影响重复
   */
  emptyTaskTime (taskId, effectRepeats) {
    return request.delete(`/taskserver/api/v1/tasks/${taskId}/time?effectRepeats=${effectRepeats}`)
  },
  /**
   * 更新任务时间
   * @param {*} taskId 任务ID
   * @param {*} obj 参数
   */
  editTaskTime (taskId, obj) {
    return request.put(`/taskserver/api/v1/tasks/${taskId}/time`, obj)
  },
  /**
   * 设置提醒时间
   * @param {*} taskId 任务ID
   * @param {*} obj 提醒数据
   */
  setTaskRemind (taskId, obj) {
    return request.post(`/taskserver/api/v1/tasks/${taskId}/remind`, obj)
  },
  /**
   * 设置任务重复
   * @param {*} taskId 任务ID
   * @param {*} obj 重复数据
   */
  setTaskRepeat (taskId, obj) {
    return request.put(`/taskserver/api/v1/tasks/${taskId}/repeat`, obj)
  },
  /**
   * 更新任务重复
   * @param {*} taskId 任务ID
   * @param {*} obj 重复数据
   */
  updateTaskRepeat (taskId, obj) {
    return request.put(`/taskserver/api/v1/tasks/${taskId}/repeatRule`, obj)
  },
  /**
   * 根据项目Id清空任务数据
   * @param {*} matterIds 项目Id
   */
  clearMyTaskByMatterIds (matterIds) {
    return request.post(`/taskserver/api/v1/tasks/clearMyTask`, {matterIds})
  }
}
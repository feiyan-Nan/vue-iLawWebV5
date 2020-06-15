export default{
  /**
   * 获取工作类型
   * @param {*} id
   * @param {*} state
   */
  getWorkType (id = '', state = 1) {
    return request.get(`/matterserver/api/v2/workType/workTypes/list/v2?matterId=${id}&state=${state}`)
  },
  /**
   * 获取项目组以及组下的任务
   * @param {*} matterId 项目id
   * @param {*} statusType 状态()
   * @param {*} pageIndex 第几页开始
   * @param {*} pageSize 每页多少条
   */
  getGroupAndTask (matterId = '', statusType = 1, pageIndex = 1, pageSize = 500) {
    return request.get(`/taskserver/api/v1/tasks/listTaskByMatter?matterId=${matterId}&pageIndex=${pageIndex}&pageSize=${pageSize}&statusType=${statusType}`)
    // /taskserver/api/v1/tasks/matterTasks/simpleInfo  新
    // /taskserver/api/v1/tasks/listTaskByMatter
  },
  /**
   * 通过项目id获取项目信息
   * @param {*} matterId 项目id
   */
  getMatterByMatterId (matterId = '') {
    return request.get(`/ilaw/api/v1/matters/${matterId}`)
  },
  /**
   * 获取关注任务
   * @param {*} params 查询条件
   */
  getFavoriteTasks (matterId, statusType, pageIndex = 1, pageSize = 200) {
    return request.get(`/taskserver/api/v1/tasks/myFavoriteTasks?matterId=${matterId}&statusType=${statusType}&pageIndex=${pageIndex}&pageSize=${pageSize}`)
  },
  /**
   * 组内移动任
   * @param {*} taskId 任务Id
   * @param {*} destTaskId 目标任务Id
   */
  moveTaskNoCrossGroup (taskId, destTaskId) {
    return request.put('/ilaw/api/v2/tasks/' + taskId + '/move', { targetId: destTaskId })
  },
  /**
   * 移动任务Cross任务组
   * @param {*} taskId 任务Id
   * @param {*} destTaskId 目标任务Id
   * @param {*} destGroupId 目标任务组Id
   * @param {*} effectRepeats 是否是重复任务
   */
  moveTaskCrossGroup (taskId, destTaskId, destGroupId, effectRepeats) {
    const params = {
      taskGroupId: destGroupId,
      targetId: destTaskId,
      effectRepeats: effectRepeats
    }
    return request.put('/taskserver/api/v1/tasks/' + taskId + '/taskGroup', params)
  },
  /**
   * 移动任务组
   * @param {*} taskGroupId 任务组Id
   * @param {*} destGroupId 目标任务组Id
   */
  moveTaskGroup (taskGroupId, destGroupId) {
    const params = {
      targetId: destGroupId
    }
    return request.put('/ilaw/api/v2/taskgroups/' + taskGroupId + '/move', params)
  },
  /**
   * 更改任务组的名称
   * @param {*} groupId 组id
   * @param {*} params 新的名
   */
  changeGroupName (groupId, params) {
    return request.put(`/ilaw/api/v2/taskgroups/${groupId}`, params)
  },
  /**
   * 将任务组标记为已完成 或者取消完成操作
   * @param {*} params 任务组 id state: Boolean valid: Boolean
   */
  changeTaskGroupStatus (params) {
    return request.put(`/ilaw//api/v2/taskflow`, params)
  },
  /**
   * 将删除的任务组恢复，同时如果有任务，也恢复
   * @param {*} groupId 任务组id
   */
  recoverDeleteTaskGroup (groupId) {
    return request.put(`/taskserver/api/v1/taskgroups/${groupId}/recover?recoverChild=true`)
  },
  /**
   * 清空所有已经删除的
   * @param {*} matterId 项目id
   */
  clearDeletedTask (matterId) {
    return request.delete(`/taskserver/api/v1/tasks/clearMatterTask?matterId=${matterId}`)
  },
  /**
   * 通过项目ID任务组ID，获取任务组下的任务以及任务组
   */
  getTaskListsByGroup (matterId = '', taskGroupId = '', statusType = '1', pageIndex = '1', pageSize = '200') {
    return request.get(`/taskserver/api/v1/tasks/listTaskByMatterV2?matterId=${matterId}&taskGroupId=${taskGroupId}&statusType=${statusType}&pageIndex=${pageIndex}&pageSize=${pageSize}`)
  },
  /**
   * 将未完成的任务组和任务一块修改为已完成的，
   * @param {*} taskGroupId 任务组id
   */
  changeAllToFinished (taskGroupId) {
    return request.put(`/taskserver/api/v1/taskgroups/${taskGroupId}/finish`)
  },
  /**
   * 将已完成的任务组修改为未完成
   * @param {*} taskGroupId 任务组id
   */
  restartFinishedTaskGroup (taskGroupId) {
    return request.put(`/taskserver/api/v1/taskgroups/${taskGroupId}/restart?restartChild=true`)
  },
  // /taskserver/api/v1/taskgroups/fsv/addAttendee?userIds=a
  /**
   * 批量分配
   * @param {*} taskGroupId 任务组id
   * @param {*} userIds 用户id的集合
   */
  batchAddAttendee (taskGroupId, userIds) {
    return request.post(`/taskserver/api/v1/taskgroups/${taskGroupId}/addAttendee?userIds=${userIds}`)
  }
}
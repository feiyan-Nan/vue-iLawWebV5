import objUtil from '@/utils/object'
export default{
  /**
     * 获取项目成员
     * @param {*} params
     */
  getAttorney (params = {}) {
    return request.get('ilaw/api/v1/matters/attorney', params)
  },
  /**
 * 查询用户能见的用户列表
 */
  searchByCreateUserId () {
    // return request.get('ilaw/api/v2/taskflow/member/serachByCreateUserId')
    return request.get('/ilaw/api/v1/auth/get/members')
  },
  /**
   * 获取正在进行的计时
   */
  getTiming () {
    return request.get('/ilaw/api/v2/timing/timing/getRunningTiming', {})
  },
  /**
   * 开始项目计时
   * @param {*} params
   */
  startTiming (params) {
    // var paramsOption = ['name', 'matterPkId', 'taskPkId', 'workTypeId', 'startTime', 'manual']
    const clientId = objUtil.getBrowser() + new Date().getTime()
    const queryStr = objUtil.buildQuery(params)
    const url = `/ilaw/api/v2/timing/timing/startTiming?clientId=${clientId}&${queryStr}`
    return request.post(url, {})
  },
  /**
   * 结束项目计时
   * @param {*} pkId 计时ID
   */
  stopTiming (pkId) {
    const clientId = objUtil.getBrowser() + new Date().getTime()
    const url = `/ilaw/api/v2/timing/timing/stopTiming?pkId=${pkId}&clientId=${clientId}`
    return request.post(url, {})
  },
  /**
   * 添加计时
   * @param {*} params
   */
  addTiming (params) {
    const url = '/ilaw/api/v2/timing/timing/add'
    return request.post(url, params)
  },
  /**
   * 作废!!!!!!
   * 完成/重启任务，
   * @param {*} taskId 任务ID
   * @param {*} state 任务需要改变的状态
   */
  changeTaskState (taskId, state) {
    const url = `ilaw/api/v2/tasks/${taskId}/state`
    const obj = { state }
    return request.put(url, obj)
  },
  /**
   * 获取新任务
  */
  getNewTasks () {
    return request.get('/ilaw/api/v2/taskflow/newtasks')
  },
  /**
   *将未读任务设置成已读
   * @param {*} ids： 任务id数组
   */
  setNewTasksReaded (ids) {
    return request.get('/ilaw/api/v2/taskflow/newTaskAfterReadingIs', {ids})
  },
  /**
   * 根据需要查询权限的对象id和权限类型获取权限
   * @param {*} userId 当前用户Id
   * @param {*} subjectid 需要查询对象的id
   * @param {*} type 类型
   */
  queryPermissionBySubject (userId, subjectid, type) {
    return request.get(`/ilaw/api/v2/permission/engine/${userId}/getPmsStrings`, {subjectid, type})
  },
  /**
   * 功能不明 注释待补充
   */
  getToken: function () {
    const url = '/ilaw/api/v2/documents/getToken'
    return request.get(url, {}).then(function () {
      window.localStorage.iFileToken = data.authToken
    })
  },
  getShareToken: function () {
    const url = '/ilaw/api/v2/templates/document/share/repo/read-only'
    return request.get(url, {}).then(function (data) {
      window.localStorage.ProjectTemplateShareToken = data.data.token
      window.localStorage.ShareRepoId = data.data.repoId
    })
  },
  getDefaultLibrary: function () {
    const url = '/ilaw/api/v2/library/mime/default'
    return request.get(url, {}).then(function (data) {
      window.localStorage.defaultLibrary = data.result.repoId
    })
  },
  getOfficeAdmin: function () {
    const url = '/ilaw/api/v2/documents/getOfficeAdmin'
    return request.get(url, {}).then(function (data) {
      window.localStorage.fileofficeUser = data
    })
  },
  /**
   * 获取项目列表信息（项目名/客户名模糊匹配），默认返回关注的项目列表
   * @param {obj} params 查询条件
   */
  searchMatters (params) {
    return request.get(`/ilaw/api/v1/matters/search`, params)
  },
  /**
   * 查询任务组
   * @param {*} params 查询条件
   */
  searchTaskGroup (params) {
    return request.get(`/ilaw/api/v2/taskgroups`, params)
  },
  /**
   * 查询项目下用户
   * @param {*} params 查询条件
   */
  searchMatterUsers (params) {
    return request.get(`/ilaw/api/v1/matters/attorney`, params)
  },
  /**
   * 关注任务
   * @param {*} taskId 任务Id
   */
  attentionTask (taskId) {
    return request.post('/ilaw/api/v2/taskflow/attention', {taskId})
  },
  /**
   * 取消关注
   * @param {*} taskId 任务Id
   */
  cancelAttentionTask (taskId) {
    return request.delete(`/ilaw/api/v2/taskflow/attention/${taskId}`)
  },
  /**
   * 将任务设置为已读
   * @param {*} ids id集合
   */
  readNewTask (ids) {
    return request.put(`/ilaw/api/v2/taskflow/newTaskAfterReadingIs?ids=${ids}`)
  },
  getWorkType (id = '', state = 1) {
    return request.get(`/ilaw/api/v2/timing/matter/workTypes/v2?matterId=${id}&state=${state}`)
  },
  /**
   * 创建任务组
   * @param {*} matterId 项目id
   * @param {*} name 任务组的名称
   */
  createTaskGroup (params) {
    return request.post(`/ilaw/api/v2/taskgroups`, params)
  }
}
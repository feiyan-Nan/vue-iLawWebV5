import store from '@/store/index'
// window.addEventListener('message', receiveMessageHandler)

window.$$messageManage = receiveMessageHandler

function receiveMessageHandler (data) {
  if (!data.type) return
  if (!handler[data.type]) return
  handler[data.type](data)
}

const handler = {
  closeDetailPage: () => store.commit('updateCalendarParams', {}),
  // ilaw计时发生变化的时候，需要更新V5中计时的内容
  changeTiming: data => store.commit('TIMING_SYNC_EDIT', data.content),
  changeTimingRT: data => store.commit('TIMING_SYNC_RT', data.content),
  // 刷新任务列表页面
  refreshTaskList: () => store.commit('refreshTaskList', {}),
  // 更新任务列表单条数据，不刷新页面
  updateTaskItem: data => store.commit('updateTaskItem', data),
  updateTasksList: () => store.commit('updateTasksList', true)
}
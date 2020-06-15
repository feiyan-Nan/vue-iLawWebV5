/**
 * 权限处理统一逻辑类别
 */
import IlawService from '@/vue/service/ilaw'
const TYPE = {
  MATTER: 'MAT'
}
let authorities = {
  MAT: {}
}
export default{
  /**
   * 获取项目权限
   * @param {*} matterId 项目id
   */
  async get (userId, type, id) {
    let res = authorities[type][id] || []
    if (!authorities[type][id]) {
      return IlawService.queryPermissionBySubject(userId, id, type).then(res => {
        authorities[type][id] = res.data || []
        return authorities[type][id]
      })
    }
    return Promise.resolve(res)
  },
  ...TYPE
}

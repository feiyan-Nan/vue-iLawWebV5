export default {
  /**
   * 获取用户信息
   */
  getMe () {
    return request.get('/im/v1/users/me')
  }
}

// 需要永久记录的数据，即不被localStorage.clear()清除
let dbData = {}
// 不能清空的数据的属性名称收到添加到该数组中
let dbDataAttrs = ['loginReturnPage']

export default{
  clearStorage: function () {
    // 清空localstorage之前记录下不能清空的数据
    dbDataAttrs.forEach(function (attr) {
      dbData[attr] = window.localStorage[attr] || ''
    })
    window.localStorage.clear()
    // 还原数据
    Object.assign(window.localStorage, dbData)
  }
}

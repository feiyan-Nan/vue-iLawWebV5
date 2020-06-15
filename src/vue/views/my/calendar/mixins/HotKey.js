/**
 * 日历视图绑定快捷键
 */
const VIEW_KEY_MAP = [{keyCode: 49, view: 'day'}, {keyCode: 50, view: 'week'}, {keyCode: 51, view: 'month'}, {keyCode: 52, view: 'year'}]
const NEXT_KEY_MAP = [{keyCode: 37, view: 'subtract'}, {keyCode: 39, view: 'add'}]
export default {
  methods: {
    listenKeydown () {
      document.addEventListener('keydown', event => {
        this.handleNextKeyBounding(event)
        return this.handleViewKeyBounding(event)
      }, false)
      window.parent.document.addEventListener('keydown', event => {
        this.handleNextKeyBounding(event)
        return this.handleViewKeyBounding(event)
      }, false)
    },
    /**
     * 绑定视图切换
     * @param {*} event
     */
    handleViewKeyBounding (event) {
      let e = event || window.event
      VIEW_KEY_MAP.forEach(item => {
        if ((e.metaKey || e.ctrlKey) && e.keyCode === item.keyCode) {
          this.toggleDateType(item.view)
          e.preventDefault()
          return false
        }
      })
    },
    handleNextKeyBounding (event) {
      let e = event || window.event
      NEXT_KEY_MAP.forEach(item => {
        if ((e.metaKey || e.ctrlKey) && e.keyCode === item.keyCode) {
          this.curDate = moment(this.curDate, 'YYYY-MM-DD')[item.view](1, this.dateType).format('YYYY-MM-DD')
          e.preventDefault()
          return false
        }
      })
    }
  },
  mounted () {
    this.listenKeydown()
  },
}
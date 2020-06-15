/**
 * modal的统一事件处理机制，避免绑定多个keydown事件
 */
let modalManager = {
  _modals: [],
  add (id, el) {
    this._modals.push({id, el})
  },
  remove (id) {
    this._modals = this._modals.filter(modal => id !== modal.id)
  },
  removeAll () {
    this._modals = []
  }
}

window.addEventListener('keydown', (event) => {
  if (event.keyCode === 27) {
    let modal = modalManager._modals.pop()
    if (modal) {
      let el = modal.el
      el.closeDialog && el.closeDialog()
    }
  }
})

export default modalManager
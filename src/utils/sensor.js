/**
 * 埋点
 */
const sensorUtil = {
  track (eventName, options) {
    window.parent.alpha_sa.track(eventName, options)
  }
}

export default sensorUtil
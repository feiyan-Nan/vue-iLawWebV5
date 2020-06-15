/**
 * 月视图中任务列表弹出框的定位、表框radius、动画的设置
 */
import popover from '@/plugin/components/popover/Popover'
export default {
  extends: popover,
  methods: {
    setStyle () {
      const client = this.ev.target.parentNode.getBoundingClientRect()
      this.style = {left: `${client.left - 25}px`, top: `${client.top + client.height - (this.size.height + 156) / 2}px`}
      this.$refs.content.style['border-radius'] = `2px`
    }
  },
  watch: {
    visible (newValue, oldValue) {
      setTimeout(() => {
        this.$refs.content.classList.add('bounceIn')
      }, 0)
    }
  },
}
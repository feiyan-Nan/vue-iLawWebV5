/**
 * 年视图任务列表弹出框的边框radius、定位
 */
import popover from '@/plugin/components/popover/Popover'
export default {
  extends: popover,
  methods: {
    setStyle () {
      const docWidth = document.documentElement.clientWidth
      const client = this.ev.target.parentNode.getBoundingClientRect()
      const left = (docWidth < this.ev.clientX + this.size.width + 10) ? (client.left - this.size.width - 5) : (client.left + client.width + 5)
      this.style = {left: `${left}px`, top: `${client.top - (this.size.height - 24) / 2}px`}
      this.$refs.content.style['border-radius'] = `2px`
    }
  },
}
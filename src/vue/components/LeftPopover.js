/**
 * 年视图任务列表弹出框的边框radius、定位
 */
import popover from '@/plugin/components/popover/Popover'
export default {
  extends: popover,
  methods: {
    setStyle () {
      this.style = {left: `0px`, top: `1.5rem`}
      this.$refs.content.style['border-radius'] = `5px`
    }
  },
}
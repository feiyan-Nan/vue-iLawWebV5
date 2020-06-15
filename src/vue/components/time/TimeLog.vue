<template lang="pug">
  .ib__time-timelog
    .ib__time-timelog__normal(v-if="!timing")
      ic-popover(v-model="visibility"  :scrollable="true" position="bottom")
        .ib__time-timelog-icon(slot="trigger"  :class="{'ib__time-timelog-icon__hidden':!timingSum}")
          i.ibass-timer
          i.ibass-start(:class="{'active': visibility}")
        timer(:taskInfo="taskInfo" @closeTimeLog="closeTimeLog")
      .ib__time-timelog-label.noselect(v-if="timingSum" :class="{'ib__show__time': visibility}") {{timingSum | formatTime}}
    .ib__time-timelog__timing(v-else)
      i.ibass-stop.pointer(@click="stopTiming")
      .ib__time-timelog-icon
        i.ibass-timer
      .ib__time-timelog-label.noselect {{durationRT | formatDuration}}
</template>
<script>
import iLawService from '../../service/ilaw/index.js'
import Timer from './Timer'
import DateUtil from '@/utils/date'

export default {
  components: {Timer},
  props: {
    taskInfo: Object,
  },
  data () {
    return {
      timing: false,
      visibility: false,
      duration: 0,
      tickTackId: null,
      startTime: null,
      isExecuting: false
    }
  },
  computed: {
    timingSum () {
      return this.taskInfo.timingSum || 0
    },
    durationRT () {
      return this.$store.state.time.curTime
    }
  },
  methods: {
    closeTimeLog () {
      this.visibility = false
    },
    async stopTiming () {
      if (this.isExecuting) {
        this.$postMessage.toast({msg: '操作进行中，请稍后...'})
      } else {
        this.isExecuting = true
        const id = this.$store.state.time.timing.pkId
        await iLawService.stopTiming(id)
        this.$store.dispatch('SYNC.TIMING_INITIAL')
        if (this.taskInfo.timing) {
          this.$postMessage.toast({msg: '操作成功', type: 'success'})
        }
        this.isExecuting = false
        this.duration = 0
      }
    },
    tickTack () {
      if (!this.tickTackId) {
        this.tickTackId = setInterval(() => {
          this.duration = moment.duration(moment().valueOf() - this.startTime).asMilliseconds()
        }, 1000)
      }
    }
  },
  filters: {
    formatTime (value) {
      const hour = Math.floor(moment.duration(value).asHours()).toString().padStart(2, '0')
      const minute = moment.duration(value).minutes().toString().padStart(2, '0')
      return `${hour}:${minute}`
    },
    formatDuration (value) {
      const hour = DateUtil.padStartPolyfill(Math.floor(moment.duration(value).asHours()) + '', 2, '0')
      const minute = DateUtil.padStartPolyfill(moment.duration(value).minutes() + '', 2, '0')
      const second = DateUtil.padStartPolyfill(moment.duration(value).seconds() + '', 2, '0')
      return `${hour}:${minute}:${second}`
    }
  },
  mounted () {
    if (this.$store.state.time.timing.taskPkId === this.taskInfo.id) {
      this.timing = true
      this.startTime = this.$store.state.time.timing.startTime
      // this.tickTack()
    }
  },
  watch: {
    '$store.state.time.timing': {
      handler (after) {
        let tempTask = _.cloneDeep(this.taskInfo)
        if (this.taskInfo.id === after.taskPkId) {
          this.timing = true
          tempTask.timing = true
          this.startTime = this.$store.state.time.timing.startTime || Date.now()
          // this.tickTack()
          this.$store.commit('updateTaskItem', {data: tempTask})
        } else if (this.timing) {
          this.timing = false
          this.visibility = false
          this.$store.commit('TIMING_SYNC_RT', null)
          // clearInterval(this.tickTackId)
          // this.tickTackId = null
          if (this.taskInfo.timing) {
            let tempMinute = Math.ceil(moment.duration(Date.now() - this.startTime).asMinutes())
            tempTask.timingSum += moment.duration(tempMinute, 'minutes').asMilliseconds()
            tempTask.timing = false
            this.$store.commit('updateTaskItem', {data: tempTask})
          }
          this.duration = 0
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
  [class*=ibass]{
    &:before{
      // margin-right:0.5rem;
      vertical-align: -.125rem;
    }
  }
  .ib__time-timelog__normal,.ib__time-timelog__timing{
    display: inline-block;
    @include flex(row,flex-start,center);
  }
  .ib__time-timelog-icon{
    margin-right:8px;
    display: inline;
  }
  .ib__time-timelog__normal{
    position: relative;
    .ibass-start{
      display:none;
      color:$theme-color-light;
    }
    .ibass-timer{
      display:inline;
      color:$color-bd-light;
    }
    &:hover,.ib__time-timelog-icon__hidden{
      .ibass-start{
        display: inline;
      }
      .ibass-timer{
        display:none;
      }
    }
    .active{
      display:none;
      visibility: visible;
    }
    /deep/ .ic__popover{
      width:unset;
    }
    .ib__show__time{
      position: absolute;
      top: 0px;
      left: 22px;
    }
  }
  .ib__time-timelog__timing{
    color:$theme-color-light;
    .ibass-stop{
      display:none;
    }
    .ibass-timer{
      display:inline;
    }
    &:hover{
      .ibass-stop{
        display:inline;
      }
      .ibass-timer{
        display:none;
      }
    }
  }
</style>

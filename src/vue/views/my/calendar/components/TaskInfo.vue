<template lang="pug">
.calendar__task-info(@click="stop")
    .calendar__task-info-left
        .ibass-task-check(v-show="task.state === 0" @click="changeTaskState(1)")
        .ibass-done(v-show="task.state === 1" @click="changeTaskState(0)")
    .calendar__task-info-main
        .calendar__task-info-title {{task.name}}
        .calendar__task-info-members
            .calendar__task-info-member(v-for="item in filteredAvatars")
                img.calendar__task-info-avatar(:src="item && item.avatar")
            .calendar__task-info-number(v-if="task.attendees && task.attendees.length>5") {{task.attendees.length}}
        .calendar__task-info-desc(v-if="task.detail") {{task.detail}}
        .calendar__task-info-date
            .calendar__task-info-date-start(v-if="task.startTime") {{getStartTime}}
            .calendar__task-info-date-end   {{getEndTime}}
        .calendar__task-info-button(@click="showDetail")
            ic-button(type="gray") 查看详情
    .calendar__task-info-right(v-show="timingAuth")
        .ibass-trig-right(v-show="runningTaskId !== task.id" @click="startTiming")
        .ibass-stop(v-show="runningTaskId === task.id" @click="stopingTiming")
</template>
<script>
import IlawService from '@/vue/service/ilaw'
import TaskService from '@/vue/service/task'
import AuthorityService from '@/vue/service/authority'
import { TASK_DETAIL, PERMISSIONS } from '@/utils/constants'
export default {
  props: {
    task: {
      type: Object,
      default: function () {
        return {}
      }
    },
  },
  data () {
    return {
      format: this.task.dayType === TASK_DETAIL.DAY_TYPE_ALL ? 'YYYY年M月DD日' : 'YYYY年M月DD日 H:mm',
      timingAuth: false,
      matterAuths: []
    }
  },
  computed: {
    getStartTime () {
      return `${moment(this.task.startTime).format(this.format)} 开始`
    },
    getEndTime () {
      return `${moment(this.task.endTime || this.task.dueTime).format(this.format)} ${this.task.dueTime ? '到期' : '结束'}`
    },
    filteredAvatars () {
      return this.task.attendees ? this.task.attendees.slice(0, 5) : []
    },
    runningTaskId () {
      return this.$store.state.time.timing.taskPkId
    }
  },
  watch: {
    matterAuths (newValue, oldValue) {
      this.timingAuth = this.matterAuths.includes(PERMISSIONS.MAT_MATTER_TIMELOG_ADD) ||
                        (this.task.attendees && this.task.attendees.some(attendee => attendee && attendee.id === this.$store.state.user.user.id)) ||
                        this.task.createUserId === this.$store.state.user.user.id
    }
  },
  methods: {
    startTiming () {
      const obj = {
        taskPkId: this.task.id,
        name: this.task.name,
        workTypeId: this.task.workTypeId,
        matterPkId: this.task.matterId,
        matterName: this.task.matterName
      }
      // 云信通知可能存在延迟，为了避免这种情况，调用getTiming进行查询
      IlawService.startTiming(obj).then(() => {
        this.$store.dispatch('SYNC.TIMING_INITIAL')
      })
    },
    stopingTiming () {
      // 调用停止计时，云信通知将会处理状态的变化
      if (this.$store.state.time.timing.pkId) {
        IlawService.stopTiming(this.$store.state.time.timing.pkId).then(() => {
          this.$store.dispatch('SYNC.TIMING_INITIAL')
        })
      }
    },
    changeTaskState (state) { // 改变任务状态
      TaskService.changeTaskState(this.task.id, state).then(res => {
        // 如果成功，更新任务状态
        this.task.state = state
        // 如果ID一致，那么同时会尝试停止计时
        if (this.$store.state.time.timing.taskPkId === this.task.id) {
          this.stopingTiming()
        }
        this.$emit('finishTask')
      })
    },
    showDetail () {
      this.$postMessage.openTaskDetail(this.task.id)
      this.$emit('close')
    },
    stop (event) {
      event.stopPropagation()
    }
  },
  mounted () {
    const matterId = this.$route.params.matterId
    if (matterId) {
      AuthorityService.get(this.$store.state.user.user.id, AuthorityService.MATTER, matterId).then(res => {
        this.matterAuths = res
      })
    } else {
      this.matterAuths = []
    }
  }
}
</script>
<style lang="scss" scoped>
.calendar__task-info{
    @include flex(row);
    width: 260px;
    padding: 15px;
}
.calendar__task-info-main{
    flex:1;
    width: 211px;
    padding: 0 5px 0 10px;
}

.calendar__task-info-left{
    @extend %f-giant;
    height: 18px;
    margin-top: 2px;
    .ibass-task-check {
      color: $color-text-secondary;
      transition: all .2s;
      cursor: pointer;
    }
    .ibass-done {
      color: $theme-color-light;
      transition: all .2s;
      cursor: pointer;
    }
    &:hover {
      .ibass-task-check, .ibass-done {
        color: $theme-color-lighter;
        transform: scale(1.1)
      }
    }
}
.calendar__task-info-right{
    @extend %f-normal;
    height: 16px;
    color:$theme-color-light;
    margin-top: 2px;
    cursor: pointer;
}
.calendar__task-info-title{
    color:$color-text-primary;
    @include multiEllipsis(2);
}
.calendar__task-info-desc, .calendar__task-info-date{
    @extend %f-extra-small;
    color:$color-text-regular;

}
.calendar__task-info-desc{
    @include multiEllipsis(2);
    margin-top: 15px;
    height: 32px;
}
.calendar__task-info-date{
    margin-top: 8px;
}
.calendar__task-info-button{
    margin-top: 15px;
}
.calendar__task-info-members{
    @include flex(row);
    margin-top: 11px;
}
.calendar__task-info-avatar,.calendar__task-info-number,.calendar__task-info-add{
    height: 24px;
    width: 24px;
    border-radius: 50%;
    margin-right: 5px;
}
.calendar__task-info-number{
    text-align:center;
    line-height:24px;
    @extend %f-extra-small;
    background-color: $theme-color-light;
    color: $color-white;
    text-align: center;
}
.calendar__task-info-add{
    @include flex(row,center,center);
    border:solid 1px #f0f0f0;
    @extend %f-extra-small;
    color:$color-bd-light;
    [class*=ibass-]{
        height: 14px;
    }
}
</style>

<template lang="pug">
.ib__timer
  textarea.ib__timer__desc(placeholder="请输入计时详情", v-model="workDescription")
  .ib__timer__operation
    work-type(
      :taskInfo="taskInfo"
      :workType="workType"
      :workTypeList="workTypeList"
      @selectWorkType="selectWorkType")
  .ib__timer-footer
    .ib__timer-footer-revision.pointer(v-if="!timeRevision" @click="reviseTime") 手动填写时间
    //- .ib__timer-footer-form(v-else)
    time-input(ref="timeInput" v-else @getInput="getInput")
    .ib__timer-footer-button
      .cancle.pointer(@click="closeTimeLog") 取消
      .start
        ic-button(v-if="isEdit" @click="saveTiming") 保存
        ic-button(v-else @click="startTiming") 开始
</template>
<script>
import WorkType from '../worktype/WorkType'
import TimeInput from './TimeInput'
import MatterService from '../../service/matter/index.js'
import iLawService from '../../service/ilaw/index.js'
export default {
  components: {WorkType, TimeInput},
  props: {
    taskInfo: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      workDescription: this.taskInfo.name,
      timeRevision: false,
      showDatePicker: false,
      workType: {},
      workTypeList: [],
      workDate: moment().format('YYYY-MM-DD'),
      timeInput: {
        startTime: '',
        endTime: '',
        duration: ''
      },
      isEdit: false,
      isExecuting: false
    }
  },
  // computed: {
  // },
  methods: {
    reviseTime () {
      this.timeRevision = true
    },

    selectDate (date) {
      this.workDate = date
      this.showDatePicker = false
    },
    // 点击外部导致dropdown关闭后，改变value
    visiableChange (value) {
      if (value) {
        this.showDatePicker = false
      }
    },
    selectWorkType (item) {
      this.workType = item
    },
    async getWorkType () {
      const {matterId} = this.taskInfo
      let data
      if (matterId) {
        data = await MatterService.getWorkType(matterId)
      } else {
        data = await iLawService.getWorkType()
      }
      this.workTypeList = data.data || []
    },
    closeTimeLog () {
      this.$emit('closeTimeLog')
    },
    getInput (data, workDate) {
      this.timeInput = data
      this.workDate = workDate
      this.isEdit = this.timeInput.duration || Object.values(this.timeInput).filter(item => item).length >= 2
    },
    async startTiming () {
      const {matterId: matterPkId, id: taskPkId} = this.taskInfo
      const name = this.workDescription
      // 判断是否指定开始时间
      const startTime = this.timeInput.startTime || ''
      const manual = startTime ? 1 : ''
      const workTypeId = this.workType.id
      if (name && name.length > 500) {
        this.$postMessage.toast({msg: '工作描述字数不能超过500字'})
      } else if (this.isExecuting) {
        this.$postMessage.toast({msg: '操作进行中，请稍后...'})
      } else {
        this.isExecuting = true
        try {
          await iLawService.startTiming({matterPkId, taskPkId, name, startTime, manual, workTypeId})
          // 增加不依赖云信的同步通知到父级
          this.$postMessage.toClockRefresh()
          // this.$store.dispatch('SYNC.TIMING_INITIAL')
          this.$postMessage.toast({msg: '操作成功', type: 'success'})
          this.closeTimeLog()
          this.isExecuting = false
        } catch (msg) {
          this.isExecuting = false
        }
      }
    },
    async saveTiming () {
      this.$refs.timeInput.autoCalc()
      const name = this.workDescription
      if (name && name.length > 500) {
        this.$postMessage.toast({msg: '工作描述字数不能超过500字'})
      } else if (!this.timeInput.duration) {
        this.$postMessage.toast({msg: '保存计时时长不能为0'})
      } else if (this.isExecuting) {
        this.$postMessage.toast({msg: '操作进行中，请稍后...'})
      } else {
        const {matterId: matterPkId, id: taskPkId, state, matterName} = this.taskInfo
        const {startTime, endTime, duration: useTime} = this.timeInput
        const workDate = this.workDate
        const workTypeId = this.workType.id
        this.isExecuting = true
        try {
          await iLawService.addTiming({matterPkId, taskPkId, name, state, workTypeId, workDate, startTime, endTime, useTime, matterName})
          this.closeTimeLog()
          let tempTaskInfo = _.cloneDeep(this.taskInfo)
          tempTaskInfo.timingSum += useTime
          this.$store.commit('updateTaskItem', {data: tempTaskInfo})
          this.$postMessage.toast({msg: '保存计时成功', type: 'success'})
          this.isExecuting = false
        } catch (msg) {
          this.isExecuting = false
        }
      }
    },
  },
  mounted () {
    this.getWorkType()
  }
}
</script>

<style lang="scss" scoped>
.ib__timer{
  padding: 10px;
  width:280px;
  background-color: $color-white;
  border: solid 1px $color-bd-extra-light;
  border-radius: 10px;
  box-shadow: 0 4px 9px 0 rgba(0, 0, 0, 0.1);
}
.ib__timer__desc{
  height: 80px;
  width: 100%;
  border-radius: 3px;
  background-color: $color-bg-lighter;
  box-shadow: inset 0 1px 4px 0 rgba(0,0,0, 0.1);
  border: solid 1px $color-bd-regular;
  box-sizing: border-box;
  padding: 10px;
  resize: none;
  outline: none;
}
.ib__timer__operation{
  margin: 14px 0;
  display: inline-block;
  height:20px;
}
.ib__timer-footer{
  @extend %f-extra-small;
  color: $color-text-light;
  .ib__timer-footer-revision{
    float:left;
    margin-left:10px;
    line-height: 31px;
  }
  .ib__timer-footer-button{
    @include flex(row,flex-end,center);
    .start{
      width:80px;
      margin-left:15px;
    }
  }

}

</style>

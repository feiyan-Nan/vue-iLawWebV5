<template lang="pug">
  .ib__worktype(ref="worktype")
    ic-popover(v-model="visibility" position="bottom" :scrollable="true" :positionX="popX" :positionY="35" :appendToBody="false")
      .ib__worktype-trigger(slot="trigger")
        .ibass-category.before
        .name {{curWorkType.name ? curWorkType.name : '工作类型'}}
        .ibass-trig-down.after
      .ib__worktype-content
        .ib__worktype-content-search
          ic-search(@search="searchWorkType")
        .ib__worktype-content-list
          .ib__worktype-content-list-group(v-for="(group,groupIndex) in listGroup")
            .ib__worktype-content-list-group-title(v-if="group") {{group}}
            .ib__worktype-content-item.pointer.ellipsis(
              v-for="(item,index) in ((curWorkTypeList[groupIndex] && curWorkTypeList[groupIndex].subWorkTypes) || curWorkTypeList)"
              :key="index"
              @click="selectWorkType(item)") {{item.name}}
              .ibass-done(v-if="item.id===curWorkType.id")

</template>
<script>

export default {
  props: {
    workType: {
      type: Object,
      default () {
        return {}
      }
    },
    workTypeList: {
      type: Array,
      defaut () {
        return []
      }
    }
  },
  data () {
    return {
      curWorkType: {},
      visibility: false,
      curWorkTypeList: [],
      popX: 90,
      compoList: false,
      listGroup: []
    }
  },
  methods: {
    initGroup () {
      this.curWorkTypeList.forEach(item => {
        if (item && item.subWorkTypeCount) {
          this.listGroup.push(item.parentWorkType.name)
        }
      })
      if (!this.listGroup.length) {
        this.listGroup = ['']
      }
    },
    selectWorkType (item) {
      this.curWorkType = item
      this.visibility = false
      this.$emit('selectWorkType', item)
    },
    searchWorkType (value) {
      if (!this.workTypeList[0].id) {
        this.listGroup = []
        this.curWorkTypeList = []
        this.workTypeList.map(wkType => {
          let tempList = []
          wkType.subWorkTypes.map(item => {
            if (item.name.includes(value)) {
              tempList.push(item)
            }
          })
          if (tempList.length) {
            this.curWorkTypeList.push({
              parentWorkType: wkType.parentWorkType,
              subWorkTypeCount: tempList.length,
              subWorkTypes: tempList
            })
          }
        })
      } else {
        this.curWorkTypeList = this.workTypeList.filter(item => item.name.includes(value))
      }
      this.initGroup()
    }
  },
  updated () {
    this.popX = (this.$refs.worktype.clientWidth - 178) / 2
  },
  watch: {
    workType (after) {
      this.curWorkType = after
    },
    workTypeList (after) {
      this.curWorkTypeList = after
      this.initGroup()
    }
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
[class*=ibass]{
  &:before{
    vertical-align: -3px;
  }
}
.ib__worktype{
  width:100%;
  .ib__worktype-trigger{
    @include flex(row,flex-start,center);
    color:$color-text-placeholder;
    .before{
      color: $color-fresh;
      line-height: 12px;
    }
    .after{
      @extend %f-extra-small;
      line-height: 10px;
    }
    .name{
      margin: 0 4px 0 10px;
      @extend %f-extra-small;
    }
  }
  .ib__worktype-content{
    margin:10px 0;
    .ib__worktype-content-search {
      padding: 0 10px;
    }
    .ib__worktype-content-list{
      margin:10px 0;
      overflow:auto;
      min-height:12px;
      max-height: 180px;
      width:178px;
      .ib__worktype-content-list-group-title{
        @extend %f-extra-small;
        color: $color-bd-regular;
        margin: 12px 10px 0;
        padding-bottom: 10px;
        border-bottom: 1px solid $color-bd-input;
      }
      .ib__worktype-content-item{
        position:relative;
        height:34px;
        line-height: 34px;
        padding: 0 10px;
        @extend %f-small;
        .ibass-done{
          position:absolute;
          top:0;
          right:10px;
          color:$theme-color-light;
        }
        &:hover {
          background: $color-bg-light;
        }
      }
    }
  }
}
</style>

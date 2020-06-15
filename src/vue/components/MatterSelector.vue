<template lang="pug">
.ib__matter-selector
    .ib__matter-selector-search
        ic-search(ref="matterSearch" :placeholder="'搜索项目'" @search="filterMatter")
    .ib__matter-selector-main
        .ib__matter-selector-all.ib__matter-selector-item.pointer(v-show="items.length === notNullMatter.length && notNullMatter.length!==0" @click="toggle")
            .ib__matter-selector-all-label 所有项目
            .ib__matter-selector-item-status
                .ib__matter-selector-item-active(:class="[isSelectAll ?'ibass-done' :'']")
        .ib__matter-selector-item.pointer.ellipsis(v-for="item in items" @click="selectMatter(item)")
            .ib__matter-selector-item-name {{item.name}}
            .ib__matter-selector-item-status
                .ib__matter-selector-item-active(:class="[isSelectAll || hasItem(item)?'ibass-done' :'']")
    .ib__matter-selector-footer(v-show="selectedMatters.length>0" @click="clean")
        .ibass-close
        .ib__matter-selector-clean-label {{label}}
</template>
<script>
export default {
  props: {
    matters: {
      type: Array,
    },
    label: {
      type: String,
      default: '清除所选项目'
    },
    defaultMatters: {
      type: Array
    }
  },
  data () {
    return {
      items: this.matters,
      selectedMatters: []
    }
  },
  methods: {
    selectMatter (item) {
      if (this.hasItem(item)) {
        this.selectedMatters = this.selectedMatters.filter(matter => matter.id !== item.id)
      } else {
        this.selectedMatters.push(item)
      }
      this.$emit('matterChange', this.selectedMatters.filter(matter => matter.id !== 'none'))
    },
    filterMatter (value) {
      this.items = _.filter(this.matters, (o) => { return o.name && o.name.toUpperCase().indexOf(value.toUpperCase()) > -1 })
    },
    selectAll () {
      this.selectedMatters = this.matters.slice(0)
      this.$emit('matterChange', this.selectedMatters)
    },
    clean () {
      this.selectedMatters = [{id: 'none'}]
      this.$emit('matterChange', this.selectedMatters)
    },
    toggle () {
      if (this.isSelectAll) {
        this.clean()
      } else {
        this.selectAll()
      }
    },
    hasItem (item) {
      return this.selectedMatters.some(matter => matter.id === item.id)
    }
  },
  watch: {
    matters (newValue, oldValue) {
      this.items = newValue
      this.filterMatter(this.$refs.matterSearch.value)
    },
    defaultMatters (newValue) {
      this.selectedMatters = newValue.length > 0 ? this.defaultMatters : this.items
    }
  },
  computed: {
    isSelectAll () {
      let selectedIds = this.selectedMatters.map(matter => matter.id)
      return this.selectedMatters.length === this.matters.length && this.matters.length === this.matters.filter(matter => selectedIds.includes(matter.id)).length
    },
    notNullMatter () {
      return _.filter(this.matters, (o) => !!o.name)
    }
  }
}
</script>
<style lang="scss" scoped>
.ib__matter-selector{
    @include flex(column);
    @extend %f-small;
    @extend %color-text-primary ;
    // padding: 0  10px;
     width: 240px;
}
.ib__matter-selector-search{
     width: 210px;
     margin-left: 10px;
 }
.ib__matter-selector-main {
    height: 180px;
    width: 100%;
    margin-top: 10px;
    overflow-y: scroll;

}
.ib__matter-selector-item{
    @include flex(row,flex-start,center);
    height: 36px;
    padding: 0 10px;
     &:hover{
        background-color: $color-bg-light;
    }
}

.ib__matter-selector-item-name{
    flex:1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.ib__matter-selector-footer{
    [class^=ibass]{
        @extend %f-small;
        height: 22px;
    }
    margin-left: 10px;
    @include flex(row,flex-start,center);
    padding-top: 5px;
    border-top: solid 1px #f0f0f0;
    width: 100%;
    color: #adadad;
}
.ib__matter-selector-item-status{
    width: 20px;
    color:$theme-color-light;
}
.ib__matter-selector-all-icon{
    @extend %f-giant;
    color: $theme-color;
    margin-right: 8px;
    width: 24px;
    @include flex(row ,center,center)
}
.ib__matter-selector-all-label {
  flex: 1;
}
.ib__matter-selector-clean-label{
    margin-left: 11px;
}
</style>
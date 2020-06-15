<template lang="pug">
  .ib__matter__choose
    left-popover(position="bottom" :triangle="false" :scrollable="true" :appendToBody="false" v-model="visible")
      .ib__matter__choose__popover
        .ib__matter__header
          .ib__matter__search
            ic-search(placeholder="按项目名称、客户搜索" @searchByEnter="search" @search="search" :defaultValue="searchVal")
          .ib__matter__amount
            span 共 {{page.count ? page.count : 0}} 个项目
          .ib__matter__close
            .ibass-close(@click="visible = false")
        .ib__matter__list__wrapper(v-ic-loading="loading")
          ul.ib__matter__list(v-if="matters.length > 0")
            li.ib__matter__list__item.pointer(v-for="matter in matters" :key="matter.id" :class="{'active': selectedMatters.some(item => item.pkId === matter.pkId)}" @click="selectItem(matter)")
              .matter__type__icon(:class="[matter.iconClass]")
              .matter__name__group
                .matter__name(v-html="matter.highLightName || matter.name")
                .matter__hight-light__name(v-if="matter.highLightClientName && (queryScope === QUERY_SCOPE.MATTER_CUSTOM || queryScope === QUERY_SCOPE.CUSTOM)" v-html="matter.highLightClientName")
              .ibass-done
            li(v-if="isLoadMore")
              .load__more.pointer(@click="loadMore") 加载更多
          .ib__matter__list__none(v-if="matters.length === 0")
            .ibass-search
            .ib__matter__list__none__text {{searchVal ? '没有找到匹配的结果' : '没有可选择的项目'}}
        .ib__matter__footer
          .ib__matter__mark__personal.pointer(@click="markAsPersonal" :class="{'active': !matterName || (selectedMatters[0] && selectedMatters[0].pkId === '')}")
            .ibass-user
            span 标记为个人任务
      .ib__matter__choose__text(slot="trigger")
        span.ellipsis {{matterName || '个人任务'}}
        .ibass-trig-down(:class="{'active': matterName}")
</template>
<script>
import LeftPopover from '@/vue/components/LeftPopover'
import IlawService from '@/vue/service/ilaw'
const QUERY_SCOPE = {
  MATTER_CUSTOM: 1,
  MATTER: 2,
  CUSTOM: 3
}
export default {
  components: { LeftPopover },
  props: {
    pmsType: {
      type: String,
      default: 'MAT:matter.task:add'
    },
    matterType: {
      type: String,
      default: null
    },
    queryScope: { // 1:项目名+客户名，2:项目名，3:客户名
      type: Number,
      default: 1
    },
    selectedMatters: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      visible: false,
      matters: [],
      page: {
        pageIndex: 1,
        pageSize: 20,
        count: 0
      },
      searchVal: '',
      loading: false,
      QUERY_SCOPE
    }
  },
  created () {
    this.search('')
  },
  mounted () {
    // console.log(this.selectedMatters, '%%%%%%')
  },
  methods: {
    search (value) {
      this.searchVal = value
      this.page.pageIndex = 1
      this.searchMatters(value).then(res => {
        this.matters = res
      })
    },
    async searchMatters (value) {
      let params = {
        queryString: value,
        pmsType: this.pmsType,
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize,
        queryScope: this.queryScope
      }
      if (this.matterType) {
        params.matterType = this.matterType
      }
      this.loading = true
      return IlawService.searchMatters(params).then(res => {
        // 设置总页数
        this.page.count = res.data.count
        this.loading = false
        return this.buildMatters(res.data.data)
      }, () => {
        this.loading = false
        return []
      })
    },
    selectItem (matter) {
      this.$emit('selectItem', matter)
      this.visible = false
    },
    markAsPersonal () {
      this.$emit('selectItem', {pkId: '', name: ''})
      this.visible = false
    },
    buildMatters (matters) {
      if (matters) {
        matters.forEach(matter => {
          // 处理高亮问题
          if (matter.highLightClientName) {
            matter.highLightClientName = `客户: ${matter.highLightClientName}`
          }
          // 处理icon
          matter.iconClass = `ibass-project-type${Number(matter.matterType) + 1}`
        })
      }
      return matters || []
    },
    loadMore () {
      this.page.pageIndex = this.page.pageIndex + 1
      this.searchMatters(this.searchVal).then(res => {
        this.matters = this.matters.concat(res)
      })
    }
  },
  computed: {
    matterName () {
      return this.selectedMatters.map(item => item.name).join(',')
    },
    isLoadMore () {
      return this.page.pageIndex * this.page.pageSize < this.page.count
    }
  }
  // 不需要每次点开都重新加载数据
  // watch: {
  //   visible (newVal) {
  //     if (newVal) {
  //       this.search('')
  //     }
  //   }
  // }
}
</script>
<style lang="scss" scoped>
  .ib__matter__choose {
    position: relative;
    .ib__matter__choose__popover {
      width: 25rem;
      padding: 1rem 0;
      .ib__matter__header {
        display: flex;
        position: relative;
        padding: 0 1.5625rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid $color-bd-title;
        .ib__matter__search {
          width: 11.25rem;
        }
        .ib__matter__amount {
          display: flex;
          line-height: 2rem;
          padding: 0 0.5rem;
          color: $color-text-placeholder;
          &:before {
            content: '';
            height: 50%;
            width: 1px;
            position: relative;
            top: 0.5rem;
            margin-right: 0.5rem;
            background-color: $color-bd-extra-light;
          }
        }
        .ib__matter__close {
          position: absolute;
          line-height: 2rem;
          right: 1.5625rem;
          .ibass-close {
            &:before {
              vertical-align: -2px;
            }
          }
        }
      }
      .ib__matter__list__wrapper {
        overflow: hidden;
      }
      .ib__matter__list {
        height: 16.25rem;
        overflow: auto;
        li {
          display: flex;
          position: relative;
          line-height: 2rem;
          min-height: 2rem;
          padding: 0.3rem 1.5625rem;
          transition: all .2s;
          &.active {
            background: $color-bg-light;
            .ibass-done {
              display: block;
            }
          }
          &:hover {
            background: $color-bg-light;
          }
          // &:not(:last-child) {
          border-bottom: 1px solid $color-bd-title;
          // }
          .matter__type__icon {
            font-size: 1.5rem;
            width: 1.5rem;
            &:before {
              vertical-align: -4px;
            }
          }
          .matter__name__group {
            margin-left: 0.625rem;
            .matter__name {
              max-width: 18.75rem;
              word-wrap: break-word;
            }
            .matter__hight-light__name {
              max-width: 18.75rem;
              color: $color-text-light;
              word-wrap: break-word;
              @extend %f-extra-small;
              /deep/ em {
                color: $dangerous-color;
              }
            }
            /deep/ em {
              font-style: normal;
              background: $color-warning;
              color: $dangerous-color;
            }
          }
          .ibass-done {
            display: none;
            position: absolute;
            right: 1.5625rem;
            color: $theme-color-light;
          }
          .load__more {
            margin: auto;
          }
        }
      }
      .ib__matter__list__none {
        height: 16.25rem;
        text-align: center;
        color: $color-text-placeholder;
        .ibass-search {
          padding-top: 5rem;
          font-size: 4rem;
        }
      }
      .ib__matter__footer {
        padding: 1rem 1.5625rem 0 1.5625rem;
        border-top: 1px solid $color-bd-title;
        color: $color-text-secondary;
        .ib__matter__mark__personal {
          display: flex;
          width: fit-content;
          transition: all 0.2s;
          .ibass-user {
            @extend %f-normal;
            &:before {
              vertical-align: -4px;
            }
          }
          span {
            margin-left: 0.625rem;
          }
          &:hover, &.active {
            color: $theme-color-light;
          }
        }
      }
    }
    .ib__matter__choose__text {
      display: flex;
      margin-right: 0.625rem;
      span {
        max-width: 9.375rem;
      }
      .ibass-trig-down {
        margin-top: 3px;
        color: $color-text-placeholder;
        &.active {
          color: $theme-color-light;
        }
      }
    }
  }
</style>

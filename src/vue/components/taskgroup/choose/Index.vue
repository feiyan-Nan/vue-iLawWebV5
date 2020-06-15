<template lang="pug">
  .ib__taskgroup__choose
    left-popover(position="bottom" :triangle="false" :scrollable="true" :appendToBody="false" v-model="visible")
      .ib__taskgroup__choose__popover
        .ib__taskgroup__header
          .ib__taskgroup__search
            ic-search(placeholder="搜索任务组" @searchByEnter="search" @search="search" :defaultValue="searchVal")
          .ib__taskgroup__amount
            span 共 {{groups.length}} 个任务组
          .ib__taskgroup__close
            .ibass-close(@click="visible = false")
        .ib__taskgroup__list__wrapper(v-ic-loading="loading")
          ul.ib__taskgroup__list(v-if="groups.length > 0")
            li.ib__taskgroup__list__item.pointer(v-for="group in groups" :key="group.id" :class="{'active': selectedTaskGroups.some(item => item.id === group.id)}" @click="selectItem(group)")
              .taskgroup__name__group
                span.taskgroup__name {{group.name}}
                span.taskgroup_count {{group.unfinishedTaskCount}}个任务
              .ibass-done
          .ib__taskgroup__list__none(v-if="groups.length === 0")
            .ibass-search
            .ib__taskgroup__list__none__text 暂无任务组
        .ib__taskgroup__footer
          .ib__taskgroup__mark__ungroup.pointer(@click="markAsUnGroup" :class="{'active': selectedTaskGroups[0] && selectedTaskGroups[0].id === 'UN_GROUP_ID'}")
            span 未分组
            span {{unGroup.unfinishedTaskCount}} 个任务
      .ib__taskgroup__choose__text(slot="trigger")
        span.ellipsis {{groupName || '未分组'}}
        .ibass-trig-down(:class="{'active': groupName}")
</template>
<script>
import LeftPopover from '@/vue/components/LeftPopover'
import IlawService from '@/vue/service/ilaw'
export default {
  props: {
    matterId: {
      type: String,
      default: ''
    },
    type: {
      type: Number,
      default: 1 // 未完成任务组:1，已完成任务组:2, 已删除任务组：3
    },
    selectedTaskGroups: {
      type: Array,
      default () {
        return []
      }
    }
  },
  components: { LeftPopover },
  data () {
    return {
      visible: false,
      defaultGroups: [],
      searchVal: '',
      loading: false
    }
  },
  created () {
    this.searchTaskGroups()
  },
  methods: {
    search (value) {
      this.searchVal = value
    },
    async searchTaskGroups () {
      let params = {
        matterId: this.matterId,
        type: 1
      }
      this.loading = true
      let res = await IlawService.searchTaskGroup(params)
      this.loading = false
      this.defaultGroups = res.data
    },
    selectItem (group) {
      this.$emit('selectItem', group)
      this.visible = false
    },
    markAsUnGroup () {
      this.$emit('selectItem', {id: 'UN_GROUP_ID', name: '未分组'})
      this.visible = false
    }
  },
  computed: {
    groupName () {
      return this.selectedTaskGroups.map(item => item.name).join(',')
    },
    groups () {
      return this.defaultGroups.filter(group => {
        return (group.name.includes(this.searchVal) || !this.searchVal) && group.id !== 'UN_GROUP_ID'
      })
    },
    unGroup () {
      return this.defaultGroups.find(group => {
        return group.id === 'UN_GROUP_ID'
      }) || {}
    }
  },
  watch: {
    matterId () {
      this.searchTaskGroups()
    }
  }
}
</script>
<style lang="scss" scoped>
  .ib__taskgroup__choose {
    position: relative;
    .ib__taskgroup__choose__popover {
      width: 25rem;
      padding: 1rem 0;
      .ib__taskgroup__header {
        display: flex;
        position: relative;
        padding: 0 1.5625rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid $color-bd-title;
        .ib__taskgroup__search {
          width: 11.25rem;
        }
        .ib__taskgroup__amount {
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
        .ib__taskgroup__close {
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
      .ib__taskgroup__list__wrapper {
        overflow: hidden;
      }
      .ib__taskgroup__list {
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
          .taskgroup__name__group {
            margin-left: 0.625rem;
            .taskgroup__name {
              max-width: 18.75rem;
              word-wrap: break-word;
            }
            .taskgroup_count{
              margin-left: 8px;
              color: $color-text-placeholder;
            }
          }
          .ibass-done {
            display: none;
            position: absolute;
            right: 1.5625rem;
            color: $theme-color-light;
          }
        }
      }
      .ib__taskgroup__list__none {
        height: 16.25rem;
        text-align: center;
        color: $color-text-placeholder;
        .ibass-search {
          padding-top: 5rem;
          font-size: 4rem;
        }
      }
      .ib__taskgroup__footer {
        padding: 1rem 1.5625rem 0 1.5625rem;
        border-top: 1px solid $color-bd-title;
        color: $color-text-secondary;
        .ib__taskgroup__mark__ungroup {
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
    .ib__taskgroup__choose__text {
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

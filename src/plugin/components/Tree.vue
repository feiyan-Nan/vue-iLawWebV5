<template lang="pug">
    .ic-tree(:class="{'ic-tree--collapse': tree.collapse}")
        .ic-tree__title
            i.ic-tree__icon(:class="{'ibass-trig-down': tree.children, 'ic-tree__icon--up': !tree.collapse}", @click="toggleCollapse")
            label(v-html="tree.label")
            i.ic-tree__icon(:class="{'ibass-task-check': !tree.selected, 'ibass-done': tree.selected}", @click="toggleSelect")
        ic-tree(v-if="tree.children" v-for="(item, index) in tree.children" :tree="item" :key="index")
</template>
<script>
/**
    功能：树形结构菜单
    创建人：liuhao
    tree对象结构：
    {
        label: string, // 显示的字段名称
        collapse: boolean, // 是否折叠
        selected: boolean, // 默认是否选中
        children: Array // 子节点数组（结构同父节点）
    }
 */
export default {
  name: 'ic-tree',
  data () {
    return {
      totalSelectCount: 0
    }
  },
  props: {
    tree: Object
  },
  methods: {
    // 列表展开/关闭的处理
    toggleCollapse () {
      this.$set(this.tree, 'collapse', !this.tree.collapse)
    },
    // 列表选择/反选的处理
    toggleSelect () {
      this.$set(this.tree, 'selected', !this.tree.selected)
    }
  }
}
</script>
<style lang="scss" scoped>
    .ic-tree {
        position: relative;
        min-height: 30px;
        line-height: 30px;
        max-height: 9999px;
        padding-left: 16px;
        transition: all .3s;
        opacity: 1;
        @at-root #{&}--collapse {
            >.ic-tree {
                height: 0;
                min-height: 0;
                max-height: 0;
                opacity: 0;
                padding: 0;
                overflow: hidden;
            }
        }
        @at-root #{&}__title {
            @include flex(row, flex-start, center);
            color: red;
            label {
                flex-grow: 1;
            }
        }
        @at-root #{&}__icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            line-height: 16px;
            transition: .3s;
            margin: 0 10px;
            flex-shrink: 0;
            &:last-child {
                margin-right: 32px;
            }
            @at-root #{&}--up {
                transform: rotate(180deg);
            }
        }
    }
</style>

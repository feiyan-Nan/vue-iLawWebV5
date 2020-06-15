<template lang="pug">
div.Ccalendar
    div.item(v-for="item in routers" ::key="item.name" :class="{active:item.active}") {{item.name}}
</template>

<script>
const items = [
  { name: '任务', url: '/#/app/my/task/list', active: true },
  { name: '计时', url: '/#/app/my/analytic' },
  { name: '成就', url: '/#/app/my/newachievement' },
  { name: '文档', url: '/#/app/my/file//' }
]
export default {
  data () {
    return {
      routers: items
    }
  }
}
</script>

 <style lang="scss" scoped>
 .container{
     @include flex(row, flex-start, center);
 }
 .item{
     cursor:pointer;
 }
 .active {
     border-bottom: 2px solid #ed6c00;
     @extend %color-theme
}
</style>

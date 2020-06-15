<template lang="pug">
.c__switch__container
    div(v-for="(item, index) in items" :key="index"  :class = "[ `c__switch__${item.value}`, active === item.value ? 'active' : '']" @click="switchActive(item)") {{item.label}}
</template>
<script>
const data = [{label: '日', value: 'day'}, {label: '周', value: 'week'}, {label: '月', value: 'month'}, {label: '年', value: 'year'}]
export default {
  props: {
    curType: {
      type: String,
    }
  },
  data () {
    return {
      items: data,
      active: this.curType
    }
  },
  methods: {
    switchActive (item) {
      this.active = item.value
      //   this.db.set('calendar_')
      this.$emit('click', item.value)
    }
  },
  watch: {
    curType (newValue, oldValue) {
      this.active = newValue
    }
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
.c__switch__container {
    @include flex(row);
    @extend %color-text-primary ;
    @extend %f-extra-small;
    width: 144px;;
    border: solid 1px #eaeaea;
    border-radius: 20px;
    [class^=c__switch]{
        @include flex(row, center, center);
        width: 36px;
        height: 30px;
        cursor: pointer;
        &:not(:last-child){
             border-right: solid 1px #eaeaea;
             &:not(:first-child){
                 box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
             }
        };
        &.active{
            @extend %f-half;
            @extend %color-theme;
            box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.05), inset 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            @extend %bg-white-light;
            &:first-child{
                border-top-left-radius: 20px;
                border-bottom-left-radius: 20px;
            };
            &:last-child {
                border-bottom-right-radius: 20px;
                border-top-right-radius: 20px;
            }
        };
    }
}

</style>
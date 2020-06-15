<template lang="pug">
.ic__date-picker-month-header
    .ic__date-picker-month-header-arrow(@click="pre")
        .ibass-arrow-left
    .ic__date-picker-month-header-label {{label}}
    .ic__date-picker-month-header-arrow(@click="next")
        .ibass-arrow-right
</template>
<script>
export default {
  name: 'ic-date-picker-header',
  componetName: 'IcDatePickerHeader',
  props: {
    label: {
      type: String,
      default: ''
    },
  },
  methods: {
    pre (ev) {
      this.$emit('pre', ev)
    },
    next (ev) {
      this.$emit('next', ev)
    }
  },
}
</script>
<style lang="scss" scoped>
%hover-black{
    background-color: #000000;
    border-radius: 5px;
}
.ic__date-picker-month-header{
    @include flex(row,center,center);
    height: 30px;
    padding: 0 10px;
}
.ic__date-picker-month-header-arrow{
    width: 30px;
    height:100%;
    @include flex(row,center,center);
    [class*=ibass-arrow]{
            color:#adadad;
    }
     &:hover{
       @extend %hover-black;
    }
}
.ic__date-picker-month-header-label{
    @include flex(row,center,center);
    color:$color-white;
    flex:1;
    height:100%;
     &:hover{
       @extend %hover-black;
    }
}
</style>

<template lang="pug">
.ic__search
    .ibass-search
    input.ic__search-input(ref="searchInput" :placeholder="placeholder" @keyup="search" type="text" v-model="value" )
</template>
<script>
export default {
  name: 'ic-search',
  props: {
    placeholder: {
      type: String,
      default: '搜索'
    },
    defaultValue: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      value: ''
    }
  },
  methods: {
    search (ev) {
      if (ev.keyCode === 13) {
        this.$emit('searchByEnter', this.value)
      } else {
        this.debounceEmitSearch()
      }
    },
    debounceEmitSearch () {}
  },
  watch: {
    defaultValue (newVal) {
      this.value = newVal
    }
  },
  created () {
    this.debounceEmitSearch = _.debounce(() => this.$emit('search', this.value), 500)
  },
  mounted () {
    this.value = this.defaultValue
    this.$nextTick(() => {
      this.$refs.searchInput.focus()
    })
  }
}
</script>
<style lang="scss" scoped>
.ic__search{
    @include flex(row,center,center);
    height: 30px;
    border-radius: 20px;
    border-color: #fefeff;
    border: solid 1px #d4d4d4;
    [class*=ibass]{
        color: $color-bd-light;
        @extend %f-small;
        @include flex(row,center,center)
    }
}
.ic__search-input{
    border:0;
    height: 16px;
    width: calc(100% - 35px);
    margin-left: 8px;
    // margin-right: 5px;
}
</style>

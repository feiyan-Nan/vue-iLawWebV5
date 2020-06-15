<template lang="pug">
.ib__user-selector()
    .ib__user-selector-search
        ic-search(:placeholder="'搜索成员'" @search="filterUser")
    .ib__user-selector-main
        .ib__user-selector-all.ib__user-selector-item(v-show="items.length===users.length&&users.length!==0" @click="selectAll")
            .ib__user-selector-all-icon.ibass-team
            .ib__user-selector-all-label 所有项目成员
            .ib__user-selector-item-status
                .ib__user-selector-item-active(:class="[selectedUsers.length === users.length?'ibass-done' :'']")
        .ib__user-selector-item.pointer(v-for="item in items" @click="selectUser(item)")
            img.ib__user-selector-item-img(:src="item.userPic" v-if="item.userPic")
            span.ib__user-selector-item-img(v-else)
            .ib__user-selector-item-name {{item.userName}}
            .ib__user-selector-item-status
                .ib__user-selector-item-active(:class="[selectedUsers.indexOf(item)>-1?'ibass-done' :'']")
    .ib__user-selector-footer(v-show="selectedUsers.length>0" @click="clean")
        .ibass-user
        .ib__user-selector-clean-label {{label}}
</template>
<script>
/**
 * 选择用户组件
 */
export default {
  props: {
    users: {
      type: Array,
    },
    defaultUsers: {
      type: Array
    }
  },
  data () {
    return {
      items: this.users,
      label: '只选择自己',
      selectedUsers: []
    }
  },
  methods: {
    selectUser (item) {
      let index = this.selectedUsers.indexOf(item)
      index > -1 ? this.selectedUsers.splice(index, 1) : this.selectedUsers.push(item)
      this.$emit('selectUser', this.selectedUsers)
    },
    filterUser (value) {
      this.items = _.filter(this.users, (o) => { return o.userName.toUpperCase().indexOf(value.toUpperCase()) > -1 })
    },
    selectAll () {
      if (this.selectedUsers.length === this.users.length) {
        this.selectedUsers = []
      } else {
        this.selectedUsers = this.users.slice(0)
      }
      this.$emit('selectUser', this.selectedUsers)
    },
    clean () {
      this.selectedUsers = this.users.slice(0, 1)
      this.$emit('selectUser', this.selectedUsers)
    },
    isSelected (item) {
      return this.selectedUsers.some(user => user.userId === item.userId)
    }
  },
  watch: {
    users (newValue, oldValue) {
      this.items = newValue
    },
    defaultUsers () {
      this.selectedUsers = this.defaultUsers
    }
  }
}
</script>
<style lang="scss" scoped>
.ib__user-selector{
    @include flex(column);
    @extend %f-small;
    @extend %color-text-primary ;
     width: 180px;
}
.ib__user-selector-search{
     width: 160px;
     margin-left: 10px;
 }
.ib__user-selector-main {
    // height: 180px;
    max-height: 180px;
    width: 100%;
    margin-top: 10px;
    overflow-y: scroll
}
.ib__user-selector-item{
    @include flex(row,flex-start,center);
    padding: 0 10px;
    height: 36px;
    &:hover{
        background-color: $color-bg-light;
    }
}
.ib__user-selector-all-label {
    flex:1;
}
.ib__user-selector-item-img{
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #dadada;
}
.ib__user-selector-item-name{
    flex:1;
    padding-left:8px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.ib__user-selector-footer{
    [class^=ibass]{
        @extend %f-normal;
        height: 22px;
    }
    margin: 0 10px;
    @include flex(row,flex-start,center);
    border-top: solid 1px #f0f0f0;
    width: 160px;
    padding-top: 5px;
    color: $color-bd-lighter;
}
.ib__user-selector-item-status{
    width: 20px;
    color:$theme-color-light;
}
.ib__user-selector-all-icon{
    @extend %f-giant;
    color: $theme-color;
    margin-right: 8px;
    width: 24px;
    @include flex(row ,center,center)
}
.ib__user-selector-clean-label{
    margin-left: 11px;
}
</style>
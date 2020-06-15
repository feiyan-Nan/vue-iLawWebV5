<template lang="pug">
  .ib__task__group__content
    .ib__task__group__collapse__icon.pointer.ibass-arrow-down
    .ib__task__group__name
      .name__input.ellipsis.editable(:contenteditable="true" placeholder='请输入任务组名称' ref="nameInput" @keydown="createGroup")
    .ib__task__group__operate
      span.pointer.ibass-close(@click="hideCreateGroup")
      span.pointer.ibass-checkmark(@click="createGroup")
</template>
<script>
import rules from '@/utils/validation/rules'
import IlawService from '@/vue/service/ilaw'
export default {
  props: {
    matter: {
      type: Object
    }
  },
  data () {
    return {
    }
  },
  mounted () {
    this.$refs.nameInput.focus()
  },
  methods: {
    hideCreateGroup () {
      this.$emit('hideCreateGroup')
    },
    createGroup (event) {
      let param = {matterId: this.matter.pkId, name: this.$refs.nameInput.textContent}
      if (event.keyCode === 13 || event.type === 'click') {
        event.preventDefault()
        if (this.validate(param)) {
          this.loading = IlawService.createTaskGroup(param).then(res => {
            this.$postMessage.toast({msg: '操作成功', type: 'success'})
            // 触发刷新
            this.$emit('refresh')
            // 隐藏创建任务组的框
            this.$emit('hideCreateGroup')
          })
        }
      } else {
        this.$refs.nameInput.focus()
      }
    },
    /**
     * 保存数据验证
     */
    validate (postData) {
      // 任务标题不能为空
      if (postData.name === '') {
        this.$postMessage.toast({msg: '任务组名称不能为空'})
        return false
      }
      // 任务名不能使用emoji
      if (!rules().noEmoji.validate(postData.name)) {
        this.$postMessage.toast({msg: '任务组名称不能包含Emoji'})
        return false
      }
      // 任务名标题长度限制200
      if (postData.name.length > 200) {
        this.$postMessage.toast({msg: '任务组名称长度大于了最大限制'})
        return false
      }
      return true
    },
  }
}
</script>
<style lang="scss" scoped>
  .ib__task__group__content {
    margin-top: 16px;
    position: relative;
    @include flex(row);
    height: 2.5em;
    line-height: 2.5rem;
    border-bottom: 1px solid $color-bd-regular;
    padding: 0 0.625rem;
    background: $color-white;
    .ib__task__group__collapse__icon {
      margin-right: 0.625rem;
      &:before{
        margin-top: 0.75rem;
        color: $color-fresh;
      }
    }
    .ib__task__group__name {
      position: relative;
      max-width: 43.75rem;
      @extend %f-small;
      // @extend %f-heavy;
      &:after {
        content: '';
        position: absolute;
        top: 2.4rem;
        left: 0;
        display: block;
        width: 100%;
        height: 3px;
        background: $theme-color-light;
      }
      .name__input{
        &.editable {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: unset;
          cursor: text;
        }
        &:focus {
          outline: none;
        }
        &:empty::before {
          @extend %f-weight-normal;
          color: $color-bd-light;
          margin-left: 10px;
          content: attr(placeholder);
        }
      }
    }
    .ib__task__group__operate {
      @extend %f-giant;
      position: absolute;
      display: block;
      right: 6rem;
      color: $theme-color-lighter;
      .ibass-close {
        position: absolute;
        top: 5px;
        right: 20px;
        &:hover{
          color: $theme-color-lighter;
        }
      }
      .ibass-checkmark {
        top: 5px;
        position: absolute;
      }
    }
  }
</style>
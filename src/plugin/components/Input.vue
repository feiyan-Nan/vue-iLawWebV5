<template lang="pug">
  .ic-input(:class="{'ic-input--underline': type === 'underline', 'ic-input--normal': type !== 'underline'}")
    label.ic-input__label(
      v-if="label"
      :for="id"
      :class="{'ic-input__label--top': inputFocus || currentValue, 'ic-input__label--warning': error.msg}"
      @click="focusInput()")
        span {{error.msg || label}}
        .ic-input__loading.ibass-refresh.animate__circle(v-show="error.validating")
    input(
      ref="input"
      v-model="currentValue"
      :name="name"
      :placeholder="type!=='underline' || label === ''? placeholder : ''"
      :type="originType"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      @keyup="handleKeyup"
      :readonly="readonly"
      :disabled="disabled"
      :maxLength="maxlength"
      :minLength="minlength"
      :id="id"
      :tabindex="tabindex"
      :class="{'disabled': disabled || readonly}"
      :style="{'width': computeWidth}"
      :autocomplete="autoComplete"
      class="ic-input__inner")
</template>
<script>
import emitter from '../mixin/emitter'
export default {
  name: 'ic-input',
  componentName: 'IcInput',
  mixins: [emitter],
  props: {
    value: [String, Number], // 数据绑定的值
    label: String, // 显示的标签名
    name: String, // 输入框的名字
    originType: String, // input输入框原始类型
    type: String, // input样式underline和normal两种
    placeholder: String, // 默认占位的placeholder
    readonly: Boolean, // 是否只读
    disabled: Boolean,
    maxlength: Number,
    minlength: Number,
    id: String, // 组件ID
    tabindex: String, // 组件的tabindex
    width: String, // 组件尺寸
    autoComplete: String, // off/on
    prop: String, // 用于表单验证的关键字符
    trigger: { // 支持的事件触发，默认都只在提交的时候做验证
      type: String,
      default: ''
    }
  },
  data () {
    return {
      currentValue: this.value,
      inputFocus: false,
      error: {}
    }
  },
  computed: {
    computeWidth () {
      return this.width + 'px'
    }
  },
  created () {
    this.$on('form.update-error', (errors) => {
      this.error = errors[this.prop] ? errors[this.prop] : {}
    })
  },
  methods: {
    handleInput () {
      const value = event.target.value
      this.$emit('input', value, event)
      this.setCurrentValue(value)
    },
    handleFocus () {
      this.inputFocus = true
      this.$emit('focus', event.target.value, event)
    },
    handleBlur () {
      this.inputFocus = false
      this.$emit('blur', event.target.value, event)
      if (this.trigger.indexOf('blur') > -1) {
        this.dispatch('IcForm', 'form.blur', [this])
      }
    },
    handleChange () {
      this.$emit('change', event.target.value, event)
      if (this.trigger.indexOf('change') > -1) {
        this.dispatch('IcForm', 'form.change', [this])
      }
    },
    handleKeyup () {
      this.$emit('keyup', event.target.value, event)
      if (this.trigger.indexOf('keyup') > -1) {
        this.dispatch('IcForm', 'form.keyup', [this])
      }
    },
    setCurrentValue (value) {
      if (value === this.currentValue) return
      this.currentValue = value
    },
    focusInput () {
      this.$refs.input.focus()
    }
  },
  watch: {
    value (newValue) {
      this.setCurrentValue(newValue)
    }
  }
}
</script>
<style lang="scss" scoped>
.ic-input {
    position: relative;
    // display: inline-block;
    margin:0 0.5rem;
    .ic-input__label {
        @include flex();
        @extend %color-text-primary ;
        @extend %f-small;
        transition: .3s;
        padding-left: 0.1rem;
        .ic-input__loading {
          height: 1rem;
          width: 1rem;
          margin-left: 5px;
          &:before {
            font-size: 1rem;
          }
        }
    }
    .ic-input__inner {
        transition: border-color .3s;
        padding: 0.5rem 0.5rem 0.3rem 0.3rem;
        box-sizing: border-box;
    }
    @at-root #{&}--normal {
        // display: inline-block;
        .ic-input__label {
            margin-right: 1rem;
            &.ic-input__label--warning {
                @extend %color-warning;
            }
        }
        .ic-input__inner {
            @extend %color-text-primary ;
            border-radius: 5px;
            border: 1px solid $color-text-placeholder;
            &:focus {
                border-color: $theme-color-lighter;
            }
            &.disabled {
                cursor: not-allowed;
                background-color: $color-text-placeholder;
            }
        }
    }
    @at-root #{&}--underline {
        padding-top: 1.2rem;
        .ic-input__label {
            position: absolute;
            left: 0;
            top: 1.5rem;
            &.ic-input__label--top {
                transform: translateY(-1.1rem);
                @extend %f-extra-small;
            }
            &.ic-input__label--warning {
                @extend %color-warning;
            }
        }
        .ic-input__inner {
            width: 100%;
            border-bottom: 1px solid $color-text-placeholder;
            &:focus:not(.disabled) {
                border-color: $theme-color-lighter;
            }
            &.disabled {
                cursor: not-allowed;
                color: $color-text-placeholder;
            }
        }
    }
    input::-webkit-input-placeholder{
        color: $color-text-placeholder;
    }
    input::-moz-placeholder{   /* Mozilla Firefox 19+ */
        color: $color-text-placeholder;
    }
    input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
        color: $color-text-placeholder;
    }
    input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
        color: $color-text-placeholder;
    }
}
</style>

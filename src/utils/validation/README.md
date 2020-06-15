
### 2.2 表单验证
参考了Element-UI的设计理念，结合项目（主要是在于label和error的显示位置，去掉了element-ui中的form-item组件），实现一套规则配置在表单组件和表单提交的时候双重验证。

基本用法

    ic-form(:rules="" :model="")
        ic-input(prop="" trigger="")

ic-form支持的属性：`rules`和`model`

`rules`: 表单中组件的验证规则，格式如下  
示例1（自定义规则）:

    {
        prop: { // 和需要验证表单组件的prop相同
            validators: [ // 验证对象集合
            { 
                validate: () => {}, // 验证方法，验证通过返回Boolean/Promise，支持异步校验
                error: '' // 自定义的错误提示信息
            }]
        }
    }
示例2(直接使用规则组相关规则):

    {
        prop: group[prop]
    }

示例3(使用已有规则):

    {
        prop: { // 和需要验证表单组件的prop相同
            validators: [rules().xxxx]
        }
    }
示例4（符合多个规则）:

    {
        prop: { // 和需要验证表单组件的prop相同
            validators: [ // 验证对象集合
            ...group[prop].validators,
            rules().xxxx,
            { 
                validate: () => {}, // 验证方法，验证通过返回Boolean/Promise，支持异步校验
                error: '' // 自定义的错误提示信息
            }]
        }
    }
两个概念，规则组和规则：  
group：规则组，由于系统中同一个字段的验证规则在系统中所有地方理论上都是一致的，且会复合多个验证规则，所以为了统一处理，可以将一个字段的验证规则放到验证组中，所有地方复用这一份规则，修改的时候只需要修改验证组中的内容实现所有地方同步，详情请查看utils/validation/group.js  
rules: 规则，同样，对于规则通常是复用的，例如输入空值校验，特殊字符校验，在使用的时候不用每个都重新写一次utils/validation/rules.js  

    {
        propName: { // 规则组名
            validators: [{ // 自定义验证组
                validate: function(){}, // 验证方法，验证通过返回Boolean/Promise，支持异步校验
                error: '' // 自定义的错误提示信息
            }]
        }
    }

`model`：表单组件绑定的model对象，建议在表单验证的时候构建验证的对象组并在通过$ref.form.validate(res => {})验证通过后，组装数据调用后端接口

ic-xxx表单组件支持属性：`prop`和`trigger`

`prop`：表单确定的属性，和`rule`中的的属性名一致

`trigger`：表单组件的验证触发条件，支持blur和keyup
      

## API

组件提供了一些静态方法，使用方式和参数如下：
- `let instance = this.$modal.open({component : component, cb:cb=>{}}, props:{})`
- `instance.close()`

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| component | modal中 | object | - |
| width | modal的宽度 | number | - |
| customClass | 自定义class | string | - |
| closeByOutside | 点击外部关闭modal | boolean | false |
| props | 传递给component的参数 | object | - |

### 事件
| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| cb | 点击回调| Function(event) |

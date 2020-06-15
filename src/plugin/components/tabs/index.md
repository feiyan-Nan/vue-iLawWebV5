## API

```html
<ic-tabs v-model="selectedTab @change="onChange">
          <ic-tab-pane name="大数据">  大数据</ic-tab-pane>
          <ic-tab-pane name="收藏夹">  收藏夹</ic-tab-pane>
          <ic-tab-pane name="实践指引">  实践指引</ic-tab-pane>
</ic-tabs>
```

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 双向绑定的被选中的name | string | 第一个TabPane|

### 事件
| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 切换Tab回调| Function() |

## 注意
TabPane的宽度等样式需要单独设定，组件不会预设
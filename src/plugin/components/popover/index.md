## API

```html
<ic-pagination @change="onChange" :totalCount="50" />
```

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| position | 气泡出现位置 | string | right,left,top,bottom 默认right|
| theme | 主题 | string | white,black 默认white |
| triangle | 是否显示三角 | boolean | true |

### 事件
| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| dbClick | 双击回调| Function() |

## 注意

popover如不满足需求，可以通过Vue的extend 的机制扩展，示例参照 vue/views/my/year/YPopover.js
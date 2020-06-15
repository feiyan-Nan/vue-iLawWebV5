## API

```html
<ic-date-picker></ic-date-picker>
```

### 属性
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| curDate | 当前时间 | string | moment().format('YYYY-MM-DD')|
| startDate | 可选日期的开始时间(默认不设置开始时间),格式为moment.js支持的格式 | String,Number | ''|
| endDate | 可选日期的结束时间(默认不设置结束时间),格式为moment.js支持的格式 | String,Number | ''|

### 事件
| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击回调| Function() |
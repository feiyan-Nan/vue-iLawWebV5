## css 
### css 命名
```
1.公共组件： .ic__功能描述-子业务__状态 例如：ic__dropdown-menu__active
2.业务组件： .模块名__功能描述-子业务__状态 例如： .calendar__month-header__hover
```
### 关于 !import 声明
```
禁止使用
```
### css 颜色
```
所有基础颜色值存放在 src/styles/atoms.scss下 不得单独定义颜色，颜色必须通过sass变量方式使用
```
### css 混入
```
sass函数存放在 src/styles/mixin.scss下 常用的有flex布局，多行注释，文本居中等
```
### 字体
```
默认字体 16px 设置字体必须从 src/styles/atoms.scss 中应用，不得直接设置值
```
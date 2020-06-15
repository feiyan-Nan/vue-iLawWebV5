
## js
### 代码风格
#### 缩进
> 2个空格作为一个缩进层级，不允许使用4个空格或者tab字符。<br>使用Eslint自动格式化工具可以忽略

### 命名
【变量】使用Camel命名

示例：
> let LoadingModules = {}

【常量】 字母全部大写 单词中间以下划线相连

示例:

> let HTML_ENTITY = {} <br>
公用的常量存放位置：@/utils/constants

【函数】 使用Camel命名法

示例：
> function stringFormat(source){<br>}

函数的【参数】 使用 Camel命名法

示例：
> function hear(theBells){<br>}

【枚举变量】使用Pascal命名法 枚举属性 使用全部字母大写，单词间下划线分割的命名方式

示例：
> const TaskDetail = {<br>
    STATE_FINISHED:1, <br>
    TIME_TYPE:0 <br>
}
boolean 类型的变量使用 is 或 has 开头

示例：
> let isFinished = false;

### 变量
 不使用var ,用 let 和 const 代替
### 类型转换
转换成String 时，使用 + ''

示例：
```
//good 
num + ''

//bad
new String(num)
num.toString()
String(num)
```
转换晨Number时，使用 +

示例：

`
//good
+str

//bad

Number(str)
`
string 转 number 必须指定进制

`
//good
 parseInt(str,10)

//bad
parseInt(str)
`

转换成boolean时，使用!!

示例：

```
let num =1024
!!num
```
### 注释
为了便于代码阅读，以下内容必须好办/**.......*/形式的快注释中
```
    1 文件
    2 函数或方法
    3 全局变量
    4 常量
```
注释中类型定义
| 类型定义 | 语法示例 | 解释 |
| ------- | ------- | --- |
|String|{string}|--|
|Number|{number}|--|
|Boolean|{boolean}|--|
|Object|{Object}|--|
|Function|{Function}|--|
|RegExp|{RegExp}|--|
|Array|{Array}|--|
|Date|{Date}|--|
|单一类型集合|{Array.&lt;string&gt;}|string 类型的数组|
|多类型|{(number｜boolean)}|可能是 number 类型, 也可能是 boolean 类型|
|允许为null|{?number}|可能是 number, 也可能是 null|
|不允许为null|{!Object}|Object 类型, 但不是 null|
|Function类型|{function(number, boolean)}|函数, 形参类型|
|Function带返回值|{function(number, boolean):string}|函数, 形参, 返回值类型|
|Promise|Promise.&lt;resolveType, rejectType&gt;|Promise，成功返回的数据类型，失败返回的错误类型|
|参数可选|@param {string=} name|可选参数, =为类型后缀|
|可变参数|@param {...number} args|变长参数,  ...为类型前缀|
|任意类型|{*}|任意类型|
|可选任意类型|@param {*=} name|可选参数，类型不限|
|可变任意类型|@param {...*} args|变长参数，类型不限|


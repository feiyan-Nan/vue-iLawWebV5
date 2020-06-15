## 设计背景
  
	基于当前iLawWeb前端框架开发效率低，且不易于维护，隧采用渐进升级方式将现有框架逐步升级到vue.

## 具体方案：iframe

### iLawWeb使用示例

```pug
iframe(
	id="v5Iframe"
	name="v5Iframe"
	frameborder="0"
	style="width:100%;border:0;margin-top:20px"
	src="/v5/#/app/my/task/calendar"
)
```
### 使用方法：
#### 启动
- 本地启动iLawWeb工程
- 本地启动iLawWebV5工程，确保改工程启动端口是50001
- 新工程即可在老工程中访问到
#### 通信
- 向父页面发送消息： 文件路径： src/utils/postMessage.js
示例:打开任务详情弹窗
```js
this.$postMessage.openTaskDetail(task.id)

---------------------------------------
// 在新工程中postMessage.js中配置对应的方法
  openTaskDetail: taskId => {
    const message = {type: MESSAGE_TYPE.OPEN_TASK_DETAIL, content: {taskId}}
    handlerPostMessage(message)
  }

---------------------------------------
// 在老工程的postMessage.js 中配置相应的接受函数
function openTaskDetail(content) {
  taskToolService.viewTaskDetail(content.taskId, function(){
    // 给iframe传递消息通知
    window.frames['v5Iframe'] && window.frames['v5Iframe'].$$messageManage({type: 'closeDetailPage'});
  });
}
```
### iframe同源实现原理
> 本地开发
iLawWeb 工程中增加gulp配置如下
```js
proxyMiddleware(['/v5/'], {
    target: 'http://localhost:50001',
    changeOrigin: true,
    logLevel: 'error',
    pathRewrite: {
      '/v5/': '/',
    },
  }),
proxyMiddleware(['/app.vue.js','/static'], {
  target: 'http://localhost:50001',
  changeOrigin: true,
  logLevel: 'error',
})
```
iLawWeb会将/v5的请求以及对应的app.vue.js代理到 iLawWebV5

> 线上
通过负载均衡代理所有v5子目录下的请求到新工程

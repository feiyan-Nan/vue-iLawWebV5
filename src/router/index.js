import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/vue/views/HomePage'
import ErrorPage from '@/vue/views/ErrorPage'
// import MineHome from '@/vue/views/my/My'
import NoticeCenter from '@/vue/views/notice/NoticeCenter'
import NotificationDetail from '@/vue/views/notice/content/detail/NotificationDetail'
import ActivateByWechat from '@/vue/views/login/activate_wechat/ActivateByWechat'
import ActivateByWechatCallback from '@/vue/views/login/activate_wechat/ActivateByWechatCallback'
// import analysis from '@/utils/analysis'
// import MyTaskList from '@/vue/views/my/task/List'
import MatterTaskList from '@/vue/views/matter/task/List'

Vue.use(Router)
let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/app/my/task/calendar',
      components: {
        default: HomePage
      },
      children: [
        {
          path: '/app/my/task/calendar',
          name: '我的日历',
          component: resolve => {
            require(['@/vue/views/my/My'], resolve)
          },
          meta: {title: '我的日历'}
        },
        {
          path: '/app/my/task/list',
          name: '我的任务列表',
          component: resolve => {
            require(['@/vue/views/my/task/List'], resolve)
          }
        },
        {
          path: '/app/matter/find/:matterId/U/calendar',
          name: '项目日历',
          component: resolve => {
            require(['@/vue/views/my/My'], resolve)
          },
          meta: {title: '项目日历'}
        },
        {
          path: '/app/matter/find/:matterId/U/task',
          name: '项目下任务列表',
          component: MatterTaskList
        },
        {
          path: '/app/notice',
          name: 'notice',
          component: NoticeCenter,
          children: [
            {
              path: 'detail',
              name: 'notificationDetail',
              component: NotificationDetail
            }
          ]
        }
      ]
    },
    // 微信激活扫码页
    {
      path: '/activate/wechat',
      components: {
        default: ActivateByWechat
      },
    },
    // 微信激活回调页
    {
      path: '/activate/wxactivateback',
      components: {
        default: ActivateByWechatCallback
      },
    },
    {
      path: '*',
      name: 404,
      component: ErrorPage
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {x: 0, y: 0}
    }
  }
})
// 路由监控操作
// router.afterEach(function (to, from, next) {
//   // 神策数据统计--暂时关闭，因为父容器已经有定义了
//   // analysis.routeTrack(to)
//   window.document.title = `Alpha-${to.meta.title || '不止律所管理系统'}`
//   next()
// })

export default router
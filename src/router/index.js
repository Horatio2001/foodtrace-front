import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' , affix:true}
    }]
  },

  {
    path: '/Network',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Network',
        component: () => import('@/views/network/index'),
        meta: { title: '网络信息', icon: 'network' , affix:true}
      }
    ]
  },

  {
    path: '/Blocks',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Blocks',
        component: () => import('@/views/blocks/index'),
        meta: { title: '区块信息', icon: 'blocks' , affix:true}
      }
    ]
  },

  {
    path: '/Transactions',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Transactions',
        component: () => import('@/views/transactions/index'),
        meta: { title: '交易信息', icon: 'transactions' , affix:true}
      }
    ]
  },
  {
    path: '/Chaincodes',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Chaincodes',
        component: () => import('@/views/chaincodes/index'),
        meta: { title: '链码信息', icon: 'chaincodes' , affix:true}
      }
    ]
  },
  {
    path: '/resource',
    component: Layout,
    redirect: '/resource/allInfo',
    name: 'Resource',
    meta: {
      title: '资源管理',
      icon: 'nested'
    },
    children: [
      {
        path: 'allInfo',
        component: () => import('@/views/resource/allInfo/index'), // Parent router-view
        name: 'AllInfo',
        meta: { title: '全部资源' , affix:true}
      },
      {
        path: 'collectInfo',
        component: () => import('@/views/resource/collectInfo/index'),
        name: 'CollectInfo',
        meta: { title: '收集信息列表' , affix:true}
      },
      {
        path: 'saveInfo',
        component: () => import('@/views/resource/saveInfo/index'),
        name: 'SaveInfo',
        meta: { title: '资源保存列表' , affix:true}
      },
      {
        path: 'enterInfo',
        component: () => import('@/views/resource/enterInfo/index'),
        name: 'EnterInfo',
        meta: { title: '资源录入列表' , affix:true}
      },
      {
        path: 'shareInfo',
        component: () => import('@/views/resource/shareInfo/index'),
        name: 'ShareInfo',
        meta: { title: '资源共享列表' , affix:true}
      }
    ]
  },
  {
    path: '/LoadedInfo',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'LoadedInfo',
        component: () => import('@/views/loadedInfo/index'),
        meta: { title: '存证数据', icon: 'skill' , affix:true}
      }
    ]
  },
  {
    path: '/Tracing',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Tracing',
        component: () => import('@/views/tracing/index'),
        meta: { title: '区块链溯源', icon: 'tab' , affix:true}
      }
    ]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/Horatio2001',
        meta: { title: 'External Link', icon: 'link' , affix:true}
      }
    ]
  },
  {
    path: '/AppTracing',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'AppTracing',
        component: () => import('@/views/appTracing/index'),
        hidden: true,
        meta: { title: '移动端溯源', icon: 'tab' , affix:true}
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

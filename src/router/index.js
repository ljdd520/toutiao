// import { createRouter, createWebHashHistory } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { Dialog } from 'vant'
import store from '@/store'
// import { createRouter } from 'vue-router'
// 路由懒加载
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/',
    component: () => import('@/views/layout/'),
    children: [
      {
        path: '',
        redirect: '/home'
      },
      {
        path: '/home', // 默认子路由
        name: 'home',
        component: () => import('@/views/home/'),
        meta: {
          requiresAuth: false
        }
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa/'),
        meta: {
          requiresAuth: false
        }
      },
      {
        path: '/video', // 默认子路由
        name: 'video',
        component: () => import('@/views/video/'),
        meta: {
          requiresAuth: false
        }
      },
      {
        path: '/my', // 默认子路由
        name: 'my',
        component: () => import('@/views/my/')
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article/'),
    props: true,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile/'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/user/chat',
    name: 'user-chat',
    component: () => import('@/views/user-chat/'),
    meta: {
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  // history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.state.user) {
    Dialog.confirm({
      title: '访问提示',
      message: '该功能需要登录才能访问，确认登录吗?'
    }).then(() => {
      router.replace({
        name: 'login',
        // 登录成功后跳入浏览的当前页面
        query: {
          redirect: router.currentRoute.value.fullPath
        }
      })
    }).catch(() => {
      next(false)
    })
  } else {
    next()
  }
})

export default router

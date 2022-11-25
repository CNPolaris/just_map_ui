import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/baidu',
      component: () => import('../views/baidu/baidu.vue')
    },
    {
      path:'/grid/index',
      name: 'BaiduGrid',
      component: () => import('@/views/baidu/index.vue')
    }
  ]
})

export default router

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/baidu/index',
      name: 'BaiduGrid',
      component: () => import('@/views/baidu/index.vue')
    }
  ]
})

export default router

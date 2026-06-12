import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { routes } from '@common/routes';

export const constantRoutes: RouteRecordRaw[] = [
  ...routes,
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
})

// 全局路由守卫
// router.beforeEach(async (to, from, next) => {
//   // const token = getToken()
//   // const userStore = useUserStore()
//   const whiteList = ['/login']

//   // if (token) {
//   //   if (to.path === '/login') {
//   //     next('/')
//   //   } else {
//   //     if (!userStore.userInfo.id) {
//   //       await userStore.getUserInfo()
//   //       next({ ...to, replace: true })
//   //     } else {
//   //       next()
//   //     }
//   //   }
//   // } else {
//   //   if (whiteList.includes(to.path)) {
//   //     next()
//   //   } else {
//   //     next('/login')
//   //   }
//   // }
//   next();
// });

export default router
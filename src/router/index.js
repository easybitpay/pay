import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(),
  routes: [

    /**
     * Pay Layout
     */
    {
      path: '/pay',
      redirect: '/pay/invoice',
      component: () => import('@/layouts/PayLayout.vue'),
      children: [
        {
          path: 'invoice/:id',
          name: 'select-coin',
          component: () => import('@/views/pay/SelectToken.vue')
        },
        {
          path: 'gateway/:id',
          name: 'gateway',
          component: () => import('@/views/pay/Gateway.vue')
        },
        {
          path: 'status/:id',
          name: 'status',
          component: () => import('@/views/pay/Status.vue')
        }
      ]
    },

    /**
     * Pay Sandbox Layout
     */
    {
      path: '/pay-sandbox',
      redirect: '/pay/invoice',
      component: () => import('@/layouts/PayLayout.vue'),
      props: { sandbox: true },
      children: [
        {
          path: 'invoice/:id',
          name: 'select-coin-sandbox',
          component: () => import('@/views/pay/SelectToken.vue'),
          props: { sandbox: true }
        },
        {
          path: 'gateway/:id',
          name: 'gateway-sandbox',
          component: () => import('@/views/pay/Gateway.vue'),
          props: { sandbox: true }
        },
        {
          path: 'status/:id',
          name: 'status-sandbox',
          component: () => import('@/views/pay/Status.vue'),
          props: { sandbox: true }
        }
      ]
    },

    {
      // the 404 route, when none of the above matches
      path: '/404',
      name: '404',
      component: () => import('@/views/Error404.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404'
    }
  ]
})

router.beforeEach(() => {
  // Scroll page to top on every route change
  setTimeout(() => {
    window.scrollTo(0, 0)
  }, 100)
})

export default router

import { adminRoutes } from '@/modules/admin/routes'
import { authRoutes } from '@/modules/auth/routes'
import ShopLayout from '@/modules/shop/layouts/ShopLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'shop',
      component: ShopLayout,
      children: [
        {
          path:  '',
          name: 'home',
          component: () => import("@/modules/shop/views/HomeView.vue"),
        },
        {
          path: 'producto/:id',
          name: 'product-detail',
          // Asegúrate de que esta ruta coincida con dónde guardaste el archivo
          component: () => import("@/modules/shop/views/ProductDetailView.vue"), 
        }
      ],
    },

    //auth routes

    authRoutes,

    //admin routes

    adminRoutes,

  ],
})

export default router

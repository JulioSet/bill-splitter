import HistoryPage from '@/pages/HistoryPage.vue'
import HomePage from '@/pages/HomePage.vue'
import ReviewReceiptPage from '@/pages/ReviewReceiptPage.vue'
import SplitBillPage from '@/pages/SplitBillPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/review',
      name: 'review',
      component: ReviewReceiptPage,
    },
    {
      path: '/split',
      name: 'split',
      component: SplitBillPage,
    },
    {
      path: '/history',
      name: 'history',
      component: HistoryPage,
    },
  ],
})

export default router

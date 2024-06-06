import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: HomeView
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/groups',
      name: 'Groups',
      // Assuming you have a GroupsView component
      component: () => import('../views/Groups.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  // Replace `isLoggedIn` with your actual logic to check if the user is logged in
  const isLoggedIn = false;

  if (!isLoggedIn && to.path !== '/login') {
    next('/login');
  } else if (isLoggedIn && to.path === '/login') {
    next('/groups');
  } else {
    next();
  }
});

export default router;
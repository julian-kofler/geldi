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
      component: () => import('../views/Groups.vue')
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Signup.vue')
    },
  ]
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('jwt') ? true : false;;

  if (to.path === '/logout') {
    localStorage.removeItem('jwt');
    next('/login');
  }

  if (!isLoggedIn && (to.path !== '/login' && to.path !== '/signup')) {
    next('/login');
  } else if (isLoggedIn && (to.path === '/login' || to.path === '/signup')) {
    next('/groups');
  } else {
    next();
  }
});

export default router;
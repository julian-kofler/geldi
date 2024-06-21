import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/signin",
      name: "Signin",
      component: () => import("./modules/registration/signin.vue"),
    },
    {
      path: "/signup",
      name: "Signup",
      component: () => import("./modules/registration/signup.vue"),
    },
  ],
});

export default router;

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/:pathMatch(.*)*",
      redirect: "/groups",
    },
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
    {
      path: "/settings",
      name: "Settings",
      component: () => import("./modules/settings/settings.vue"),
    },
    {
      path: "/groups",
      name: "Groups",
      component: () => import("./modules/groups/groups.vue"),
    },
    {
      path: "/groups/:groupID(\\d+)",
      name: "Group",
      component: () => import("./modules/group/group.vue"),
      // props: {mode: "view"}
    },
    {
      path: "/groups/:groupID(\\d+)/manage",
      component: () => import("./modules/groups/pages/editGroup.vue"),
      props: {mode: "view"}
    },
    {
      path: "/groups/new",
      component: () => import("./modules/groups/pages/editGroup.vue"),
      props: {mode: "new"}
    },
    {
      path: "/groups/:groupID(\\d+)/expense/:expenseID(\\d+)",
      component: () => import("./modules/group/pages/editExpense.vue"),
      props: {mode: "view"}
    },
    {
      path: "/groups/:groupID(\\d+)/expense/new",
      component: () => import("./modules/group/pages/editExpense.vue"),
      props: {mode: "new"}
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem("jwt") ? true : false;

  if (!isLoggedIn && to.path !== "/signin" && to.path !== "/signup") {
    next("/signin");
  } else if (isLoggedIn && (to.path === "/signin" || to.path === "/signup")) {
    next("/groups");
  } else {
    next();
  }
});

export default router;

import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/Login.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/Login.vue"),
    },
    {
      path: "/groups",
      name: "Groups",
      component: () => import("../views/Groups.vue"),
    },
    {
      path: "/groups/:groupId",
      name: "GroupDetail",
      component: () => import("../views/GroupDetail.vue"),
    },
    {
      path: "/groups/:groupId/manage",
      name: "GroupManage",
      component: () => import("../views/GroupManage.vue"),
    },
    {
      path: "/groups/:groupId/new-expense",
      name: "newExpense",
      component: () => import("../views/createExpense.vue"),
    },
    {
      path: "/new-group",
      name: "newGroup",
      component: () => import("../views/newGroup.vue"),
    },
    // {
    //   path: '/groups/:groupId/expenses/:expenseId',
    //   name: 'Expense',
    //   component: () => import('../views/Expense.vue')
    // },
    {
      path: "/signup",
      name: "Signup",
      component: () => import("../views/Signup.vue"),
    },
    {
      path: "/settings",
      name: "Settings",
      component: () => import("../views/Settings.vue"),
    },
    {
      path: "/balance",
      name: "Balance",
      component: () => import("../views/Balance.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem("jwt") ? true : false;

  if (to.path === "/logout") {
    localStorage.removeItem("jwt");
    next("/login");
  }

  if (!isLoggedIn && to.path !== "/login" && to.path !== "/signup") {
    next("/login");
  } else if (isLoggedIn && (to.path === "/login" || to.path === "/signup")) {
    next("/groups");
  } else {
    next();
  }
});

export default router;

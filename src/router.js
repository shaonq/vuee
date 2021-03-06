import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import store from "@/store";
Vue.use(VueRouter);
import { docsRoute, serversRoute, developerRoute } from "@/views/routeFile.js";
const V = path => Vue.extend(require(`@/views/${path}.vue`).default);
const getChildren = (arr, file) => {
  let children = arr.map((item, index) => {
    return { path: item.url, component: V(item.path) };
  });
  children.push({ path: "", component: V(arr[0].path) });
  return children;
};



const router = new VueRouter({
  linkActiveClass: "is-active",
  linkExactActiveClass: "is-exact-active",
  routes: [
    {
      path: "/",
      component: V("Layout"),
      children: [
        { path: "", redirect: "/docs" },
        {
          path: "docs",
          component: V("docs/Index"),
          children: getChildren(docsRoute)
        },
        {
          path: "developer",
          component: V("developer/Index"),
          children: getChildren(developerRoute)
        },
        { path: "*", component: V("404") }
      ]
    }
  ]
});

// 用户登录
router.beforeEach(({ name, matched, fullPath }, from, next) => {
  if (
    matched.some(item => item.meta.auth) &&
    name !== "login" &&
    !store.getters.token
  ) {
    return next({ name: "login", query: { redirect: fullPath } });
  }
  next();
});

export default router;

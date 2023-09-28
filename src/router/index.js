import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../view/HomeView.vue";
import AboutView from "../view/AboutView.vue";
import checkboxGroup from "../view/checkboxGroup.vue";
import content from "../view/content.vue";

import setoptios from "../view/setoptios.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
  {
    path: "/checkboxGroup",
    name: "checkboxGroup",
    component: checkboxGroup,
  },
  {
    path: "/content",
    name: "content",
    component: content,
  },
  {
    path: "/setoptios",
    name: "setoptios",
    component: setoptios,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

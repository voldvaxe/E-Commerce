import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import SignIn from "../views/SignInView.vue";
import SignUp from "../views/SignUpView.vue";
import Products from "../views/ProductsView.vue";
import Categories from "../views/CategoriesView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/SignIn",
    name: "signIn",
    component: SignIn,
  },
  {
    path: "/SignUp",
    name: "signUp",
    component: SignUp,
  },
  {
    path: "/Products",
    name: "products",
    component: Products,
  },
  {
    path: "/Categories",
    name: "categories",
    component: Categories,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

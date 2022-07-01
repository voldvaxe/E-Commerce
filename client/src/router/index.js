import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SignIn from "../views/SignInView.vue";
import SignUp from "../views/SignUpView.vue";
import ProductsView from "../views/ProductsView.vue";
import Cart from "../views/CartView.vue";
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
    path: "/Products/:id",
    name: "products",
    component: ProductsView,
  },
  {
    path: "/Cart",
    name: "cart",
    component: Cart,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

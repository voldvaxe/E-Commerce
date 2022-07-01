import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: "",
    products: [],
    categories: [],
  },
  getters: {},
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setProducts(state, products) {
      state.products = products;
    },
    setCategories(state, cetegories) {
      state.categories = cetegories;
    },
    deleteProduct(state, productId) {
      const products = state.products.filter((elm) => {
        return elm._id !== productId;
      });
      state.products = products;
    },
    deleteCategory(state, categoryId) {
      const categories = state.categories.filter((elm) => {
        return elm._id !== categoryId;
      });
      state.categories = categories;
    },
    appendProducts(state, products) {
      state.products.push(...products);
    },
  },
  actions: {},
  modules: {},
});

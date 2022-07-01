import axios from "axios";
import { createStore } from "vuex";

export default createStore({
  state: {
    token: "",
    categories: [],
    products: [],
    lte: "",
    gte: "",
    regex: "",
    selectedCategory: "",
    info: {},
    loadMore: true,
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
    setInfo(state, info) {
      state.info = info;
    },
    setLte(state, lte) {
      state.lte = lte;
    },
    setGte(state, gte) {
      state.gte = gte;
    },
    setRegex(state, regex) {
      state.regex = regex;
    },
    setSelectedCategory(state, selectedCategory) {
      state.selectedCategory = selectedCategory;
    },
    appendProducts(state, products) {
      state.products.push(...products);
    },
    setLoadMore(state, val) {
      state.loadMore = val;
    },
  },
  actions: {
    async getProducts(context) {
      context.commit("setLoadMore", true);
      const res = await axios.get(
        `/api/product?filter={"category": "${
          context.state.selectedCategory
        }", "price" : {"$lte" : "${context.state.lte}", "$gte": "${
          context.state.gte
        }"}, "name" : {"$regex": "${context.state.regex}"}}&page=${1}`
      );
      if (res.data.result < 9) context.commit("setLoadMore", false);
      console.log(res.data.products);
      context.commit("setProducts", res.data.products);
    },
    async appendProducts(context, pageNumber) {
      const res = await axios.get(
        `/api/product?filter={"category": "${context.state.selectedCategory}", "price" : {"$lte" : "${context.state.lte}", "$gte": "${context.state.gte}"}, "name" : {"$regex": "${context.state.regex}"}}&page=${pageNumber}`
      );
      if (res.data.result < 9) context.commit("setLoadMore", false);
      context.commit("appendProducts", res.data.products);
    },
  },
  modules: {},
});

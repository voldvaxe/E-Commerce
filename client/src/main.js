import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import axios from "axios";

loadFonts();
axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_URL;

createApp(App).use(router).use(store).use(vuetify).mount("#app");

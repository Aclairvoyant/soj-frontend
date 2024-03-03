import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ArcoVue from "@arco-design/web-vue";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
import "@arco-design/web-vue/dist/arco.css";
import "@/plugins/axios";
import "@/access/index";

const app = createApp(App);
app.use(ArcoVue).use(ArcoVueIcon);
app.use(store).use(router).mount("#app");

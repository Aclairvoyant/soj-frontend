import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ArcoVue from "@arco-design/web-vue";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
import "@arco-design/web-vue/dist/arco.css";
import "@/plugins/axios";
import "@/access/index";
import 'bytemd/dist/index.css';

createApp(App)
    .use(ArcoVue)
    .use(ArcoVueIcon)
    .use(store)
    .use(router)
    .mount("#app");

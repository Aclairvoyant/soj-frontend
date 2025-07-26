import { createStore } from "vuex";
import user from "@/store/user";
import message from "@/store/modules/message-optimized";

export const store = createStore({
  mutations: {},
  actions: {},
  modules: {
    user,
    message
  },
});

export default store;

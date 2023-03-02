import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import VueResponsiveness from "vue-responsiveness";

createApp(App).use(VueResponsiveness).mount("#app");

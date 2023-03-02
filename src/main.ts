import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import VueResponsiveness from "./types/vue-responsiveness";

createApp(App)
  .use(VueResponsiveness, {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    "2xl": 1500,
    "3xl": 1800,
  })
  .mount("#app");

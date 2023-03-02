import { VueResponsivenessMatches } from "./types";
import VueResponsiveness from "./vue-responsiveness";

declare module "@vue/runtime-core" {
  // eslint-disable-next-line no-unused-vars
  interface ComponentCustomProperties {
    $matches: VueResponsivenessMatches;
  }
}

export default VueResponsiveness;

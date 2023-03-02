import { VueResponsivenessMatches } from "./types";

declare module "vue" {
  // eslint-disable-next-line no-unused-vars
  interface ComponentCustomProperties {
    $matches: VueResponsivenessMatches;
  }
}

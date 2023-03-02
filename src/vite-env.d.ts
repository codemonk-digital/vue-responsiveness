/// <reference types="vite/client" />

import {VueResponsivenessMatches} from "./types";

declare module "@vue/runtime-core" {
    // eslint-disable-next-line no-unused-vars
    interface ComponentCustomProperties {
        $matches: VueResponsivenessMatches;
    }
}
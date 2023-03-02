import {
  VueResponsivenessBreakpoints,
  VueResponsivenessMatches,
} from "./types";
import { ReactiveVariable } from "vue/macros";
import { App, reactive } from "vue";
const VueResponsiveness = {
  install(
    app: App,
    breakpoints: VueResponsivenessBreakpoints = {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
    }
  ): App {
    const queries: Record<string, { min: string; max: string }> =
      Object.entries(breakpoints)
        .sort(([, a], [, b]) => (a || 0) - (b || 0))
        .reduce((out, [key, min], i, arr) => {
          out[key] = {
            min: min ? `(min-width: ${min}px)` : "",
            max: arr[i + 1]?.[1]
              ? `(max-width: ${arr[i + 1]?.[1]! - 0.1}px)`
              : "",
          };
          return out;
        }, {} as Record<string, { min: string; max: string }>);
    const matches: ReactiveVariable<VueResponsivenessMatches> = reactive({
      ...Object.assign(
        {},
        ...Object.keys(queries).map((_) => ({
          [_]: { min: false, max: false, only: false },
        }))
      ),
    });

    Object.entries(queries).forEach(([interval, query]) => {
      const match: Record<"min" | "max", MediaQueryList> = {
        min: window.matchMedia(query.min),
        max: window.matchMedia(query.max),
      };
      Object.entries(match).forEach(([key, query]) => {
        const listener = ({ matches: val }: { matches: boolean }) => {
          const { min, max } = { ...matches[interval], [key]: val } as {
            min: boolean;
            max: boolean;
          };
          matches[interval] = { min, max, only: min && max };
        };
        query.addEventListener("change", listener);
        listener(query);
      });
    });

    app.config.globalProperties.$matches = matches;

    return app;
  },
};

export default VueResponsiveness;

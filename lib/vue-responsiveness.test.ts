import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import App from "../src/App.vue";
import { VueResponsiveness, useMatches } from "./vue-responsiveness";
import { VueResponsivenessBreakpoints } from "./types";
import { Presets } from "./presets";
import { defineComponent } from "vue";

describe("vue-responsiveness", () => {
  const bs5 = Object.assign(
    {},
    {
      current: "xs",
    },
    ...Object.keys(Presets.Bootstrap_5).map((key) => ({
      [key]: {
        max: true,
        min: true,
        only: true,
      },
    }))
  );
  const render = (preset?: VueResponsivenessBreakpoints) =>
    mount(App, {
      global: {
        plugins: [[VueResponsiveness, preset]],
      },
    });

  it("should work", () => {
    expect(render().element).toMatchSnapshot();
  });

  it("should work with custom breakpoints", () => {
    expect(render({ min: null, max: 1000 }).element).toMatchSnapshot();
  });

  it("should reverse unordered values", () => {
    expect(render({ max: 1000, min: null }).element).toMatchSnapshot();
  });

  it("should match $matches", () => {
    expect(render().vm.$matches).toEqual(bs5);
  });

  it("useMatches() should work", () => {
    const App = defineComponent({
      setup() {
        const matches = useMatches();
        return { matches };
      },
      template: "<div />",
    });
    const { vm } = mount(App, {
      global: {
        plugins: [[VueResponsiveness]],
      },
    });
    expect(vm.matches).toEqual(bs5);
  });
});

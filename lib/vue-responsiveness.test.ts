import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import App from "../src/App.vue";
import { VueResponsiveness } from "./vue-responsiveness";
import { VueResponsivenessBreakpoints } from "./types";

describe("vue-responsiveness", () => {
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
});

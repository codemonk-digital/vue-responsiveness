# Vue Responsiveness

Reactive breakpoint and media preference state for Vue 3, powered by the browser's native `matchMedia` API.

[Try the live demo](https://codemonk-digital.github.io/vue-responsiveness/) · [View the example source](https://github.com/codemonk-digital/vue-responsiveness/blob/main/src/App.vue)

[![Total downloads](https://img.shields.io/npm/dt/vue-responsiveness.svg?style=flat-square&color=f9d342)](https://www.npmjs.com/package/vue-responsiveness)
[![Latest release](https://img.shields.io/npm/v/vue-responsiveness.svg?style=flat-square&color=f9d342)](https://www.npmjs.com/package/vue-responsiveness)
[![License](https://img.shields.io/npm/l/vue-responsiveness.svg?style=flat-square&color=f9d342)](https://github.com/codemonk-digital/vue-responsiveness/blob/main/LICENSE)
![Dependencies](https://img.shields.io/badge/dependencies-0-f9d342.svg?style=flat-square)
[![Minzip size](https://img.shields.io/bundlephobia/minzip/vue-responsiveness.svg?style=flat-square&color=f9d342)](https://bundlephobia.com/package/vue-responsiveness)
![Coverage](https://img.shields.io/badge/coverage-100%25-f9d342.svg?style=flat-square)
![SSR compatibility](https://img.shields.io/badge/SSR-ready-f9d342.svg?style=flat-square)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-f9d342.svg?style=flat-square)](https://makeapullrequest.com)

Use it when you want Vue components to react to breakpoints, orientation, hover support, color scheme, reduced motion, and contrast preferences without manually wiring `window.matchMedia`.

## Features

- **Vue-friendly API**: use `$matches` in templates or `useMatches()` in `<script setup>`.
- **Breakpoint presets included**: start with Bootstrap 5 by default, or switch to Tailwind CSS, Vuetify, Bulma, and more.
- **Custom breakpoints**: define your own app-specific intervals with a plain object.
- **Media query support**: react to viewport width, `orientation`, `hover`, `prefers-color-scheme`, `prefers-contrast`, and `prefers-reduced-motion`.
- **SSR safe**: it does not touch `window` during server rendering.
- **Zero runtime dependencies**: lightweight and built on the browser's native `window.matchMedia`.
- **Automatic cleanup**: listeners are attached to `MediaQueryList` objects and cleaned up with the Vue app.

## Installation

Use the package manager your project already uses.

| Package manager | Command |
|-----------------|---------|
| pnpm | `pnpm add vue-responsiveness` |
| yarn | `yarn add vue-responsiveness` |
| npm | `npm install vue-responsiveness` |

## Quick start

### 1. Register the plugin

In `main.ts`:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { VueResponsiveness } from 'vue-responsiveness'

createApp(App)
  .use(VueResponsiveness)
  .mount('#app')
```

That is enough to use the default Bootstrap 5 breakpoints.
For other frameworks (Tailwind CSS, Vuetify, etc.), or your own intervals, see [Breakpoint management](#breakpoint-management).

### 2. Choose how to read responsive state

Install with `.use(VueResponsiveness)` once for each Vue app. Templates can read `$matches` directly; JavaScript can call `useMatches()` inside a component's `setup()` or `<script setup>` to get that app's responsive state. Calling `useMatches()` outside setup throws because there is no current component to identify the app.

#### Option A: use `$matches` in templates

Every component can read `$matches` in its template, without importing.

```html
<template>
  <div>
    <p>Current breakpoint: {{ $matches.current || 'unknown' }}</p>

    <p v-if="$matches.md.min">
      This is visible on medium screens and larger.
    </p>

    <p v-if="$matches.sm.max">
      This is visible on small screens and smaller.
    </p>

    <p v-if="$matches.prefers.colorScheme === 'dark'">
      Dark mode is preferred.
    </p>
  </div>
</template>
```

#### Option B: use `useMatches()` in script setup

Use the composable when you need responsive state in computed values, watchers, or methods.

Call `useMatches()` synchronously during `setup()` or `<script setup>` after registering the plugin. It resolves the state belonging to that Vue app and throws a descriptive error when called outside setup or without the plugin. Keep the returned object for use in callbacks and methods.

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useMatches } from 'vue-responsiveness'

const matches = useMatches()

const showSidebar = computed(() => matches.md.min)
</script>

<template>
  <main>
    <aside v-if="showSidebar">
      Sidebar navigation
    </aside>

    <nav v-else>
      Mobile navigation
    </nav>
  </main>
</template>
```

You can also use helper methods:

```ts
const showDesktopNav = computed(() => matches.isMin('lg'))
const showMobileNav = computed(() => matches.isMax('sm'))
const isTabletLayout = computed(() => matches.isOnly('md'))
```

## Breakpoint management

### Use a preset

The plugin uses `Presets.Bootstrap_5` by default. To use a different preset, pass it as the second argument to `app.use()`.

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { VueResponsiveness, Presets } from 'vue-responsiveness'

createApp(App)
  .use(VueResponsiveness, Presets.Tailwind_CSS)
  .mount('#app')
```

Available presets:

`Ant_Design`, `Bootstrap_3`, `Bootstrap_4`, `Bootstrap_5`, `Bulma`, `Chakra`, `Foundation`, `Ionic`, `Master_CSS`, `Material_Design`, `Materialize`, `Material_UI`, `Quasar`, `Semantic_UI`, `Skeleton`, `Tailwind_CSS`, `Vuetify`, `Vuetify_3`, `Windi_CSS`

See [preset versions and sources](docs/presets.md) for the supported scales, aliases, and unit assumptions. `Vuetify` preserves its existing five-tier scale; choose `Vuetify_3` to include the `xxl` interval at 2560px. Chakra v2's `2xl` minimum is 1536px, and Materialize 1.0 uses minima of 601/993/1201px.

`Bootstrap_3` follows the [Bootstrap 3.4 grid](https://getbootstrap.com/docs/3.4/css/#grid-media-queries): `sm: 768`, `md: 992`, `lg: 1200`. `Material_UI` retains the [Material UI v4 defaults](https://v4.mui.com/customization/breakpoints/), including `lg: 1280`; it does not automatically track later framework versions. These correct the earlier Bootstrap 3 values and Material UI's `1260px` large threshold. Apps overriding framework defaults should pass their own breakpoint object.

<details>
<summary>Bootstrap 5 preset details</summary>

```ts
Presets.Bootstrap_5 = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
}
```

</details>

Each Vue app has one breakpoint configuration and one responsive state object shared by its components. Separate apps, including server-rendered apps, have independent state and media listeners. Unmounting an app removes only its listeners. Breakpoint status objects keep their identity as the viewport changes, so retaining `const md = matches.md` preserves reactivity.

### Define custom breakpoints

Pass an object whose keys are your breakpoint names and whose values are the minimum width in pixels. Each interval includes its minimum and ends immediately before the next distinct minimum, including at fractional viewport widths.

Widths must be finite, non-negative numbers; `null` remains supported as an alias for zero. Names cannot be empty, collide with `$matches` members (such as `current` or `prefers`), use inherited object names, or start with Vue's reserved `__v_` prefix. Invalid configuration throws before listeners are attached.

An empty object enables preference queries without width breakpoints. Names sharing a minimum width are aliases for the same interval; `current` selects the first configured name at that width.

```ts
app.use(VueResponsiveness, {
  small: 0,
  medium: 777,
  large: 1234
})
```

Then use those names in templates:

```html
<!-- Applies when 777px <= viewport width < 1234px -->
<template v-if="$matches.medium.only">
  <TwoColumnLayout />
</template>
```

## API Reference

`$matches` and `useMatches()` expose the same reactive object. Use `$matches` in templates and `useMatches()` in JavaScript or TypeScript.

### Breakpoint status properties

Each breakpoint key, such as `sm`, `md`, `lg`, or one of your custom names, contains three booleans.

| Name                  | Type      | Description | Example Access |
|-----------------------|-----------|-------------|----------------|
| `current`             | `string`  | The breakpoint interval that currently matches. | `$matches.current` |
| `[breakpointKey].min` | `boolean` | `true` at this breakpoint width and above. | `$matches.md.min` |
| `[breakpointKey].max` | `boolean` | `true` up to and including this breakpoint range. | `$matches.lg.max` |
| `[breakpointKey].only`| `boolean` | `true` only inside this breakpoint range. | `$matches.sm.only` |

### Breakpoint helper methods

These are handy in computed values and methods.

| Name                | Type                         | Description | Example usage                         |
|---------------------|------------------------------|-------------|---------------------------------------|
| `isMin(breakpoint)` | `(breakpointKey) => boolean` | Matches at this breakpoint and above. | `matches.isMin('md')` |
| `isMax(breakpoint)` | `(breakpointKey) => boolean` | Matches inside this breakpoint range and below. | `matches.isMax('sm')` |
| `isOnly(breakpoint)`| `(breakpointKey) => boolean` | Matches only inside this breakpoint range. | `matches.isOnly('lg')` |

### Additional media query properties

These values mirror common CSS media queries, but are available directly in Vue.

| Name                    | Type                              | Description | Media query equivalent |
|-------------------------|-----------------------------------|-------------|------------------------|
| `orientation`           | `'portrait' \| 'landscape'`       | The current device orientation | `@media (orientation: *)` |
| `hover`                 | `'none' \| 'hover'` | The hover capability of the device | `@media (hover: *)` |
| `prefers.reducedMotion` | `'no-preference' \| 'reduce'` | User preference for reduced motion | `@media (prefers-reduced-motion: *)` |
| `prefers.colorScheme`   | `'light' \| 'dark'` | User preference for color scheme | `@media (prefers-color-scheme: *)` |
| `prefers.contrast`      | `'no-preference' \| 'more' \| 'less' \| 'custom'` | User preference for contrast | `@media (prefers-contrast: *)` |

### Optional breakpoint name checking

Existing TypeScript usage remains permissive: `useMatches()` and `$matches` continue accepting arbitrary custom names. To catch misspellings in a composable consumer, explicitly supply the names from the configuration installed in that app:

```ts
const breakpoints = { phone: 0, wide: 900 }
// Install this configuration when creating the app.
const matches = useMatches<keyof typeof breakpoints>()
matches.phone.only
matches.isMin('wide')
// matches.phoen.only would be a TypeScript error.
```

`VueResponsivenessMatches<'phone' | 'wide'>` provides the same opt-in typing. This annotation does not register or verify runtime configuration; use the same names passed to the plugin. The global `$matches` type remains compatible with existing custom-breakpoint templates.

## Server rendering and hydration

The plugin can be installed on the server without accessing `window`. Existing client installations sample media queries immediately.

For apps that render responsive branches on the server, enable SSR mode in the same server/client app setup:

```ts
app.use(VueResponsiveness, Presets.Bootstrap_5, { ssr: true })
```

Pass `undefined` instead of a preset to use the default Bootstrap 5 breakpoints:

```ts
app.use(VueResponsiveness, undefined, { ssr: true })
```

In SSR mode, the server and initial client render use the same fallback: all breakpoint flags are false, `current` is empty, orientation is landscape, hover is available, color scheme is light, and contrast/motion preferences are `no-preference`. The client samples media queries and attaches listeners after the root mounts. Reactive consumers then update on Vue's next render tick. Use this mode consistently on both server and client; it prevents hydration mismatches but may change the layout after mounting.

## Testing

When testing a component that uses `$matches`, install the plugin through Vue Test Utils `global.plugins`.

```ts
import { shallowMount } from '@vue/test-utils'
import MyComponent from './MyComponent.vue'
import { VueResponsiveness } from 'vue-responsiveness'

describe('<MyComponent />', () => {
  it('should render', () => {
    const wrapper = shallowMount(MyComponent, {
      global: {
        plugins: [VueResponsiveness]
      }
    })

    expect(wrapper.exists()).toBe(true)
  })
})
```

## Development checks

Run `pnpm verify` before committing. It runs lint, typechecks the app/library, tests, and tooling configurations, builds the package, checks its published entry points, runs the tests with library coverage enforcement, and builds the demo. CI runs the same command after a frozen-lockfile install.

For a focused check, use `pnpm typecheck`, `pnpm lint`, or `pnpm coverage`. Test cases live in `lib/**/*.test.ts` or `test/**/*.test.ts`; the test adapter models viewport and preference changes independently of the demo.

After a build, `pnpm check:package` checks the emitted declarations with both NodeNext and bundler resolution, and exercises the ES module and CommonJS entry points. The library declaration configuration is `tsconfig.lib.json`; published source files exclude tests and snapshots.

To preview the deployed demo locally, run `pnpm build:demo` followed by `pnpm preview:demo`, then open the `/vue-responsiveness/` URL printed by Vite. See [demo hosting](docs/demo.md) for GitHub Pages setup and deployment details.

## How it works

- Vue Responsiveness uses [`window.matchMedia(queryString)`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia), the same browser API behind CSS media queries.
- It listens to `change` events on `MediaQueryList` objects, so updates happen only when a query starts or stops matching.
- It avoids global `resize` listeners and keeps one responsive state object per Vue app.
- It is SSR safe because browser-only APIs are read after the plugin is installed in the client.

## Questions and issues

Found something confusing, broken, or missing? [Open an issue](https://github.com/codemonk-digital/vue-responsiveness/issues).

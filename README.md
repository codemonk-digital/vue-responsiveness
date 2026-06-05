# Vue Responsiveness

A tiny, performant, and intuitive Vue 3 plugin for working with responsive breakpoints and media queries at runtime.

[![Total downloads](https://img.shields.io/npm/dt/vue-responsiveness.svg?style=flat-square&color=f9d342)](https://www.npmjs.com/package/vue-responsiveness)
[![Latest release](https://img.shields.io/npm/v/vue-responsiveness.svg?style=flat-square&color=f9d342)](https://www.npmjs.com/package/vue-responsiveness)
[![License](https://img.shields.io/npm/l/vue-responsiveness.svg?style=flat-square&color=f9d342)](https://github.com/codemonk-digital/vue-responsiveness/blob/main/LICENSE)
![Dependencies](https://img.shields.io/badge/dependencies-0-f9d342.svg?style=flat-square)
[![Minzip size](https://img.shields.io/bundlephobia/minzip/vue-responsiveness.svg?style=flat-square&color=f9d342)](https://bundlephobia.com/package/vue-responsiveness)
[![UMD gzip size](https://img.shields.io/badge/umd%3Agzip-1.41%20kB-f9d342.svg?style=flat-square)](https://unpkg.com/vue-responsiveness)
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

### Demo

[Codesandbox](https://codesandbox.io/p/devbox/nxqvcr)

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

You can use either option below, or mix them in the same app. Use `$matches` for simple template conditions and `useMatches()` when you need responsive state in `<script setup>`.

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

`Ant_Design`, `Bootstrap_3`, `Bootstrap_4`, `Bootstrap_5`, `Bulma`, `Chakra`, `Foundation`, `Ionic`, `Master_CSS`, `Material_Design`, `Materialize`, `Material_UI`, `Quasar`, `Semantic_UI`, `Skeleton`, `Tailwind_CSS`, `Vuetify`, `Windi_CSS`

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

Vue Responsiveness is designed to have one app-wide breakpoint configuration. Register the plugin once, close to `createApp()`, so all components read from the same `$matches` object.

### Define custom breakpoints

Pass an object whose keys are your breakpoint names and whose values are the minimum width in pixels. The plugin calculates each breakpoint's maximum width from the next breakpoint.

```ts
app.use(VueResponsiveness, {
  small: 0,
  medium: 777,
  large: 1234
})
```

Then use those names in templates:

```html
<!-- @media (min-width: 777px) and (max-width: 1233.9px) -->
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

## How it works

- Vue Responsiveness uses [`window.matchMedia(queryString)`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia), the same browser API behind CSS media queries.
- It listens to `change` events on `MediaQueryList` objects, so updates happen only when a query starts or stops matching.
- It avoids global `resize` listeners and keeps one responsive state object per Vue app.
- It is SSR safe because browser-only APIs are read after the plugin is installed in the client.

## Questions and issues

Found something confusing, broken, or missing? [Open an issue](https://github.com/codemonk-digital/vue-responsiveness/issues).

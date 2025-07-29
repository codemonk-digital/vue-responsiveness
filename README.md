# Vue Responsiveness

A tiny, performant, and intuitive Vue 3 plugin for working with responsive breakpoints and media queries at runtime.

## ✨ Features
- **Zero dependencies**: lightweight with no external dependencies
- **Optimal runtime performance**: leverages native `window.matchMedia` for efficient updates, hundreds of times lighter than `resize` event listeners
- **Comprehensive media query support**: reacts to changes in viewport width, `orientation`, `hover` capability, and user preferences (`prefers-color-scheme`, `prefers-contrast` and `prefers-reduced-motion`)
- **SSR Ready**: Works seamlessly in server-side rendered applications
- **Flexible API access**: provides both a globally available `$matches` object (for templates) and a `useMatches()` composable (for `<script setup>`)
- **Full TypeScript support**: offers excellent DX (developer experience) with full type inference and autocompletion
- **Predefined breakpoint presets**: includes common presets like Bootstrap, Tailwind CSS, Material Design, and more for quick setup
- **Custom breakpoints definition**: Define your own bespoke responsiveness intervals with ease
- **Thorough cleanup**: All listeners are automatically garbage collected when the app unmounts, preventing memory leaks

<p>
<a href="https://www.npmjs.com/package/vue-responsiveness"><img src="https://img.shields.io/npm/dt/vue-responsiveness.svg?color=f9d342&style=plastic" alt="Total Downloads"></a>
<a href="https://www.npmjs.com/package/vue-responsiveness"><img src="https://img.shields.io/npm/v/vue-responsiveness.svg?color=f9d342&style=plastic" alt="Latest Release"></a>
<a href="https://github.com/codemonk-digital/vue-responsiveness/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/vue-responsiveness.svg?color=f9d342&style=plastic" alt="License"></a>
<img src="https://img.shields.io/badge/dependencies-0-f9d342?style=plastic" alt="Dependencies" />
    <a href="https://unpkg.com/vue-responsiveness"><img src="https://img.shields.io/badge/umd:gzip-1.12_kB-f9d342?style=plastic" alt="unpkg umd min:gzip size" /></a>
<img src="https://img.shields.io/badge/coverage-100%25-f9d342?style=plastic" alt="Unit tests coverage"/>
<img src="https://img.shields.io/badge/SSR-ready-f9d342?style=plastic" alt="SSR compatibility status"/>
<a href="https://makeapullrequest.com"><img src="https://img.shields.io/badge/PRs-welcome-f9d342?style=plastic" alt="PRs Welcome"/></a>
</p>

---
## 📦 Installation

::: {panel-tabset}
### pnpm
```bash
pnpm install vue-responsiveness
```

### yarn
```bash
yarn add vue-responsiveness
```

### npm
```bash
npm i vue-responsiveness
```
:::

---
## 🚀 Quick Start & Basic Usage

This plugin provides reactive access to various media queries, making it easy to adapt your Vue components to different screen sizes and user preferences. You can access the responsiveness state through a global property (`$matches`) or using a composable function (`useMatches()`).

The default breakpoint preset is set to Bootstrap 5. To use a different preset, or to define your own bespoke intervals, see [Breakpoint Management](#breakpoint-management) section below.

### Demo
[Codesandbox](https://codesandbox.io/p/devbox/nxqvcr)

### Usage

#### main.ts

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { VueResponsiveness } from 'vue-responsiveness'

createApp()
   .use(VueResponsiveness) // Uses Bootstrap 5 presets when no config specified
   .mount('#app')
```

#### Global `$matches` object

Accessible directly within any Vue component's `<template />`. Ideal for simple conditional rendering.
```html
<template>
   <div class="my-responsive-component">
      <h2>Current Breakpoint: {{ $matches.current || 'N/A' }}</h2>

      <p v-if="$matches.sm.min">This content shows on small screens and larger.</p>

      <p v-if="$matches.md.max">This content shows on medium screens and smaller.</p>

      <div v-if="$matches.lg.only" class="bg-blue-100 p-4">
         You are currently on a large desktop screen.
      </div>

      <p v-if="$matches.orientation === 'portrait'">Device is in portrait mode.</p>

      <p v-if="$matches.hover === 'none'">You are on a touch-only device.</p>

      <p v-if="$matches.prefers.colorScheme === 'dark'">Dark mode is preferred.</p>

      <p v-if="$matches.prefers.reducedMotion === 'reduce'">User prefers reduced motion.</p>
   </div>
</template>
```

#### Composable (`useMatches()`)

Use this composable within `<script setup>` or `setup()` function for reactive access to the plugin's state.

```ts
import { computed } from 'vue'
import { useMatches } from 'vue-responsiveness'

const matches = useMatches()

// Example computed properties based on responsiveness state
const isMobile = computed(() => matches.sm.max) // Roughly small screens and below
const prefersDarkMode = computed(() => matches.prefers.colorScheme === 'dark')

// You can also use the helper functions:
const trueOnMdAndAbove = computed(() => matches.isMin('md'))
const trueOnSmOnly = computed(() => matches.isOnly('sm'))
```

---
## 📐 Breakpoint Management

### Using presets
The plugin comes with a variety of predefined breakpoint presets from popular CSS frameworks.
By default, `Presets.Bootstrap_5` ([see details](https://getbootstrap.com/docs/5.3/layout/breakpoints/#available-breakpoints)) is used if no argument is provided to `app.use(VueResponsiveness)`.

<details>
    <summary>
         Bootstrap_5 preset details:
</summary>

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
How to use any other preset:

```ts
import { VueResponsiveness, Presets } from "vue-responsiveness";

app.use(VueResponsiveness, Presets.Tailwind_CSS)
```

### Available Presets
Here's the list of currently available presets:

`Bootstrap_3`, `Bootstrap_4`, `Bootstrap_5`, `Bulma`, `Chakra`, `Foundation`, `Ionic`, `Master_CSS`, `Material_Design`, `Materialize`, `Material_UI`, `Quasar`, `Semantic_UI`, `Skeleton`, `Tailwind_CSS`, `Vuetify`, `Windi_CSS`

- **Note**: This plugin is designed to have a single, app-wide instance of its responsiveness state. This ensures optimal performance by minimizing listeners and memory footprint. It also provides a consistent `$matches` object or `useMatches()` composable throughout your application. Therefore, defining multiple presets in different parts of your app is not supported and is an intentional design choice.

### Defining custom breakpoints

You can define your own set of breakpoint intervals by passing an object to the plugin. The keys will be your custom breakpoint names, and the values will be their `min-width` (in pixels). The plugin automatically calculates the `max-width` for each interval.

```ts
app.use(VueResponsiveness, {
  small: 0,
  medium: 777,
  large: 1234
})
```

```html
<!-- @media (min-width: 777px) and (max-width: 1233.9px) -->
<template v-if="$matches.medium.only">
  ...content
</template>
```

---
## API Reference

The global `$matches` object (and the object returned by `useMatches()`) provide the following properties and helper methods:

### Breakpoint status properties

These properties reflect the current viewport width relative to the defined breakpoints. Each breakpoint key (e.g., `sm`, `md`, `lg`, or your custom keys) holds an object with `min`, `max`, and `only` boolean flags.

| Name                  | Type      | Description | Example Access |
|-----------------------|-----------| ----------- | -------------- |
| `current`             | `string`  | The name (`key`) of the breakpoint interval that currently matches the viewport's `only` condition. | `$matches.current` |
| `[breakpointKey].min` | `boolean` | `true` if current viewport width is greater than or equal to the breakpoint's minimum value | `$matches.md.min` |
| `[breakpointKey].max` | `boolean` | `true` if current viewport width is less than the breakpoint's maximum value | `$matches.lg.max` |
| `[breakpointKey].only`| `boolean` | `true` if current viewport width is within the breakpoint's minimum and maximum values (exclusive of max) | `$matches.sm.only` |

### Breakpoint helper methods

These allow creating custom computed based on current viewport width and breakpoints.

| Name                | Type      | Description | Example usage                         |
|---------------------|-----------|-------------|---------------------------------------|
| `isMin(breakpoint)` | `function`| Returns `true` if the viewport width is greater than or equal to the specified breakpoint's minimum value. | `matches.isMin('md')`                 |
| `isMax(breakpoint)` | `function`| Returns `true` if the viewport width is less than or equal to the specified breakpoint's maximum value. | `matches.isMax('my-custom-interval')` |
| `isOnly(breakpoint)`| `function`| Returns `true` if the viewport width is within the specified breakpoint's range (greater than or equal to min and less than max). | `matches.isOnly('sm')`                |

### Additional media query properties

These properties provide information about the device's capabilities and user preferences.

| Name                    | Type                              | Description | Media query equivalent |
|-------------------------|-----------------------------------|-------------|------------------------|
| `orientation`           | `'portrait' \| 'landscape'`       | The current device orientation | `@media (orientation: *)` |
| `hover`                 | `'none' \| 'hover'` | The hover capability of the device | `@media (hover: *)` |
| `prefers.reducedMotion` | `'no-preference' \| 'reduce'` | User preference for reduced motion | `@media (prefers-reduced-motion: *)` |
| `prefers.colorScheme` | `'light' \| 'dark'` | User preference for color scheme | `@media (prefers-color-scheme: *)` |
| `prefers.contrast` | `'no-preference' \| 'more' \| 'less' \| 'custom'` | User preference for contrast | `@media (prefers-contrast: *)` |

---
## 🧪 Testing
When testing components using the plugin's API you need to add the plugin to `global.plugins`. Example:

```ts
import MyComponent from './MyComponent.vue'
import { VueResponsiveness } from 'vue-responsiveness'
describe('<MyComponent />', () => {
  it('should render', () => {
    const wrapper = shallowMount(MyComponent, {
      global: {
        plugins: [VueResponsiveness]
      }
    })
    // test here    
  })
})
```
---
## 💡 How It Works
- Uses the native browser API [`window.matchMedia(queryString)`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia), the same underlying technology that powers CSS media queries
- It subscribes to `change` events on MediaQueryList instances, reacting only when the matching status of a media query actually changes, not every time the screen size changes
- Unlike traditional methods that often rely on the `window.resize` event,, `matchMedia` is highly optimized by browsers, offering far better performance
- all listeners are directly attached to the `MediaQueryList` objects and automatically garbage collected when the application instance is unmounted, ensuring no global pollution or lingering event handlers.
- the design ensures only one plugin instance and one set of listeners per Vue application, making it exceptionally light on memory and CPU consumption

---
## Got issues?
[Let me know!](https://github.com/codemonk-digital/vue-responsiveness/issues)

---
Happy coding!  
:: }<(((*> ::
    
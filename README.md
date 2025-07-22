# Vue Responsiveness
**What** - tiny plugin for working with responsiveness intervals, focused on runtime performance and great DX.  
**Why** - I'm obsessed with both runtime performance (see [how it works](#how-it-works)) and ease of use.  
**Want to thank me?** - [A star will do](https://github.com/codemonk-digital/vue-responsiveness), to let everyone know it works as advertised.

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
## Installation

#### yarn
```terminal
yarn add vue-responsiveness
```

#### npm
```terminal
npm i vue-responsiveness
```
---
## Basic demo
[Codesandbox](https://codesandbox.io/p/devbox/nxqvcr)

---
## Usage

#### main.ts

```ts
import { VueResponsiveness } from 'vue-responsiveness'

createApp()
   .use(VueResponsiveness)
   .mount('#app')
```
#### in any `<template />`:
```html
<!-- @media (min-width: 576px) -->
<template v-if="$matches.sm.min">
     ...content
</template>

<!-- @media (max-width: 767.9px) -->
<SomeComponent v-if="$matches.sm.max">
  ...content
</SomeComponent>

<!-- @media (min-width: 576px) and (max-width: 767.9px) -->
<div v-if="$matches.sm.only">
  ...content
</div>
```
---
## Breakpoint presets:
```ts
import { VueResponsiveness, Presets } from "vue-responsiveness";

app.use(VueResponsiveness, Presets.Tailwind_CSS)
```

*Note:* The default value of responsiveness breakpoints is set to Bootstrap 5's [responsiveness breakpoints](https://getbootstrap.com/docs/5.3/layout/breakpoints/#available-breakpoints) preset.
<details>
    <summary>
         Preset details:
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

Here's the list of currently available presets:

`Bootstrap_3`, `Bootstrap_4`, `Bootstrap_5`, `Bulma`, `Chakra`, `Foundation`, `Ionic`, `Master_CSS`, `Material_Design`, `Materialize`, `Material_UI`, `Quasar`, `Semantic_UI`, `Skeleton`, `Tailwind_CSS`, `Vuetify`, `Windi_CSS`

*Notes:*
 - If you maintain a CSS framework (or use one often) and want it added as a preset, [open an issue](https://github.com/codemonk-digital/vue-responsiveness/issues) or a PR.
 - If you spot any inconsistency in [the presets](https://github.com/codemonk-digital/vue-responsiveness/blob/main/lib/presets.ts) (either my typo or some library update), please, let me know, I'll correct it.
 - You can define your own responsiveness intervals, see [Bespoke intervals](#bespoke-intervals) section below. 
 - You can't define more than one preset and have them working in different parts of the same app. This is intentional and has two benefits: 
    - there's only one instance of it and only one set of listeners
    - the app-wide available `$matches` refers to the one plugin instance defined on the app.    
 
   This functionality (multiple instances) will not be added to the plugin. If this functionality is ever needed, consider asking it on StackOverflow, let me know about it (either opening an issue on the repo or tagging my [SO profile](https://stackoverflow.com/users/1891677/tao)) and I'll provide a solution/workaround for your case.

---
## API
### - globally available `$matches` object
(works in any SFC template, with code completion support)

| Name                                      | Type                                              | Description                                                                                                                                                                                |
|-------------------------------------------|---------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **each preset interval key**              | `Object`                                          | contains the following properties: `min`, `max`, `only` - each is a `boolean` value, indicating whether the current viewport width matches the respective condition for the given interval |
| `isMin(intervalName: string): boolean`    | `Function`                                        | returns `true` if current viewport width is greater than or equal to the interval's `min` value                                                                                            |
| `isMax(intervalName: string): boolean`    | `Function`                                        | returns `true` if the current viewport width is less than the interval's `max` value                                                                                                       |
| `isOnly(intervalName: string): boolean`   | `Function`                                        | returns `true` if current viewport width is within the interval's `min` and `max` values (excluding `max`)                                                                                 |
| `orientation`                             | `'portrait' \| 'landscape'`                       | current viewport orientation<br />CSS signature: `@media (orientation: portrait)` & `@media (orientation: landscape)`                                                                      |
| `hover`                                   | `boolean`                                         | `true` if current device supports hover (e.g. not a touch device)<br />CSS signature: `@media (hover: hover)` - true / `@media (hover: none)` - false                                      |
| `prefers.reducedMotion`                   | `boolean`                                         | `true` if user prefers reduced motion<br />`@media (prefers-reduced-motion: reduce)` - true<br /> `@media (prefers-reduced-motion: no-preference)` - false                     |
| `prefers.colorScheme`                     | `'light' \| 'dark'`                               | current user preferred color scheme<br />CSS signature: `@media (prefers-color-scheme: *)`                                                                                                 |
| `prefers.contrast`                        | `'more' \| 'less' \| 'no-preference' \| 'custom'` | current user preferred contrast<br />CSS signature: `@media (prefers-contrast: *)`                                                                                                         |

### - `useMatches()` composable

Has the same API as `$matches` object above, but can be used in `setup()` or `<script setup>` blocks.
```ts
import { useMatches } from 'vue-responsiveness'

const matches = useMatches()

const currentInterval = computed(() => matches.interval)
const trueOnSmOnly = computed(() => matches.isOnly('sm'))
const trueOnMdAndAbove = computed(() => matches.isMin('md'))
const isTouchDeVice = computed(() => !matches.hover)
const prefersReducedMotion = computed(() => matches.prefers.reducedMotion === 'reduce')
const prefersDarkMode = computed(() => matches.prefers.colorScheme === 'dark')
const prefersContrast = computed(() => matches.prefers.contrast) 
// 'more' | 'less' | 'custom' | 'no-preference' **
```

** - see [MDN docs](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast) for details

---
## Bespoke intervals:
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
## Hide components, (while still rendering them) - usage with `v-show`:
`<SomeComponent />` below will be rendered at all times but will only be displayed on `md` and below:
```html
<!-- rendered at all times (keeps listeners while hidden), but only displayed on 
  @media (max-width: 991.9px) -->
<SomeComponent v-show="$matches.md.max" />
```
---
## Testing:
Add plugin to `global.plugins` when testing components using the plugin's API:
Example
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
## How it works:
- uses the native [`window.matchMedia(queryString)`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) and only reacts to changes in the query's `matches` value. It's the same API powering CSS media queries. 
- listeners are placed on the `MediaQueryList` instances, meaning they are garbage collected as soon as the app is unmounted, without leaving bound events behind on `<body>` or `window` object.
- no global pollution
- only one instance per app (much lighter than having one instance per component needing it)
- in terms of memory and/or CPU consumption, using `window.matchMedia` is a few hundred times lighter than using the _"traditional"_ `resize` event listener method

---
## Got issues?
[Let me know!](https://github.com/codemonk-digital/vue-responsiveness/issues)

---
Happy coding!  
:: }<(((*> ::
    
# Vue Responsiveness
<p class="center">
<a href="https://www.npmjs.com/package/vue-responsiveness"><img src="https://img.shields.io/npm/dt/vue-responsiveness.svg?color=f9d342&style=plastic" alt="Total Downloads"></a>
<a href="https://www.npmjs.com/package/vue-responsiveness"><img src="https://img.shields.io/npm/v/vue-responsiveness.svg?color=f9d342&style=plastic" alt="Latest Release"></a>
<a href="https://github.com/codemonk-digital/vue-responsiveness/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/vue-responsiveness.svg?color=f9d342&style=plastic" alt="License"></a>
<img src="https://img.shields.io/badge/dependencies-0-f9d342?style=plastic" alt="Dependencies" />
<a href="https://unpkg.com/vue-responsiveness"><img src="https://img.badgesize.io/https://unpkg.com/vue-responsiveness.svg?compression=gzip&label=umd:minzip&style=plastic&color=f9d342" alt="unpkg umd min:gzip size" /></a>
<img src="https://img.shields.io/badge/coverage-100%25-f9d342?style=plastic" alt="Unit tests coverage"/>
<img src="https://img.shields.io/badge/SSR-ready-f9d342?style=plastic" alt="SSR compatibility status"/>
<a href="https://makeapullrequest.com"><img src="https://img.shields.io/badge/PRs-welcome-f9d342?style=plastic" alt="PRs Welcome"/></a>
</p>
Tiny plugin for working with responsiveness intervals, focused on ease of use and runtime performance.

To be fair, I am a bit obsessed with both performance and ease of use. If curios, scroll down to [How it works](#how-it-works).

### Installation

#### yarn
```terminal
yarn add vue-responsiveness
```

#### npm
```terminal
npm i vue-responsiveness
```

### Basic demo

https://codesandbox.io/s/kind-grass-93d5q4

### Usage

*Note:* The default config value is set to Bootstrap 5's [responsiveness breakpoints](https://getbootstrap.com/docs/5.3/layout/breakpoints/#available-breakpoints) preset:
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

<SomeComponent v-if="$matches.sm.max">
  <!-- @media (max-width: 767.9px) -->
  ...content
</SomeComponent>

<div v-if="$matches.sm.only">
  <!-- @media (min-width: 576px) and (max-width: 767.9px) -->
  ...content
</div>
```

### Breakpoint presets:
```ts
import { VueResponsiveness, Presets } from "vue-responsiveness";

app.use(VueResponsiveness, Presets.Tailwind_CSS)
```
Available presets:

`Bootstrap_3`, `Bootstrap_4`, `Bootstrap_5`, `Bulma`, `Chakra`, `Foundation`, `Ionic`, `Master_CSS`, `Material_Design`, `Materialize`, `Material_UI`, `Quasar`, `Semantic_UI`, `Skeleton`, `Tailwind_CSS`, `Vuetify`, `Windi_CSS`

**Notes:**
 - If you maintain a CSS framework (or use one often) and want its preset added, [open an issue](https://github.com/codemonk-digital/vue-responsiveness/issues) or a PR.
 - If you spot any inconsistency in [the presets](https://github.com/codemonk-digital/vue-responsiveness/blob/main/lib/presets.ts) (either my typo or some library update), please, let me know, I'll correct it.

### Bespoke intervals:
```ts
app.use(VueResponsiveness, {
  small: 0,
  medium: 777,
  large: 1234
})
```
```html
<template v-if="$matches.medium.only">
  <!-- @media (min-width: 777px) and (max-width: 1233.9px) -->
  ...content
</template>
```
### Hide components, (while still rendering them) - usage with `v-show`:
`<SomeComponent />` below will be rendered at all times but will only be displayed on `md` and below:
```html
<!-- rendered at all times (keeps listeners while hidden), but only displayed on 
  @media (max-width: 991.9px) -->
<SomeComponent v-show="$matches.md.max" />
```
### Use in `setup()`:
```ts
import { useMatches } from 'vue-responsiveness'

const matches = useMatches()

const currentInterval = computed(() => matches.interval)
const trueOnSmOnly = computed(() => matches.isOnly('sm'))
const trueOnMdAndAbove = computed(() => matches.isMin('md'))
```

### Testing:
Add the plugin to `global.plugins` when testing components using its API:
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
    expect(wrapper.element).toMatchSnapshot()
  })
})
```

### How it works:
- uses the native [`window.matchMedia(queryString)`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) and only reacts to changes in the query's `matches` value. It's the same API powering CSS media queries. 
- listeners are placed on the `MediaQueryList` instances, meaning they are garbage collected as soon as the app is unmounted, without leaving bound events behind on `<body>` or `window` object.
- no global pollution
- having it app-wide is lighter than having listeners bound by each component using it
- in terms of memory and/or CPU consumption, using `window.matchMadia` is a few hundred times lighter than using the _"traditional"_ `resize` event listener method

### Got issues?
[Let me know!](https://github.com/codemonk-digital/vue-responsiveness/issues)

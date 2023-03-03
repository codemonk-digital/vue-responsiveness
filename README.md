# Vue Responsiveness
<p>
<a href="https://www.npmjs.com/package/vue-responsiveness"><img src="https://img.shields.io/npm/dt/vue-responsiveness.svg" alt="Total Downloads"></a>
<a href="https://github.com/c/releases"><img src="https://img.shields.io/npm/v/vue-responsiveness.svg" alt="Latest Release"></a>
<a href="https://github.com/andrei-gheorghiu/vue-responsiveness/blob/main/LICENSE.MD"><img src="https://img.shields.io/npm/l/vue-breakpoint-compass.svg" alt="License"></a>
<img src="https://img.shields.io/badge/dependencies-0-brightgreen.svg" />
<a href="https://unpkg.com/vue-responsiveness"><img src="https://img.badgesize.io/https://unpkg.com/vue-responsiveness.svg?compression=gzip&label=umd:minzip" alt="unpkg umd min:gzip size" /></a>
<a href="https://circleci.com/gh/andrei-gheorghiu/vue-responsiveness/tree/main"><img src="https://circleci.com/gh/andrei-gheorghiu/vue-responsiveness/tree/main.svg?style=svg" alt="CircleCI" /></a>
<a href="https://makeapullrequest.com"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome"/></a>
</p>
Extremely light (<code>< 1kb</code> gzipped) plugin in terms of both size and runtime resource consumption.

I wrote it because I wanted something extremely easy to use but as light as possible.   
To be fair, I am a bit obsessed with both performance and ease of use. If curios, scroll down to "How it works".

### Installation

#### yarn
```terminal
yarn add vue-responsiveness
```

#### npm
```terminal
npm i vue-responsiveness
```

### Usage

The default breakpoints value is set to Bootstrap 5's [responsiveness breakpoints](https://getbootstrap.com/docs/5.3/layout/breakpoints/#available-breakpoints) preset:
#### main.ts

```ts
import { VueResponsiveness } from 'vue-responsiveness'

createApp()
   .use(VueResponsiveness)
   .mount('#app')
```
#### in any `<template />`:
```html
<!-- sm and above
  @media (min-width: 576px) -->
<template v-if="$matches.sm.min">
   ...content
</template>

<!-- sm and below
  @media (max-width: 767.9px) -->
<SomeComponent v-if="$matches.sm.max">
  ...content
</SomeComponent>

<!-- sm only
  @media (min-width: 576px) and (max-width: 767.9px) -->
<div v-if="$matches.sm.only">
  ...content
</div>
```

### Available breakpoint presets

#### Usage:

```ts
import { VueResponsiveness, Presets } from "vue-responsiveness";

app.use(VueResponsiveness, Presets.Tailwind_CSS)
```
Available presets:
 - Bootstrap_3
 - Bootstrap_4
 - Bootstrap_5
 - Bulma
 - Chakra
 - Foundation
 - Ionic
 - Material_Design
 - Materialize
 - Material_UI
 - Quasar
 - Semantic_UI
 - Skeleton
 - Tailwind_CSS
 - Vuetify
 - Windi_CSS

**Notes:**
 - If you maintain a CSS framework (or if you use one often) and you'd like its preset added, [open an issue](https://github.com/andrei-gheorghiu/vue-responsiveness/issues) or even a PR.
 - If you spot any inconsistency in [the presets](https://github.com/andrei-gheorghiu/vue-responsiveness/blob/main/lib/presets.ts) (either my typo or some library update), please, let me know, I'll correct it.

#### Use your own breakpoints:
```ts
app.use(VueResponsiveness, {
  small: 0,
  medium: 777,
  large: 1234
})
```
```html
<!-- medium only
  @media (min-width: 777px) and (max-width: 1233.9px) -->
<template v-if="$matches.medium.only">
  ...content
</template>
```
### Hide components, (while still rendering them) - usage with `v-show`:
`<SomeComponent />` below will be rendered at all screen sizes but will only be displayed on `md` and below:
```html
<!-- rendered all the time,  but only displayed on: 
  @media (max-width: 991.9px) -->
<SomeComponent v-show="$matches.md.max" />
```
### Issues?
[Let me know!](https://github.com/andrei-gheorghiu/vue-responsiveness/issues)

### How it works:
- the plugin uses the native [`window.matchMedia(queryString)`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) and only reacts to changes in the query's `matches` value. It's basically the same API powering the CSS media queries. 
- the listeners are placed on the returned `MediaQueryList` instances, which means they are removed/deleted as soon as the app is unmounted, without leaving anything bound on `<body>` or `window` object.
- having it placed on the app instance makes it a lot more performant than the alternative of having listeners placed by each component using the plugin.
- in terms of memory and/or CPU consumption, this approach is hundreds of times more performant than the _"traditional"_ `resize` event listener method.

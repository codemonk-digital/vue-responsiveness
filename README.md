# Vue Responsiveness

Tiny plugin for managing responsiveness breakpoints in Vue3 apps.

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
 - If you spot any inconsistency in the presets (either my typo or some library update), please, let me know, I'll correct it.

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

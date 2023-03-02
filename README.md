# Vue Responsiveness

Tiny plugin for managing responsiveness breakpoints in Vue3 apps.

## Install

```terminal
yarn add vue-responsiveness
```

## Usage

By default, it implements Bootstrap 5's [responsiveness breakpoints](https://getbootstrap.com/docs/5.3/layout/breakpoints/#available-breakpoints):

```ts
import VueResponsiveness from 'vue-responsiveness'

createApp()
   .use(VueResponsiveness)
   .mount('#app')
```

```html
<!-- sm and above
  @media (min-width: 576px) -->
<template v-if="$matches.sm.min">
   ...content
</template>

<!-- sm and below
  @media (max-width: 767.9px) -->
<template v-if="$matches.sm.max">
  ...content
</template>

<!-- sm only
  @media (min-width: 576px) and (max-width: 767.9px) -->
<template v-if="$matches.sm.only">
  ...content
</template>
```
*Note:* `<template/>` tags not required, works on any components/DOM elements

## Customized breakpoint names and values

```ts
createApp()
   .use(VueResponsiveness, {
      small: 0,
      medium: 777,
      large: 1234
   })
   .mount('#app')
```
```html
<!-- medium only
  @media (min-width: 777px) and (max-width: 1233.9px) -->
<template v-if="$matches.medium.only">
  ...content
</template>
```
## `v-show` usage:
```html
<!-- rendered all the time,  but only displayed on: 
  @media (max-width: 991.9px) -->
<SomeComponent v-show="$matches.md.max" />
```

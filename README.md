# Vue Responsiveness

Tiny plugin for managing responsiveness breakpoints in Vue3 apps.

## Install

### yarn
```terminal
yarn add vue-responsiveness
```

### npm
```terminal
npm i vue-responsiveness
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

## Custom breakpoint names and values

### Bootstrap 4's [responsiveness breakpoints](https://getbootstrap.com/docs/4.6/layout/overview/#responsive-breakpoints):

```ts
app.use(VueResponsiveness, {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200
})
```
### Bespoke breakpoints
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
## With `v-show`:
`<SomeComponent />` below will be rendered at all screen sizes but will only be displayed on `md` and below:
```html
<!-- rendered all the time,  but only displayed on: 
  @media (max-width: 991.9px) -->
<SomeComponent v-show="$matches.md.max" />
```
## Issues?
[Let me know!](https://github.com/andrei-gheorghiu/vue-responsiveness/issues)
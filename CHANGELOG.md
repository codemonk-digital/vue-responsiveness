# Changelog

## 0.3.0

### New

- Add opt-in SSR hydration mode and opt-in TypeScript checking for breakpoint names.
- Add a `Vuetify_3` preset with the `xxl` interval.

### Fixed

- Keep responsive state and media query listeners separate for each Vue app.
- Correct framework preset thresholds and eliminate gaps between breakpoint intervals.
- Publish declarations that resolve in both NodeNext and bundler TypeScript projects.

### Migration note

Installing with `.use(VueResponsiveness)` and accessing `$matches` in templates are unchanged. `useMatches()` now reads the state provided to the current Vue app, so call it during component setup (including `<script setup>`). Calls outside setup now throw instead of reading shared module state.

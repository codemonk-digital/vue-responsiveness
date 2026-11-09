# Preset versions and sources

Presets describe minimum widths in pixels. They retain established names and framework versions; they do not automatically migrate to each framework's latest release. Applications with customized framework breakpoints should pass those values directly.

| Preset | Supported scale and primary source | Notes |
| --- | --- | --- |
| `Ant_Design` | [Ant Design 4.24.16](https://github.com/ant-design/ant-design/blob/4.24.16/components/style/themes/default.less) | Grid minima. `xs: 0` is the baseline; the separate 480px token is not its grid minimum. |
| `Bootstrap_3` | [Bootstrap 3.4](https://getbootstrap.com/docs/3.4/css/#grid-media-queries) | `sm: 768`, `md: 992`, `lg: 1200`. |
| `Bootstrap_4` | [Bootstrap 4.6](https://getbootstrap.com/docs/4.6/layout/overview/#responsive-breakpoints) | Five intervals, ending at `xl: 1200`. |
| `Bootstrap_5` | [Bootstrap 5.3](https://getbootstrap.com/docs/5.3/layout/breakpoints/) | Default preset; six intervals, ending at `xxl: 1400`. |
| `Bulma` | [Bulma 0.9.4](https://github.com/jgthms/bulma/blob/0.9.4/sass/utilities/initial-variables.sass) | Minima of 769/1024/1216/1408px after the mobile baseline. |
| `Chakra` | [Chakra UI v2](https://v2.chakra-ui.com/docs/styled-system/responsive-styles) | `xs` is this package's alias for `base`; em values are projected using 16px, including `2xl: 1536` from 96em. |
| `Foundation` | [Foundation for Sites 6](https://get.foundation/sites/docs/media-queries.html#changing-the-breakpoints) | Full Sass map, including `xlarge` and `xxlarge`; the framework generates em queries. |
| `Ionic` | [Ionic 6.7.5](https://github.com/ionic-team/ionic-framework/blob/v6.7.5/core/src/themes/ionic.globals.scss) | Minima of 576/768/992/1200px after the zero baseline. |
| `Master_CSS` | [Master CSS 1.37.8](https://css.master.co/docs/breakpoints) | Original key names and values. Below 360px, no named interval matches. |
| `Material_Design` | [Material Design 2](https://m2.material.io/design/layout/understanding-layout.html) | `sm_8` and `sm_12` are package aliases for the small-screen column tiers. This is not the Material 3 scale. |
| `Materialize` | [Materialize 1.0.0](https://github.com/Dogfalo/materialize/blob/1.0.0/sass/components/_variables.scss) | Minimum widths are 601/993/1201px; 600/992/1200 are the framework's maximum-width values. |
| `Material_UI` | [Material UI v4](https://v4.mui.com/customization/breakpoints/) | Retains v4's 600/960/1280/1920px minima. |
| `Quasar` | [Quasar v2](https://quasar.dev/style/breakpoints/) | Minima of 600/1024/1440/1920px. |
| `Semantic_UI` | [Semantic UI 2.x](https://semantic-ui.com/elements/container.html#container-sizes) | Four container/grid tiers; `small_monitor` and `large_monitor` are package names. |
| `Skeleton` | [Skeleton 2.0.4](https://github.com/dhg/Skeleton/blob/master/css/skeleton.css) | The source's cuts are 400/550/750/1000/1200px. Interval labels and the zero baseline are defined by this package. |
| `Tailwind_CSS` | [Tailwind CSS 3.4](https://v3.tailwindcss.com/docs/screens) | Pixel-based v3 defaults; `xs` names the unprefixed baseline. |
| `Vuetify` | [Vuetify 3.0.0](https://github.com/vuetifyjs/vuetify/blob/v3.0.0/packages/vuetify/src/composables/display.ts) | Legacy five-tier subset. For compatibility, `xl` remains unbounded. |
| `Vuetify_3` | [Vuetify 3.0.0](https://github.com/vuetifyjs/vuetify/blob/v3.0.0/packages/vuetify/src/composables/display.ts) | Complete six-tier map, including `xxl: 2560`. |
| `Windi_CSS` | [Windi CSS 3.5.6](https://github.com/windicss/windicss/blob/v3.5.6/src/config/base.ts) | `xs` names the unprefixed baseline. |

## Matching semantics

The plugin's intervals are continuous: a maximum is immediately below the next distinct minimum. Some frameworks use epsilon offsets or gaps in their own maximum-width queries. For example, Materialize ends its small-screen maximum at 600px and starts medium at 601px; this plugin's small interval extends up to, but excludes, 601px. The minimum-width presets agree, while fractional maximum-width behavior can differ.

Chakra and Foundation use em queries. These numeric presets represent their usual 16px browser-default-font scale; they cannot reproduce em behavior when that default changes. Tailwind v4's rem semantics are likewise not implied by the existing v3 preset.

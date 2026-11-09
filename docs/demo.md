# Demo hosting

The live demo is a static Vue app hosted at
https://codemonk-digital.github.io/vue-responsiveness/.
Visitors do not need an account, editor workspace, or terminal.

## Local development and preview

- `pnpm dev` starts the demo with live updates.
- `pnpm build:demo` builds the static site into `dist-demo/`.
- `pnpm preview:demo` serves that build locally. Open the printed URL ending in
  `/vue-responsiveness/`.

The demo uses the plugin source in this repository. Its separate
`vite.demo.config.ts` bundles Vue and the demo assets, with the repository path
as the URL base. The package build still writes to `dist/`; the demo output is
ignored by Git and is not included in the npm package.

## First deployment

The repository's [Pages settings](https://github.com/codemonk-digital/vue-responsiveness/settings/pages)
are already set to **GitHub Actions**. Once `.github/workflows/demo.yml` reaches
`main`, the push starts the first deployment automatically. Open the
[workflow run](https://github.com/codemonk-digital/vue-responsiveness/actions/workflows/demo.yml)
and check that the `build` and `deploy` jobs finish successfully, then open the
URL shown by the `deploy` job. **Run workflow** on `main` can redeploy it later.

The workflow uses GitHub's built-in token; no personal access token or additional
hosting account is needed. GitHub administrators may need to allow Actions or
approve the `github-pages` environment if organization policies require it.

## Subsequent updates

Every push to `main` runs `pnpm verify`, including the library tests, package
consumer checks, and demo build. Only a successful build can deploy. Manual runs
on other branches can build the demo but cannot publish it.

The workflow uploads only `dist-demo/`. No generated site files or `gh-pages`
branch need to be committed. If the repository name or hosting path changes,
update the `base` in `vite.demo.config.ts` and the demo links in the README and
this document.

If a deployment fails, inspect the failed job in Actions. A Pages configuration
error may mean the source in **Settings → Pages** is no longer set to
**GitHub Actions**.

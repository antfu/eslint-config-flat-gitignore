# eslint-config-flat-gitignore

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

`.gitignore` support for [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new).

## Usage

```bash
npm i -D eslint-config-flat-gitignore
```

```js
// eslint.config.js
import gitignore from 'eslint-config-flat-gitignore'

export default [
  // recommended putting it at the first
  gitignore(),
  // your other configs here
]
```

By default it will only looks for `.gitignore` but NOT `.eslintignore`, as we would recommended move away from `.eslintignore` to declare directly in `eslint.config.js` for single source of truth. If you still want it, you can pass the `files` option to specify the files to look for.

```js
gitignore({
  files: [
    '.gitignore',
    '.eslintignore',
  ]
})
```

By default, this plugin throws if any of the ignore files are missing. This can be disabled by passing setting the `strict` option to `false`.

```js
gitignore({
  files: [
    '.gitignore',
    '.eslintignore',
  ],
  strict: false,
})
```

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2023-PRESENT [Anthony Fu](https://github.com/antfu)


<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/eslint-config-flat-gitignore?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/eslint-config-flat-gitignore
[npm-downloads-src]: https://img.shields.io/npm/dm/eslint-config-flat-gitignore?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/eslint-config-flat-gitignore
[bundle-src]: https://img.shields.io/bundlephobia/minzip/eslint-config-flat-gitignore?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=eslint-config-flat-gitignore
[license-src]: https://img.shields.io/github/license/antfu/eslint-config-flat-gitignore.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/antfu/eslint-config-flat-gitignore/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/eslint-config-flat-gitignore

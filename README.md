<div align="center">
  <img width="150" height="150" title="PostHTML" src="https://posthtml.github.io/posthtml/logo.svg">
  <h1>Safe Class Names</h1>
  <p>Replace escaped characters in class names and CSS selectors</p>

  [![Version][npm-version-shield]][npm]
  [![Build][github-ci-shield]][github-ci]
  [![License][license-shield]][license]
  [![Downloads][npm-stats-shield]][npm-stats]
</div>

## Introduction

This plugin replaces escaped characters in class names from your `<style>` tags and inside `class=""` attributes with safe characters, that do not need escaping.

By default, it replaces:

- `\:` and `\/` with `-`
- `\%` with `pc`
- `\.` with `_`

See the full [list of replacements](lib/index.js#L19-L51).

### But... why?

So you can use those cool [Tailwind CSS](https://tailwindcss.com) selectors in HTML emails. 😎

Escaped characters in CSS selectors are not currently supported by all email clients, so you can use this plugin to replace them with HTML email-safe alternatives.

## Install

```
npm i posthtml posthtml-safe-class-names
```

## Usage

Consider `example.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .w-3\/5 {
      width: 60%;
    }
    
    .bg-\[\#1da1f1\] {
      background-color: #1da1f1;
    }

    @media (max-width: 600px) {
      .sm\:w-1\/2 {
        width: 50%;
      }
    }
  </style>
</head>
<body>
  <div class="w-3/5 sm:w-1/2 bg-[#1da1f1]">Lorem ipsum</div>
</body>
</html>
```

```js
import posthtml from 'posthtml'
import {readFileSync, writeFileSync} from 'node:fs'
import safeClassNames from 'posthtml-safe-class-names'

const source = readFileSync('./example.html')

posthtml([
    safeClassNames()
  ])
  .process(source)
  .then(result => fs.writeFileSync('./after.html', result.html))
```

Result:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .sm-w-3-5 {
      width: 60%;
    }

    .bg-_1da1f1 {
      background-color: #1da1f1;
    }

    @media (max-width: 600px) {
      .sm-w-1-2 {
        width: 50%;
      }
    }
  </style>
</head>
<body>
  <div class="w-3-5 sm-w-1-2 bg-_1da1f1">Lorem ipsum</div>
</body>
</html>
```

## Options

### `replacements`

Type: `Object`\
Default: [see list](lib/index.js#L19-L51)

The plugin accepts an options object where you can define character replacement mappings:

```js
{
  ':': '-',
  '\/': '-',
  '%': 'pc',
  '.': '_',
  // ...
}
```

See the full [list of replacements](lib/index.js#L19-L51).

Besides adding new mappings, you can of course override the default ones.

Using the same `example.html`, let's replace `\:` in our class names with `__` instead of `-`:

```js
posthtml([
    safeClassNames({
      replacements: {
        ':': '__',
      }
    })
  ])
  .process(source)
  .then(result => writeFileSync('./after.html', result.html))
```

Result:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .sm__w-3-5 {
      width: 60%;
    }

    .bg-_1da1f1 {
      background-color: #1da1f1;
    }

    @media (max-width: 600px) {
      .sm__w-1-2 {
        width: 50%;
      }
    }
  </style>
</head>
<body>
  <div class="w-3-5 sm__w-1-2 bg-_1da1f1">Lorem ipsum</div>
</body>
</html>
```

### `ignored`

Type: `Array`\
Default: `[{heads: '{{', tails: '}}'}, {heads: '{{{', tails: '}}}'}]`

An array of objects each containing heads/tails strings that mark the start and end of a class name to ignore. If a class name matches a pattern defined here, it will not be processed.

```js
posthtml([
    safeClassNames({
      ignored: [
        {heads: '[[', tails: ']]'},
      ]
    })
  ])
  .process('<div class="foo:bar [[ biz ]]">')
  .then(result => console.log(result.html))

  // <div class="foo-bar [[ biz ]]">
```

[npm]: https://www.npmjs.com/package/posthtml-safe-class-names
[npm-version-shield]: https://img.shields.io/npm/v/posthtml-safe-class-names.svg
[npm-stats]: http://npm-stat.com/charts.html?package=posthtml-safe-class-names
[npm-stats-shield]: https://img.shields.io/npm/dt/posthtml-safe-class-names.svg
[github-ci]: https://github.com/posthtml/posthtml-safe-class-names/actions
[github-ci-shield]: https://github.com/posthtml/posthtml-safe-class-names/actions/workflows/nodejs.yml/badge.svg
[license]: ./LICENSE
[license-shield]: https://img.shields.io/npm/l/posthtml-safe-class-names.svg

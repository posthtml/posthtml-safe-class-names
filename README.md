<div align="center">
  <img width="150" height="150" title="PostHTML" src="https://posthtml.github.io/posthtml/logo.svg">
  <h1>Safe Class Names</h1>
  <p>Replace escaped characters in class names and CSS selectors</p>

  [![Version][npm-version-shield]][npm]
  [![License][license-shield]][license]
  [![Build][travis-ci-shield]][travis-ci]
  [![Downloads][npm-stats-shield]][npm-stats]
</div>

## Introduction

This plugin replaces escaped characters in class names from your `<style>` tags and inside `class=""` attributes with safe characters, that do not need escaping.

By default, it replaces:

- `\:` and `\/` with `-`
- `\%` with `pc`
- `\.` with `_`


### But... why?

Because I needed a way to use [Tailwind CSS variants](https://tailwindcss.com/docs/configuring-variants) in my HTML emails 🤷‍♂️

Escaped characters in CSS selectors or HTML class names are not supported by all email clients (currently Gmail being the biggest one), so you can use this plugin to replace them with safe alternatives.

## Install

```
$ npm i posthtml posthtml-safe-class-names
```

## Usage

Consider `example.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .sm\:w-3\/5 {
      width: 60%;
    }

    @media (max-width: 600px) {
      .sm\:w-1\/2 {
        width: 50%;
      }
    }
  </style>
</head>
<body>
  <div class="w-3/5 sm:w-1/2">Lorem ipsum</div>
</body>
</html>
```

```js
const fs = require('fs')
const posthtml = require('posthtml')
const safeClassNames = require('posthtml-safe-class-names')

const source = fs.readFileSync('./example.html')

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

    @media (max-width: 600px) {
      .sm-w-1-2 {
        width: 50%;
      }
    }
  </style>
</head>
<body>
  <div class="w-3-5 sm-w-1-2">Lorem ipsum</div>
</body>
</html>
```

## Options

### `replacements`

The plugin accepts an options object where you can define character replacement mappings.

Default:

```js
{
  ':': '-',
  '\/': '-',
  '%': 'pc',
  '.': '_',
}
```

Besides adding new mappings, you can of course override the default ones.

Using the same `example.html`, let's choose to replace `\:` in our class names with `__` instead of `-`:

```js
posthtml([
    safeClassNames({
      replacements: {
        ':': '__',
      }
    })
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
    .sm__w-3-5 {
      width: 60%;
    }

    @media (max-width: 600px) {
      .sm__w-1-2 {
        width: 50%;
      }
    }
  </style>
</head>
<body>
  <div class="w-3-5 sm__w-1-2">Lorem ipsum</div>
</body>
</html>
```

[npm]: https://www.npmjs.com/package/posthtml-safe-class-names
[npm-version-shield]: https://img.shields.io/npm/v/posthtml-safe-class-names.svg
[npm-stats]: http://npm-stat.com/charts.html?package=posthtml-safe-class-names
[npm-stats-shield]: https://img.shields.io/npm/dt/posthtml-safe-class-names.svg
[travis-ci]: https://travis-ci.org/cossssmin/posthtml-safe-class-names/
[travis-ci-shield]: https://img.shields.io/travis/cossssmin/posthtml-safe-class-names/master.svg
[license]: ./LICENSE
[license-shield]: https://img.shields.io/npm/l/posthtml-safe-class-names.svg

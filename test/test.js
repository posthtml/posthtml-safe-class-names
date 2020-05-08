const test = require('ava')
const plugin = require('../lib')
const posthtml = require('posthtml')

const {join} = require('path')
const {readFileSync} = require('fs')

const fixture = file => readFileSync(join(__dirname, 'fixtures', `${file}.html`), 'utf8')
const expected = file => readFileSync(join(__dirname, 'expected', `${file}.html`), 'utf8')

const clean = html => html.replace(/[^\S\r\n]+$/gm, '').trim()

const process = (t, name, options, log = false) => {
  return posthtml([plugin(options)])
    .process(fixture(name))
    .then(result => log ? console.log(result.html) : clean(result.html))
    .then(html => t.is(html, expected(name).trim()))
}

test('Sanity test', t => {
  return process(t, 'sanity')
})

test('Uses defaults if `replacements` is falsy', t => {
  return process(t, 'sanity', {replacements: null})
})

test('Overrides default character replacement', t => {
  return process(t, 'override', {replacements: {':': '__'}})
})

test('Works with new custom mappings', t => {
  return process(t, 'custom', {replacements: {',': '_'}})
})

test('Works when there are no class attributes', t => {
  return process(t, 'style-only')
})

test('Works when there are no style tags', t => {
  return process(t, 'classes-only')
})

test('Works when there are multiple style tags', t => {
  return process(t, 'multiple-style')
})

test('Works inside media queries', t => {
  return process(t, 'media-queries')
})

test.only('Works with font face', t => {
  return process(t, 'font-face')
})

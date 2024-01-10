import path from 'node:path'
import {readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import posthtml from 'posthtml'
import {expect, test} from 'vitest'
import plugin from '../lib/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const fixture = file => readFileSync(path.join(__dirname, 'fixtures', `${file}.html`), 'utf8')
const expected = file => readFileSync(path.join(__dirname, 'expected', `${file}.html`), 'utf8')

const clean = html => html.replaceAll(/[^\S\r\n]+$/gm, '').trim()

const process = (t, name, options, log = false) => {
  return posthtml([plugin(options)])
    .process(fixture(name))
    .then(result => log ? console.log(result.html) : clean(result.html))
    .then(html => expect(html).toBe(expected(name).trim()))
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

test('Works with font face', t => {
  return process(t, 'font-face')
})

test('Works with empty <style> tags', t => {
  return process(t, 'empty-style')
})

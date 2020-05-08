'use strict'

const postcss = require('postcss')

const headCSSRegex = needle => new RegExp(`(?=.+)\\\\${needle}`, 'g')
const classAttrRegex = needle => new RegExp(`\\${needle}`, 'g')

const postcssSafeCSS = (options = {}) => root => {
  root.walkDecls(decl => {
    if (decl.parent.selector) {
      Object.entries(options.replacements).forEach(([from, to]) => {
        decl.parent.selector = decl.parent.selector.replace(headCSSRegex(from), to)
      })
    }
  })
}

module.exports = (options = {}) => tree => {
  options.replacements = {
    ':': '-',
    '\/': '-', // eslint-disable-line
    '%': 'pc',
    '.': '_',
    ...options.replacements
  }

  const process = node => {
    if (node.tag === 'style') {
      node.content = postcss([postcssSafeCSS({replacements: options.replacements})]).process(node.content[0].trim()).css
    }

    if (node.attrs && node.attrs.class) {
      const classes = node.attrs.class.split(' ')
      const safeClasses = []

      classes.forEach(cls => {
        Object.entries(options.replacements).forEach(([from, to]) => {
          cls = cls.replace(classAttrRegex(from), to)
        })

        safeClasses.push(cls)
      })

      node.attrs.class = safeClasses.join(' ')
    }

    return node
  }

  return tree.walk(process)
}

import postcss from 'postcss'
import cssEscape from 'css.escape'

const headCSSRegex = needle => new RegExp(`\\\\[${needle}]`, 'g')
const classAttrRegex = needle => new RegExp(`\\${needle}`, 'g')

const postcssSafeCSS = (options = {}) => root => {
  root.walkDecls(decl => {
    if (decl.parent.selector) {
      Object.entries(options.replacements).forEach(([from, to]) => {
        decl.parent.selector = decl.parent.selector
          .replace(headCSSRegex(cssEscape(from)), to)
          .replace('\\2c ', '_')
      })
    }
  })
}

const plugin = (options = {}) => tree => {
  options.separator = options.separator || '-'
  options.replacements = {
    ':': '-',
    '/': '-',
    '%': 'pc',
    '.': '_',
    ',': '_',
    '#': '_',
    '[': '',
    ']': '',
    '(': '',
    ')': '',
    '{': '',
    '}': '',
    '!': 'i-',
    '&': 'and-',
    '<': 'lt-',
    '=': 'eq-',
    '>': 'gt-',
    '|': 'or-',
    '@': 'at-',
    '?': 'q-',
    '\\': '-',
    '"': '-',
    '\'': '-',
    '*': '-',
    '+': '-',
    ';': '-',
    '^': '-',
    '`': '-',
    '~': '-',
    $: '-',
    ...options.replacements,
  }

  const process = node => {
    if (node.tag === 'style' && node.content) {
      const content = Array.isArray(node.content) ? node.content.join('') : node.content

      node.content = postcss([
        postcssSafeCSS({
          replacements: options.replacements,
        }),
      ])
        .process(content)
        .css
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

export default plugin

import postcss from 'postcss'
import postcssSafeCss from './postcssSafeCss.js'
import getClassCandidates from './getClassCandidates.js'

const plugin = (options = {}) => tree => {
  options.ignored = options.ignored || [
    {
      heads: '{{',
      tails: '}}',
    },
    {
      heads: '{{{',
      tails: '}}}',
    },
  ]

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

  const classAttrRegex = needle => new RegExp(`\\${needle}`, 'g')

  const process = node => {
    if (node.tag === 'style' && node.content) {
      const content = Array.isArray(node.content) ? node.content.join('') : node.content

      node.content = postcss([
        postcssSafeCss({
          replacements: options.replacements,
        }),
      ])
        .process(content)
        .css
    }

    if (node.attrs && node.attrs.class) {
      const classes = getClassCandidates(node.attrs.class, options.ignored)
      const safeClasses = []

      for (let cls of classes) {
        // If class starts or ends with one if the heads/tails, skip it
        if (options.ignored.some(({heads, tails}) => cls.startsWith(heads) || cls.endsWith(tails))) {
          safeClasses.push(cls)
          continue
        }

        for (const [from, to] of Object.entries(options.replacements)) {
          cls = cls.replace(classAttrRegex(from), to)
        }

        safeClasses.push(cls)
      }

      node.attrs.class = safeClasses.join(' ')
    }

    return node
  }

  return tree.walk(process)
}

export default plugin

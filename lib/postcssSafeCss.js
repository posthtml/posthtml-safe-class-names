import cssEscape from 'css.escape'

const headCSSRegex = needle => new RegExp(`\\\\[${needle}]`, 'g')

export default (options = {}) => root => {
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

import cssEscape from 'css.escape'

function unescapeRegExp(string) {
  return string.replace(/\\(.)/g, '$1')
}

export default (options = {}) => root => {
  const replacementsRegex = new RegExp(`\\\\(${Object.keys(options.replacements).map(cssEscape).join('|')})`, 'g')

  root.walkRules(rule => {
    rule.selector = rule.selector
      .replace(replacementsRegex, matched => {
        return options.replacements[unescapeRegExp(matched)]
      })
      // Replace escaped commas with underscores
      .replaceAll('\\2c ', '_')
  })
}

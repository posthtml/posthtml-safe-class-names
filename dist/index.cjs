'use strict';

const postcss = require('postcss');
const safe = require('postcss-safe-parser');
const cssEscape = require('css.escape');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const postcss__default = /*#__PURE__*/_interopDefaultCompat(postcss);
const safe__default = /*#__PURE__*/_interopDefaultCompat(safe);
const cssEscape__default = /*#__PURE__*/_interopDefaultCompat(cssEscape);

function unescapeRegExp(string) {
  return string.replace(/\\(.)/g, "$1");
}
const postcssSafeCss = (options = {}) => (root) => {
  const replacementsRegex = new RegExp(`\\\\(${Object.keys(options.replacements).map(cssEscape__default).join("|")})`, "g");
  root.walkRules((rule) => {
    rule.selector = rule.selector.replace(replacementsRegex, (matched) => {
      return options.replacements[unescapeRegExp(matched)];
    }).replaceAll("\\2c ", "_");
  });
};

function getClassCandidates(input, config) {
  const result = [];
  let currentIndex = 0;
  config.sort((a, b) => b.heads.length - a.heads.length);
  while (currentIndex < input.length) {
    let foundMatch = false;
    for (const { heads, tails } of config) {
      if (input.slice(currentIndex, currentIndex + heads.length) === heads) {
        const tailIndex = input.indexOf(tails, currentIndex + heads.length);
        if (tailIndex !== -1) {
          result.push(input.slice(currentIndex, tailIndex + tails.length));
          currentIndex = tailIndex + tails.length;
          foundMatch = true;
          break;
        }
      }
    }
    if (!foundMatch) {
      const nextHeadIndex = Math.min(...config.map(({ heads }) => input.indexOf(heads, currentIndex)).filter((index) => index !== -1));
      if (nextHeadIndex === Number.POSITIVE_INFINITY) {
        result.push(input.slice(currentIndex));
        currentIndex = input.length;
      } else {
        result.push(input.slice(currentIndex, nextHeadIndex));
        currentIndex = nextHeadIndex;
      }
    }
  }
  return result.map((i) => i.trim()).filter((i) => i.trim().length > 0);
}

const plugin = (options = {}) => (tree) => {
  options.ignored = options.ignored || [
    {
      heads: "{{",
      tails: "}}"
    },
    {
      heads: "{{{",
      tails: "}}}"
    }
  ];
  options.replacements = {
    ":": "-",
    "/": "-",
    "%": "pc",
    ".": "_",
    ",": "_",
    "#": "_",
    "[": "",
    "]": "",
    "(": "",
    ")": "",
    "{": "",
    "}": "",
    "!": "i-",
    "&": "and-",
    "<": "lt-",
    "=": "eq-",
    ">": "gt-",
    "|": "or-",
    "@": "at-",
    "?": "q-",
    "\\": "-",
    '"': "-",
    "'": "-",
    "*": "-",
    "+": "-",
    ";": "-",
    "^": "-",
    "`": "-",
    "~": "-",
    $: "-",
    ...options.replacements
  };
  const classAttrRegex = (needle) => new RegExp(`\\${needle}`, "g");
  const process = (node) => {
    if (node.tag === "style" && node.content) {
      const content = Array.isArray(node.content) ? node.content.join("") : node.content;
      node.content = postcss__default([
        postcssSafeCss({
          replacements: options.replacements
        })
      ]).process(content, { parser: safe__default }).css;
    }
    if (node.attrs?.class) {
      const classes = getClassCandidates(node.attrs.class, options.ignored);
      const safeClasses = [];
      for (let cls of classes) {
        if (options.ignored.some(({ heads, tails }) => cls.startsWith(heads) || cls.endsWith(tails))) {
          safeClasses.push(cls);
          continue;
        }
        for (const [from, to] of Object.entries(options.replacements)) {
          cls = cls.replace(classAttrRegex(from), to);
        }
        safeClasses.push(cls);
      }
      node.attrs.class = safeClasses.join(" ");
    }
    return node;
  };
  return tree.walk(process);
};

module.exports = plugin;

interface IgnoredOption {
  heads: string;
  tails: string;
}

export type SafeClassNamesConfig = {
  /**
   * Array of objects each containing heads/tails strings that mark the start and end of a class name to ignore.
   * If a class name matches a pattern defined here, it will not be processed.
   *
   * @example
   *
   * ```js
   * {
   *   ignored: [
   *     {
   *       heads: '[[',
   *       tails: ']]',
   *     },
   *   ],
   * }
   * ```
   */
  ignored: IgnoredOption[];

  /**
   * Character replacement mappings.
   *
   * The key is the character to replace and the value is the replacement.
   *
   * @example
   *
   * ```js
   * {
   *   '\/': '-',
   *   '.': '_',
   *   '%': 'pc',
   * }
   * ```
   */
  replacements: Record<string, string>;
};

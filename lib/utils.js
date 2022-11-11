const fs = require("fs-extra");
const path = require("path");
const mkdirp = require("mkdirp");
/**
 * Transforms a style dictionary token path to a css var but removes any occurence of
 * [default] key words for certain tokens, which allows you to structure semantic tokens in JSON
 *
 * Primarily used for values interacted with via scss and css custom properties
 */
const normalizeTokenName = (path) => {
  const normalizedPath = typeof path === "string" ? path.split("-") : path;
  return normalizedPath.filter((item) => item !== "[default]").join("-");
};
/**
 * Transforms a style dictionary token path to a dot-delimited token id and
 * removes occurences of nested [default] key words from the path
 *
 * Primarily used for values interacted with via typescript and css-in-js
 *
 * Example: content.color.grass_green.[default] => content.color.grass_green
 */
const normalizeTokenId = (path) => {
  const re = new RegExp(/\[default\]/);
  const normalizedId = typeof path === "string" ? path.split("-") : path;
  return normalizedId.map((item) => item.replace(re, "default")).join(".");
};
/**
 * Recursively traverse a style dictionary object to arbitrary depth
 *
 * Replaces [default] with 'default' and handles replacement of any keyword
 * designated in the pathOperators object
 *
 * Primarily used for values interacted with via typescript and css-in-js
 *
 * Example: "content": { "color": { "grass_green": { "[default]": "#359970" } => "content": { "color": { "grass_green": { "default": "#359970" },
 */
const normalizeTokenPath = (object) => {
  // set a list of operators to replace reserved words
  const pathOperators = {
    "[default]": "default",
  };

  // check if the value of a key is an array
  return Array.isArray(object)
    ? // map over array, recurse
      object.map(normalizeTokenPath)
    : // else, traverse; if the value of a key is an object
    object && typeof object === "object"
    ? // traverse the object using fromEntries
      Object.fromEntries(
        // replace the keys when they match a property inside the pathOperators object
        Object.entries(object).map(([k, v]) => [
          k in pathOperators ? pathOperators[k] : k,
          // continue recursion
          normalizeTokenPath(v),
        ])
      )
    : // break recursion
      object;
};

/**
 * Traverse a tokens object and transform a `-theme` key
 *
 * Primarily used for values interacted with via typeScript, when generating
 * index files that describe the shape of a set of tokens
 *
 * Example:
 * // index.d.ts
 * declare const _default: { "black-theme": { "content": { // types here... } } } => declare const _default: { "black": { "content": { // types here... } } }
 *
 */
const normalizeThemeName = (obj) => {
  const themeRegEx = new RegExp(/^[a-zA-Z]+-theme$/);
  for (const [key, value] of Object.entries(obj)) {
    if (themeRegEx.test(key)) {
      obj[key.replace(/-theme/, "")] = obj[key];
      delete obj[key];
    }
  }
  return obj;
};
/**
 * Gets the `*-theme` key from a monday tokens object
 * @param {*} obj
 */
const lookupTheme = (obj) => {
  const themeRegEx = new RegExp(/^[a-zA-Z]+-theme$/);

  let lookup = Object.keys(obj)
    .filter((key) => {
      return themeRegEx.test(key);
    })
    .forEach((key) => {
      return key;
    });
};

/**
 * Writes an index file
 * @description Use to generate an index when bundling in folders for each theme
 * @param {string[]} types - a collection of themes, colormodes, or token collection types, e.g. [`dark`, `light`]
 * @param {string | string[]} collection - the folder that should contain the index file, e.g. `color`
 */
const writeEsmIndex = async (types, collection) => {
  let output = "";
  for (const type of types) {
    output += `import {${type}} from './${type}'\n`;
  }
  output += `export default { ${types.join(", ")} }`;

  const dir = path.join(`dist/js/${collection}`);

  await mkdirp(dir);
  fs.writeFileSync(path.join(dir, `index.js`), output);
};

/**
 * Writes an index file for type declarations
 * @description Use to generate a .d.ts index file summarizing the contents of a collection
 * @param {string[]} types - a collection of themes, colormodes, or token collection types, e.g. [`dark`, `light`]
 * @param {string | string[]} collection - the folder that should contain the index file, e.g. `color`
 */
async function writeMainTsIndex(types, collection) {
  let output = "";
  for (const type of types) {
    output += `import ${type} from './${type}'\n`;
  }
  output += `declare const _default { ${types.join(", ")} }`;

  const dir = path.join(`dist/js/${collection}`);
  await mkdirp(dir);
  fs.writeFileSync(path.join(dir, `index.d.ts`), output);
}
/**
 * Gets the contents of a style dictionary tokens object at its first key,
 * which should always be the name of the theme in monday-ui-tokens.
 *
 * For example: dictionary.tokens[Object.entries(dictionary.tokens)[0][0]] looks up
 * the dictionary at `light-theme` and returns all properties for that key.
 *
 * Primarily used for values interacted with as css-in-js, where consumers import via file name.
 *
 * @TODO this could be brittle, create a custom parser instead:
 * https://github.com/amzn/style-dictionary/tree/main/examples/advanced/custom-parser
 *
 */
const getDictionary = (obj) =>
  obj.tokens
    ? obj.tokens[Object.entries(obj.tokens)[0][0]]
    : new Error(
        "Error, malformed tokens object. The name of the theme should be the first key in the dictionary object."
      );

/**
 * @param {Object} _object
 * @param {string} term
 * @returns a search result based on regex matching the term argument
 */
function searchObject(_object, term) {
  var query = new RegExp(term, "i");
  return Object.keys(_object).find(function (q) {
    return query.test(q);
  });
}

module.exports = {
  writeMainTsIndex,
  writeEsmIndex,
  normalizeTokenName,
  normalizeTokenPath,
  normalizeThemeName,
  lookupTheme,
  getDictionary,
};

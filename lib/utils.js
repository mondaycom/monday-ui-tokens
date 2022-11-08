const fs = require("fs-extra");
const path = require("path");
const mkdirp = require("mkdirp");
/**
 *  Transforms a style dictionary token path to a css var but removes any occurence of
 * [default] key words for certain tokens, which allows you to structure semantic tokens in JSON
 *
 */
const normalizeTokenName = (path) => {
  const normalizedPath = typeof path === "string" ? path.split("-") : path;
  return normalizedPath.filter((el) => el !== "[default]").join("-");
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
 *
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
 *
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
  lookupTheme,
};

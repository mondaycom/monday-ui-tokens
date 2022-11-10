const StyleDictionary = require("style-dictionary");

const glob = require("glob");

const {
  writeMainTsIndex,
  writeEsmIndex,
  normalizeTokenName,
  normalizeTokenPath,
  getDictionary,
  traverseAndReplace,
} = require("../lib/utils");

const themes = [`light`, `dark`, `black`, `hacker`];

StyleDictionary.registerFormat({
  name: "scss/variables",
  formatter: function (dictionary, config) {
    return `${dictionary.allProperties
      .map((prop) => {
        return `${"$" + normalizeTokenName(prop.path.join("-"))}:${
          prop.value
        };`;
      })
      .join("\n")}
      `;
  },
});
StyleDictionary.registerFormat({
  name: "javascript/object",
  formatter: function ({ dictionary }) {
    const recursiveleyFlattenDictionary = (obj) => {
      const tree = {};
      if (typeof obj !== "object" || Array.isArray(obj)) {
        return obj;
      }

      if (obj.hasOwnProperty("value")) {
        return obj.value;
      } else {
        for (const name in obj) {
          if (obj.hasOwnProperty(name)) {
            tree[name] = recursiveleyFlattenDictionary(obj[name]);
          }
        }
      }
      return tree;
    };

    let tokensObj = getDictionary(dictionary);

    return `${this.selector} ${JSON.stringify(
      recursiveleyFlattenDictionary(normalizeTokenPath(tokensObj)),
      null,
      2
    )}`;
  },
});
//

// js object
StyleDictionary.registerFormat({
  name: "javascript/object/esm",
  formatter: function ({ dictionary, file }) {
    const recursiveleyFlattenDictionary = (obj) => {
      const tree = {};
      if (typeof obj !== "object" || Array.isArray(obj)) {
        return obj;
      }

      if (obj.hasOwnProperty("value")) {
        return obj.value;
      } else {
        for (const name in obj) {
          if (obj.hasOwnProperty(name)) {
            tree[name] = recursiveleyFlattenDictionary(obj[name]);
          }
        }
      }

      return tree;
    };

    return `${this.selector} ${JSON.stringify(
      recursiveleyFlattenDictionary(getDictionary(dictionary)),
      null,
      2
    )}`;
  },
});
// ts declarations
StyleDictionary.registerFormat({
  name: "typescript/module-declarations",
  formatter: function ({ dictionary, options, file }) {
    const getType = (value) => {
      switch (typeof value) {
        case "string":
          return "string";
        case "number":
          return "number";
        default:
          return "any";
      }
    };

    const recursiveTypeGeneration = (obj) => {
      const tree = {};

      if (typeof obj !== "object" || Array.isArray(obj)) {
        return obj;
      }

      if (obj.hasOwnProperty("value") && typeof obj.value === "string") {
        return getType(obj.value);
      } else {
        for (const name in obj) {
          if (obj.hasOwnProperty(name)) {
            tree[name] = recursiveTypeGeneration(obj[name]);
          }
        }
      }
      return tree;
    };

    const output = `${this.selector}: ${JSON.stringify(
      recursiveTypeGeneration(getDictionary(dictionary)),
      null,
      2
    )}    
 export default ${file.destination
   .replace(`esm/colors/`, "")
   .replace(`.d.ts`, "")};`;

    return output
      .replace(/"any"/g, "any")
      .replace(/"string"/g, "string")
      .replace(/"number"/g, "number");
  },
});
// ts index
StyleDictionary.registerFormat({
  name: "typescript/index",
  formatter: function ({ dictionary, options, file }) {
    const getType = (value) => {
      switch (typeof value) {
        case "string":
          return "string";
        case "number":
          return "number";
        default:
          return "any";
      }
    };

    const recursiveTypeGeneration = (obj) => {
      const tree = {};

      if (typeof obj !== "object" || Array.isArray(obj)) {
        return obj;
      }

      if (obj.hasOwnProperty("value") && typeof obj.value === "string") {
        return getType(obj.value);
      } else {
        for (const name in obj) {
          if (obj.hasOwnProperty(name)) {
            tree[name] = recursiveTypeGeneration(obj[name]);
          }
        }
      }
      return tree;
    };

    const output = `${this.selector}: ${JSON.stringify(
      recursiveTypeGeneration(dictionary.tokens),
      null,
      2
    )}
 export default _default;`;

    return output
      .replace(/"any"/g, "any")
      .replace(/"string"/g, "string")
      .replace(/"number"/g, "number");
  },
});
//
//
//
StyleDictionary.extend({
  source: ["data/**/*.json"],
  platforms: {
    // scss: {
    //   source: glob.sync(`data/colors/**/*.json`),
    //   buildPath: "dist/scss/",
    //   files: [
    //     {
    //       destination: "variables.scss",
    //       format: "scss/variables",
    //       options: {
    //         outputReferences: false,
    //       },
    //     },
    //   ],
    // },
    jsObject: {
      source: glob.sync(`data/colors/**/*.json`),
      buildPath: "dist/js/",
      files: [
        {
          destination: `index.js`,
          format: "javascript/object",
          selector: "export default",
          filter: {
            customProperty: true,
            global: true,
          },
        },
        {
          destination: `black.js`,
          format: "javascript/object",
          selector: "export default",
          filter: {
            customProperty: true,
            theme: "black",
          },
        },
        {
          destination: `dark.js`,
          format: "javascript/object",
          selector: "export default",
          filter: {
            customProperty: true,
            theme: "dark",
          },
        },
        {
          destination: `hacker.js`,
          format: "javascript/object",
          selector: "export default",
          filter: {
            customProperty: true,
            theme: "hacker",
          },
        },
        {
          destination: `light.js`,
          format: "javascript/object",
          selector: "export default",
          filter: {
            customProperty: true,
            theme: "light",
          },
        },
      ],
    },
    // jsObjectEsm: {
    //   source: glob.sync(`data/colors/**/*.json`),
    //   buildPath: `dist/js/`,
    //   files: [
    //     {
    //       destination: `esm/colors/black.js`,
    //       format: "javascript/object/esm",
    //       selector: "export const black =",
    //       filter: {
    //         customProperty: true,
    //         theme: "black",
    //       },
    //     },
    //     {
    //       destination: `esm/colors/dark.js`,
    //       format: "javascript/object/esm",
    //       selector: "export const dark =",
    //       filter: {
    //         customProperty: true,
    //         theme: "dark",
    //       },
    //     },
    //     {
    //       destination: `esm/colors/hacker.js`,
    //       format: "javascript/object/esm",
    //       selector: "export const hacker =",
    //       filter: {
    //         customProperty: true,
    //         theme: "hacker",
    //       },
    //     },
    //     {
    //       destination: `esm/colors/light.js`,
    //       format: "javascript/object/esm",
    //       selector: "export const light =",
    //       filter: {
    //         customProperty: true,
    //         theme: "light",
    //       },
    //     },
    //   ],
    // },
    // jsObjectTypeDeclarations: {
    //   source: glob.sync(`data/colors/**/*.json`),
    //   buildPath: `dist/js/`,
    //   files: [
    //     {
    //       destination: `esm/colors/black.d.ts`,
    //       format: "typescript/module-declarations",
    //       selector: "declare const black",
    //       filter: {
    //         customProperty: true,
    //         theme: "black",
    //       },
    //     },
    //     {
    //       destination: `esm/colors/dark.d.ts`,
    //       format: "typescript/module-declarations",
    //       selector: "declare const dark",
    //       filter: {
    //         customProperty: true,
    //         theme: "dark",
    //       },
    //     },
    //     {
    //       destination: `esm/colors/light.d.ts`,
    //       format: "typescript/module-declarations",
    //       selector: "declare const light",
    //       filter: {
    //         customProperty: true,
    //         theme: "light",
    //       },
    //     },
    //   ],
    // },
    // jsObjectTypeIndex: {
    //   source: glob.sync(`data/colors/**/*.json`),
    //   buildPath: `dist/js/`,
    //   files: [
    //     {
    //       destination: `esm/colors/index.d.ts`,
    //       format: "typescript/index",
    //       selector: "declare const _default",
    //       filter: {
    //         customProperty: true,
    //         type: "color",
    //       },
    //     },
    //   ],
    // },
  },
}).buildAllPlatforms();

// todo, make async
writeEsmIndex(themes, `esm/colors`);

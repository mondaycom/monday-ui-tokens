const path = require("path");
const glob = require("glob");

// Style dictionary build configuration
const StyleDictionary = require("style-dictionary");

// Transforms a style dictionary token path to a css var but removes any occurence of
// [default] key words for certain tokens, which allows you to structure semantic tokens in JSON

const normalizeTokenName = (path) => {
  const normalizedPath = typeof path === "string" ? path.split("-") : path;
  return normalizedPath.filter((el) => el !== "[default]").join("-");
};

StyleDictionary.registerFormat({
  name: "monday/css/variables",
  formatter: function (dictionary, config) {
    return `${this.selector} {
      ${dictionary.allProperties
        .map((prop) => {
          return `--${normalizeTokenName(prop.path.join("-"))} : ${
            prop.value
          };`;
        })
        .join("\n")}
      }`;
  },
});

StyleDictionary.registerFormat({
  name: "javascript/object",
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
      recursiveleyFlattenDictionary(dictionary.tokens),
      null,
      2
    )}`;
  },
});

StyleDictionary.extend({
  source: ["data/**/*.json"],
  platforms: {
    scss: {
      "transformGroup": "scss",
      "buildPath": "dist/scss/",
      "files": [
        {
          "destination": "variables.scss",
          "format": "scss/variables",
          "options": {
            "outputReferences": false
          },
          "filter":{
            "customProperty": true,
          }
        }
      ]
    },
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
          destination: `light.js`,
          format: "javascript/object",
          selector: "export default",
          filter: {
            customProperty: true,
            theme: "light",
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
          destination: `black.js`,
          format: "javascript/object",
          selector: "export default",
          filter: {
            customProperty: true,
            theme: "black",
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
        }
      ],
    },
  },
}).buildAllPlatforms();

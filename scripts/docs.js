const StyleDictionary = require('style-dictionary');
const glob = require("glob");
const chroma = require("chroma-js")
const {
    normalizeTokenName
} = require("../lib/utils");

// Add a custom format that will generate the tokens related docs format
StyleDictionary.registerFormat({
    name: 'json/docColorTable',
    formatter: (dictionary) => {
        return (
            "{\n" + dictionary.allProperties.map(
                function (prop) {
                    return `"${normalizeTokenName(prop.path)}": ["${prop.value}","${chroma(prop.value).css('hsl')}" ,"${chroma(prop.value).css()}","${prop.role}"]`;
                }
            ).join(",\n") + "\n}"
        );
    },
});

StyleDictionary.extend({
    source: glob.sync(`data/**/*.json`),
    platforms: {
        // Story book sync tables
        "syncCoreSwatch": {
            "buildPath": "docs/data/js/tokens-tables/",
            "files": [
                {
                    "destination": "map.flat.tokens.content.json",
                    "format": "json/docColorTable",
                    "filter": {
                        "role": "content"
                    }
                },
                {
                    "destination": "map.flat.tokens.paletteBrand.json",
                    "format": "json/docColorTable",
                    "filter": {
                        "role": "brand",
                    }
                },
                {
                    "destination": "map.flat.tokens.paletteNatural.json",
                    "format": "json/docColorTable",
                    "filter": {
                        "role": "natural",
                    }
                }
            ]
        },
    }
}).buildAllPlatforms();

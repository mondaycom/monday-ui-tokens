const StyleDictionary = require('style-dictionary');
const glob = require("glob");
const {
    normalizeTokenName
} = require("../lib/utils");

// Add a custom format that will generate the tokens related docs format
StyleDictionary.registerFormat({
    name: 'json/flatSyncTable',
    formatter: (dictionary) => {
        return (
            "{\n" + dictionary.allProperties.map(
                function (prop) {
                    return `"${normalizeTokenName(prop.path)}": ["${prop.value}","${prop.role}"]`;
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
                    "format": "json/flatSyncTable",
                    "filter": {
                        "role": "content"
                    }
                },
                {
                    "destination": "map.flat.tokens.paletteBrand.json",
                    "format": "json/flatSyncTable",
                    "filter": {
                        "role": "brand",
                    }
                },
                {
                    "destination": "map.flat.tokens.paletteNatural.json",
                    "format": "json/flatSyncTable",
                    "filter": {
                        "role": "natural",
                    }
                }
            ]
        },
    }
}).buildAllPlatforms();

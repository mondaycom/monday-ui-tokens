# Monday Ui tokens

A style dictionary token registry for monday.com Vibe tokens. 

This registry output design tokens in various flavours:
* SCSS
* JS
* JS/ESM
we use [Style-dctionary](https://amzn.github.io/style-dictionary/) to output them

## installation
````npm i monday-ui-tokens````

## Build
````npm run build````

## Usage
Tokens can be imported from the dist folder
* dist/js
* dist/js/esm
* scss

JS tokens are separated into themes and include only key tokens.
SCSS folder contains a unified file: variables.scss and include all tokens scope.

### Dependencies
style-dictionary

### Tokens scope
Our tokens are divided into scopes
* core: global tokens , not influenced by theme.
* colors: this scope is divided to:
  * content: content color palette references that are used within themes.
  * palette: reference colors that are used within themes.
  * themes and products.
    * our main themes are:
      * light
      * dark
      * black
      * hacker

### Token Roles
We have reference tokens: content, palette
We have key tokens.
in Vibe related efforts we recommend using only key tokens

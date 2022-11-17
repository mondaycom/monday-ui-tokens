# Monday UI tokens

A style dictionary token registry for monday.com Vibe tokens.

This registry outputs design tokens in various flavours:

- SCSS
- JS
- JS/ESM

We use [style-dictionary](https://amzn.github.io/style-dictionary/) to output them.

## installation

`npm i monday-ui-tokens`

## Build

`npm run build`

## Usage

Tokens can be imported from the dist folder

- dist/js
- dist/js/esm
- scss

JS tokens are separated into themes and include only key tokens.
SCSS folder contains a unified file: variables.scss and include all tokens scope.

### Dependencies

style-dictionary

### Tokens scope

Our tokens are divided into scopes

- core: global tokens , not influenced by theme.
- colors: this scope is divided to:
  - content: content color palette references that are used within themes.
  - palette: reference colors that are used within themes.
  - themes and products.
    - our main themes are:
      - light
      - dark
      - black
      - hacker

### Token Roles

* Reference tokens: content, palette.
* Key tokens.
* In Vibe related efforts we recommend using only key tokens.

### Storybook reference
* An Example of token values can be used viewed using a storybook instance. 
  * Content colors
  * Brand Palette
  * Natural Palette
  * Use: 
    * ```npm run build```
    * ```npm run storybook```

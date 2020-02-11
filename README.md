# @loopmode/create-prism-list

Creates a list of installed prismjs themes, languages or plugins.

Usage: `yarn create prism-list outFile typeOrPattern`

Run it in a project where prismjs is installed. Monorepos and yarn workspaces are supported.

```sh
# using yarn
yarn create prism-list ./languages.ts languages
yarn create prism-list ./themes.ts themes
yarn create prism-list ./plugins.ts plugins

# using npm
npm init prism-list ./languages.ts languages

# with a pattern
yarn create prism-list ./stuff/minified-files.json *.min
```

### `outFile`

File to create, a filepath relative to the current working directory


Supported extensions: `json`, `js`, `ts`, `tsx`.

Note about typescript: The export will be `as const`, so you can do something like `type PrismTheme = typeof import('./themes.ts').default[number];`.

### typeOrPattern

- type can either be one of `themes|languages|plugins`
- type can be a glob pattern relative to the prismjs directory inside node_modules
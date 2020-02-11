#!/usr/bin/env node

/*
 * Checks installed prismjs and generates a list of available languages or themes.
 *
 * Usage:
 * create-prism-list <outFile> <typeOrPattern>
 *
 * - `outFile` - path to file to create, relative to cwd
 * - `typeOrPattern` - either one of 'themes', 'languages' or `plugins`, or a glob pattern relative to prismjs
 */

const fs = require("fs-extra");
const path = require("path");
const glob = require("glob");

const defaultPatterns = {
  themes: "themes/*.css",
  languages: "components/!(index|*.min).js",
  plugins: "plugins/*.css"
};

const codeGenerators = {
  ".json$": generateJSON,
  ".js$": generateJavascript,
  ".tsx?$": generateTypescript
};

const [outFile, patternOrType] = process.argv.slice(2);
const pattern = defaultPatterns[patternOrType] || patternOrType;

if (outFile && pattern) {
  createModule(outFile, pattern);
} else {
  console.info(">> Usage: create-prism-list <outFile> <typeOrPattern>");
}

function createModule(outFile, pattern) {
  const names = getNames(pattern);
  fs.ensureDirSync(path.dirname(outFile));
  const codeGenerator = getGenerator(outFile);
  if (!codeGenerator) {
    console.warn(
      `>> Unsupported type "${path.extname(outFile)}" - supported types: `,
      Object.keys(codeGenerators)
    );
    process.exit(1);
  }
  const moduleFile = path.resolve(process.cwd(), outFile);
  const moduleCode = codeGenerator(names);
  fs.writeFileSync(moduleFile, moduleCode, "utf-8");
}

function getNames(pattern) {
  let prismDir;
  try {
    prismDir = path.dirname(require.resolve("prismjs"));
  } catch (error) {}
  if (!prismDir) {
    console.warn(">> prismjs not installed");
    process.exit(1);
  }

  const files = glob.sync(pattern, {
    cwd: prismDir
  });
  return files.map(file => {
    // "themes/prism-coy.css" -> "coy"
    return path
      .basename(file)
      .replace("prism-", "")
      .split(".")[0];
  });
}

function generateJSON(names) {
  return JSON.stringify(names, null, 2);
}

function generateJavascript(names) {
  const arrayString = JSON.stringify(names, null, 2).replace(/"/g, "'");
  return `module.exports = ${arrayString};`;
}

function generateTypescript(names) {
  const arrayString = JSON.stringify(names, null, 2).replace(/"/g, "'");
  return `export default ${arrayString} as const;`;
}

function getGenerator(filename, generators = codeGenerators) {
  const fileExtension = path.extname(filename);
  const key = Object.keys(generators).find(pattern =>
    fileExtension.match(pattern)
  );
  return generators[key];
}

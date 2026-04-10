// Patches missing internal files in lodash-es that are required by kapsule -> three-globe.
// lodash-es 4.17.21 ships without these private helpers; this script creates them.
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "../node_modules/lodash-es");

const files = {
  "_baseTrim.js": `import trimmedEndIndex from './_trimmedEndIndex.js';
var reTrimStart = /^\\s+/;
function baseTrim(string) {
  return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '') : string;
}
export default baseTrim;
`,
  "_getRawTag.js": `import _Symbol from './_Symbol.js';
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
var nativeObjectToString = objectProto.toString;
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
  try { value[symToStringTag] = undefined; var unmasked = true; } catch (e) {}
  var result = nativeObjectToString.call(value);
  if (unmasked) { if (isOwn) { value[symToStringTag] = tag; } else { delete value[symToStringTag]; } }
  return result;
}
export default getRawTag;
`,
};

let patched = 0;
for (const [name, content] of Object.entries(files)) {
  const filePath = path.join(dir, name);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`Patched lodash-es: ${name}`);
    patched++;
  }
}
if (patched === 0) console.log("lodash-es: all patches already applied");

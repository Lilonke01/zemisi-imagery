// Check the real settings helper without requiring a running Next.js server.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const compiled = ts.transpileModule(fs.readFileSync('src/lib/settings.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const context = { exports: {} };
vm.runInNewContext(compiled, context);
const { defaults, whatsapp } = context.exports;
const general = new URL(whatsapp(defaults));
assert.equal(general.pathname, '/27832321716');
assert.equal(general.searchParams.get('text'), defaults.default_whatsapp_message);
const changed = { ...defaults, whatsapp_number: '27820000000' };
const contextual = "Hi Zemisi Imagery! I'm interested in this photo: A & B — https://example.com/gallery?photo=123";
const photo = new URL(whatsapp(changed, contextual));
assert.equal(photo.pathname, '/27820000000');
assert.equal(photo.searchParams.get('text'), contextual);
assert.equal(photo.searchParams.size, 1);
console.log('WhatsApp settings and contextual encoding checks passed.');

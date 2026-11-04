// Ambient type declarations for packages whose own typings are not resolvable
// via package.json "exports".
// @gotfeedback/markdown-it-media has types at ./types/index.d.ts but its
// "exports" map points only to ./index.js, so TypeScript cannot resolve them.
declare module "@gotfeedback/markdown-it-media";

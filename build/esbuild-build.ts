import esbuild from "esbuild";
const typescriptEntries = ["build/index.ts"];
// const cssEntries = ["build/style.css"];
const entries = [
  ...typescriptEntries,
  //  ...cssEntries
];

export const esBuildContext: esbuild.BuildOptions = {
  platform: "node",
  sourcemap: true,
  entryPoints: entries,
  bundle: true,
  minify: false,
  loader: {
    ".png": "dataurl",
    ".woff": "dataurl",
    ".woff2": "dataurl",
    ".eot": "dataurl",
    ".ttf": "dataurl",
    ".svg": "dataurl",
  },
  outdir: "build/dist",
};

esbuild
  .build(esBuildContext)
  .then(() => {
    console.log("\tesbuild complete");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import fs, { readdirSync } from "fs";
import { resolve } from "path";
import generateFile from "vite-plugin-generate-file";
import { viteStaticCopy } from "vite-plugin-static-copy";

// read package.json file
const packageJson = JSON.parse(fs.readFileSync(resolve(__dirname, "package.json"), "utf-8"));

const removeExtension = (filename) => {
  const lastDotPosition = filename.lastIndexOf(".");
  if (lastDotPosition === -1) {
    return filename;
  }
  return filename.substring(0, lastDotPosition);
};

// find all files in the current directory including subdirectories
const mapAllFilesInDir = (baseDir, output) => {
  const files = readdirSync(baseDir);
  // console.log("files", files);
  return files.reduce((acc, dir) => {
    // const name = resolve(dir, file);
    const name = `${baseDir}/${dir}`;
    const outputName = removeExtension(`${output}/${dir}`);
    const isDirectory = fs.statSync(name).isDirectory();
    return isDirectory
      ? { ...acc, ...mapAllFilesInDir(name, `${outputName}`) }
      : {
          ...acc,
          [outputName]: removeExtension(name),
        };
  }, {});
};

// find subdirectories in the current directory
const listAllSubDirectories = (baseDir) => {
  const files = readdirSync(baseDir);
  const directories = files.reduce((acc, file) => {
    const name = `${baseDir}/${file}`;
    const isDirectory = fs.statSync(name).isDirectory();
    return isDirectory ? [...acc, name, ...listAllSubDirectories(name)] : acc;
  }, []);
  return directories;
};

const SOURCE_ENTRY = "src/redesign";
// generate 'exports' and 'typesVersions' fields for package.json based on the source directory
const createEntryPoints = (baseDir, esmBuildDir, cjsBuildDir, typesDir) => {
  const dirs = listAllSubDirectories(baseDir);
  const entryPoints = dirs.map((dir) => dir.slice(baseDir.length + 1));
  const entryPointsMap = entryPoints.reduce((acc, entryPoint) => {
    return {
      ...acc,
      [`./${entryPoint}`]: {
        import: `${esmBuildDir}/${entryPoint}/index.esm.js`,
        require: `${cjsBuildDir}/${entryPoint}/index.js`,
        types: `${typesDir}/${entryPoint}/index.d.ts`,
      },
      [`./${entryPoint}/*`]: {
        import: `${esmBuildDir}/${entryPoint}/*.esm.js`,
        require: `${cjsBuildDir}/${entryPoint}/*.js`,
        types: `${typesDir}/${entryPoint}/*.d.ts`,
      },
    };
  }, {});
  entryPointsMap["."] = {
    import: `${esmBuildDir}/index.esm.js`,
    require: `${cjsBuildDir}/index.js`,
    types: `${typesDir}/index.d.ts`,
  };
  entryPointsMap["./*"] = {
    import: `${esmBuildDir}/*.esm.js`,
    require: `${cjsBuildDir}/*.js`,
    types: `${typesDir}/*.d.ts`,
  };

  const typesVersions = {
    "*": {
      "*": [`${typesDir}/*`],
      ...entryPoints.reduce((acc, entryPoint) => {
        return {
          ...acc,
          [entryPoint]: [`${typesDir}/${entryPoint}/index.d.ts`],
        };
      }, {}),
    },
  };
  return { exports: entryPointsMap, typesVersions };
};

const pick = (obj, props) => {
  const newObj = {};
  props.forEach((prop) => {
    newObj[prop] = obj[prop];
  });
  return newObj;
};

const createPackageJson = (packageJson, esmBuildDir, cjsBuildDir, typesDir) => {
  const { exports, typesVersions } = createEntryPoints(SOURCE_ENTRY, esmBuildDir, cjsBuildDir, typesDir);
  const newPackageJson = {
    ...packageJson,
    main: `${cjsBuildDir}/index.js`,
    module: `${esmBuildDir}/index.mjs`,
    types: "index.d.ts",
    typesVersions,
    exports,
    dependencies: pick(packageJson.dependencies, ["react-fast-compare", "@types/prop-types", "prop-types"]),
  };
  delete newPackageJson.scripts;
  return newPackageJson;
};

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [react()]
  build: {
    minify: false,
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      external: ["react", "react-dom", "prop-types", "@types/prop-types"],
      // output: { dir: "dist/lib/build" }
      output: [
        { dir: "dist/lib/build/esm", format: "esm" },
        { dir: "dist/lib/build/cjs", format: "cjs" },
      ],
    },
    lib: {
      entry: mapAllFilesInDir("src/redesign", "js"),
      name: "react-xarrows",
      formats: ["cjs", "es"],
    },
    // todo: to this only in prod mode
    sourcemap: true,
  },
  plugins: [
    dts({ entryRoot: "src", outputDir: "dist/lib/types", tsConfigFilePath: "tsconfig.json" }),
    // @ts-ignore
    generateFile([
      {
        type: "json",
        output: "./package.json",
        data: createPackageJson(packageJson, "./lib/build/esm/js", "./lib/build/cjs/js", "./lib/types/redesign"),
      },
    ]),
    viteStaticCopy({
      targets: [
        {
          src: "LICENSE",
          dest: ".",
        },
        {
          src: "README.md",
          dest: ".",
        },
      ],
    }),
  ],
});

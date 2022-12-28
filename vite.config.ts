import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import fs, { readdirSync } from "fs";
import { resolve } from "path";
import generateFile from "vite-plugin-generate-file";

// // find all files in the current directory(no folders)
// const listAllFilesInDir = (dir: string) => {
//   return readdirSync(dir, { withFileTypes: true })
//     .filter((dirnet) => dirnet.isFile())
//     .map((dirnet) => resolve(dir, dirnet.name));
// };

// // find all files in the current directory including subdirectories
// const listAllFilesInDir = (dir) => {
//   const files = readdirSync(dir);
//   console.log("files", files);
//   return files.reduce((acc, file) => {
//     const name = resolve(dir, file);
//     const isDirectory = fs.statSync(name).isDirectory();
//     return isDirectory ? [...acc, ...listAllFilesInDir(name)] : [...acc, name];
//   }, []);
// };

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
const createEntryPoints = (baseDir, distDir, typesDir) => {
  const dirs = listAllSubDirectories(baseDir);
  const entryPoints = dirs.map((dir) => dir.slice(baseDir.length + 1));
  // console.log("dirs", dirs);
  // console.log("entryPoints", entryPoints);
  const entryPointsMap = entryPoints.reduce((acc, entryPoint) => {
    return {
      ...acc,
      [`./${entryPoint}`]: {
        import: `${distDir}/${entryPoint}/index.mjs`,
        require: `${distDir}/${entryPoint}/index.js`,
        types: `${typesDir}/${entryPoint}/index.d.ts`,
      },
      [`./${entryPoint}/*`]: {
        import: `${distDir}/${entryPoint}/*.mjs`,
        require: `${distDir}/${entryPoint}/*.js`,
        types: `${typesDir}/${entryPoint}/*.d.ts`,
      },
    };
  }, {});
  entryPointsMap["."] = {
    import: `${distDir}/index.mjs`,
    require: `${distDir}/index.js`,
    types: `${typesDir}/index.d.ts`,
  };
  entryPointsMap["./*"] = {
    import: `${distDir}/*.mjs`,
    require: `${distDir}/*.js`,
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
const createPackageJson = (packageJson, distDir, typesDir) => {
  const { exports, typesVersions } = createEntryPoints(SOURCE_ENTRY, distDir, typesDir);
  const newPackageJson = {
    ...packageJson,
    main: `${distDir}/index.js`,
    module: `${distDir}/index.mjs`,
    types: "index.d.ts",
    typesVersions,
    exports,
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
    emptyOutDir: true,
    lib: {
      // entry: ["src/index.ts"],
      // entry: listAllFilesInDir("src/redesign"),
      // entry: { "build/internal/hooks": "src/redesign/internal/hooks" },
      entry: mapAllFilesInDir("src/redesign", "build"),
      name: "react-xarrows",
      formats: ["cjs", "es"],
    },
    rollupOptions: { external: ["react", "react-dom", "lodash", "prop-types", "@types/prop-types"] },
    // todo: to this only in prod mode
    sourcemap: true,
  },
  plugins: [
    dts({ entryRoot: "src", outputDir: "dist/types", tsConfigFilePath: "tsconfig.json" }),
    // @ts-ignore
    generateFile([
      {
        type: "json",
        output: "./package.json",
        // data: packageJson,
        data: createPackageJson(packageJson, "./build", "./types/redesign"),
      },
    ]),
  ],
});

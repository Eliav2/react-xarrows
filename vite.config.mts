import { defineConfig } from 'vite';
import { copyFileSync } from 'node:fs';
import dts from 'vite-plugin-dts';

// Library build only. Tests keep their own config in vitest.config.ts because
// they compile JSX with the automatic runtime, while the published build must
// stay on the classic runtime (see `jsx` in tsconfig.json) so it never emits an
// import of react/jsx-runtime, which does not exist on React 16.8.
export default defineConfig({
  // Must be set explicitly. The bundler does NOT inherit `jsx` from tsconfig.json,
  // and its own default is the automatic runtime, which pulls react/jsx-runtime
  // into the bundle and breaks React 16.8.
  esbuild: {
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
  plugins: [
    dts({
      // Flatten the whole public API into one declaration file. The per-file
      // tree tsc emits uses extensionless relative imports, which cannot be
      // reused by both the import and require conditions of the exports map.
      bundleTypes: true,
      include: ['src'],
      afterBuild: () => {
        // Same types, two extensions. Without .d.mts, TypeScript on
        // moduleResolution node16 reads index.d.ts as CJS and reports the ESM
        // entry as "masquerading as CJS". A flat file has no relative imports,
        // so the copy is valid under both module systems.
        copyFileSync('lib/index.d.ts', 'lib/index.d.mts');
        copyFileSync('lib/index.d.ts', 'lib/index.d.cts');
      },
    }),
  ],
  build: {
    outDir: 'lib',
    emptyOutDir: true,
    sourcemap: true,
    // esbuild cannot emit ES5. browserslist already excludes IE11, so ES5 was
    // only ever costing bytes.
    target: 'es2015',
    lib: {
      entry: 'src/index.tsx',
      // Global name for the UMD bundle, unchanged from the webpack build.
      name: 'reactXarrow',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) =>
        ({ es: 'index.mjs', cjs: 'index.cjs', umd: 'index.umd.js' })[format] ?? `index.${format}.js`,
    },
    rollupOptions: {
      // React is the only external left. The package has no runtime
      // dependencies, so a script-tag consumer needs nothing but React.
      external: ['react'],
      output: {
        globals: { react: 'React' },
        // The entry mixes a default export with named ones. `named` keeps the
        // default reachable at `.default`, which is what the webpack UMD build
        // already did, so script-tag consumers see no change.
        exports: 'named',
      },
    },
  },
});

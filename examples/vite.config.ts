import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// GitHub Pages serves the demo from /<repo>/, everything else from the root.
const base = process.env.GITHUB_PAGES === 'true' ? '/react-xarrows/' : '/';

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    // The alias below pulls library source out of the repo root, where pnpm has
    // installed React 18 for the library's own build and tests. The demo runs
    // React 19 from examples/. Without deduping, the two halves of the app get
    // two React copies, the second one's hook dispatcher is null, and every
    // route that renders an Xarrow throws "Cannot read properties of null".
    dedupe: ['react', 'react-dom'],
    alias: {
      // Resolve the library straight from source so the demo always reflects
      // this checkout. package.json still declares a real dependency so that
      // external sandboxes importing examples/ on its own can install it.
      'react-xarrows': path.resolve(dirname, '../src/index.tsx'),
    },
  },
  server: {
    // CodeSandbox and StackBlitz proxy the dev server through their own hosts.
    allowedHosts: true,
  },
});

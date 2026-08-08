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

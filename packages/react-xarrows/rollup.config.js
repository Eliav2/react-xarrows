import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import { defineConfig } from 'rollup';

const dist = 'dist';

const rollupConfig = defineConfig({
  input: 'src/index.tsx',
  output: [
    {
      file: `${dist}/react-xarrows.cjs.js`,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: `${dist}/react-xarrows.esm.js`,
      format: 'esm',
      sourcemap: true,
    },
    {
      file: `${dist}/react-xarrows.umd.js`,
      format: 'umd',
      sourcemap: true,
      name: 'ReactXarrows',
      globals: [{ react: 'React', lodash: '_', 'prop-types': 'PT' }],
    },
  ],
  plugins: [del({ targets: `${dist}/*`, runOnce: true }), typescript({ tsconfig: './tsconfig.rollup.json' })],
  external: ['react', 'lodash', 'prop-types'],
});

export default rollupConfig;

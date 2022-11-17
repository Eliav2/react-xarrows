import {defineConfig} from 'vite'
// import path from 'path'
// import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    // plugins: [react()]
    build: {
        minify: false,
        outDir: "dist",
        emptyOutDir: true,

        // target: "es2015",
        // target: "modules",
        lib: {
            entry: "src/index.tsx",
            formats: ["cjs", "es"],
        },
        rollupOptions: {external: ['react', 'react-dom', 'lodash', 'prop-types', '@types/prop-types']}
        // rollupOptions: {
        //   output: {
        //     manualChunks: {
        //       vendor: ["react", "react-router-dom", "react-dom"],
        //       ...renderChunks(dependencies),
        //     },
        //   },
        // },
    }
})

// rollup.config.mjs
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';
// import terser from '@rollup/plugin-terser';

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
	input: 'lib.esm/index.js',
	output: [
        {
            // dir: 'dist',
            file: 'dist/open-provider.umd.js',
            format: 'umd',
            name: 'openProvider'
        },
        /* {
            // dir: 'dist',
            file: 'dist/bundle.umd.min.js',
            format: 'umd',
            name: 'openProvider',
            plugins: [terser()] // minify bundle
        } */
    ],
    plugins: [
        commonjs(), 
        nodeResolve(), 
        json(), 
        nodePolyfills({
            include: 'events'
        })
    ]
};
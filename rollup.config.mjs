// rollup.config.mjs
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';

const globals = `
    const global = window;
    // const process = {
    //     env: {
    //         NODE_ENV: 'production'
    //     },
    //     nextTick: function (fn) {}
    // };
    // const Buffer = {
    //     alloc: function () {},
    //     from: function () {},
    // };
`;

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
            name: 'openProvider',
            banner: globals,
            // intro: 'const global = window;',
        },
    ],
    plugins: [
        commonjs(), 
        nodeResolve(), 
        json(), 
        nodePolyfills({
            include: 'events',
        })
    ]
};
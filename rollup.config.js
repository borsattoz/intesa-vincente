import commonjs from '@rollup/plugin-commonjs';
import { copy } from '@web/rollup-plugin-copy';
import css from 'rollup-plugin-import-css';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';

const ENV = 'production';

export default {
    input: 'src/index.tsx',
    output: {
	dir: 'dist',
	format: 'esm',
	sourcemap: ENV === 'production' ? false : true,
    },
    plugins: [
	typescript(),
	nodeResolve(),
	replace({
	    preventAssignment: true,
	    'process.env.NODE_ENV': JSON.stringify(ENV),
	}),
	commonjs(),
	css({
	    inject: true,
	}),
	copy({
	    rootDir: 'src',
	    patterns: [
		'*.html',
		'*.txt',
	    ],
	    exclude: '',
	}),
    ],
}

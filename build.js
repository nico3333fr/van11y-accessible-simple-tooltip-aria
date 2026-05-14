'use strict';

const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const { minify } = require('terser');

const pkg = require('./package.json');

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');

const banner = [
    '/**',
    ` * ${pkg.name} - ${pkg.description}`,
    ` * @version v${pkg.version}`,
    ` * @link ${pkg.homepage}`,
    ` * @license ${pkg.license} : https://github.com/nico3333fr/van11y-accessible-simple-tooltip-aria/blob/master/LICENSE`,
    ' */',
    ''
].join('\n');

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function listSrcFiles() {
    return fs.readdirSync(SRC_DIR).filter((f) => f.endsWith('.js'));
}

async function buildEs5() {
    const es6Files = listSrcFiles().filter((f) => f.endsWith('.es6.js'));

    for (const file of es6Files) {
        const srcPath = path.join(SRC_DIR, file);
        const code = fs.readFileSync(srcPath, 'utf8');

        const transformed = babel.transformSync(code, {
            babelrc: false,
            configFile: false,
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: { ie: '10' },
                        loose: true,
                        modules: false
                    }
                ]
            ]
        });

        const baseName = file.replace(/\.es6\.js$/, '');
        const es5Path = path.join(DIST_DIR, `${baseName}.js`);
        fs.writeFileSync(es5Path, transformed.code);

        const minified = await minify(transformed.code);
        if (minified.error) {
            throw minified.error;
        }
        const minPath = path.join(DIST_DIR, `${baseName}.min.js`);
        fs.writeFileSync(minPath, banner + minified.code);
    }
}

function buildDefault() {
    const allFiles = listSrcFiles();
    const passthroughJs = allFiles.filter(
        (f) => f.endsWith('.js') && !f.endsWith('.es6.js')
    );
    const es6Files = allFiles.filter((f) => f.endsWith('.es6.js'));

    for (const file of passthroughJs) {
        const src = path.join(SRC_DIR, file);
        const code = fs.readFileSync(src, 'utf8');

        fs.writeFileSync(path.join(DIST_DIR, file), code);

        // produce minified version with banner
        // intentionally omitted: only es6 sources require minification in this project
    }

    for (const file of es6Files) {
        const src = path.join(SRC_DIR, file);
        fs.writeFileSync(path.join(DIST_DIR, file), fs.readFileSync(src, 'utf8'));
    }
}

async function main() {
    ensureDir(DIST_DIR);

    const task = process.argv[2] || 'default';

    if (task === 'es5') {
        await buildEs5();
        return;
    }

    if (task === 'default') {
        await buildEs5();
        buildDefault();
        return;
    }

    console.error(`Unknown task: ${task}`);
    process.exit(1);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

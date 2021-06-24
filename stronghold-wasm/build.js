const cp = require('child_process');
const fs = require('fs');

let buildWeb = process.argv.includes('--web')
let buildNode = process.argv.includes('--node')

if(!buildWeb && !buildNode) {
    buildWeb = true
    buildNode = true
}

console.log(`Building Web: ${buildWeb.toString().toUpperCase()}`)
console.log(`Building Node: ${buildNode.toString().toUpperCase()}`)

if(buildNode) {
    console.log('Generating nodejs build...');
    const result = cp.spawnSync('wasm-pack', 'build -t nodejs -d nodejs --out-name stronghold-wasm-nodejs'.split(' '), {
        stdio: 'inherit',
    });
    if (result.error) {
        if (result.error.message.includes('ENOENT')) {
            console.error('wasm-pack is not installed. Install from https://rustwasm.github.io/wasm-pack')
        } else {
            console.error(result.error.message);
        }
        process.exit(1);
    }
    if (result.status) {
        process.exit(result.status);
    }

    console.log('Replacing name in nodejs/package.json...');
    const nodeFile = String(fs.readFileSync('nodejs/package.json', 'utf-8'));
    const newNodeFile = nodeFile.replace('"stronghold_wasm"', '"stronghold-wasm-nodejs"');
    fs.writeFileSync('nodejs/package.json', newNodeFile);
}

if(buildWeb) {
    console.log('Generating web build...');
    const result = cp.spawnSync('wasm-pack', 'build -t bundler -d web --out-name stronghold-wasm-web'.split(' '), {
        stdio: 'inherit',
    });
    if (result.error) {
        console.error(result.error.message);
        process.exit(1);
    }
    if (result.status) {
        process.exit(result.status);
    }

    console.log('Replacing name in web/package.json...');
    const webFile = String(fs.readFileSync('web/package.json', 'utf-8'));
    const newWebFile = webFile.replace('"stronghold_wasm"', '"stronghold-wasm-web"');
    fs.writeFileSync('web/package.json', newWebFile);
}

console.log('Done!');

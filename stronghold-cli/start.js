
const execSync = require('child_process').execSync

const arg = process.argv.slice(2) || ''

execSync(`tsc-watch --build --onSuccess "yarn run start:js ${arg.join(' ')}"`, {
  stdio: [0, 1, 2],
})

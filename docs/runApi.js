const fsx = require('fs-extra');
const path = require('path');
const process = require('process');

console.log(`==> Starting build.js for ${path.basename(process.cwd())}`);
console.log();

// Clean the old build outputs
fsx.emptyDirSync('dist');
fsx.emptyDirSync('lib');
fsx.emptyDirSync('temp');
fsx.emptyDirSync('etc/test-outputs');

// Run the scenario runner
require('./scripts/buildApi.js').runScenarios('./config/build-config.json');

console.log();
console.log(`==> Finished build.js for ${path.basename(process.cwd())}`);
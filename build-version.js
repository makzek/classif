'use strict';

const fs = require('fs');
const timestamp = new Date().toISOString();

fs.writeFileSync('src/environments/version.ts', 'export const VERSION = {\ntimestamp: \'' + timestamp + '\'\n};\n');

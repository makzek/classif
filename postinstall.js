'use strict';

const fs = require('fs');

fs.createReadStream('src/app/app.config.ts')
.pipe(fs.createWriteStream('src/app/app.config.local.ts'));

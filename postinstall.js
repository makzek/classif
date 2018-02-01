'use strict';

const fs = require('fs');
const cfgName = 'src/app/app.config.ts';
const localCfgName = 'src/app/app.config.local.ts';

if (!fs.existsSync(localCfgName)) {
    fs.writeFileSync(localCfgName,`
export const APP_CONFIG_LOCAL = {};
`
    );
}

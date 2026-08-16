const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

const regex = /ojama: 'rgba\(255, 255, 255, 0\.3\)',\s*/;
code = code.replace(regex, '');

fs.writeFileSync('src/GameEngine.tsx', code);

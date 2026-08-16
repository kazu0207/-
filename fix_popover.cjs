const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

code = code.replace(/absolute -right-12 top-1\/2/, 'absolute -left-12 top-1/2');
code = code.replace(/absolute -right-24 top-1\/2/, 'absolute -left-24 top-1/2');

fs.writeFileSync('src/GameEngine.tsx', code);

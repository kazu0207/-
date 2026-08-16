const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

// 1. Fix match animation timeout
code = code.replace(/status: 'animating_gravity'\s*\}\);\s*\}, 600\);/g, "status: 'animating_gravity'\n        });\n      }, 850);");

// 2. Fix block spawn opacity
const initialOpacityRegex = /initial=\{\{\s*opacity:\s*0,/;
code = code.replace(initialOpacityRegex, "initial={{\n        opacity: 1,");

// Also remove opacity: 1 from normal animate to avoid overriding 
// Wait, if animate has opacity: 1, it's fine.
const animateOpacityRegex = /:\s*\{\s*opacity:\s*1,\s*scale:\s*1,/;
// It's perfectly fine to keep it.

fs.writeFileSync('src/GameEngine.tsx', code);

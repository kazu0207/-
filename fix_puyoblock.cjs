const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

const regex = /const colorHex = \{\s*red: '#e11d48',\s*blue: '#0891b2',\s*green: '#059669',\s*yellow: '#d97706',\s*chameleon: '#9333ea', \/\/ Fallback for chameleon\s*gravity: '#475569',\s*tornado: '#14b8a6'\s*\}\[card\.color\];/;

const newCode = `const actualColor = card.chameleonColor || card.color;
  const colorHex = {
    red: '#e11d48',
    blue: '#0891b2',
    green: '#059669',
    yellow: '#d97706',
    ojama: '#ffffff',
    chameleon: '#9333ea',
    gravity: '#475569',
    tornado: '#14b8a6'
  }[actualColor as keyof typeof colorHex] || '#ffffff';`;

code = code.replace(regex, newCode);

fs.writeFileSync('src/GameEngine.tsx', code);

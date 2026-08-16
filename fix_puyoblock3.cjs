const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

const ojamaPuyoRegex = /className="absolute inset-0\.5 border-2 border-white\/40 bg-white\/20 shadow-inner flex items-center justify-center overflow-hidden backdrop-blur-sm"/;
const newOjamaPuyo = `className="absolute inset-0.5 border-2 border-slate-200 bg-white shadow-inner flex items-center justify-center overflow-hidden"`;

code = code.replace(ojamaPuyoRegex, newOjamaPuyo);

const ojamaPuyoInner = /className="w-1\/2 h-1\/2 border-2 border-white\/50 rounded-full"/;
const newOjamaPuyoInner = `className="w-1/2 h-1/2 border-4 border-slate-200 rounded-full"`;

code = code.replace(ojamaPuyoInner, newOjamaPuyoInner);

fs.writeFileSync('src/GameEngine.tsx', code);

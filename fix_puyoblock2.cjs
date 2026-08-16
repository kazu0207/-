const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

const regex = /<div \s*className="absolute inset-0\.5 border border-white\/20 shadow-inner flex items-center justify-center overflow-hidden"\s*style=\{\{\s*backgroundColor: colorHex,\s*borderRadius,\s*boxShadow: isMatched \? '0 0 20px 10px rgba\(255,255,255,0\.8\)' : \`inset 0 0 10px rgba\(0,0,0,0\.2\), inset 2px 2px 5px rgba\(255,255,255,0\.4\)\`\s*\}\}\s*>\s*<div className="absolute top-1 left-1 w-3 h-3 rounded-full bg-white\/50 blur-\[1px\]" \/>\s*<\/div>/m;

const newCode = `{card.color === 'ojama' ? (
        <div 
          className="absolute inset-0.5 border-2 border-white/40 bg-white/20 shadow-inner flex items-center justify-center overflow-hidden backdrop-blur-sm"
          style={{ borderRadius }}
        >
          <div className="w-1/2 h-1/2 border-2 border-white/50 rounded-full" />
        </div>
      ) : (
        <div 
          className="absolute inset-0.5 border border-white/20 shadow-inner flex items-center justify-center overflow-hidden"
          style={{ 
            backgroundColor: colorHex,
            borderRadius,
            boxShadow: isMatched ? '0 0 20px 10px rgba(255,255,255,0.8)' : \`inset 0 0 10px rgba(0,0,0,0.2), inset 2px 2px 5px rgba(255,255,255,0.4)\`
          }}
        >
          <div className="absolute top-1 left-1 w-3 h-3 rounded-full bg-white/50 blur-[1px]" />
        </div>
      )}`;

code = code.replace(regex, newCode);

fs.writeFileSync('src/GameEngine.tsx', code);

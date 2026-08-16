const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');
if (!code.includes('import { ArrowUpDown, Tornado }')) {
  code = code.replace(/import \{ playSelect, playDrop, playPop, playCombo \} from '\.\/audio';/, "import { playSelect, playDrop, playPop, playCombo } from './audio';\nimport { ArrowUpDown, Tornado } from 'lucide-react';");
  fs.writeFileSync('src/GameEngine.tsx', code);
}

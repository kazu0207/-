const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

const regex = /<\/main>\n\s*<\/div>\n\s*<\/div>\n\s*\);\n\}/;
code = code.replace(regex, '</main>\n    </div>\n    </div>\n  );\n}');
// wait, the error is at 783. Let me just replace the bottom part carefully.

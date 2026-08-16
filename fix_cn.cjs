const fs = require('fs');
let code = fs.readFileSync('src/ScoreBoard.tsx', 'utf8');

code = code.replace(
  `import { cn } from './utils';`,
  `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`
);

fs.writeFileSync('src/ScoreBoard.tsx', code);

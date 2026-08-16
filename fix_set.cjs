const fs = require('fs');

// 1. types.ts
let types = fs.readFileSync('src/types.ts', 'utf8');
types = types.replace(/matchedIds: Set<string>;/, 'matchedIds: string[];');
fs.writeFileSync('src/types.ts', types);

// 2. OnlineGame.tsx
let online = fs.readFileSync('src/OnlineGame.tsx', 'utf8');
online = online.replace(/matchedIds: new Set\(\)/, 'matchedIds: []');
fs.writeFileSync('src/OnlineGame.tsx', online);

// 3. CpuGame.tsx
let cpu = fs.readFileSync('src/CpuGame.tsx', 'utf8');
cpu = cpu.replace(/matchedIds: new Set\(\)/, 'matchedIds: []');
fs.writeFileSync('src/CpuGame.tsx', cpu);

// 4. gameLogic.ts
let logic = fs.readFileSync('src/gameLogic.ts', 'utf8');
// findMatches currently returns Set<string>. We'll make it return string[]
logic = logic.replace(/export function findMatches\(columns: GameCard\[\]\[\]\): Set<string> \{/g, 'export function findMatches(columns: GameCard[][]): string[] {');
logic = logic.replace(/const matched = new Set<string>\(\);/g, 'const matched = new Set<string>();');
logic = logic.replace(/return matched;/g, 'return Array.from(matched);');
fs.writeFileSync('src/gameLogic.ts', logic);

// 5. GameEngine.tsx
let engine = fs.readFileSync('src/GameEngine.tsx', 'utf8');
// Change gameState.matchedIds?.has(card.id) to gameState.matchedIds?.includes(card.id)
engine = engine.replace(/gameState\.matchedIds\?\.has\(/g, 'gameState.matchedIds?.includes(');
fs.writeFileSync('src/GameEngine.tsx', engine);


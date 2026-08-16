const fs = require('fs');

// --- 1. Patch store.ts (playerName persistence) ---
let storeCode = fs.readFileSync('src/store.ts', 'utf8');

const storeTarget1 = `const generateUserId = () => {`;
const storeRepl1 = `const getInitialPlayerName = () => {
  let name = localStorage.getItem('puyo_player_name');
  if (!name) {
    name = \`Player \${Math.floor(Math.random() * 1000)}\`;
  }
  return name;
};

const generateUserId = () => {`;
storeCode = storeCode.replace(storeTarget1, storeRepl1);

storeCode = storeCode.replace(
  "playerName: `Player ${Math.floor(Math.random() * 1000)}`,",
  "playerName: getInitialPlayerName(),"
);

storeCode = storeCode.replace(
  "setPlayerName: (playerName) => set({ playerName }),",
  "setPlayerName: (playerName) => {\n    localStorage.setItem('puyo_player_name', playerName);\n    set({ playerName });\n  },"
);

fs.writeFileSync('src/store.ts', storeCode);


// --- 2. Patch server.ts (min 2 players) ---
let serverCode = fs.readFileSync('server.ts', 'utf8');
serverCode = serverCode.replace(
  `if (room.players.length >= 1 && room.players.every((p: any) => p.ready)) {`,
  `if (room.players.length >= 2 && room.players.every((p: any) => p.ready)) {`
);
fs.writeFileSync('server.ts', serverCode);


// --- 3. Patch src/OnlineGame.tsx (max 2 CPUs, UI warning for min 2 players) ---
let onlineCode = fs.readFileSync('src/OnlineGame.tsx', 'utf8');

onlineCode = onlineCode.replace(
  `                {room.players.length <= 3 && <option value={1}>1</option>}
                {room.players.length <= 2 && <option value={2}>2</option>}
                {room.players.length <= 1 && <option value={3}>3</option>}
              </select>`,
  `                {room.players.length <= 3 && <option value={1}>1</option>}
                {room.players.length <= 2 && <option value={2}>2</option>}
              </select>`
);

onlineCode = onlineCode.replace(
  `<button 
            onClick={() => useMultiplayerStore.getState().setReady(!room.players.find(p => p.id === userId)?.ready)}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 font-bold shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all"
          >
            {room.players.find(p => p.id === userId)?.ready ? '準備を取り消す' : '準備完了！'}
          </button>`,
  `{room.players.length < 2 ? (
            <button 
              disabled
              className="px-8 py-3 rounded-xl bg-slate-700 text-slate-400 font-bold cursor-not-allowed shadow-md"
            >
              2人以上の参加が必要です
            </button>
          ) : (
            <button 
              onClick={() => useMultiplayerStore.getState().setReady(!room.players.find(p => p.id === userId)?.ready)}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 font-bold shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all"
            >
              {room.players.find(p => p.id === userId)?.ready ? '準備を取り消す' : '準備完了！'}
            </button>
          )}`
);

fs.writeFileSync('src/OnlineGame.tsx', onlineCode);

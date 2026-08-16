const fs = require('fs');
let code = fs.readFileSync('src/OnlineGame.tsx', 'utf8');

// Update initGame logic
const targetInit = `    const numPlayers = room.players.length;
    const deck = createDeck('shared', numPlayers);
    
    const columns: GameCard[][] = [[], [], []];

    let players: PlayerState[] = room.players.map(p => ({
      id: p.id,
      name: p.name,
      isCpu: false,
      score: 0, hand: [], stats: { maxCombo: 0, linesCleared: 0, maxSimultaneousLines: 0, blocksCleared: { total: 0, ojama: 0, red: 0, blue: 0, green: 0, yellow: 0 }, specialCardsUsed: { total: 0, gravity: 0, tornado: 0, chameleon: 0, ojama: 0 } }
    }));`;

const replInit = `    const columns: GameCard[][] = [[], [], []];

    let players: PlayerState[] = room.players.map(p => ({
      id: p.id,
      name: p.name,
      isCpu: false,
      score: 0, hand: [], stats: { maxCombo: 0, linesCleared: 0, maxSimultaneousLines: 0, blocksCleared: { total: 0, ojama: 0, red: 0, blue: 0, green: 0, yellow: 0 }, specialCardsUsed: { total: 0, gravity: 0, tornado: 0, chameleon: 0, ojama: 0 } }
    }));

    const cpuCount = room.cpuCount || 0;
    for (let i = 0; i < cpuCount; i++) {
      players.push({
        id: \`cpu-\${i+1}\`,
        name: \`CPU \${i+1}\`,
        isCpu: true,
        score: 0, hand: [], stats: { maxCombo: 0, linesCleared: 0, maxSimultaneousLines: 0, blocksCleared: { total: 0, ojama: 0, red: 0, blue: 0, green: 0, yellow: 0 }, specialCardsUsed: { total: 0, gravity: 0, tornado: 0, chameleon: 0, ojama: 0 } }
      });
    }

    const numPlayers = players.length;
    const deck = createDeck('shared', numPlayers);`;

code = code.replace(targetInit, replInit);

const targetRender = `<h3 className="text-sm font-bold text-slate-400 mb-4 uppercase">プレイヤー ({room.players.length}/4)</h3>
          <ul className="flex flex-col gap-2">`;

const replRender = `
        <div className="flex justify-between items-center w-full max-w-sm mb-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase">プレイヤー ({room.players.length + (room.cpuCount || 0)}/4)</h3>
          {(room.players[0]?.id === userId) ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">追加CPU:</span>
              <select 
                value={room.cpuCount || 0}
                onChange={(e) => useMultiplayerStore.getState().setCpuCount(parseInt(e.target.value, 10))}
                className="bg-slate-800 text-white text-sm rounded px-2 py-1 outline-none border border-slate-700"
              >
                <option value={0}>0</option>
                {room.players.length <= 3 && <option value={1}>1</option>}
                {room.players.length <= 2 && <option value={2}>2</option>}
                {room.players.length <= 1 && <option value={3}>3</option>}
              </select>
            </div>
          ) : (
            (room.cpuCount || 0) > 0 && <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">追加CPU: {room.cpuCount}</span>
          )}
        </div>
        <ul className="flex flex-col gap-2 w-full max-w-sm mb-8">`;

code = code.replace(
  `<div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm mb-8 shadow-xl">
          <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase">プレイヤー ({room.players.length}/4)</h3>
          <ul className="flex flex-col gap-2">`,
  `<div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm mb-8 shadow-xl">` + replRender
);


code = code.replace(
  `</ul>
        </div>`,
  `  {Array.from({ length: room.cpuCount || 0 }).map((_, i) => (
              <li key={\`cpu-\${i}\`} className="flex justify-between items-center bg-slate-800/50 px-4 py-3 rounded-lg border border-slate-700/30">
                <span className="font-bold text-slate-400">🤖 CPU {i+1}</span>
                <span className="text-xs font-bold px-2 py-1 rounded bg-slate-700 text-slate-500">参加予定</span>
              </li>
            ))}
          </ul>
        </div>`
);

fs.writeFileSync('src/OnlineGame.tsx', code);

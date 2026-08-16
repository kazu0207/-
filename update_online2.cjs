const fs = require('fs');
let data = fs.readFileSync('src/OnlineGame.tsx', 'utf8');

data = data.replace(
  /<h2 className="text-3xl font-black mb-8 bg-gradient-to-br from-indigo-400 to-cyan-400 bg-clip-text text-transparent">待機ロビー: \{room.id\}<\/h2>/,
  `<h2 className="text-3xl font-black mb-2 bg-gradient-to-br from-indigo-400 to-cyan-400 bg-clip-text text-transparent">待機ロビー</h2>
        <div className="bg-slate-900/80 border border-indigo-500/50 rounded-xl px-6 py-4 mb-8 flex flex-col items-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <span className="text-slate-400 text-sm font-bold uppercase mb-1">ルームID (友達に教えてあげよう)</span>
          <span className="text-4xl font-black text-white tracking-widest">{room.id}</span>
        </div>`
);

fs.writeFileSync('src/OnlineGame.tsx', data);

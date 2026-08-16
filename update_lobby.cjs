const fs = require('fs');
let data = fs.readFileSync('src/Lobby.tsx', 'utf8');

data = data.replace(
  /<form onSubmit=\{handleJoin\} className="flex flex-col gap-4">[\s\S]*?<\/form>/,
  `<div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">プレイヤー名</label>
              <input 
                type="text" 
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                required
                maxLength={10}
              />
            </div>
            
            <button 
              onClick={() => {
                if (playerName.trim()) {
                  const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
                  setMode('online');
                  connectAndJoin(newRoomId);
                }
              }}
              className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-bold text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] active:scale-95"
            >
              👑 ルームを作成してホストになる
            </button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-700"></div>
              <span className="shrink-0 mx-4 text-slate-500 text-sm font-bold uppercase">or</span>
              <div className="flex-grow border-t border-slate-700"></div>
            </div>

            <form onSubmit={handleJoin} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">参加するルームID</label>
                <input 
                  type="text" 
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="例: A1B2C3"
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  required
                  maxLength={20}
                />
              </div>

              {error && <p className="text-rose-400 text-sm font-bold text-center">{error}</p>}

              <button 
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 font-bold text-lg shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all hover:scale-[1.02] active:scale-95"
              >
                🤝 オンライン対戦に参加
              </button>
            </form>
          </div>`
);

fs.writeFileSync('src/Lobby.tsx', data);

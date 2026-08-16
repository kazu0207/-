import React, { useState } from 'react';
import { useMultiplayerStore } from './store';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Lobby() {
  const { setMode, connectAndJoin, playerName, setPlayerName, error } = useMultiplayerStore();
  const [roomId, setRoomId] = useState('');
  const [showRules, setShowRules] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim() && playerName.trim()) {
      setMode('online');
      connectAndJoin(roomId.trim());
    }
  };

  return (
    <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950/80 to-slate-950 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        
      <AnimatePresence>
        {showRules && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto custom-scrollbar flex flex-col"
            >
              <div className="sticky top-0 bg-slate-900/90 backdrop-blur-md p-4 border-b border-slate-700 flex justify-between items-center z-10">
                <h2 className="text-xl font-bold text-white">ルール＆カード一覧</h2>
                <button onClick={() => setShowRules(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 space-y-6 text-slate-300 text-sm">
                <section>
                  <h3 className="text-lg font-bold text-indigo-400 mb-2 border-b border-slate-700 pb-1">基本ルール</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>各プレイヤーは3つの列（タワー）の上下どちらかからカードを配置します。</li>
                    <li>同色の通常カードが縦・横に3つ以上繋がるとマッチして消え、ポイントを獲得します。</li>
                    <li>山札がなくなるまで交互にターンを繰り返し、最終的にポイントが高いプレイヤーの勝利です。</li>
                  </ul>
                </section>
                <section>
                  <h3 className="text-lg font-bold text-cyan-400 mb-2 border-b border-slate-700 pb-1">通常カード（4色）</h3>
                  <div className="flex gap-2 mb-2">
                    <div className="w-8 h-8 rounded bg-rose-600 border border-white/20"></div>
                    <div className="w-8 h-8 rounded bg-cyan-600 border border-white/20"></div>
                    <div className="w-8 h-8 rounded bg-emerald-600 border border-white/20"></div>
                    <div className="w-8 h-8 rounded bg-amber-600 border border-white/20"></div>
                  </div>
                  <p>赤、青、緑、黄の4色。同じ色を3つ繋げると消えます。</p>
                </section>
                <section>
                  <h3 className="text-lg font-bold text-fuchsia-400 mb-2 border-b border-slate-700 pb-1">特殊カード（タワーに配置される）</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 shrink-0 rounded bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-xl">🗿</div>
                      <div>
                        <strong className="text-white block">おじゃまカード</strong>
                        <p>マッチしません。隣接するカードがマッチして消えた時に、巻き込まれて一緒に消えます。相手への嫌がらせに使います。</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 shrink-0 rounded bg-gradient-to-br from-indigo-500 to-fuchsia-500 border-2 border-fuchsia-300 flex items-center justify-center text-xl">🌈</div>
                      <div>
                        <strong className="text-white block">カメレオンカード</strong>
                        <p>使用時にプレイヤーが4色の中から好きな色を指定でき、その色の通常カードとして扱われます。</p>
                      </div>
                    </div>
                  </div>
                </section>
                <section>
                  <h3 className="text-lg font-bold text-amber-400 mb-2 border-b border-slate-700 pb-1">アクションカード（使用して消費する）</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 shrink-0 rounded bg-indigo-900 border-2 border-indigo-400 flex items-center justify-center text-xl">🌌</div>
                      <div>
                        <strong className="text-white block">重力反転</strong>
                        <p>タワーに置かずに使用します。盤面の重力が反転し、カードが上に落ちる（または下に戻る）ようになります。状況を一変させる強力なカードです。</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 shrink-0 rounded bg-teal-900 border-2 border-teal-400 flex items-center justify-center text-xl">🌪️</div>
                      <div>
                        <strong className="text-white block">竜巻（手札シャッフル）</strong>
                        <p>タワーに置かずに使用します。全プレイヤーの手札を一度回収し、シャッフルして再配布します。相手の計画を崩すのに有効です。</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

        <div className="flex flex-col items-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-br from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            カラーポップス
          </h1>
          <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-bold tracking-widest text-slate-400 border border-slate-700 uppercase">
            Multiplayer
          </span>
        </div>

                  <button 
            onClick={() => setShowRules(true)}
            className="w-full py-3 mb-6 rounded-xl bg-slate-800/50 hover:bg-slate-700/80 border border-slate-600 transition-all font-bold text-sm text-slate-300 flex items-center justify-center gap-2"
          >
            <span>📖</span> ルール＆カード一覧を見る
          </button>
          <div className="flex flex-col gap-6">
          <button 
            onClick={() => setMode('cpu')}
            className="w-full py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-600 transition-all font-bold text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
          >
            <span>🤖</span> CPUと対戦する
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-700"></div>
            <span className="shrink-0 mx-4 text-slate-500 text-sm font-bold uppercase">or Online</span>
            <div className="flex-grow border-t border-slate-700"></div>
          </div>

          <div className="flex flex-col gap-4">
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
                  const newRoomId = Math.floor(1000 + Math.random() * 9000).toString();
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
          </div>
        </div>
      </motion.div>
    </div>
  );
}

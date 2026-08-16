const fs = require('fs');
let code = fs.readFileSync('src/Lobby.tsx', 'utf8');

const importAdd = `import React, { useState } from 'react';
import { useMultiplayerStore } from './store';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';`;

code = code.replace(/import React, \{ useState \} from 'react';\nimport \{ useMultiplayerStore \} from '\.\/store';\nimport \{ motion \} from 'framer-motion';/, importAdd);

const stateAdd = `  const { setMode, connectAndJoin, playerName, setPlayerName, error } = useMultiplayerStore();
  const [roomId, setRoomId] = useState('');
  const [showRules, setShowRules] = useState(false);`;
code = code.replace(/  const \{ setMode, connectAndJoin, playerName, setPlayerName, error \} = useMultiplayerStore\(\);\n  const \[roomId, setRoomId\] = useState\(''\);/, stateAdd);

const rulesUI = `
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
`;

code = code.replace(/<div className="flex flex-col items-center mb-10">/, 
  rulesUI + '\n        <div className="flex flex-col items-center mb-10">');

const ruleButton = `          <button 
            onClick={() => setShowRules(true)}
            className="w-full py-3 mb-6 rounded-xl bg-slate-800/50 hover:bg-slate-700/80 border border-slate-600 transition-all font-bold text-sm text-slate-300 flex items-center justify-center gap-2"
          >
            <span>📖</span> ルール＆カード一覧を見る
          </button>
          <div className="flex flex-col gap-6">`;
code = code.replace(/<div className="flex flex-col gap-6">/, ruleButton);

fs.writeFileSync('src/Lobby.tsx', code);

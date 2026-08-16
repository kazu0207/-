const fs = require('fs');
let code = fs.readFileSync('src/ScoreBoard.tsx', 'utf8');

// 1. Update grid class for total === 3
code = code.replace(
  `    } else if (total === 3) {
      if (index === 0) return 'row-span-2 col-start-1';
      if (index === 1) return 'row-start-1 col-start-2';
      if (index === 2) return 'row-start-2 col-start-2';
    }`,
  `    } else if (total === 3) {
      if (index === 0) return 'col-span-2';
      if (index === 1) return 'col-start-1 row-start-2';
      if (index === 2) return 'col-start-2 row-start-2';
    }`
);

// 2. Adjust overall container styling to reduce spacing
code = code.replace(
  `className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-start overflow-y-auto custom-scrollbar backdrop-blur-xl p-4 md:p-8"`,
  `className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-center overflow-y-auto custom-scrollbar backdrop-blur-xl p-2 md:p-4"`
);

// 3. Adjust Title
code = code.replace(
  `className="text-4xl md:text-6xl font-black mb-2 tracking-tighter bg-gradient-to-br from-amber-200 to-amber-500 bg-clip-text text-transparent drop-shadow-lg shrink-0 mt-4"`,
  `className="text-3xl md:text-5xl font-black mb-1 tracking-tighter bg-gradient-to-br from-amber-200 to-amber-500 bg-clip-text text-transparent drop-shadow-lg shrink-0"`
);

// 4. Adjust Subtitle
code = code.replace(
  `className="text-xl md:text-2xl font-bold text-white mb-8 shrink-0"`,
  `className="text-lg md:text-xl font-bold text-white mb-4 shrink-0"`
);

// 5. Adjust main Grid container
code = code.replace(
  `"grid grid-cols-2 gap-4 w-full max-w-5xl mb-12 shrink-0"`,
  `"grid grid-cols-2 gap-2 md:gap-4 w-full max-w-5xl mb-4 shrink-0"`
);

// 6. Adjust Card padding & margin
code = code.replace(
  `"bg-slate-900/80 border border-slate-700/50 rounded-2xl p-4 md:p-6 shadow-2xl flex flex-col"`,
  `"bg-slate-900/80 border border-slate-700/50 rounded-xl p-3 md:p-4 shadow-2xl flex flex-col"`
);

// 7. Adjust Card header
code = code.replace(
  `className="flex items-center justify-between border-b border-white/10 pb-3 mb-3"`,
  `className="flex items-center justify-between border-b border-white/10 pb-2 mb-2"`
);

// 8. Adjust Rank badge
code = code.replace(
  `"text-3xl font-black w-10 h-10 flex items-center justify-center rounded-full text-slate-900"`,
  `"text-xl md:text-2xl font-black w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-slate-900"`
);

// 9. Adjust Name
code = code.replace(
  `className="text-xl md:text-2xl font-bold truncate max-w-[150px]"`,
  `className="text-lg md:text-xl font-bold truncate max-w-[150px]"`
);

// 10. Adjust Score Number
code = code.replace(
  `className="text-3xl font-black text-cyan-400"`,
  `className="text-2xl md:text-3xl font-black text-cyan-400"`
);

// 11. Adjust Stats Grid
code = code.replace(
  `className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm md:text-base"`,
  `className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs md:text-sm"`
);

// 12. Adjust buttons
code = code.replace(
  `className="flex gap-4 pb-12 shrink-0"`,
  `className="flex gap-4 pb-4 shrink-0"`
);

code = code.replace(
  `className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-full font-bold text-lg transition-all"`,
  `className="px-6 py-2 md:px-8 md:py-3 bg-slate-800 hover:bg-slate-700 rounded-full font-bold text-sm md:text-base transition-all"`
);

code = code.replace(
  `className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 rounded-full font-bold text-lg shadow-[0_0_40px_rgba(79,70,229,0.5)] transition-all hover:scale-105 active:scale-95"`,
  `className="px-6 py-2 md:px-8 md:py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 rounded-full font-bold text-sm md:text-base shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all hover:scale-105 active:scale-95"`
);


fs.writeFileSync('src/ScoreBoard.tsx', code);

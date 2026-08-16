const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

const tcgCardRegex = /export function TCGCard\(\{\s*card,\s*onClick,\s*selected = false,\s*className\s*\}\: \{\s*card: GameCard;\s*onClick\?\: \(\) => void;\s*selected\?\: boolean;\s*className\?\: string;\s*\}\) \{[\s\S]*?<\div className="absolute inset-0 bg-gradient-to-br from-white\/30 to-transparent pointer-events-none" \/>[\s\S]*?<\/motion\.div>\s*\}/;

const newTCGCard = `export function TCGCard({ 
  card, 
  onClick, 
  selected = false,
  className
}: { 
  card: GameCard; 
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}) {
  const colorHex = {
    red: '#e11d48',
    blue: '#0891b2',
    green: '#059669',
    yellow: '#d97706'
  }[card.color];
  
  const isOjama = card.color === 'ojama';
  const isChameleon = card.color === 'chameleon';
  const isGravity = card.color === 'gravity';
  const isTornado = card.color === 'tornado';
  const isSpecial = isOjama || isChameleon || isGravity || isTornado;

  return (
    <motion.div
      layoutId={card.id}
      className={cn(
        "relative rounded-xl border-2 shadow-lg flex flex-col justify-center items-center overflow-hidden transition-all duration-300 w-full max-w-[80px] aspect-[5/7]",
        selected ? "border-white shadow-[0_0_15px_rgba(255,255,255,0.8)] z-50" : "border-white/20 z-10 hover:border-white/50 cursor-pointer",
        className,
        isSpecial ? "bg-white" : ""
      )}
      style={{
        backgroundColor: isSpecial ? undefined : colorHex,
        scale: selected ? 1.1 : 1,
        y: selected ? -10 : 0
      }}
      onClick={onClick}
    >
      {isOjama && (
        <div className="w-full h-full bg-white flex items-center justify-center">
           <div className="w-10 h-10 border-4 border-slate-200 rounded-full"></div>
        </div>
      )}
      
      {isChameleon && (
        <div className="w-full h-full relative">
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-[#e11d48]" />
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#0891b2]" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#059669]" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[#d97706]" />
        </div>
      )}
      
      {isGravity && (
        <div className="w-full h-full bg-white flex items-center justify-center">
           <ArrowUpDown className="w-10 h-10 text-slate-700" />
        </div>
      )}
      
      {isTornado && (
        <div className="w-full h-full bg-white flex items-center justify-center">
           <Tornado className="w-10 h-10 text-slate-700" />
        </div>
      )}
      
      {!isSpecial && (
         <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
      )}
      <div className="absolute inset-0 border border-white/20 rounded-xl pointer-events-none shadow-inner" />
    </motion.div>
  );
}`;

code = code.replace(tcgCardRegex, newTCGCard);

fs.writeFileSync('src/GameEngine.tsx', code);

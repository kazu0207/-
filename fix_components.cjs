const fs = require('fs');
let data = fs.readFileSync('src/GameEngine.tsx', 'utf8');

const tcgCardReplace = `export function TCGCard({ 
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
  const isChameleon = card.color === 'chameleon';
  const color = card.chameleonColor || card.color;
  
  const bgStyle = (() => {
    if (isChameleon && !card.chameleonColor) return { background: 'conic-gradient(from 180deg at 50% 50%, #e11d48 0deg, #0891b2 90deg, #059669 180deg, #d97706 270deg)' };
    switch(color) {
      case 'red': return { backgroundColor: '#e11d48' };
      case 'blue': return { backgroundColor: '#0891b2' };
      case 'green': return { backgroundColor: '#059669' };
      case 'yellow': return { backgroundColor: '#d97706' };
      case 'ojama': return { backgroundColor: '#cbd5e1' };
      case 'gravity': return { backgroundColor: '#f8fafc' };
      case 'tornado': return { backgroundColor: '#f8fafc' };
      default: return { backgroundColor: '#cbd5e1' };
    }
  })();

  return (
    <motion.div
      layoutId={card.id}
      className={cn(
        "relative rounded-xl border-2 shadow-lg flex flex-col justify-center items-center overflow-hidden transition-all duration-300 w-full max-w-[80px] aspect-[5/7]",
        selected ? "border-white shadow-[0_0_15px_rgba(255,255,255,0.8)] z-50" : "border-white/20 z-10 hover:border-white/50 cursor-pointer",
        className
      )}
      style={{
        ...bgStyle,
        scale: selected ? 1.1 : 1,
        y: selected ? -10 : 0
      }}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
      
      {card.color === 'gravity' && <div className="text-3xl">↕️</div>}
      {card.color === 'tornado' && <div className="text-3xl">🌪️</div>}
      
      {card.color !== 'gravity' && card.color !== 'tornado' && (
        <div className="w-[50%] h-[50%] max-w-[40px] max-h-[40px] rounded-full bg-white/20 border border-white/40 flex items-center justify-center">
          <div className="w-[60%] h-[60%] rounded-full bg-white/60 blur-[2px]" />
        </div>
      )}
    </motion.div>
  );
}`;

data = data.replace(/export function TCGCard\(\{[\s\S]*?\}<\/motion\.div>\s*\n\}/, tcgCardReplace);

const puyoBlockReplace = `export function PuyoBlock({ 
  card, 
  onClick, 
  selected = false,
  isMatched = false,
  connections = { top: false, bottom: false, left: false, right: false },
  className
}: { 
  card: GameCard; 
  onClick?: () => void;
  selected?: boolean;
  isMatched?: boolean;
  connections?: Connections;
  className?: string;
}) {
  const size = 64; 
  
  let initialAnim: any = { opacity: 0, scale: 1, y: 0 };
  if (card.entry === 'bottom') {
    initialAnim = { opacity: 0, y: 30 };
  } else if (card.entry === 'top') {
    initialAnim = { opacity: 0, y: -30 };
  }

  const getRadius = (vert: boolean, horiz: boolean) => {
    if (vert && horiz) return '4px'; 
    if (vert || horiz) return '8px'; 
    return '24px'; 
  };
  
  const borderRadius = \`\${getRadius(connections.top, connections.left)} \${getRadius(connections.top, connections.right)} \${getRadius(connections.bottom, connections.right)} \${getRadius(connections.bottom, connections.left)}\`;

  const isChameleon = card.color === 'chameleon';
  const color = card.chameleonColor || card.color;
  
  const bgStyle = (() => {
    if (isChameleon && !card.chameleonColor) return { background: 'conic-gradient(from 180deg at 50% 50%, #e11d48 0deg, #0891b2 90deg, #059669 180deg, #d97706 270deg)' };
    switch(color) {
      case 'red': return { backgroundColor: '#e11d48' };
      case 'blue': return { backgroundColor: '#0891b2' };
      case 'green': return { backgroundColor: '#059669' };
      case 'yellow': return { backgroundColor: '#d97706' };
      case 'ojama': return { backgroundColor: '#cbd5e1' };
      case 'gravity': return { backgroundColor: '#f8fafc' };
      case 'tornado': return { backgroundColor: '#f8fafc' };
      default: return { backgroundColor: '#cbd5e1' };
    }
  })();

  return (
    <motion.div 
      layoutId={card.id}
      initial={initialAnim}
      animate={
        isMatched 
          ? { opacity: 0, scale: 0, filter: 'brightness(2)' }
          : { 
              opacity: 1, 
              scale: 1,
              y: selected ? -10 : 0,
            }
      }
      exit={{ opacity: 0, scale: 0, filter: 'brightness(2)' }}
      transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
      className={cn("relative select-none block", className)}
      style={{ 
        width: size, 
        height: size, 
        cursor: onClick ? 'pointer' : 'default',
        zIndex: selected ? 50 : 1
      }}
      onClick={onClick}
    >
      <div 
        className="absolute inset-0.5 border border-white/20 shadow-inner flex items-center justify-center overflow-hidden"
        style={{ 
          ...bgStyle,
          borderRadius,
          boxShadow: isMatched ? '0 0 20px 10px rgba(255,255,255,0.8)' : \`inset 0 0 10px rgba(0,0,0,0.2), inset 2px 2px 5px rgba(255,255,255,0.4)\`
        }}
      >
        <div className="absolute top-1 left-1 w-3 h-3 rounded-full bg-white/50 blur-[1px]" />
        {card.color === 'gravity' && <div className="text-3xl">↕️</div>}
        {card.color === 'tornado' && <div className="text-3xl">🌪️</div>}
      </div>
    </motion.div>
  );
}`;

data = data.replace(/export function PuyoBlock\(\{[\s\S]*?\}<\/motion\.div>\s*\n\}/, puyoBlockReplace);
fs.writeFileSync('src/GameEngine.tsx', data);

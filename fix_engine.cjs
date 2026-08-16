const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

// 1. Clear lastAction on match to prevent column rebounce
code = code.replace(/status: 'animating_match',/g, "status: 'animating_match',\n            lastAction: undefined,");

// 2. Fix PuyoBlock component completely
const puyoBlockStart = code.indexOf('export function PuyoBlock');
const returnDiv = code.indexOf('return (', puyoBlockStart);
const divStart = code.indexOf('<motion.div', returnDiv);
const divEnd = code.indexOf('</motion.div>', divStart) + 13; // length of </motion.div>

const newPuyoBlockBody = `export function PuyoBlock({ 
  card, 
  onClick, 
  selected = false,
  isMatched = false,
  connections = { top: false, bottom: false, left: false, right: false },
  className
}: { 
  card: Card; 
  onClick?: () => void;
  selected?: boolean;
  isMatched?: boolean;
  connections?: Connections;
  className?: string;
}) {
  const size = 64;
  const [hasEntered, setHasEntered] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setHasEntered(true), 800);
    return () => clearTimeout(t);
  }, []);

  const isTopDrop = card.entry === 'top';
  const isBottomInsert = card.entry === 'bottom';

  const getRadius = (vert: boolean, horiz: boolean) => {
    if (vert && horiz) return '4px'; 
    if (vert || horiz) return '8px'; 
    return '24px'; 
  };
  
  const borderRadius = \`\${getRadius(connections.top, connections.left)} \${getRadius(connections.top, connections.right)} \${getRadius(connections.bottom, connections.right)} \${getRadius(connections.bottom, connections.left)}\`;

  const actualColor = card.chameleonColor || card.color;
  const colorHex = {
    red: '#e11d48',
    blue: '#0891b2',
    green: '#059669',
    yellow: '#d97706',
    ojama: '#ffffff',
    chameleon: '#9333ea',
    gravity: '#475569',
    tornado: '#14b8a6'
  }[actualColor as keyof typeof colorHex] || '#ffffff';

  return (
    <motion.div 
      layoutId={\`puyo-\${card.id}\`}
      initial={{
        opacity: 0,
        y: isTopDrop ? -300 : (isBottomInsert ? 64 : 0),
        scale: 1
      }}
      animate={
        isMatched 
          ? { 
              opacity: [1, 0, 1, 0, 1, 1, 0], 
              scale: [1, 1, 1, 1, 1, 1.3, 1.6], 
              filter: ['brightness(1)', 'brightness(3)', 'brightness(1)', 'brightness(3)', 'brightness(1)', 'brightness(1)', 'brightness(2)'],
              y: 0,
              x: 0
            }
          : { 
              opacity: 1, 
              scale: 1,
              y: selected ? -10 : (!hasEntered ? (isTopDrop ? [-300, 0, -30, 0, -10, 0] : (isBottomInsert ? [64, 0] : 0)) : 0),
            }
      }
      exit={{ opacity: 0, scale: 0, filter: 'brightness(2)' }}
      transition={
        isMatched
          ? { duration: 0.8, times: [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1], ease: "easeInOut" }
          : (!hasEntered && isTopDrop)
            ? { duration: 0.6, times: [0, 0.4, 0.6, 0.75, 0.9, 1], ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeIn"] }
            : (!hasEntered && isBottomInsert)
              ? { duration: 0.25, ease: "easeOut" }
              : { type: "spring", stiffness: 500, damping: 30, mass: 1 }
      }
      className={cn("relative select-none block", className)}
      style={{ 
        width: size, 
        height: size, 
        cursor: onClick ? 'pointer' : 'default',
        zIndex: selected ? 50 : 1
      }}
      onClick={onClick}
    >
      {card.color === 'ojama' ? (
        <div 
          className="absolute inset-0.5 border-2 border-slate-200 bg-white shadow-inner flex items-center justify-center overflow-hidden"
          style={{ borderRadius }}
        >
          <div className="w-1/2 h-1/2 border-4 border-slate-200 rounded-full" />
        </div>
      ) : (
        <div 
          className="absolute inset-0.5 border border-white/20 shadow-inner flex items-center justify-center overflow-hidden"
          style={{ 
            backgroundColor: colorHex,
            borderRadius,
            boxShadow: isMatched ? '0 0 20px 10px rgba(255,255,255,0.8)' : \`inset 0 0 10px rgba(0,0,0,0.2), inset 2px 2px 5px rgba(255,255,255,0.4)\`
          }}
        >
          {card.color === 'chameleon' && (
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent" />
          )}
          {card.color === 'gravity' && (
            <span className="text-2xl" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>🔄</span>
          )}
          {card.color === 'tornado' && (
            <span className="text-2xl" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>🌪️</span>
          )}
        </div>
      )}
    </motion.div>
  );
}`;

code = code.substring(0, puyoBlockStart) + newPuyoBlockBody + code.substring(divEnd);

// Also update the wrapper motion.div to ensure the layout spring is nice and gentle
code = code.replace(/<motion\.div\s*key=\{card\.id\}\s*layout\s*transition=\{\{ type: "spring", stiffness: 300, damping: 15, mass: 1 \}\}/, 
  `<motion.div
                            key={card.id}
                            layout
                            transition={{ type: "spring", stiffness: 400, damping: 25, mass: 1 }}`);

fs.writeFileSync('src/GameEngine.tsx', code);

const fs = require('fs');
let code = fs.readFileSync('src/GameEngine.tsx', 'utf8');

const containerRegex = /<div className="flex justify-center gap-0 flex-1 min-h-\[300px\]">/;
const newContainer = `<div className="flex justify-center gap-0 flex-1 min-h-[300px] overflow-hidden rounded-xl">`;

code = code.replace(containerRegex, newContainer);

// Make PuyoBlock bounce properly when landing
// Currently it uses { type: "spring", bounce: 0.6, duration: 0.6 }
// Let's adjust to make it feel like a solid block
const puyoBlockTransitionRegex = /:\s*\{\s*type: "spring", bounce: 0\.6, duration: 0\.6\s*\}/;
const newPuyoBlockTransition = `: { type: "spring", stiffness: 300, damping: 15, mass: 1 }`;
code = code.replace(puyoBlockTransitionRegex, newPuyoBlockTransition);

// Apply layout transition to match so things move together
const motionDivRegex = /<motion\.div\s*key=\{card\.id\}\s*layout/;
const newMotionDiv = `<motion.div
                            key={card.id}
                            layout
                            transition={{ type: "spring", stiffness: 300, damping: 15, mass: 1 }}`;
code = code.replace(motionDivRegex, newMotionDiv);

fs.writeFileSync('src/GameEngine.tsx', code);

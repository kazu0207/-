const fs = require('fs');
let code = fs.readFileSync('src/ScoreBoard.tsx', 'utf8');

code = code.replace(
  `{sortedPlayers.map((p, idx) => (`,
  `{sortedPlayers.map((p, idx) => {
          const stats = p.stats || { maxCombo: 0, linesCleared: 0, maxSimultaneousLines: 0, blocksCleared: { total: 0, ojama: 0, red: 0, blue: 0, green: 0, yellow: 0 }, specialCardsUsed: { total: 0, gravity: 0, tornado: 0, chameleon: 0, ojama: 0 } };
          return (
`
);

code = code.replace(
  /p\.stats\./g,
  `stats.`
);

code = code.replace(
  `          </div>
        ))}
      </div>`,
  `          </div>
        )})}
      </div>`
);

fs.writeFileSync('src/ScoreBoard.tsx', code);

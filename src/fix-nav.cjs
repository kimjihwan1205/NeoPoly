const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf-8');
c = c.replace(/activeNav\?: 'market' \| 'art' \| null/g, "activeNav?: 'market' | 'art' | 'studio' | 'support' | null");
fs.writeFileSync('src/App.tsx', c);
console.log('Fixed');

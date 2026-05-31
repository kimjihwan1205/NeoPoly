import fs from 'fs';
import path from 'path';

function processFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  if (content.includes('pravatar.cc')) {
    content = content.replace(/https:\/\/i\.pravatar\.cc\/[^\s'"]+/g, (match) => {
      // Extract seed or something to keep it deterministic? 
      // i.pravatar.cc/150?u=1 -> seed=1
      const seedMatch = match.match(/u=([^&'"]+)/) || match.match(/img=([^&'"]+)/);
      const seed = seedMatch ? seedMatch[1] : Math.random().toString(36).substring(7);
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
    });
    changed = true;
  }
  
  // also check if unsplash is breaking
  if (content.includes('images.unsplash.com')) {
    content = content.replace(/https:\/\/images\.unsplash\.com\/[^'"]+/g, (match) => {
      return match;
    });
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walk('./src');

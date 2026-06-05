import fs from 'fs';
import path from 'path';

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(filePath));
    } else {
      results.push(filePath);
    }
  });
  return results;
}

const files = walkDir('src').filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // replace hero image
  content = content.replace(/\/assets\/images\/hero-2\.png/g, '/images/hero.png');
  content = content.replace(/\/assets\/images\/hero\.webp/g, '/images/hero.png');

  // replace work_X images
  content = content.replace(/\/assets\/images\/work_(\d+)\.webp/g, (match, p1) => {
    let num = parseInt(p1, 10);
    // Let's just use the same URL space hack for <= 45 if we need to? Let's check if the space is needed.
    if (num <= 45) {
      return `/images/work_%20${num}.png`;
    } else {
      return `/images/work_${num}.png`;
    }
  });

  // replace AI main images
  content = content.replace(/\/assets\/images\/AI_studio_Main0(\d)\.webp/g, (match, p1) => {
    return `/images/AI_studio_Main0${p1}.png`;
  });

  // optionally logo.webp
  content = content.replace(/\/assets\/images\/logo\.webp/g, '/images/logo.png');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
});

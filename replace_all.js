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
  content = content.replace(/\/assets\/images\/hero-2\.png/g, 'https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/hero.png');
  content = content.replace(/\/assets\/images\/hero\.webp/g, 'https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/hero.png');

  // replace work_X images
  content = content.replace(/\/assets\/images\/work_(\d+)\.webp/g, (match, p1) => {
    let num = parseInt(p1, 10);
    // Let's just use the same URL space hack for <= 45 if we need to? Let's check if the space is needed.
    if (num <= 45) {
      return `https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%20${num}.png`;
    } else {
      return `https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_${num}.png`;
    }
  });

  // replace AI main images
  content = content.replace(/\/assets\/images\/AI_studio_Main0(\d)\.webp/g, (match, p1) => {
    return `https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/AI_studio_Main0${p1}.png`;
  });

  // optionally logo.webp
  content = content.replace(/\/assets\/images\/logo\.webp/g, 'https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/logo.png');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
});

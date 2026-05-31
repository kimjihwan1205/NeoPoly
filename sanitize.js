import fs from 'fs';
import path from 'path';

function sanitizeDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fullPath = path.join(dir, f);
    if (fs.statSync(fullPath).isDirectory()) {
      sanitizeDir(fullPath);
    } else {
      let newF = f
        .replace(/로고(-1)?\.png/g, 'logo$1.png')
        .replace(/임시_작품(\d+)\.png/g, 'temp_work$1.png')
        .replace(/작품(\d+)\.png/g, 'work$1.png')
        .replace(/히어로이미지(-1)?\.png/g, 'hero_image$1.png');
      
      if (f !== newF) {
        fs.renameSync(fullPath, path.join(dir, newF));
        console.log(`Renamed: ${f} -> ${newF}`);
      } else if (/[\u3131-\uD79D]/.test(f)) {
        // If it contains Korean characters after replacement, delete or rename generic
        console.log(`Deleting file with korean characters: ${fullPath}`);
        fs.unlinkSync(fullPath);
      }
    }
  }
}

sanitizeDir(path.join(process.cwd(), 'public'));
sanitizeDir(path.join(process.cwd(), 'src/assets/images'));

function replaceInDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      replaceInDir(fullPath);
    } else {
      if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let newContent = content
          .replace(/\/src\/assets\/images\//g, '/assets/images/')
          .replace(/로고(-1)?\.png/g, 'logo$1.png')
          .replace(/임시_작품(\d+)\.png/g, 'temp_work$1.png')
          .replace(/작품(\d+)\.png/g, 'work$1.png')
          .replace(/히어로이미지(-1)?\.png/g, 'hero_image$1.png');
        
        if (content !== newContent) {
          fs.writeFileSync(fullPath, newContent);
          console.log(`Updated paths in ${fullPath}`);
        }
      }
    }
  }
}

replaceInDir(path.join(process.cwd(), 'src'));
console.log('Done!');

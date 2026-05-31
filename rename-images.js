import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'public/assets/images');
const files = fs.readdirSync(dir);

for (const file of files) {
  if (file.startsWith('work_ ')) {
    const newName = file.replace('work_ ', 'work_');
    fs.renameSync(path.join(dir, file), path.join(dir, newName));
  }
}

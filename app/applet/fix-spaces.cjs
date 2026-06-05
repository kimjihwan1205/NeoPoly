const fs = require('fs');

const files = [
  'src/components/ReferencePage.tsx',
  'src/components/TurnaroundPage.tsx',
  'src/components/ProjectPage.tsx',
  'src/components/UserProfilePage.tsx',
  'src/components/FullWorkflowPage.tsx',
  'src/components/NotesPage.tsx',
  'src/components/ContentManagementPage.tsx',
  'src/components/AIStudioPage.tsx',
  'src/components/AccountSettingsPage.tsx',
  'src/App.tsx',
  'src/data.ts'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    
    const regex = /https:\/\/raw\.githubusercontent\.com\/kimjihwan1205\/NeoPoly\/main\/work_(\d+)\.png/g;
    
    content = content.replace(regex, (match, param) => {
      let num = parseInt(param);
      if (num < 46) {
          return `https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%20${num}.png`;
      }
      return match;
    });
    
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`Reverted spaces in ${file}`);
  }
});

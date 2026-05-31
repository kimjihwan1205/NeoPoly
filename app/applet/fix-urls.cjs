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
    
    // Pattern to match any URL starting with https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/ 
    const regex = /https:\/\/raw\.githubusercontent\.com\/kimjihwan1205\/NeoPoly\/main\/([^"'\`\?>\s]+)/g;
    
    content = content.replace(regex, (match, path) => {
      // Decode path in case It's something like work_%201.png
      let decoded = decodeURIComponent(path);
      // Remove any space around work_ 
      decoded = decoded.replace(/work_\s+/g, 'work_').replace(/work_%20/g, 'work_');
      
      return `https://cdn.jsdelivr.net/gh/kimjihwan1205/NeoPoly/${decoded}`;
    });
    
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`Updated ${file}`);
  }
});

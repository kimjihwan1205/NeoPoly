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
    
    // Pattern to match any URL starting with https://cdn.jsdelivr.net/gh/kimjihwan1205/NeoPoly/
    const regex = /https:\/\/cdn\.jsdelivr\.net\/gh\/kimjihwan1205\/NeoPoly\/([^"'\`\?>\s]+)/g;
    
    content = content.replace(regex, (match, path) => {
      // Re-encode URI component if it matches the pattern we previously changed back ? Wait, before I just kept the spacing literal or encoded?
      // Previously, we removed %20 and used un-encoded. It's safer to just let it be whatever it is now.
      return `https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/${path}`;
    });
    
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`Reverted ${file}`);
  }
});

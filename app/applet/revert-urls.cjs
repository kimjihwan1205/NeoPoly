const fs = require('fs');
const path = require('path');

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
    
    content = content.replace(regex, (match, urlPath) => {
      // For images that previously had space in them like "work_%201", because we decoded them to "work_1" in the previous step,
      // it's probably better to restore them exactly as they were if they broke.
      // But we can just use the urlPath, maybe GitHub raw redirects or we just put it back.
      // Actually we know "work_1.png" works fine on github too if they renamed it, but if they didn't, maybe we encode it.
      // Let's just restore exactly the raw github URL format.
      let encoded = urlPath.replace(/work_(\d+)/, 'work_ $1'); // It was literally "work_%201.png" before and some were "work_48.png"
      
      // We will first check just raw path
      let res = `https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/${urlPath}`;
      
      // But looking back, some were work_%201.png etc.
      // I will just use the standard work_%20 if the number is less than 46!
      let numMatch = urlPath.match(/work_(\d+)\.png/);
      if (numMatch) {
          let num = parseInt(numMatch[1]);
          if (num < 46) {
             res = `https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%20${num}.png`;
          }
      }
      
      return res;
    });
    
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`Reverted ${file}`);
  }
});

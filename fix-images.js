import fs from 'fs';

const images = [];
// 1 to 10
for(let i=1; i<=10; i++) images.push(`/assets/images/work_ ${i}.png`);
// 21 to 45
for(let i=21; i<=45; i++) images.push(`/assets/images/work_ ${i}.png`);
// 46 to 54
for(let i=46; i<=54; i++) images.push(`/assets/images/work_${i}.png`);

let content = fs.readFileSync('src/App.tsx', 'utf8');

let idx = 0;
content = content.replace(/image:\s*""/g, () => {
    const img = images[idx % images.length];
    idx++;
    return `image: "${img}"`;
});

content = content.replace(/thumb\s*=\s*""/g, () => {
    const img = images[idx % images.length];
    idx++;
    return `thumb="${img}"`;
});

content = content.replace(/img:\s*''/g, () => {
    const img = images[idx % images.length];
    idx++;
    return `img: '${img}'`;
});

content = content.replace(/src=""/g, () => {
    const img = images[idx % images.length];
    idx++;
    return `src="${img}"`;
});
content = content.replace(/image:\s*'""'/g, () => {
    const img = images[idx % images.length];
    idx++;
    return `image: '${img}'`;
});

fs.writeFileSync('src/App.tsx', content, 'utf8');

// Also do it for src/components/ContentManagementPage.tsx
if (fs.existsSync('src/components/ContentManagementPage.tsx')) {
  let cmContent = fs.readFileSync('src/components/ContentManagementPage.tsx', 'utf8');
  cmContent = cmContent.replace(/image:\s*''/g, () => {
    const img = images[idx % images.length];
    idx++;
    return `image: '${img}'`;
  });
  fs.writeFileSync('src/components/ContentManagementPage.tsx', cmContent, 'utf8');
}

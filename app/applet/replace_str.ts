import fs from 'fs';
import path from 'path';

function walkDir(dir: string): string[] {
  let results: string[] = [];
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

const replacements: Record<string, string> = {
  // 1
  '숲속 엘프 궁수': '엘프궁수',
  '숲 엘프 궁수': '엘프궁수',
  '엘프 궁수': '엘프궁수',
  
  // 2
  '험악한 오크 전사': '오크',
  '오크 전사': '오크',
  
  // 3
  '웅장한 판타지 드래곤': '와이번',
  '산맥 드래곤': '와이번',
  '판타지 드래곤': '와이번',
  
  // 4
  '등짐 진 공룡': '공룡',
  '공룡 탈것': '공룡',
  '짐꾼 공룡': '공룡',
  
  // 5
  '설원 농구 선수': '스트릿 패션',
  '겨울 농구 선수': '스트릿 패션',
  
  // 6
  '코뿔소 전사 돌격': '코뿔소 전사' // "코뿔소 전사" is already mostly correct, but just in case
};

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  Object.entries(replacements).forEach(([oldStr, newStr]) => {
     // use global replacement
     content = content.split(oldStr).join(newStr);
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
});

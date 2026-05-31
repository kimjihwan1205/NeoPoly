import fs from 'fs';

let content = fs.readFileSync('src/components/ReferencePage.tsx', 'utf-8');

// 1. Fix handleCardClick shiftKey removal
const target1 = `  const handleCardClick = (e: React.MouseEvent, id: number) => {
    if (e.shiftKey || e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const newSet = new Set(selectedIds);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      setSelectedIds(newSet);
    } else {
      setSelectedIds(new Set([id]));
    }
  };`;

const replace1 = `  const handleCardClick = (e: React.MouseEvent, id: number) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const newSet = new Set(selectedIds);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      setSelectedIds(newSet);
    } else {
      if (isPopup) {
         setSelectedIds(new Set([id]));
      } else {
         setSelectedIds(new Set()); // clears selection
      }
    }
  };`;
if(content.includes(target1)) content = content.replace(target1, replace1);

// Import Check
if(content.includes('Trash2, Clock, Folder, Wand2, CheckSquare') && !content.includes(', Check }')) {
    content = content.replace('Trash2, Clock, Folder, Wand2, CheckSquare', 'Trash2, Clock, Folder, Wand2, CheckSquare, Check');
}

// 2. Fix instruction string
const instructionTarget = `<CheckSquare className="w-4 h-4 text-neutral-400" /> Shift 또는 Ctrl(Cmd) 키를 누르고 클릭하면 여러 개를 다중 선택할 수 있습니다.`;
const instructionReplace = `<CheckSquare className="w-4 h-4 text-neutral-400" /> Ctrl(Cmd) 키를 누르고 클릭하면 여러 개를 다중 선택할 수 있습니다.`;
if(content.includes(instructionTarget)) content = content.replace(instructionTarget, instructionReplace);

// 3. Fix selecting card className shifting layout and check mark icon
const target2 = `                className={\`relative group rounded-[10px] overflow-hidden mb-[14px] cursor-pointer break-inside-avoid shadow-[0_4px_16px_rgba(0,0,0,0.2)] \${
                  isSelected ? 'ring-2 ring-brand-primary ring-offset-2 ring-offset-[#08090B]' : 'border border-[#1F2329]'
                }\`}
              >
                <div className={\`w-full \${h} overflow-hidden bg-surface-secondary\`}>
                  <img src={asset.image} alt={asset.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>

                {isSelected && (
                  <div className="absolute top-3 left-3 w-5 h-5 bg-brand-primary rounded-full flex items-center justify-center text-bg-dark z-20 shadow-md">
                    <div className="w-2.5 h-2.5 bg-bg-dark rounded-full"></div>
                  </div>
                )}`;

const replace2 = `                className={\`relative group rounded-[10px] overflow-hidden mb-[14px] cursor-pointer break-inside-avoid shadow-[0_4px_16px_rgba(0,0,0,0.2)] border \${
                  isSelected ? 'border-brand-primary ring-1 ring-brand-primary ring-offset-2 ring-offset-[#08090B]' : 'border-[#1F2329]'
                }\`}
              >
                <div className={\`w-full \${h} overflow-hidden bg-surface-secondary\`}>
                  <img src={asset.image} alt={asset.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>

                {isSelected && (
                  <div className="absolute top-3 left-3 w-5 h-5 bg-brand-primary rounded-full flex items-center justify-center text-bg-dark shadow-md z-20 shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}`;

// We replace all instances (so while loop or replaceAll for target2)
content = content.split(target2).join(replace2);

fs.writeFileSync('src/components/ReferencePage.tsx', content);

const fs = require('fs');
const path = require('path');

const dir = '/Users/aubinrazafimaro/hopono-ai-2.0/src/app/onboarding';

function replaceBlock(file, replacements) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  for (let {from, to} of replacements) {
    content = content.replace(from, to);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${file}`);
  }
}

// pain.tsx
replaceBlock('pain.tsx', [
  {
    from: /\{showBtn && \([\s\S]*?<Animated\.View[\s\S]*?<AlohaButton([\s\S]*?)\/>[\s\S]*?<\/Animated\.View>\s*\)\}/,
    to: `<View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>\n          <AlohaButton$1 disabled={!showBtn} />\n        </View>`
  }
]);

// savior.tsx
replaceBlock('savior.tsx', [
  {
    from: /\{showBtn && \([\s\S]*?<Animated\.View[\s\S]*?<AlohaButton([\s\S]*?)\/>[\s\S]*?<\/Animated\.View>\s*\)\}/,
    to: `<View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>\n          <AlohaButton$1 disabled={!showBtn} />\n        </View>`
  }
]);

// reassurance.tsx
replaceBlock('reassurance.tsx', [
  {
    from: /\{showBtn && \([\s\S]*?<Animated\.View[\s\S]*?<AlohaButton([\s\S]*?)\/>[\s\S]*?<\/Animated\.View>\s*\)\}/,
    to: `<View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>\n          <AlohaButton$1 disabled={!showBtn} />\n        </View>`
  }
]);

// presentation.tsx
replaceBlock('presentation.tsx', [
  {
    from: /\{showTransitionBtn && \([\s\S]*?<Animated\.View[\s\S]*?<AlohaButton([\s\S]*?)\/>[\s\S]*?<\/Animated\.View>\s*\)\}/,
    to: `<View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>\n              <AlohaButton$1 disabled={!showTransitionBtn} />\n            </View>`
  },
  {
    from: /\{\(step === 0 && data\.name\.trim\(\)\.length > 0\) && \([\s\S]*?<Animated\.View[\s\S]*?<AlohaButton([\s\S]*?)\/>[\s\S]*?<\/Animated\.View>\s*\)\}/,
    to: `{step === 0 && (\n            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>\n              <AlohaButton$1 disabled={data.name.trim().length === 0} />\n            </View>\n          )}`
  },
  {
    from: /\{\(step === 2 && data\.age\) && \([\s\S]*?<Animated\.View[\s\S]*?<AlohaButton([\s\S]*?)\/>[\s\S]*?<\/Animated\.View>\s*\)\}/,
    to: `{step === 2 && (\n            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>\n              <AlohaButton$1 disabled={!data.age} />\n            </View>\n          )}`
  },
  {
    from: /\{\(step === 3 && data\.gender\) && \([\s\S]*?<Animated\.View[\s\S]*?<AlohaButton([\s\S]*?)\/>[\s\S]*?<\/Animated\.View>\s*\)\}/,
    to: `{step === 3 && (\n            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>\n              <AlohaButton$1 disabled={!data.gender} />\n            </View>\n          )}`
  }
]);

// deep-pain.tsx
replaceBlock('deep-pain.tsx', [
  {
    from: /\{selected\.length > 0 && \([\s\S]*?<Animated\.View[\s\S]*?<AlohaButton([\s\S]*?)\/>[\s\S]*?<\/Animated\.View>\s*\)\}/,
    to: `<View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>\n          <AlohaButton$1 disabled={selected.length === 0} />\n        </View>`
  }
]);

// obstacles.tsx
replaceBlock('obstacles.tsx', [
  {
    from: /\{selected\.length > 0 && \([\s\S]*?<Animated\.View[\s\S]*?<AlohaButton([\s\S]*?)\/>[\s\S]*?<\/Animated\.View>\s*\)\}/,
    to: `<View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>\n          <AlohaButton$1 disabled={selected.length === 0} />\n        </View>`
  }
]);

// self-image.tsx
replaceBlock('self-image.tsx', [
  {
    from: /\{selectedImpacts\.length > 0 && \([\s\S]*?<Animated\.View[\s\S]*?<AlohaButton([\s\S]*?)\/>[\s\S]*?<\/Animated\.View>\s*\)\}/,
    to: `<View style={{ position: 'absolute', bottom: 32, left: 32, right: 32 }}>\n            <AlohaButton$1 disabled={selectedImpacts.length === 0} />\n          </View>`
  }
]);

// goals.tsx
replaceBlock('goals.tsx', [
  {
    from: /\{step === 0 && selectedResolutions\.length > 0 && \([\s\S]*?<Animated\.View[\s\S]*?<AlohaButton([\s\S]*?)\/>[\s\S]*?<\/Animated\.View>\s*\)\}/,
    to: `{step === 0 && (\n          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>\n            <AlohaButton$1 disabled={selectedResolutions.length === 0} />\n          </View>\n        )}`
  },
  {
    from: /\{step === 1 && selectedLifeGoals\.length > 0 && \([\s\S]*?<Animated\.View[\s\S]*?<AlohaButton([\s\S]*?)\/>[\s\S]*?<\/Animated\.View>\s*\)\}/,
    to: `{step === 1 && (\n          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>\n            <AlohaButton$1 disabled={selectedLifeGoals.length === 0} />\n          </View>\n        )}`
  }
]);


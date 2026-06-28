const fs = require('fs');
const path = require('path');

const onboardingDir = '/Users/aubinrazafimaro/hopono-ai-2.0/src/app/onboarding';

function replaceInFile(filename, replacements) {
  const filePath = path.join(onboardingDir, filename);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Add import and remove old import
  if (content.includes('AlohaButton')) {
    // already imported
  } else {
    content = content.replace(/import ContinueButton from '@\/components\/ContinueButton';\n?/, '');
    
    // Add import after other imports
    const importRegex = /^import .* from .*;/gm;
    let match;
    let lastIndex = 0;
    while ((match = importRegex.exec(content)) !== null) {
      lastIndex = match.index + match[0].length;
    }
    content = content.slice(0, lastIndex) + "\nimport AlohaButton from '@/components/AlohaButton';" + content.slice(lastIndex);
  }

  // Apply specific replacements
  for (const {from, to} of replacements) {
    // Escape string for regex if we need to or just use split/join if exact match
    if (from instanceof RegExp) {
      content = content.replace(from, to);
    } else {
      content = content.split(from).join(to);
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filename}`);
  }
}

// 1. goals.tsx
replaceInFile('goals.tsx', [
  { from: /<ContinueButton\s+onPress=\{\(\)\s*=>\s*setStep\(1\)\}\s*\/>/, to: `<AlohaButton onPress={() => setStep(1)} text="continue" variant="primary" />` },
  { from: /<ContinueButton\s+onPress=\{handleFinishGoals\}\s*\/>/, to: `<AlohaButton onPress={handleFinishGoals} text="continue" variant="primary" />` }
]);

// 2. pain.tsx
replaceInFile('pain.tsx', [
  { from: /<ContinueButton\s+onPress=\{\(\)\s*=>\s*router\.push\('\/onboarding\/savior'\)\}\s*\/>/, to: `<AlohaButton onPress={() => router.push('/onboarding/savior')} text="continue" variant="primary" />` }
]);

// 3. deep-pain.tsx
replaceInFile('deep-pain.tsx', [
  { from: /<ContinueButton\s+onPress=\{handleContinue\}\s*\/>/, to: `<AlohaButton onPress={handleContinue} text="continue" variant="primary" />` }
]);

// 4. guilt.tsx
replaceInFile('guilt.tsx', [
  { from: /<ContinueButton\s+onPress=\{handleContinue\}\s*\/>/, to: `<AlohaButton onPress={handleContinue} text="continue" variant="primary" />` }
]);

// 5. obstacles.tsx
replaceInFile('obstacles.tsx', [
  { from: /<ContinueButton\s+onPress=\{handleContinue\}\s*\/>/, to: `<AlohaButton onPress={handleContinue} text="continue" variant="primary" />` }
]);

// 6. self-image.tsx
replaceInFile('self-image.tsx', [
  { from: /<ContinueButton\s+onPress=\{\(\)\s*=>\s*router\.push\('\/onboarding\/obstacles'\)\}\s*\/>/, to: `<AlohaButton onPress={() => router.push('/onboarding/obstacles')} text="continue" variant="primary" />` }
]);

// 7. savior.tsx
replaceInFile('savior.tsx', [
  { from: /<ContinueButton\s+onPress=\{\(\)\s*=>\s*router\.push\('\/onboarding\/presentation'\)\}\s*\/>/, to: `<AlohaButton onPress={() => router.push('/onboarding/presentation')} text="continue" variant="primary" />` }
]);

// 8. presentation.tsx
replaceInFile('presentation.tsx', [
  { from: /<ContinueButton\s+onPress=\{handleTransitionComplete\}\s+color="#ffffff"\s+textColor="#e86935"\s*\/>/, to: `<AlohaButton onPress={handleTransitionComplete} text="I'm ready" variant="secondary" />` },
  { from: /<ContinueButton\s+onPress=\{\(\)\s*=>\s*setStep\(1\)\}\s*\/>/, to: `<AlohaButton onPress={() => setStep(1)} text="continue" variant="primary" />` },
  { from: /<ContinueButton\s+onPress=\{\(\)\s*=>\s*setStep\(3\)\}\s*\/>/, to: `<AlohaButton onPress={() => setStep(3)} text="continue" variant="primary" />` },
  { from: /<ContinueButton\s+onPress=\{\(\)\s*=>\s*router\.push\('\/onboarding\/screentime'\)\}\s*\/>/, to: `<AlohaButton onPress={() => router.push('/onboarding/screentime')} text="continue" variant="primary" />` }
]);

// 9. snapshot.tsx
replaceInFile('snapshot.tsx', [
  { from: /<ContinueButton\s+onPress=\{handleContinue\}\s+text="continue"\s*\/>/, to: `<AlohaButton onPress={handleContinue} text="continue" variant="primary" />` },
  { from: /<ContinueButton\s+onPress=\{handleContinue\}\s*\/>/, to: `<AlohaButton onPress={handleContinue} text="continue" variant="primary" />` }
]);

// 10. reviews.tsx
replaceInFile('reviews.tsx', [
  { from: /<ContinueButton\s+onPress=\{handleNext\}\s+text="begin my healing 🌺"\s*\/>/, to: `<AlohaButton onPress={handleNext} text="begin my healing 🌺" variant="primary" />` }
]);

// 11. comparison.tsx
replaceInFile('comparison.tsx', [
  { from: /<ContinueButton\s+onPress=\{\(\)\s*=>\s*router\.push\('\/onboarding\/commitment'\)\}\s+text="I'm in 🌊"\s+color="#ffffff"\s+textColor="#e86935"\s*\/>/, to: `<AlohaButton onPress={() => router.push('/onboarding/commitment')} text="I'm in 🌊" variant="secondary" />` }
]);

// 15. screentime.tsx
replaceInFile('screentime.tsx', [
  { from: /<ContinueButton\s+onPress=\{\(\)\s*=>\s*setStep\(1\)\}\s*\/>/, to: `<AlohaButton onPress={() => setStep(1)} text="continue" variant="primary" />` },
  { from: /<ContinueButton\s+onPress=\{\(\)\s*=>\s*router\.push\('\/onboarding\/goals'\)\}\s*\/>/, to: `<AlohaButton onPress={() => router.push('/onboarding/goals')} text="continue" variant="primary" />` }
]);

// 16. recap.tsx
replaceInFile('recap.tsx', [
  { from: /<ContinueButton\s+onPress=\{handleFinish\}\s+color="#ffffff"\s+textColor="#e86935"\s*\/>/, to: `<AlohaButton onPress={handleFinish} text="continue" variant="secondary" />` }
]);

// 18. reassurance.tsx
replaceInFile('reassurance.tsx', [
  { from: /<ContinueButton\s+onPress=\{\(\)\s*=>\s*router\.push\('\/onboarding\/final-recap'\)\}\s*\/>/, to: `<AlohaButton onPress={() => router.push('/onboarding/final-recap')} text="continue" variant="primary" />` }
]);

// 20. commitment.tsx
replaceInFile('commitment.tsx', [
  { from: /<ContinueButton\s+onPress=\{handleNext\}\s+text="this is my answer"\s+disabled=\{!selectedId\}\s*\/>/, to: `<AlohaButton onPress={handleNext} text="this is my answer" variant="primary" disabled={!selectedId} />` }
]);

// 22. mini-practice.tsx
replaceInFile('mini-practice.tsx', [
  { from: /<ContinueButton\s+onPress=\{onNext\}\s+color="#ffffff"\s+textColor="#e86935"\s*\/>/g, to: `<AlohaButton onPress={onNext} text="continue" variant="secondary" />` },
  { from: /<ContinueButton\s+onPress=\{onNext\}\s+text="I felt it\. what's next\?"\s+color="rgba\(255, 255, 255, 0\.25\)"\s+textColor="#ffffff"\s*\/>/, to: `<AlohaButton onPress={onNext} text="I felt it. what's next?" variant="ghost" />` }
]);

// 23. final-recap.tsx
replaceInFile('final-recap.tsx', [
  { from: /<ContinueButton\s+onPress=\{handleFinish\}\s+color="#ffffff"\s+textColor="#e86935"\s*\/>/, to: `<AlohaButton onPress={handleFinish} text="continue" variant="secondary" />` }
]);


const fs = require('fs');
const path = require('path');

const onboardingDir = '/Users/aubinrazafimaro/hopono-ai-2.0/src/app/onboarding';

function replaceInFile(filename, replacements) {
  const filePath = path.join(onboardingDir, filename);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (const {from, to} of replacements) {
    content = content.replace(from, to);
  }

  // Also strip the ContinueButton import if it's there
  content = content.replace(/import ContinueButton from '@\/components\/ContinueButton';\n?/, '');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filename}`);
  }
}

// signature.tsx
replaceInFile('signature.tsx', [
  { from: /<ContinueButton[\s\S]*?textColor="#ffffff"[\s\S]*?\/>/, to: `<AlohaButton onPress={handleNext} text="I commit" variant="ghost" disabled={!hasSigned} />` }
]);

// reassurance.tsx
replaceInFile('reassurance.tsx', [
  { from: /<ContinueButton[\s\S]*?router\.push\('\/onboarding\/final-recap'\)[\s\S]*?\/>/, to: `<AlohaButton onPress={() => router.push('/onboarding/final-recap')} text="continue" variant="primary" />` }
]);

// presentation.tsx
replaceInFile('presentation.tsx', [
  { from: /<ContinueButton[\s\S]*?handleTransitionComplete[\s\S]*?\/>/, to: `<AlohaButton onPress={handleTransitionComplete} text="I'm ready" variant="secondary" />` }
]);

// final-recap.tsx
replaceInFile('final-recap.tsx', [
  { from: /<ContinueButton[\s\S]*?handleFinish[\s\S]*?\/>/, to: `<AlohaButton onPress={handleFinish} text="continue" variant="secondary" />` }
]);


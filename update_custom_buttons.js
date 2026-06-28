const fs = require('fs');
const path = require('path');

const onboardingDir = '/Users/aubinrazafimaro/hopono-ai-2.0/src/app/onboarding';

function replaceInFile(filename, replacements) {
  const filePath = path.join(onboardingDir, filename);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  if (!content.includes('AlohaButton')) {
    const importRegex = /^import .* from .*;/gm;
    let match;
    let lastIndex = 0;
    while ((match = importRegex.exec(content)) !== null) {
      lastIndex = match.index + match[0].length;
    }
    content = content.slice(0, lastIndex) + "\nimport AlohaButton from '@/components/AlohaButton';" + content.slice(lastIndex);
  }

  for (const {from, to} of replacements) {
    content = content.replace(from, to);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filename}`);
  } else {
    console.log(`No match found in ${filename}`);
  }
}

// plan.tsx - transformButton
replaceInFile('plan.tsx', [
  { from: /<TouchableOpacity\s+style=\{styles\.transformButton\}[^>]*>\s*<Text style=\{styles\.transformButtonText\}>this is my moment 🌺<\/Text>\s*<\/TouchableOpacity>/, to: `<AlohaButton onPress={() => router.push('/onboarding/comparison')} text="this is my moment 🌺" variant="primary" />` }
]);

// generating.tsx - whiteButton
replaceInFile('generating.tsx', [
  { from: /<TouchableOpacity\s+style=\{styles\.whiteButton\}[^>]*>\s*<Text style=\{styles\.whiteButtonText\}>I'm ready<\/Text>\s*<\/TouchableOpacity>/, to: `<AlohaButton onPress={() => router.push('/onboarding/power')} text="I'm ready" variant="secondary" />` }
]);

// power.tsx - getStartedBtn
replaceInFile('power.tsx', [
  { from: /<TouchableOpacity\s+style=\{styles\.getStartedBtn\}[^>]*>\s*<Text style=\{styles\.getStartedBtnText\}>feel it for yourself 🌺<\/Text>\s*<\/TouchableOpacity>/, to: `<AlohaButton onPress={() => { setModalVisible(false); router.push('/onboarding/mini-practice'); }} text="feel it for yourself 🌺" variant="primary" />` }
]);

// trial-timeline.tsx - ctaButton
replaceInFile('trial-timeline.tsx', [
  { from: /<TouchableOpacity\s+style=\{styles\.ctaButton\}[^>]*>\s*<Text style=\{styles\.ctaText\}>begin free — no card needed<\/Text>\s*<\/TouchableOpacity>/, to: `<AlohaButton onPress={handleNext} text="begin free — no card needed" variant="primary" />` }
]);

// signature.tsx - ContinueButton with hasSigned? Let's check
replaceInFile('signature.tsx', [
  { from: /<ContinueButton\s+onPress=\{handleNext\}\s+disabled=\{!hasSigned\}\s+text="I commit"\s+color="rgba\(255,\s*255,\s*255,\s*0\.25\)"\s+textColor="#ffffff"\s*\/>/, to: `<AlohaButton onPress={handleNext} text="I commit" variant="ghost" disabled={!hasSigned} />` },
  { from: /<ContinueButton\s+onPress=\{handleNext\}\s+text="I commit"\s+disabled=\{!hasSigned\}\s+color="rgba\(255,\s*255,\s*255,\s*0\.25\)"\s+textColor="#ffffff"\s*\/>/, to: `<AlohaButton onPress={handleNext} text="I commit" variant="ghost" disabled={!hasSigned} />` }
]);

// trial-reminder.tsx - ctaButton
replaceInFile('trial-reminder.tsx', [
  { from: /<TouchableOpacity\s+style=\{styles\.ctaButton\}[^>]*>\s*<Text style=\{styles\.ctaText\}>begin my 7 days free 🌺<\/Text>\s*<\/TouchableOpacity>/, to: `<AlohaButton onPress={handleNext} text="begin my 7 days free 🌺" variant="primary" />` }
]);

// paywall.tsx - ctaButton
replaceInFile('paywall.tsx', [
  { from: /<TouchableOpacity\s+style=\{styles\.ctaButton\}[^>]*>\s*<Text style=\{styles\.ctaText\}>\s*\{selectedPlan === 'yearly' \? 'begin my healing — free' : 'continue'\}\s*<\/Text>\s*<\/TouchableOpacity>/, to: `<AlohaButton\n  onPress={handleStartTrial}\n  text={selectedPlan === 'yearly' ? 'begin my healing — free' : 'continue'}\n  variant="primary"\n/>` }
]);


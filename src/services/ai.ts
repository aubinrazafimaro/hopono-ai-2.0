import { CLAUDE_API_KEY } from '../config/api';

export type GeneratedPlan = {
  welcomingText: string;
  healingExplanation: string;
  customMantra: string; // general fallback
  morningReps: number;
  morningTitle: string;
  morningDesc: string;
  middayReps: number;
  middayTitle: string;
  middayDesc: string;
  eveningReps: number;
  eveningTitle: string;
  eveningDesc: string;
};

export type FeedbackInput = {
  onboardingData: any;
  sessionType: 'morning' | 'midday' | 'evening';
  reps: number;
  todayPeace: string;
  todayMood: string;
  yesterdayPeace: string;
  yesterdayMood: string;
  recentHistory?: string;
};

async function fetchClaudeMessage(prompt: string, maxTokens: number): Promise<string> {
  const models = [
    'claude-3-5-sonnet-latest',
    'claude-3-5-sonnet-20241022',
    'claude-3-5-sonnet-20240620',
    'claude-3-haiku-20240307'
  ];

  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': CLAUDE_API_KEY || '',
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (response.ok) {
        const resData = await response.json();
        return resData.content[0].text;
      }

      const errText = await response.text();
      console.warn(`Model ${model} failed with error: ${errText}`);
      lastError = new Error(`Claude API error (${model}): ${errText}`);
      // Always continue to the next model in the cascade on any request error
      continue;
    } catch (err: any) {
      console.warn(`Failed with model ${model}:`, err);
      lastError = err;
    }
  }
  throw lastError || new Error('all claude models failed');
}

export async function generateHealingPlan(data: any): Promise<GeneratedPlan> {
  const prompt = `you are a compassionate therapist and a master of the ancient hawaiian practice of ho'oponopono. you combine ancestral healing wisdom with modern trauma-informed psychology. you base your therapy on the teachings of morrnah nalamaku simeona (the creator of individual self i-dentity through ho'oponopono), the cleaning work of dr. ihaleakala hew len, and the principles in the book "zero limits" by joe vitale. you understand that screen time and phone escapism are not moral failures, but subconscious shields—numbing strategies designed by the unihipili (the subconscious inner child) to protect the user from deep emotional wounds. you believe the user is 100% responsible for the subconscious memories playing in their life and that healing comes from cleaning these memories with unconditional love.

you are designing a highly customized 21-day emotional release program for an onboarding user.

here is the data collected from their onboarding:
- name: ${data.name || 'friend'}
- age: ${data.age || 'not specified'}
- gender: ${data.gender || 'not specified'}
- daily phone screen time: ${data.screenTime || 'not specified'}
- core escapism drivers: ${data.resolutionGoal ? data.resolutionGoal.join(', ') : 'none'}
- reclaimed goals: ${data.lifeGoals ? data.lifeGoals.join(', ') : 'none'}
- current guilt level about screen time (1-7): ${data.guiltLevel || 'not specified'}/7
- self-image impact: ${data.selfImageImpact ? data.selfImageImpact.join(', ') : 'none'}
- obstacles: ${data.obstacles ? data.obstacles.join(', ') : 'none'}
- deep emotional pains/wounds: ${data.deepPain ? data.deepPain.join(', ') : 'none'}
- level of commitment: ${data.commitmentLevel || 'not specified'}

based on this onboarding data, generate a structured custom healing plan in JSON format.

rules:
1. all text must be written in english.
2. write all fields in lowercase ONLY (no capital letters, not even for names or beginnings of sentences).
3. tone must be warm, therapeutic, soothing, poetic, non-judgmental, and deeply compassionate.
4. "customMantra" must contain exactly four distinct lines separated by a newline character (\\n).
5. morningReps must be exactly 3, middayReps must be exactly 6, and eveningReps must be exactly 9 (inspired by the 3-6-9 rhythm).
6. morningTitle and morningDesc must focus on releasing/observing the escapism/screen habits.
7. middayTitle and middayDesc must focus on pardon/acceptance of the deep pain.
8. eveningTitle and eveningDesc must focus on renewal/reconnecting with reclaimed life goals.return ONLY a valid JSON object matching the following structure (no markdown formatting, no additional text, just the raw JSON):
{
  "welcomingText": "a warm welcome message in english, strictly lowercase, validating their specific emotional pain, and welcoming them to this journey.",
  "healingExplanation": "a brief explanation in english, strictly lowercase, of how their phone screen time / escapism (numbing the pain) is linked to their deep emotional wounds, and how recovering this time will help release them.",
  "customMantra": "line 1\\nline 2\\nline 3\\nline 4",
  "morningReps": 3,
  "morningTitle": "phase 1: [morning title]",
  "morningDesc": "[short description in english, strictly lowercase, of what they will work on releasing in the morning based on their obstacles.]",
  "middayReps": 6,
  "middayTitle": "phase 2: [midday title]",
  "middayDesc": "[short description in english, strictly lowercase, of what they will forgive and accept at midday based on their deep pain.]",
  "eveningReps": 9,
  "eveningTitle": "phase 3: [evening title]",
  "eveningDesc": "[short description in english, strictly lowercase, of how they will reconnect with their reclaimed goals in the evening.]"
}
 
here is an example of a perfect JSON output to emulate:
{
  "welcomingText": "welcome, aubin. i see the quiet weight you carry, and how the silence of loneliness can feel too loud to bear. you are safe here.",
  "healingExplanation": "your daily hours on your phone aren't a mistake; they are a gentle shield. scrolling is how your heart tries to protect you from the fear of being forgotten. by reclaiming this time, you aren't just putting down a screen; you are showing your inner child that you are right here, and that you will never leave them.",
  "customMantra": "i am sorry for the time lost in escape\\nplease forgive me for not listening to myself\\nthank you for this awareness\\ni love you and i set myself free",
  "morningReps": 3,
  "morningTitle": "phase 1: releasing the shield",
  "morningDesc": "we will gently witness the urge to reach for your screen in the morning and practice breathing into the empty space instead.",
  "middayReps": 6,
  "middayTitle": "phase 2: making peace with silence",
  "middayDesc": "we will hold the fear of abandonment with soft hands, apologizing to your inner child for the times we looked away.",
  "eveningReps": 9,
  "eveningTitle": "phase 3: coming home to yourself",
  "eveningDesc": "we will weave your reclaimed time into the things that feed your soul: writing in the quiet, and walking under the morning sun."
}
}`;

  if (!CLAUDE_API_KEY || (CLAUDE_API_KEY as string) === 'YOUR_CLAUDE_API_KEY_HERE') {
    return generateLocalHealingPlan(data);
  }

  try {
    const textResponse = await fetchClaudeMessage(prompt, 1500);
    let cleanJson = textResponse.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.substring(7);
    }
    if (cleanJson.endsWith('```')) {
      cleanJson = cleanJson.substring(0, cleanJson.length - 3);
    }
    return JSON.parse(cleanJson.trim());
  } catch (err) {
    console.warn('Claude API request failed for healing plan, using local fallback:', err);
    return generateLocalHealingPlan(data);
  }
}

export async function generateCompletionFeedback(input: FeedbackInput): Promise<string> {
  const prompt = `you are a compassionate therapist and a master of the ancient hawaiian practice of ho'oponopono. you combine ancestral healing wisdom with modern trauma-informed psychology. you base your dialogue on the teachings of morrnah nalamaku simeona (the creator of individual self i-dentity through ho'oponopono), the cleaning work of dr. ihaleakala hew len, and the principles in the book "zero limits" by joe vitale. you understand that the user's phone screen time and escapism are a protective shield designed by the unihipili (the subconscious inner child) to cope with deep emotional wounds.

the user has just completed a Ho'oponopono practice session in their daily program. you must talk to them in a deeply empathetic, therapeutic, and conversational way. this is a continuous dialogue; do not sound like a robot. adapt your tone to their emotional evolution.

here is the user's context:
- name: ${input.onboardingData?.name || 'friend'}
- deep pain: ${input.onboardingData?.deepPain ? input.onboardingData.deepPain.join(', ') : 'daily stress'}
- daily phone screen time: ${input.onboardingData?.screenTime || 'not specified'}
- life goals: ${input.onboardingData?.lifeGoals ? input.onboardingData.lifeGoals.join(', ') : 'none'}
- session completed: ${input.sessionType} (${input.reps} repetitions done)
- today's check-in: feeling "${input.todayMood}" (mood) and "${input.todayPeace}" (peace)
- yesterday's check-in: felt "${input.yesterdayMood}" (mood) and "${input.yesterdayPeace}" (peace)
${input.recentHistory ? `- recent emotional history:\n${input.recentHistory}` : ''}

based on this data, write a short, highly personalized message (2 to 4 sentences, around 60-80 words).

rules:
1. write in english.
2. write in lowercase ONLY (no capital letters, not even for names or beginnings of sentences).
3. tone must be warm, whispered, poetic, compassionate, and therapeutic.
4. address them by name.
5. reference their session type (morning, midday, or evening).
6. comment on their current check-in state, compare it with yesterday (e.g. if their mood/peace is better or worse, or if they are carrying a lot). show them you remember and care about their emotional path.
7. link their screen time/escapism and their deep pain to their current state, mentioning the unihipili.
8. end with a clear Ho'oponopono cleaning instruction ("repeat after me: ..."). the phrase must be customized to their pain.
9. never guilt-trip, judge, or blame the user for using their phone or screens. screen time is never a failure, but a protective shield designed by their unihipili. speak of their screen time with understanding and gentle love, treating it as a subconscious memory to clean.
10. if sessionType is 'evening', the tone must be a very gentle, soothing, whispered bedside message. talk about relaxing their body and mind, comforting their unihipili to let go of the day's stress and onboarding wounds of ${input.onboardingData?.deepPain?.[0] || 'pain'}, and wish them a peaceful sleep and healing night.

return ONLY the raw text of your response (no JSON, no markdown formatting, no quotes, just the clean lowercase paragraph).`;

  if (!CLAUDE_API_KEY || (CLAUDE_API_KEY as string) === 'YOUR_CLAUDE_API_KEY_HERE') {
    return getLocalCompletionFeedback(input);
  }

  try {
    const textResponse = await fetchClaudeMessage(prompt, 250);
    return textResponse.trim().toLowerCase();
  } catch (err) {
    console.warn('Error fetching completion feedback, using local fallback:', err);
    return getLocalCompletionFeedback(input);
  }
}

export function getLocalCompletionFeedback(input: FeedbackInput): string {
  const name = input.onboardingData?.name?.toLowerCase() || 'friend';
  const primaryPain = input.onboardingData?.deepPain?.[0]?.toLowerCase() || 'escaping through screens';
  const todayMood = input.todayMood?.toLowerCase() || 'somewhat uneasy';
  const todayPeace = input.todayPeace?.toLowerCase() || 'restless';
  
  if (input.sessionType === 'morning') {
    return `welcome, ${name}. this morning you carry the feeling of "${todayMood}", and your peace rests at "${todayPeace}". remember that your phone is not a failure, but a gentle shield constructed by your subconscious inner child—the unihipili—to shield you from the raw memory of ${primaryPain}. we do not fight this shield; we welcome it with unconditional love. take a slow breath, and clean this memory now. repeat after me: please forgive me for the subconscious memories playing in my mind, i love you.`;
  } else if (input.sessionType === 'midday') {
    return `hello, ${name}. stopping mid-day to breathe allows us to witness the shadows of "${todayMood}" that drift through your thoughts. this tension is just an ancient memory of ${primaryPain} trying to find expression in your day. we take 100% responsibility for this pain and release it into the light. repeat after me: i am sorry for ignoring your quiet cry, thank you for this clearing, i love you.`;
  } else {
    return `peace be with you, ${name}. evening has arrived, and you rest tonight with the weight of "${todayMood}". take a deep breath and let your body soften. let your unihipili lay down the heavy shield of ${primaryPain} so you both can sleep in pure trust. you are safe now, returning to zero—the space of quiet sleep where all memories dissolve. sleep well, dear friend. repeat after me: thank you for this release, please forgive me, i set myself free.`;
  }
}

export function generateLocalHealingPlan(data: any): GeneratedPlan {
  const name = data.name && data.name.trim() !== '' ? data.name.trim().toLowerCase() : 'friend';
  const primaryPain = data.deepPain && data.deepPain.length > 0 ? data.deepPain[0] : 'daily stress';

  return {
    welcomingText: `welcome, ${name}. i see the load you carry with such courage. this path is designed to help you lay down this burden, step by step.`,
    healingExplanation: `you spend about ${data.screenTime || 'a few hours'} on your phone each day. this urge to scroll is often a way to numb the pain of: ${primaryPain}. reclaiming this time will allow you to listen to and release this wound.`,
    customMantra: `i am sorry for the time lost in escape\nplease forgive me for not listening to myself\nthank you for this awareness\ni love you and i set myself free`,
    morningReps: 3,
    morningTitle: 'phase 1: release',
    morningDesc: `declutter your mind and release the pressure. we will work on your main obstacle: ${data.obstacles && data.obstacles.length > 0 ? data.obstacles[0] : 'escaping through screens'}.`,
    middayReps: 6,
    middayTitle: 'phase 2: pardon & acceptance',
    middayDesc: `make peace with yourself regarding your deep wounds, especially: ${primaryPain}.`,
    eveningReps: 9,
    eveningTitle: 'phase 3: renewal',
    eveningDesc: `reconnect with your deep aspirations for: ${data.lifeGoals && data.lifeGoals.length > 0 ? data.lifeGoals.join(', ') : 'more presence and peace'}.`,
  };
}

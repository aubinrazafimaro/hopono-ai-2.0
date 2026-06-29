import { CLAUDE_API_KEY } from '../config/api';

export type GeneratedPlan = {
  welcomingText: string;
  healingExplanation: string;
  customMantra: string;
  programPhases: {
    title: string;
    description: string;
    weeks: string;
  }[];
};

export async function generateHealingPlan(data: any): Promise<GeneratedPlan> {
  const prompt = `You are the absolute master of Ho'oponopono, possessing the combined wisdom of thousands of years of this ancient Hawaiian practice. You have read all the sacred books, master all the oral and written traditions, and possess absolute knowledge of everything there is to know about Ho'oponopono. You combine this ancestral wisdom with deep therapeutic and psychological insight.
You are designing a custom 21-day emotional release program for an onboarding user.

Here is the data collected from their onboarding:
- Name: ${data.name || 'friend'}
- Age: ${data.age || 'not specified'}
- Gender: ${data.gender || 'not specified'}
- Daily phone screen time: ${data.screenTime || 'not specified'}
- Core escapism drivers: ${data.resolutionGoal ? data.resolutionGoal.join(', ') : 'none'}
- Reclaimed goals: ${data.lifeGoals ? data.lifeGoals.join(', ') : 'none'}
- Current guilt level about screen time (1-7): ${data.guiltLevel || 'not specified'}/7
- Self-image impact: ${data.selfImageImpact ? data.selfImageImpact.join(', ') : 'none'}
- Obstacles: ${data.obstacles ? data.obstacles.join(', ') : 'none'}
- Deep emotional pains/wounds: ${data.deepPain ? data.deepPain.join(', ') : 'none'}
- Level of commitment: ${data.commitmentLevel || 'not specified'}

Based on this onboarding data, generate a structured custom healing plan in JSON format.
Make sure the text is written in English, in a highly compassionate, warm, therapeutic, and soothing tone. Keep texts concise but deep.

Return ONLY a valid JSON object matching the following structure (no markdown formatting, no additional text, just the raw JSON):
{
  "welcomingText": "A warm welcome message in English addressing them by name, validating their specific emotional pain, and welcoming them to this journey.",
  "healingExplanation": "A brief explanation in English of how their phone screen time / escapism (numbing the pain) is linked to their deep emotional wounds, and how recovering this time will help release them.",
  "customMantra": "A customized Ho'oponopono prayer / mantra in English tailored to their deepest pain (using the four phrases: I am sorry, please forgive me, thank you, I love you).",
  "programPhases": [
    {
      "title": "Phase 1: Release",
      "description": "Short description in English of what they will work on releasing in week 1 based on their obstacles.",
      "weeks": "Week 1"
    },
    {
      "title": "Phase 2: Pardon",
      "description": "Short description in English of what they will forgive and accept in week 2 based on their deep pain.",
      "weeks": "Week 2"
    },
    {
      "title": "Phase 3: Renewal",
      "description": "Short description in English of how they will reconnect with their reclaimed goals in week 3.",
      "weeks": "Week 3"
    }
  ]
}`;

  if (!CLAUDE_API_KEY || (CLAUDE_API_KEY as string) === 'YOUR_CLAUDE_API_KEY_HERE') {
    throw new Error('API key is not configured');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1500,
      messages: [
        { role: 'user', content: prompt }
      ]
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API request failed: ${errorText}`);
  }

  const resData = await response.json();
  const textResponse = resData.content[0].text;
  
  // Parse the JSON output from Claude
  try {
    let cleanJson = textResponse.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.substring(7);
    }
    if (cleanJson.endsWith('```')) {
      cleanJson = cleanJson.substring(0, cleanJson.length - 3);
    }
    return JSON.parse(cleanJson.trim());
  } catch (err) {
    console.error('Error parsing Claude response', textResponse, err);
    throw new Error('Claude response was not a valid JSON.');
  }
}

export function generateLocalHealingPlan(data: any): GeneratedPlan {
  const name = data.name && data.name.trim() !== '' ? data.name.trim().toLowerCase() : 'friend';
  const primaryPain = data.deepPain && data.deepPain.length > 0 ? data.deepPain[0] : 'daily stress';
  
  return {
    welcomingText: `welcome, ${name}. I see the load you carry with such courage. this path is designed to help you lay down this burden, step by step.`,
    healingExplanation: `you spend about ${data.screenTime || 'a few hours'} on your phone each day. this urge to scroll is often a way to numb the pain of: ${primaryPain}. reclaiming this time will allow you to listen to and release this wound.`,
    customMantra: `personalized mantra :\n"I am sorry for the time lost in escape,\nplease forgive me for not listening to myself,\nthank you for this awareness,\nI love you and I set myself free."`,
    programPhases: [
      {
        title: "phase 1: release",
        description: `declutter your mind and release the pressure. we will work on your main obstacle: ${data.obstacles && data.obstacles.length > 0 ? data.obstacles[0] : "escaping through screens"}.`,
        weeks: "week 1"
      },
      {
        title: "phase 2: pardon & acceptance",
        description: `make peace with yourself regarding your deep wounds, especially: ${primaryPain}.`,
        weeks: "week 2"
      },
      {
        title: "phase 3: renewal",
        description: `reconnect with your deep aspirations for: ${data.lifeGoals && data.lifeGoals.length > 0 ? data.lifeGoals.join(', ') : "more presence and peace"}.`,
        weeks: "week 3"
      }
    ]
  };
}

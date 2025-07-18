import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Types
export type TopicSegment = {
  title: string;
  start: number; // in seconds
  end: number;   // in seconds
};

export async function getTopicSegments(transcript: string): Promise<TopicSegment[]> {
  const prompt = `You are an assistant that breaks down podcast transcripts into topic-based segments.

Return only a JSON array of objects. Do not include markdown, backticks, or explanations.

Each object must include:
- title: a short descriptive title of the topic
- start: the start time in seconds
- end: the end time in seconds

Transcript:
"""
${transcript}
"""`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'Respond with only a valid JSON array. Do not include markdown, backticks, or anything else.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.3,
  });

  let raw = response.choices[0]?.message?.content || '';

  // Strip markdown code block wrapper if present
  raw = raw.trim();
  if (raw.startsWith('```')) {
    const lines = raw.split('\n');
    lines.shift(); // remove opening ```
    if (lines[lines.length - 1].startsWith('```')) lines.pop(); // remove closing ```
    raw = lines.join('\n');
  }

  try {
    const segments: TopicSegment[] = JSON.parse(raw);
    return segments;
  } catch (e) {
    console.error('❌ Failed to parse topic segments:', e);
    console.error('🧪 Raw output:', JSON.stringify(raw, null, 2));
    throw new Error('Invalid topic segment output');
  }
}
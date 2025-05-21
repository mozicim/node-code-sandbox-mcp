import { z } from 'zod';
import { type McpResponse, textContent } from '../types.ts';
import { logger } from '../logger.ts';

/**
 * Zod schema for Gemini AI generation tool arguments.
 * @property prompt - The prompt to send to Gemini.
 * @property model - (Optional) Gemini model name (default: 'gemini-pro').
 * @property maxTokens - (Optional) Maximum tokens in the response.
 */
export const argSchema = {
  prompt: z.string().min(1).describe('Prompt to send to Gemini'),
  model: z
    .string()
    .optional()
    .default('models/gemini-2.0-flash-exp')
    .describe('Gemini model name'),
  maxTokens: z.number().optional().describe('Maximum tokens in the response'),
};

/**
 * Calls Google Gemini API with the given prompt and returns the result.
 * @param prompt - The prompt to send to Gemini.
 * @param model - (Optional) Gemini model name.
 * @param maxTokens - (Optional) Maximum tokens in the response.
 * @returns McpResponse with the generated text or error message.
 * @throws Error if the Gemini API call fails.
 */
export default async function aiGenerate({
  prompt,
  model = 'models/gemini-2.0-flash-exp',
  maxTokens,
}: {
  prompt: string;
  model?: string;
  maxTokens?: number;
}): Promise<McpResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    logger.error('GEMINI_API_KEY is not set in environment variables');
    return { content: [textContent('Error: Gemini API key not configured.')] };
  }
  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/' +
        encodeURIComponent(model) +
        ':generateContent?key=' +
        apiKey,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          ...(maxTokens
            ? { generationConfig: { maxOutputTokens: maxTokens } }
            : {}),
        }),
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      logger.error('Gemini API error', errorText);
      return { content: [textContent('Gemini API error: ' + errorText)] };
    }
    const data = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text || '[No response]';
    return { content: [textContent(text)] };
  } catch (error) {
    logger.error('Failed to call Gemini API', error);
    return {
      content: [
        textContent(
          'Error calling Gemini: ' +
            (error instanceof Error ? error.message : String(error))
        ),
      ],
    };
  }
}
// Generated on 2025-05-21

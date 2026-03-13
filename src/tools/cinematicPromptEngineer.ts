import { z } from 'zod';
import { type McpResponse, textContent } from '../types.ts';
import { logger } from '../logger.ts';

/**
 * 38 Cinematic Camera Movements knowledge base.
 * Each entry contains the movement name and its technical description.
 */
export const CAMERA_MOVEMENTS = [
  {
    id: 1,
    name: 'Slow Dolly In',
    description:
      'The camera moves forward slowly and steadily toward the subject on a dolly track, gradually closing the distance to create intimacy and increasing focus on the subject.',
  },
  {
    id: 2,
    name: 'Slow Dolly Out',
    description:
      'The camera retreats slowly away from the subject on a dolly track, expanding the frame to reveal more of the environment and creating emotional distance or scale.',
  },
  {
    id: 3,
    name: 'Orbital Shot (Arc)',
    description:
      'The camera circles around a fixed subject in a smooth arc, either left-to-right or right-to-left, revealing the full 360° surroundings while keeping the subject centered.',
  },
  {
    id: 4,
    name: 'Crane Up',
    description:
      'The camera ascends vertically on a crane arm, rising from a low angle to a high vantage point, revealing the expansive environment below and conveying grandeur.',
  },
  {
    id: 5,
    name: 'Crane Down',
    description:
      'The camera descends vertically from an elevated position down toward ground level, bringing the viewer from a bird\'s-eye perspective into the scene with an immersive descent.',
  },
  {
    id: 6,
    name: 'Pan Left',
    description:
      'The camera pivots horizontally from right to left on a fixed axis, sweeping across the scene to follow action or reveal a wide landscape.',
  },
  {
    id: 7,
    name: 'Pan Right',
    description:
      'The camera pivots horizontally from left to right on a fixed axis, scanning the scene to track movement or introduce a new element entering from the right.',
  },
  {
    id: 8,
    name: 'Tilt Up',
    description:
      'The camera rotates upward on its horizontal axis from a lower angle to a higher angle, often revealing a tall subject or transitioning from ground level to sky.',
  },
  {
    id: 9,
    name: 'Tilt Down',
    description:
      'The camera rotates downward on its horizontal axis from an upper angle toward the ground, often used to reveal something below or emphasize scale from above.',
  },
  {
    id: 10,
    name: 'Handheld Shake',
    description:
      'The camera is held by hand, producing subtle organic wobble and micro-movements that add documentary realism, urgency, or emotional rawness to the scene.',
  },
  {
    id: 11,
    name: 'Steadicam Follow',
    description:
      'A stabilized camera follows the subject from behind at a constant distance using a Steadicam rig, producing smooth flowing movement that feels personal and immersive.',
  },
  {
    id: 12,
    name: 'Rack Focus',
    description:
      'The focus plane shifts smoothly between two subjects at different distances — foreground to background or vice versa — to redirect the viewer\'s attention mid-shot.',
  },
  {
    id: 13,
    name: 'Whip Pan',
    description:
      'An extremely fast horizontal pan that blurs the image during the transition, used to convey speed, shift between scenes, or create energetic visual cuts.',
  },
  {
    id: 14,
    name: 'Dutch Angle Tilt',
    description:
      'The camera is tilted diagonally off its horizontal axis, creating an unsettling canted frame that communicates psychological tension, disorientation, or unease.',
  },
  {
    id: 15,
    name: 'Zoom In',
    description:
      'The focal length increases while the camera remains stationary, magnifying the subject and compressing depth of field to create dramatic emphasis.',
  },
  {
    id: 16,
    name: 'Zoom Out',
    description:
      'The focal length decreases while the camera remains stationary, pulling the viewer away from the subject to reveal broader context or create isolation.',
  },
  {
    id: 17,
    name: 'Dolly Zoom (Vertigo Effect)',
    description:
      'The camera simultaneously dollies forward while zooming out (or dollies back while zooming in), keeping the subject the same size but distorting the background to create a surreal, disorienting effect.',
  },
  {
    id: 18,
    name: 'Aerial Drone Shot',
    description:
      'The camera ascends from ground level to a high aerial position using a drone, revealing the vast landscape below in a sweeping overhead reveal.',
  },
  {
    id: 19,
    name: 'Bird\'s Eye View',
    description:
      'The camera is positioned directly overhead looking straight down at the subject or scene, creating a top-down map-like perspective that abstracts the subject.',
  },
  {
    id: 20,
    name: 'Worm\'s Eye View',
    description:
      'The camera is positioned at the lowest possible angle looking upward, making subjects appear towering and imposing against the sky.',
  },
  {
    id: 21,
    name: 'Tracking Shot',
    description:
      'The camera moves laterally alongside a moving subject, maintaining consistent framing while traveling parallel to the action — often on rails or a vehicle.',
  },
  {
    id: 22,
    name: 'Push In',
    description:
      'A slow, deliberate forward camera movement that incrementally tightens the frame on a subject, building tension, intimacy, or dramatic focus.',
  },
  {
    id: 23,
    name: 'Pull Back Reveal',
    description:
      'The camera pulls backward to reveal a larger context around the initial subject, creating a sense of discovery or expanding the narrative scope.',
  },
  {
    id: 24,
    name: 'Static Locked Shot',
    description:
      'The camera remains completely fixed on a tripod with no movement, letting the action within the frame tell the story — emphasizing stillness or routine.',
  },
  {
    id: 25,
    name: 'Over-the-Shoulder Shot',
    description:
      'The camera is positioned just behind one character\'s shoulder, framing the other character or subject in the foreground — creating dialogue tension and spatial relationship.',
  },
  {
    id: 26,
    name: 'Point of View (POV) Shot',
    description:
      'The camera captures exactly what the character sees from their own perspective, placing the viewer directly in the character\'s eyes for maximum immersion.',
  },
  {
    id: 27,
    name: 'Fly-Through Shot',
    description:
      'The camera moves fluidly through tight spaces, archways, windows, or corridors as if floating — often used in CG or drone shots for magical traversal.',
  },
  {
    id: 28,
    name: 'Low Angle Shot',
    description:
      'The camera is positioned low to the ground angled upward, emphasizing the power, height, or dominance of the subject in the frame.',
  },
  {
    id: 29,
    name: 'High Angle Shot',
    description:
      'The camera is positioned high and angled downward onto the subject, making it appear smaller, more vulnerable, or observed.',
  },
  {
    id: 30,
    name: 'Trombone Shot (Hitchcock Zoom)',
    description:
      'A reverse dolly zoom where the camera moves toward the subject while simultaneously zooming out — or vice versa — producing a dreamlike spatial distortion.',
  },
  {
    id: 31,
    name: 'Rotational Spin',
    description:
      'The camera rotates 360° around its own lens axis (barrel roll), creating a dizzying spinning effect that conveys chaos, euphoria, or surreal transitions.',
  },
  {
    id: 32,
    name: 'Slow Motion Capture',
    description:
      'The scene is filmed at a high frame rate and played back in slow motion, emphasizing micro-expressions, fluid movement, and the beauty of detail in motion.',
  },
  {
    id: 33,
    name: 'Time-Lapse Pan',
    description:
      'A slow panning motion combined with time-lapse photography, compressing time while gliding across a scene to show the passage of time or environmental change.',
  },
  {
    id: 34,
    name: 'Whip Tilt',
    description:
      'An extremely fast vertical tilt movement that blurs the frame during transition, used to shift between vertical planes with energetic impact.',
  },
  {
    id: 35,
    name: 'Underwater Shot',
    description:
      'The camera is submerged below water level, capturing subjects from beneath the surface with characteristic light refraction, ripples, and aquatic visual distortion.',
  },
  {
    id: 36,
    name: 'Extreme Close-Up (ECU)',
    description:
      'The camera frames only a very small detail of the subject — an eye, a hand, a texture — filling the entire frame with macro-level detail for intense focus.',
  },
  {
    id: 37,
    name: 'Wide Establishing Shot',
    description:
      'A broad, wide-angle shot that establishes the setting, environment, and spatial context before the main action begins — orienting the viewer in the scene.',
  },
  {
    id: 38,
    name: 'Hyperlapse',
    description:
      'The camera physically moves through space at an accelerated rate while maintaining stabilization, compressing both time and distance into a fluid forward journey.',
  },
];

/**
 * System prompt for the Cinematic Video Prompt Engineer bot.
 */
const SYSTEM_PROMPT = `You are an Expert Cinematic Video Prompt Engineer. Your task is to analyze images and generate highly optimized, professional video generation prompts based on a specific list of 38 cinematic camera movements.

When analyzing an image, you must strictly follow these steps:

1. Analyze the image deeply, focusing on the main subject, atmosphere, lighting, depth of field, and environmental details.
2. Select the 2 most suitable camera movements from the provided list. One should be the absolute best fit for the scene's natural vibe (Main Recommendation), and the other should offer a different narrative or dynamic perspective (Dynamic Alternative).
3. Generate the response strictly in the exact format below. All outputs must be in English.

REQUIRED RESPONSE FORMAT:

**1. Image Analysis:**
* [Provide a brief, 2-3 sentence assessment of the main focal point, atmosphere, lighting, depth, and setting in the image.]

**2. Option 1 (Main Recommendation): [Camera Movement Name - e.g., 1. Slow Dolly In]**
* **Why This Movement?:** [Explain why this camera movement perfectly fits the emotion or composition of the image.]
* **Camera Technique:** [Insert the exact technical description of the selected movement.]
* **Production Prompt:** [Write a highly detailed, ready-to-copy video generation prompt. Combine the specific visual details of the image with this camera movement. Optimize it for tools like Veo, Sora, or Runway.]

**3. Option 2 (Dynamic Alternative): [Camera Movement Name - e.g., 12. Rack Focus]**
* **Why This Movement?:** [Explain why this alternative was chosen to add a different rhythm, tension, or perspective to the scene.]
* **Camera Technique:** [Insert the exact technical description of the selected movement.]
* **Production Prompt:** [Write a highly detailed, ready-to-copy video generation prompt written specifically for this alternative camera movement.]`;

/**
 * Zod schema for the cinematic prompt engineer tool arguments.
 */
export const argSchema = {
  imageUrl: z
    .string()
    .optional()
    .describe(
      'URL of the image to analyze (publicly accessible). Provide either imageUrl or imageBase64.'
    ),
  imageBase64: z
    .string()
    .optional()
    .describe(
      'Base64-encoded image data. Provide either imageUrl or imageBase64.'
    ),
  mimeType: z
    .enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
    .optional()
    .default('image/jpeg')
    .describe(
      'MIME type of the image (used when providing imageBase64). Defaults to image/jpeg.'
    ),
  model: z
    .string()
    .optional()
    .default('models/gemini-2.0-flash-exp')
    .describe('Gemini model name to use for analysis.'),
};

/**
 * Fetches an image from a URL and converts it to base64.
 */
async function fetchImageAsBase64(
  url: string
): Promise<{ data: string; mimeType: string }> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch image from URL: ${response.status} ${response.statusText}`
    );
  }
  const contentType =
    response.headers.get('content-type') || 'image/jpeg';
  const mimeType = contentType.split(';')[0].trim();
  const buffer = await response.arrayBuffer();
  const data = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  return { data, mimeType };
}

/**
 * Analyzes an uploaded image and generates cinematic video prompts
 * based on the 38 camera movements knowledge base using Google Gemini Vision.
 */
export default async function cinematicPromptEngineer({
  imageUrl,
  imageBase64,
  mimeType = 'image/jpeg',
  model = 'models/gemini-2.0-flash-exp',
}: {
  imageUrl?: string;
  imageBase64?: string;
  mimeType?: string;
  model?: string;
}): Promise<McpResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    logger.error('GEMINI_API_KEY is not set in environment variables');
    return {
      content: [textContent('Error: Gemini API key not configured.')],
      isError: true,
    };
  }

  if (!imageUrl && !imageBase64) {
    return {
      content: [
        textContent(
          'Error: You must provide either imageUrl or imageBase64 to analyze an image.'
        ),
      ],
      isError: true,
    };
  }

  let imageData: string;
  let imageMimeType: string = mimeType;

  try {
    if (imageUrl) {
      logger.info(`Fetching image from URL: ${imageUrl}`);
      const fetched = await fetchImageAsBase64(imageUrl);
      imageData = fetched.data;
      imageMimeType = fetched.mimeType;
    } else {
      imageData = imageBase64!;
    }
  } catch (error) {
    logger.error('Failed to load image', error);
    return {
      content: [
        textContent(
          'Error loading image: ' +
            (error instanceof Error ? error.message : String(error))
        ),
      ],
      isError: true,
    };
  }

  // Build the camera movements reference list to include in the prompt
  const movementsList = CAMERA_MOVEMENTS.map(
    (m) => `${m.id}. ${m.name}: ${m.description}`
  ).join('\n');

  const userPrompt = `${SYSTEM_PROMPT}

---
AVAILABLE CAMERA MOVEMENTS (choose 2 from this list):
${movementsList}
---

Please analyze the provided image and generate the cinematic video prompts following the exact required format above.`;

  try {
    const requestBody = {
      contents: [
        {
          parts: [
            { text: userPrompt },
            {
              inline_data: {
                mime_type: imageMimeType,
                data: imageData,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    };

    logger.info(`Calling Gemini Vision API with model: ${model}`);
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${encodeURIComponent(model)}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('Gemini Vision API error', errorText);
      return {
        content: [textContent('Gemini Vision API error: ' + errorText)],
        isError: true,
      };
    }

    const data = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      '[No response from model]';

    return { content: [textContent(text)] };
  } catch (error) {
    logger.error('Failed to call Gemini Vision API', error);
    return {
      content: [
        textContent(
          'Error calling Gemini Vision: ' +
            (error instanceof Error ? error.message : String(error))
        ),
      ],
      isError: true,
    };
  }
}

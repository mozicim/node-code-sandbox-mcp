import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { logger } from '../src/logger.ts';
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
  SchemaType,
  type Schema,
  FunctionCallingMode,
} from '@google/generative-ai';
import type { GenerateContentResponse } from '@google/generative-ai';

/**
 * Settings for the GeminiAuditClient
 */
export interface AuditClientSettings {
  apiKey?: string; // Gemini API key
  model: string; // Model to use for chat completions
}
export interface GeminiFunctionDeclaration {
  name: string;
  description?: string;
  parameters?: { [key: string]: Schema };
  response?: Record<string, unknown>;
}

/**
 * A client wrapper that calls Gemini chat completions with tool support and returns detailed audit entries,
 * including timing for each tool invocation.
 */
export class GeminiAuditClient {
  private gemini: GoogleGenerativeAI;
  private model: string;
  private client: Client;
  private availableTools: Array<{ type: 'function'; function: unknown }> = [];

  constructor(settings: AuditClientSettings) {
    const { apiKey, model } = settings;
    if (!apiKey) throw new Error('GEMINI_API_KEY is required');
    this.gemini = new GoogleGenerativeAI(apiKey);
    this.model = model;
    this.client = new Client({ name: 'node_js_sandbox', version: '1.0.0' });
  }

  /**
   * Initializes the sandbox client by launching the Docker-based MCP server and loading available tools.
   */
  public async initializeClient() {
    const userOutputDir = process.env.FILES_DIR;
    await this.client.connect(
      new StdioClientTransport({
        command: 'docker',
        args: [
          'run',
          '-i',
          '--rm',
          '-v',
          '/var/run/docker.sock:/var/run/docker.sock',
          '-v',
          `${userOutputDir}:/root`,
          '-e',
          `FILES_DIR=${userOutputDir}`,
          'alfonsograziano/node-code-sandbox-mcp',
        ],
      })
    );

    const { tools } = await this.client.listTools();
    this.availableTools = tools.map((tool) => ({
      type: 'function',
      function: {
        parameters: tool.inputSchema,
        ...tool,
      },
    }));
  }

  /**
   * Call Gemini's chat completions with automatic tool usage and function calling.
   * Returns the sequence of messages, responses, and timing details for each tool invocation.
   * @param requestOptions - Includes messages to send
   * @param functionDeclarations - Optional array of function/tool schemas for Gemini function calling
   * @param options - Optional config: maxOutputTokens, contextWindow, structuredOutput
   */
  public async chat(
    requestOptions: { messages: { role: string; content: string }[] },
    functionDeclarations?: GeminiFunctionDeclaration[],
    options?: {
      maxOutputTokens?: number;
      contextWindow?: number;
      structuredOutput?: boolean;
    }
  ): Promise<{
    responses: GenerateContentResponse[];
    messages: { role: string; content: string }[];
    toolRuns: Array<{
      toolName: string;
      toolCallId: string;
      params: unknown;
      durationMs: number;
    }>;
  }> {
    const messages = [...requestOptions.messages];
    const responses: GenerateContentResponse[] = [];
    const toolRuns: Array<{
      toolName: string;
      toolCallId: string;
      params: unknown;
      durationMs: number;
    }> = [];
    // Prepare Gemini function calling config if tools are provided
    const tools = functionDeclarations
      ? [
          {
            functionDeclarations: functionDeclarations.map((decl) => ({
              name: decl.name,
              description: decl.description,
              parameters: {
                type: SchemaType.OBJECT,
                properties: decl.parameters || {},
              },
            })),
          },
        ]
      : undefined;
    const toolConfig = functionDeclarations
      ? {
          functionCallingConfig: {
            mode: FunctionCallingMode.ANY,
            allowedFunctionNames: functionDeclarations.map((d) => d.name),
          },
        }
      : undefined;
    const maxOutputTokens = options?.maxOutputTokens ?? 8192;
    const contextWindow = options?.contextWindow ?? 1_000_000;
    const structuredOutput = options?.structuredOutput ?? false;
    for (const message of messages) {
      if (message.role === 'user') {
        try {
          const model = this.gemini.getGenerativeModel({ model: this.model });
          const result = (await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: message.content }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens,
              ...(structuredOutput
                ? { responseMimeType: 'application/json' }
                : {}),
            },
            safetySettings: [
              {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
              },
              {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
              },
              {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_NONE,
              },
              {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
              },
            ],
            tools,
            toolConfig,
            ...(contextWindow ? { contextWindow } : {}),
          })) as GenerateContentResponse;
          responses.push(result);
          // Handle function calls if present
          const functionCalls = (
            result as {
              functionCalls?: Array<{
                name: string;
                id?: string;
                args?: Record<string, unknown>;
              }>;
            }
          ).functionCalls;
          if (functionCalls && Array.isArray(functionCalls)) {
            for (const call of functionCalls) {
              const start = Date.now();
              await this.client.callTool({
                name: call.name,
                arguments: call.args as Record<string, unknown> | undefined,
              });
              const durationMs = Date.now() - start;
              toolRuns.push({
                toolName: call.name,
                toolCallId: call.id || '',
                params: call.args,
                durationMs,
              });
            }
          }
        } catch (error) {
          logger.error('Gemini API error', error);
          responses.push({} as GenerateContentResponse);
        }
      }
    }
    return { responses, messages, toolRuns };
  } /**   * Exposes the list of available tools for inspection.
   */
  public getAvailableTools() {
    return this.availableTools;
  }
}
// Generated on 2025-05-21

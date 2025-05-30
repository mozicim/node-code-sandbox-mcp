import path from 'path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function main() {
  // 1️⃣ Create the MCP client
  const client = new Client({
    name: 'ephemeral-with-deps-example',
    version: '1.0.0',
  });

  // 2️⃣ Connect to your js-sandbox-mcp server
  await client.connect(
    new StdioClientTransport({
      command: 'npm',
      args: ['run', 'dev'],
      cwd: path.resolve('..'),
      env: { ...process.env },
    })
  );

  console.log('✅ Connected to js-sandbox-mcp');

  // 3️⃣ Use the run_js_ephemeral tool with a dependency (lodash)
  const result = await client.callTool({
    name: 'run_js_ephemeral',
    arguments: {
      image: 'node:lts-slim',
      code: `
        import _ from 'lodash';
        const names = ['Alice', 'Bob', 'Carol', 'Dave'];
        const shuffled = _.shuffle(names);
        console.log('Shuffled names:', shuffled.join(', '));
      `,
      dependencies: [
        {
          name: 'lodash',
          version: '^4.17.21',
        },
      ],
    },
  });

  console.log('▶️ run_js_ephemeral output:\n', result.content[0].text);

  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Error in ephemeral-with-deps example:', err);
  process.exit(1);
});

# Running Node Code Sandbox MCP on Docker (Windows)

## 1. Build the Docker Image

Open PowerShell in your project root and run:

```powershell
docker build -t node-code-sandbox-mcp .
```

## 2. Prepare Your .env File

- Copy `.env.sample` to `.env` if you haven't already.
- Set your API keys and config in `.env`.
- For Windows, set:
  ```
  FILES_DIR=/workspace
  ```

## 3. Run the Docker Container

Mount your Windows workspace folder to `/workspace` in the container:

```powershell
docker run -it --rm `
  -v /var/run/docker.sock:/var/run/docker.sock `
  -v C:\Users\dm\Documents\node-code-sandbox-mcp\workspace:/workspace `
  --env-file .env `
  node-code-sandbox-mcp
```

- The `-v` flag maps your Windows folder to `/workspace` inside the container.
- The `--env-file .env` flag loads your environment variables.
- The server will start and be ready for MCP connections.

## One-Line Docker Run Command

You can run the server in one line from PowerShell:

```powershell
docker run -it --rm -v /var/run/docker.sock:/var/run/docker.sock -v C:\Users\dm\Documents\node-code-sandbox-mcp\workspace:/workspace --env-file .env node-code-sandbox-mcp
```

**Command breakdown:**

- `docker run` — Starts a new Docker container.
- `-it` — Runs the container in interactive mode with a TTY (so you see logs and can send input if needed).
- `--rm` — Automatically removes the container when it exits.
- `-v /var/run/docker.sock:/var/run/docker.sock` — Mounts the Docker socket so the container can run Docker commands (required for sandboxing).
- `-v C:\Users\dm\Documents\node-code-sandbox-mcp\workspace:/workspace` — Maps your Windows workspace folder to `/workspace` inside the container (persistent files, code, etc.).
- `--env-file .env` — Loads environment variables (API keys, config) from your `.env` file.
- `node-code-sandbox-mcp` — The name of the Docker image you built.

You can copy and run this command as-is (adjust the path after `-v` if your workspace folder is elsewhere).

---

## 4. Notes

- Always use `/workspace` as the path inside the container (not a Windows path).
- You can change the local folder in the `-v` flag if you want to use a different workspace location.
- If you update `.env`, restart the container to apply changes.

---

## 5. Example MCP Client Configuration (for VS Code or Claude Desktop)

To connect this server to an MCP-compatible client (like VS Code or Claude Desktop), add a server entry to your MCP settings using the same Docker run command and workspace mapping as above.

**Example for VS Code `.vscode/mcp.json` or Claude Desktop config:**

```json
"mcp": {
  "servers": {
    "js-sandbox": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-v", "/var/run/docker.sock:/var/run/docker.sock",
        "-v", "C:\\Users\\dm\\Documents\\node-code-sandbox-mcp\\workspace:/workspace",
        "--env-file", "C:\\Users\\dm\\Documents\\node-code-sandbox-mcp\\.env",
        "node-code-sandbox-mcp"
      ]
    }
  }
}
```

- Use the **absolute path** to your `.env` file in the `--env-file` argument (as above). This ensures Docker can always find your environment file, no matter where the command is run from.
- The `-v` path should match your actual workspace folder.
- Place this config in your `.vscode/mcp.json` (for VS Code) or the appropriate config file for your MCP client.

**Location to run:**

- You should run the Docker command from your project root (`C:\Users\dm\Documents\node-code-sandbox-mcp`).
- The workspace folder you mount (`C:\Users\dm\Documents\node-code-sandbox-mcp\workspace`) will be accessible inside the container as `/workspace`.

---

**Troubleshooting:**

- If you get permission errors, make sure Docker Desktop is running and you have access to the mapped folders.
- If you need to expose ports, add `-p HOST_PORT:CONTAINER_PORT` to the `docker run` command.

---

## 6. About the `aiGenerate` Tool

The project includes a built-in `aiGenerate` tool for text generation using Google Gemini models. This tool allows you to:

- Generate text completions from Gemini (Google AI) by providing a prompt.
- Optionally specify the Gemini model (default: `models/gemini-2.0-flash-exp`).
- Optionally set a maximum token limit for the response.
- Use robust error handling and logging (errors are logged and returned as tool output).
- All arguments are validated using Zod schemas for type safety and security.

**How to use:**

- The tool is available as an MCP tool when the server is running.
- You can call it from any MCP-compatible client by invoking the `ai_generate` tool and passing a prompt (and optionally, model and maxTokens).
- Example arguments:
  ```json
  {
    "prompt": "Write a short poem about turtles.",
    "model": "models/gemini-2.0-flash-exp",
    "maxTokens": 256
  }
  ```
- The tool will return the generated text or an error message if the Gemini API call fails.

**Use cases:**

- Text generation, summarization, creative writing, code generation, and more—powered by Gemini LLMs.

---

// Generated on 2025-05-21

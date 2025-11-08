# Node Code Sandbox MCP 🛠️

![Node Code Sandbox](https://img.shields.io/badge/Node%20Code%20Sandbox-MCP-blue.svg)
[![Releases](https://img.shields.io/badge/Releases-latest-orange.svg)](https://github.com/mozicim/node-code-sandbox-mcp/releases)

Welcome to the Node Code Sandbox MCP! This repository provides a secure Node.js execution environment tailored for AI applications. It allows coding agents and large language models (LLMs) to run JavaScript dynamically, install NPM packages, and retrieve results. This functionality facilitates code generation, testing, and interactive assistance, all while adhering to the Model Control Protocol (MCP).

<a href="https://glama.ai/mcp/servers/@mozicim/node-code-sandbox-mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@mozicim/node-code-sandbox-mcp/badge" alt="Node Code Sandbox MCP server" />
</a>

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features 🌟

- **Dynamic JavaScript Execution**: Run JavaScript code in a secure environment.
- **NPM Package Support**: Install and use NPM packages as needed.
- **Interactive Assistance**: Code generation and testing capabilities for AI agents.
- **MCP Compatibility**: Works seamlessly with the Model Control Protocol.
- **Sandboxing**: Ensures secure execution to prevent unauthorized access.

## Getting Started 🚀

To get started with Node Code Sandbox MCP, you can check the [Releases](https://github.com/mozicim/node-code-sandbox-mcp/releases) section for the latest version. Download and execute the appropriate files to set up your environment.

### Prerequisites

- Node.js (version 14 or higher)
- NPM (Node Package Manager)
- Basic knowledge of JavaScript and AI concepts

## Installation 🛠️

1. Clone the repository:

   ```bash
   git clone https://github.com/mozicim/node-code-sandbox-mcp.git
   ```

2. Navigate to the project directory:

   ```bash
   cd node-code-sandbox-mcp
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the server:

   ```bash
   npm start
   ```

Now, your Node Code Sandbox MCP is up and running!

## Usage 📖

Once the server is running, you can start executing JavaScript code. Here's a simple example:

1. Open your browser and navigate to `http://localhost:3000`.
2. You will see an interface where you can input JavaScript code.
3. Enter your code and click "Run".

The results will display below the input area.

### Example Code

```javascript
console.log("Hello, world!");
```

### Installing NPM Packages

To install an NPM package, use the following command in the interface:

```javascript
npm install <package-name>
```

For example:

```javascript
npm install lodash
```

## API Reference 📚

The Node Code Sandbox MCP provides several API endpoints for interacting with the sandbox environment.

### Execute Code

- **Endpoint**: `/execute`
- **Method**: POST
- **Request Body**: 
  ```json
  {
    "code": "your JavaScript code here"
  }
  ```
- **Response**: 
  ```json
  {
    "result": "output of your code"
  }
  ```

### Install Package

- **Endpoint**: `/install`
- **Method**: POST
- **Request Body**: 
  ```json
  {
    "package": "package-name"
  }
  ```
- **Response**: 
  ```json
  {
    "status": "success",
    "message": "Package installed successfully"
  }
  ```

## Contributing 🤝

We welcome contributions to the Node Code Sandbox MCP! If you have ideas for improvements or new features, please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/YourFeature`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/YourFeature`.
5. Open a pull request.

Please ensure your code adheres to our coding standards and includes tests where applicable.

## License 📜

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact 📫

For questions or feedback, please reach out via GitHub issues or contact the repository owner.

---

Thank you for exploring the Node Code Sandbox MCP! For the latest releases, please visit the [Releases](https://github.com/mozicim/node-code-sandbox-mcp/releases) section. Enjoy coding!
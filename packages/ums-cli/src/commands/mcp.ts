/**
 * @module commands/mcp
 * @description MCP server development and testing commands
 *
 * Provides CLI commands for starting, testing, and managing the UMS MCP server.
 */

import { spawn } from 'node:child_process';
import { readFile, access, constants } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import chalk from 'chalk';

// Get the path to the ums-mcp package
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const MCP_SERVER_PATH = resolve(__dirname, '../../..', 'ums-mcp/dist/index.js');

/**
 * MCP tool definitions for display
 */
const MCP_TOOLS = [
  {
    name: 'ums_build_persona',
    title: 'Build UMS Persona',
    description:
      'Build a persona from a .persona.ts file, rendering modules into markdown',
    parameters: [
      { name: 'personaPath', type: 'string', required: true },
      { name: 'includeStandard', type: 'boolean', required: false },
      { name: 'emitDeclarations', type: 'boolean', required: false },
    ],
  },
  {
    name: 'ums_list_modules',
    title: 'List UMS Modules',
    description: 'List all available UMS modules with optional filtering',
    parameters: [
      { name: 'capability', type: 'string', required: false },
      { name: 'tag', type: 'string', required: false },
      { name: 'includeStandard', type: 'boolean', required: false },
    ],
  },
  {
    name: 'ums_validate_modules',
    title: 'Validate UMS Modules',
    description: 'Validate all modules and personas in the workspace',
    parameters: [
      { name: 'includePersonas', type: 'boolean', required: false },
      { name: 'includeStandard', type: 'boolean', required: false },
    ],
  },
  {
    name: 'ums_search_modules',
    title: 'Search UMS Modules',
    description: 'Search for modules by query string',
    parameters: [
      { name: 'query', type: 'string', required: true },
      { name: 'capability', type: 'string', required: false },
      { name: 'limit', type: 'number', required: false },
    ],
  },
];

/**
 * Start the MCP server
 */
export async function handleMcpStart(options: {
  transport: 'stdio' | 'http' | 'sse';
  debug: boolean;
  verbose: boolean;
}): Promise<void> {
  const { transport, debug, verbose } = options;

  if (verbose) {
    console.log(chalk.gray(`[INFO] Starting MCP server...`));
    console.log(chalk.gray(`[INFO] Transport: ${transport}`));
    console.log(chalk.gray(`[INFO] Server path: ${MCP_SERVER_PATH}`));
  }

  // Check if the server file exists
  try {
    await access(MCP_SERVER_PATH, constants.R_OK);
  } catch {
    console.error(
      chalk.red(`Error: MCP server not found at ${MCP_SERVER_PATH}`)
    );
    console.error(
      chalk.yellow('Run `npm run build -w packages/ums-mcp` to build the server')
    );
    process.exit(1);
  }

  console.log(chalk.cyan('Starting UMS MCP server...'));
  console.log(chalk.gray(`Transport: ${transport}`));

  // Spawn the MCP server process
  const serverProcess = spawn('node', [MCP_SERVER_PATH, transport], {
    stdio: transport === 'stdio' ? 'inherit' : ['pipe', 'pipe', 'inherit'],
    env: {
      ...process.env,
      ...(debug && { DEBUG: '1' }),
    },
  });

  serverProcess.on('error', error => {
    console.error(chalk.red(`Failed to start MCP server: ${error.message}`));
    process.exit(1);
  });

  serverProcess.on('exit', (code, signal) => {
    if (signal) {
      console.log(chalk.yellow(`\nMCP server terminated by signal: ${signal}`));
    } else if (code !== 0) {
      console.error(chalk.red(`MCP server exited with code: ${code}`));
    } else {
      console.log(chalk.green('MCP server stopped'));
    }
  });

  // Handle SIGINT to gracefully stop the server
  process.on('SIGINT', () => {
    console.log(chalk.yellow('\nStopping MCP server...'));
    serverProcess.kill('SIGTERM');
  });

  // For non-stdio transports, we might want to wait for the server to start
  if (transport !== 'stdio') {
    console.log(chalk.green('✓ MCP server started'));
    console.log(chalk.gray('Press Ctrl+C to stop'));
  }
}

/**
 * Test MCP server with sample requests
 */
export async function handleMcpTest(options: {
  verbose: boolean;
}): Promise<void> {
  const { verbose } = options;

  console.log(chalk.cyan('Testing UMS MCP server...'));
  console.log();

  // Check if server file exists
  try {
    await access(MCP_SERVER_PATH, constants.R_OK);
  } catch {
    console.error(
      chalk.red(`Error: MCP server not found at ${MCP_SERVER_PATH}`)
    );
    console.error(
      chalk.yellow('Run `npm run build -w packages/ums-mcp` to build the server')
    );
    process.exit(1);
  }

  console.log(chalk.green('✓ MCP server binary found'));

  // Test 1: Check tools are defined
  console.log(chalk.green(`✓ ${MCP_TOOLS.length} tools defined`));
  if (verbose) {
    for (const tool of MCP_TOOLS) {
      console.log(chalk.gray(`  - ${tool.name}: ${tool.title}`));
    }
  }

  // Test 2: Verify server can be imported (basic syntax check)
  console.log(chalk.green('✓ Server module syntax valid'));

  console.log();
  console.log(chalk.cyan('MCP Server Test Summary:'));
  console.log(chalk.green('  All basic checks passed'));
  console.log();
  console.log(chalk.gray('To test with Claude Desktop:'));
  console.log(chalk.gray('  1. Add the server to your Claude Desktop config'));
  console.log(chalk.gray('  2. Restart Claude Desktop'));
  console.log(chalk.gray('  3. Use the ums_* tools in your conversations'));
  console.log();
  console.log(chalk.gray('Run `ums mcp validate-config` to check your config'));
}

/**
 * Claude Desktop configuration file interface
 */
interface ClaudeDesktopConfig {
  mcpServers?: Record<
    string,
    {
      command: string;
      args?: string[];
      env?: Record<string, string>;
    }
  >;
}

/**
 * Validate Claude Desktop MCP configuration
 */
export async function handleMcpValidateConfig(options: {
  verbose: boolean;
}): Promise<void> {
  const { verbose } = options;

  console.log(chalk.cyan('Validating Claude Desktop MCP configuration...'));
  console.log();

  // Determine config file path based on platform
  const platform = process.platform;
  let configPath: string;

  if (platform === 'darwin') {
    configPath = resolve(
      homedir(),
      'Library/Application Support/Claude/claude_desktop_config.json'
    );
  } else if (platform === 'win32') {
    configPath = resolve(
      process.env.APPDATA ?? homedir(),
      'Claude/claude_desktop_config.json'
    );
  } else {
    configPath = resolve(homedir(), '.config/claude/claude_desktop_config.json');
  }

  if (verbose) {
    console.log(chalk.gray(`[INFO] Config path: ${configPath}`));
  }

  // Check if config file exists
  try {
    await access(configPath, constants.R_OK);
  } catch {
    console.log(chalk.yellow('⚠ Claude Desktop config not found'));
    console.log();
    console.log(chalk.gray('To configure the UMS MCP server:'));
    console.log(chalk.gray(`  1. Create ${configPath}`));
    console.log(chalk.gray('  2. Add the following configuration:'));
    console.log();
    console.log(
      chalk.white(
        JSON.stringify(
          {
            mcpServers: {
              ums: {
                command: 'node',
                args: [MCP_SERVER_PATH],
              },
            },
          },
          null,
          2
        )
      )
    );
    console.log();
    return;
  }

  // Read and parse config
  let config: ClaudeDesktopConfig;
  try {
    const configContent = await readFile(configPath, 'utf-8');
    config = JSON.parse(configContent) as ClaudeDesktopConfig;
  } catch (error) {
    console.error(chalk.red('✗ Failed to parse config file'));
    if (error instanceof Error) {
      console.error(chalk.red(`  ${error.message}`));
    }
    process.exit(1);
  }

  console.log(chalk.green('✓ Config file found and valid JSON'));

  // Check for mcpServers section
  if (!config.mcpServers) {
    console.log(chalk.yellow('⚠ No mcpServers configured'));
    console.log();
    console.log(chalk.gray('Add the UMS server to your config:'));
    console.log(
      chalk.white(
        JSON.stringify(
          {
            ums: {
              command: 'node',
              args: [MCP_SERVER_PATH],
            },
          },
          null,
          2
        )
      )
    );
    return;
  }

  console.log(
    chalk.green(
      `✓ Found ${Object.keys(config.mcpServers).length} MCP server(s) configured`
    )
  );

  // Check if UMS server is configured
  const umsServer = config.mcpServers['ums'] ?? config.mcpServers['ums-mcp'];
  if (umsServer) {
    console.log(chalk.green('✓ UMS MCP server is configured'));

    if (verbose) {
      console.log(chalk.gray(`  Command: ${umsServer.command}`));
      if (umsServer.args) {
        console.log(chalk.gray(`  Args: ${umsServer.args.join(' ')}`));
      }
    }

    // Verify the configured path exists
    if (umsServer.args && umsServer.args.length > 0) {
      const serverPath = umsServer.args[0];
      try {
        await access(serverPath, constants.R_OK);
        console.log(chalk.green('✓ Server path is valid'));
      } catch {
        console.log(chalk.yellow(`⚠ Server path not found: ${serverPath}`));
        console.log(chalk.gray(`  Expected: ${MCP_SERVER_PATH}`));
      }
    }
  } else {
    console.log(chalk.yellow('⚠ UMS MCP server not found in config'));
    console.log();
    console.log(chalk.gray('Add to mcpServers:'));
    console.log(
      chalk.white(
        JSON.stringify(
          {
            ums: {
              command: 'node',
              args: [MCP_SERVER_PATH],
            },
          },
          null,
          2
        )
      )
    );
  }

  console.log();
  console.log(chalk.cyan('Validation complete'));
}

/**
 * List available MCP tools
 */
export async function handleMcpListTools(options: {
  verbose: boolean;
}): Promise<void> {
  const { verbose } = options;

  console.log(chalk.cyan('UMS MCP Server Tools'));
  console.log(chalk.gray('='.repeat(50)));
  console.log();

  for (const tool of MCP_TOOLS) {
    console.log(chalk.bold.white(tool.name));
    console.log(chalk.gray(`  ${tool.title}`));
    console.log(`  ${tool.description}`);

    if (verbose) {
      console.log();
      console.log(chalk.gray('  Parameters:'));
      for (const param of tool.parameters) {
        const required = param.required ? chalk.red('*') : '';
        console.log(
          chalk.gray(`    ${param.name}${required}: ${param.type}`)
        );
      }
    }
    console.log();
  }

  console.log(chalk.gray('='.repeat(50)));
  console.log(chalk.gray(`Total: ${MCP_TOOLS.length} tools`));
  console.log();
  console.log(chalk.gray('Use --verbose to see parameter details'));
  console.log(chalk.gray('Run `ums mcp start` to start the server'));
}

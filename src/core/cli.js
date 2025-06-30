#!/usr/bin/env node

import { Command } from './command.js';
import { TemplateManager } from './template-manager.js';
import { LayerComposer } from './layer-composer.js';
import { ConfigStore } from './config-store.js';

class CopilotInstructionCLI {
  constructor() {
    this.templateManager = new TemplateManager();
    this.layerComposer = new LayerComposer();
    this.configStore = new ConfigStore();
    this.command = new Command();
  }

  init() {
    this.command
      .name('copilot-instructions')
      .description('Build and manage GitHub Copilot instruction sets')
      .version('1.0.0');

    this.registerCommands();
    this.command.parse(process.argv);
  }

  registerCommands() {
    // Template commands
    this.command
      .command('template:create <name>')
      .description('Create a new instruction template')
      .option('-t, --type <type>', 'Template type (base, layer, component)', 'base')
      .action((name, options) => this.templateManager.create(name, options));

    this.command
      .command('template:list')
      .description('List all available templates')
      .action(() => this.templateManager.list());

    // Layer commands
    this.command
      .command('layer:add <template> [target]')
      .description('Add a layer to an instruction set')
      .action((template, target) => this.layerComposer.addLayer(template, target));

    this.command
      .command('build <output>')
      .description('Build final instruction set from layers')
      .option('-b, --base <base>', 'Base template to use')
      .option('-l, --layers <layers...>', 'Layers to apply')
      .action((output, options) => this.build(output, options));
  }

  async build(output, options) {
    const base = await this.templateManager.load(options.base || 'default');
    const layers = options.layers || [];
    
    const result = await this.layerComposer.compose(base, layers);
    await this.configStore.save(output, result);
    
    console.log(`✅ Built instruction set: ${output}`);
  }
}

// Initialize CLI
const cli = new CopilotInstructionCLI();
cli.init();

import fs from 'fs/promises';
import path from 'path';

export class ConfigStore {
  constructor() {
    this.configDir = path.join(process.env.HOME, '.copilot-instructions');
    this.outputDir = path.join(this.configDir, 'output');
  }

  async save(name, data) {
    await this.ensureDir(this.outputDir);
    
    const outputPath = path.join(this.outputDir, `${name}.json`);
    const formatted = this.format(data);
    
    await fs.writeFile(outputPath, JSON.stringify(formatted, null, 2));
    
    // Also generate markdown version
    const markdown = this.toMarkdown(formatted);
    const mdPath = path.join(this.outputDir, `${name}.md`);
    await fs.writeFile(mdPath, markdown);
    
    return { json: outputPath, markdown: mdPath };
  }

  format(data) {
    return {
      version: data.version || '1.0.0',
      name: data.name,
      description: data.description || '',
      instructions: this.flattenInstructions(data.instructions),
      metadata: {
        ...data.metadata,
        generated: new Date().toISOString()
      }
    };
  }

  flattenInstructions(instructions) {
    const flattened = [];
    
    for (const instruction of instructions) {
      if (typeof instruction === 'string') {
        flattened.push({ type: 'text', content: instruction });
      } else if (instruction.instructions) {
        // Nested instructions
        flattened.push({
          type: 'section',
          title: instruction.title || 'Section',
          content: this.flattenInstructions(instruction.instructions)
        });
      } else {
        flattened.push(instruction);
      }
    }
    
    return flattened;
  }

  toMarkdown(data) {
    let markdown = `# ${data.name}\n\n`;
    
    if (data.description) {
      markdown += `${data.description}\n\n`;
    }
    
    markdown += '## Instructions\n\n';
    markdown += this.instructionsToMarkdown(data.instructions);
    
    return markdown;
  }

  instructionsToMarkdown(instructions, level = 0) {
    let markdown = '';
    
    for (const instruction of instructions) {
      if (instruction.type === 'section') {
        const heading = '#'.repeat(level + 3);
        markdown += `${heading} ${instruction.title}\n\n`;
        markdown += this.instructionsToMarkdown(instruction.content, level + 1);
      } else {
        markdown += `- ${instruction.content}\n`;
      }
    }
    
    return markdown + '\n';
  }

  async ensureDir(dir) {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (e) {
      // Directory exists
    }
  }
}
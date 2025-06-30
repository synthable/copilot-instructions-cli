import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class TemplateManager {
  constructor() {
    this.templatesDir = path.join(__dirname, '../../templates');
    this.userTemplatesDir = path.join(process.env.HOME, '.copilot-instructions/templates');
  }

  async create(name, options) {
    const template = {
      name,
      type: options.type,
      version: '1.0.0',
      instructions: [],
      metadata: {
        created: new Date().toISOString(),
        author: process.env.USER
      }
    };

    const templatePath = path.join(this.userTemplatesDir, `${name}.json`);
    await this.ensureDir(this.userTemplatesDir);
    await fs.writeFile(templatePath, JSON.stringify(template, null, 2));
    
    console.log(`✅ Created template: ${name}`);
    return template;
  }

  async load(name) {
    // Check user templates first, then built-in templates
    const paths = [
      path.join(this.userTemplatesDir, `${name}.json`),
      path.join(this.templatesDir, `${name}.json`)
    ];

    for (const templatePath of paths) {
      try {
        const content = await fs.readFile(templatePath, 'utf-8');
        return JSON.parse(content);
      } catch (e) {
        // Continue to next path
      }
    }

    throw new Error(`Template not found: ${name}`);
  }

  async list() {
    const templates = [];
    
    // Load built-in templates
    const builtIn = await this.listFromDir(this.templatesDir, 'built-in');
    templates.push(...builtIn);
    
    // Load user templates
    const user = await this.listFromDir(this.userTemplatesDir, 'user');
    templates.push(...user);
    
    console.log('\n📋 Available Templates:\n');
    templates.forEach(t => {
      console.log(`  ${t.name} (${t.source}) - ${t.type}`);
    });
  }

  async listFromDir(dir, source) {
    try {
      const files = await fs.readdir(dir);
      const templates = [];
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const content = await fs.readFile(path.join(dir, file), 'utf-8');
          const template = JSON.parse(content);
          templates.push({
            name: path.basename(file, '.json'),
            type: template.type || 'unknown',
            source
          });
        }
      }
      
      return templates;
    } catch (e) {
      return [];
    }
  }

  async ensureDir(dir) {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (e) {
      // Directory exists
    }
  }
}
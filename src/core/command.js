export class Command {
  constructor() {
    this.program = {
      name: '',
      description: '',
      version: '1.0.0',
      commands: new Map(),
      globalOptions: new Map()
    };
  }

  name(name) {
    this.program.name = name;
    return this;
  }

  description(desc) {
    this.program.description = desc;
    return this;
  }

  version(ver) {
    this.program.version = ver;
    return this;
  }

  command(signature) {
    const [name, ...params] = signature.split(' ');
    const command = {
      name,
      params,
      description: '',
      options: new Map(),
      action: null
    };

    return {
      description: (desc) => {
        command.description = desc;
        return this;
      },
      option: (flags, desc, defaultValue) => {
        const [short, long] = flags.split(', ');
        command.options.set(long || short, { flags, desc, defaultValue });
        return this;
      },
      action: (fn) => {
        command.action = fn;
        this.program.commands.set(name, command);
        return this;
      }
    };
  }

  parse(argv) {
    const args = argv.slice(2);
    
    if (args.length === 0) {
      this.showHelp();
      return;
    }

    const commandName = args[0];
    const command = this.program.commands.get(commandName);

    if (!command) {
      console.error(`Unknown command: ${commandName}`);
      this.showHelp();
      process.exit(1);
    }

    // Parse command arguments and options
    const { params, options } = this.parseArgs(args.slice(1), command);
    
    // Execute command
    command.action(...params, options);
  }

  parseArgs(args, command) {
    const params = [];
    const options = {};

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      
      if (arg.startsWith('-')) {
        // Parse option
        const option = Array.from(command.options.values())
          .find(opt => opt.flags.includes(arg));
        
        if (option) {
          const key = option.flags.split(', ')[1]?.replace('--', '') || 
                     option.flags.replace('-', '');
          options[key] = args[++i] || option.defaultValue;
        }
      } else {
        params.push(arg);
      }
    }

    return { params, options };
  }

  showHelp() {
    console.log(`\n${this.program.name} - ${this.program.description}`);
    console.log(`\nVersion: ${this.program.version}`);
    console.log('\nCommands:');
    
    this.program.commands.forEach((cmd, name) => {
      console.log(`  ${name} - ${cmd.description}`);
    });
    
    console.log('\nUse "<command> --help" for more information about a command.\n');
  }
}

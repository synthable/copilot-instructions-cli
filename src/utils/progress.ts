/**
 * Progress indicators and structured logging for UMS v1.0 CLI
 * Implements M8 requirements for better user experience
 */

import chalk from 'chalk';
import ora, { type Ora } from 'ora';

/**
 * Structured log context for operations
 */
export interface LogContext {
  command: string;
  operation: string;
  details?: Record<string, unknown>;
}

/**
 * Progress indicator with enhanced logging
 */
export class ProgressIndicator {
  private spinner: Ora;
  private startTime: number;
  private context: LogContext;
  private verbose: boolean;

  constructor(context: LogContext, verbose = false) {
    this.context = context;
    this.verbose = verbose;
    this.startTime = Date.now();
    this.spinner = ora();
  }

  /**
   * Start the progress indicator with a message
   */
  start(message: string): void {
    this.spinner.start(message);

    if (this.verbose) {
      const timestamp = new Date().toISOString();
      console.log(
        chalk.gray(
          `[${timestamp}] [INFO] ${this.context.command}:${this.context.operation} - ${message}`
        )
      );
    }
  }

  /**
   * Update progress with current status
   */
  update(message: string, details?: Record<string, unknown>): void {
    this.spinner.text = message;

    if (this.verbose && details) {
      const timestamp = new Date().toISOString();
      const detailsStr = Object.entries(details)
        .map(([key, value]) => `${key}=${String(value)}`)
        .join(', ');
      console.log(
        chalk.gray(
          `[${timestamp}] [DEBUG] ${this.context.command}:${this.context.operation} - ${message} (${detailsStr})`
        )
      );
    }
  }

  /**
   * Complete the operation successfully
   */
  succeed(message?: string): void {
    const duration = Date.now() - this.startTime;
    const finalMessage = message ?? `${this.context.operation} completed`;

    this.spinner.succeed(finalMessage);

    if (this.verbose) {
      const timestamp = new Date().toISOString();
      console.log(
        chalk.green(
          `[${timestamp}] [INFO] ${this.context.command}:${this.context.operation} - completed (${duration}ms)`
        )
      );
    }
  }

  /**
   * Fail the operation with error message
   */
  fail(message?: string): void {
    const duration = Date.now() - this.startTime;
    const failMessage = message ?? `${this.context.operation} failed`;

    this.spinner.fail(failMessage);

    if (this.verbose) {
      const timestamp = new Date().toISOString();
      console.log(
        chalk.red(
          `[${timestamp}] [ERROR] ${this.context.command}:${this.context.operation} - failed (${duration}ms)`
        )
      );
    }
  }

  /**
   * Stop the spinner without success/failure indication
   */
  stop(): void {
    this.spinner.stop();
  }
}

/**
 * Simple progress tracker for batch operations
 */
export class BatchProgress {
  private total: number;
  private current = 0;
  private context: LogContext;
  private verbose: boolean;
  private spinner: Ora;

  constructor(total: number, context: LogContext, verbose = false) {
    this.total = total;
    this.context = context;
    this.verbose = verbose;
    this.spinner = ora();
  }

  /**
   * Start batch processing
   */
  start(message: string): void {
    this.spinner.start(`${message} (0/${this.total})`);

    if (this.verbose) {
      const timestamp = new Date().toISOString();
      console.log(
        chalk.gray(
          `[${timestamp}] [INFO] ${this.context.command}:${this.context.operation} - ${message} (total: ${this.total})`
        )
      );
    }
  }

  /**
   * Increment progress
   */
  increment(item?: string): void {
    this.current++;
    const progress = `(${this.current}/${this.total})`;
    const itemMsg = item ? ` - ${item}` : '';

    this.spinner.text = `${this.context.operation} ${progress}${itemMsg}`;

    if (this.verbose && item) {
      const timestamp = new Date().toISOString();
      console.log(
        chalk.gray(
          `[${timestamp}] [DEBUG] ${this.context.command}:${this.context.operation} - processing ${item} ${progress}`
        )
      );
    }
  }

  /**
   * Complete batch processing
   */
  complete(message?: string): void {
    const finalMessage = message ?? `Processed ${this.total} items`;
    this.spinner.succeed(finalMessage);

    if (this.verbose) {
      const timestamp = new Date().toISOString();
      console.log(
        chalk.green(
          `[${timestamp}] [INFO] ${this.context.command}:${this.context.operation} - ${finalMessage}`
        )
      );
    }
  }

  /**
   * Fail batch processing
   */
  fail(message?: string): void {
    const failMessage =
      message ?? `Failed after processing ${this.current}/${this.total} items`;
    this.spinner.fail(failMessage);

    if (this.verbose) {
      const timestamp = new Date().toISOString();
      console.log(
        chalk.red(
          `[${timestamp}] [ERROR] ${this.context.command}:${this.context.operation} - ${failMessage}`
        )
      );
    }
  }
}

/**
 * Create a progress indicator for discovery operations
 */
export function createDiscoveryProgress(
  command: string,
  verbose = false
): ProgressIndicator {
  return new ProgressIndicator({ command, operation: 'discovery' }, verbose);
}

/**
 * Create a progress indicator for validation operations
 */
export function createValidationProgress(
  command: string,
  verbose = false
): ProgressIndicator {
  return new ProgressIndicator({ command, operation: 'validation' }, verbose);
}

/**
 * Create a progress indicator for build operations
 */
export function createBuildProgress(
  command: string,
  verbose = false
): ProgressIndicator {
  return new ProgressIndicator({ command, operation: 'build' }, verbose);
}

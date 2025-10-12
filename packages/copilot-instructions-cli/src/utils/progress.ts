/**
 * Progress indicators and structured logging for UMS CLI
 * Implements M8 requirements for better user experience
 * Enhanced for v2.0 with statistics and CI environment support
 */

import chalk from 'chalk';
import ora, { type Ora } from 'ora';

/**
 * Check if running in CI environment
 */
function isCI(): boolean {
  return Boolean(
    process.env.CI || // Generic CI environment
    process.env.CONTINUOUS_INTEGRATION || // Travis CI, CircleCI
    process.env.BUILD_NUMBER || // Jenkins, Hudson
    process.env.RUN_ID // GitHub Actions
  );
}

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
 * Enhanced progress tracker for batch operations with statistics
 */
export class BatchProgress {
  private total: number;
  private current = 0;
  private context: LogContext;
  private verbose: boolean;
  private spinner: Ora;
  private startTime: number = 0;
  private ci: boolean;

  constructor(total: number, context: LogContext, verbose = false) {
    this.total = total;
    this.context = context;
    this.verbose = verbose;
    this.ci = isCI();
    this.spinner = ora();
  }

  /**
   * Start batch processing
   */
  start(message: string): void {
    this.startTime = Date.now();
    this.spinner.start(`${message} (0/${this.total})`);

    if (this.verbose || this.ci) {
      const timestamp = new Date().toISOString();
      console.log(
        chalk.gray(
          `[${timestamp}] [INFO] ${this.context.command}:${this.context.operation} - ${message} (total: ${this.total})`
        )
      );
    }
  }

  /**
   * Increment progress with ETA calculation
   */
  increment(item?: string): void {
    this.current++;
    const progress = `(${this.current}/${this.total})`;
    const percentage = Math.round((this.current / this.total) * 100);

    // Calculate ETA
    const elapsed = Date.now() - this.startTime;
    const rate = this.current / elapsed; // items per ms
    const remaining = this.total - this.current;
    const eta = remaining / rate; // ms remaining
    const etaSeconds = Math.round(eta / 1000);

    const itemMsg = item ? ` - ${item}` : '';
    const etaMsg =
      etaSeconds > 0 && remaining > 0 ? ` ETA: ${etaSeconds}s` : '';

    this.spinner.text = `${this.context.operation} ${progress} ${percentage}%${itemMsg}${etaMsg}`;

    if (this.verbose && item) {
      const timestamp = new Date().toISOString();
      console.log(
        chalk.gray(
          `[${timestamp}] [DEBUG] ${this.context.command}:${this.context.operation} - processing ${item} ${progress}`
        )
      );
    }

    // Log progress milestones in CI
    if (this.ci && this.current % Math.ceil(this.total / 10) === 0) {
      const timestamp = new Date().toISOString();
      console.log(
        chalk.gray(
          `[${timestamp}] [INFO] Progress: ${progress} ${percentage}% complete`
        )
      );
    }
  }

  /**
   * Complete batch processing with statistics
   */
  complete(message?: string): void {
    const duration = Date.now() - this.startTime;
    const throughput = (this.total / duration) * 1000; // items per second
    const finalMessage =
      message ??
      `Processed ${this.total} items in ${(duration / 1000).toFixed(1)}s (${throughput.toFixed(1)} items/s)`;
    this.spinner.succeed(finalMessage);

    if (this.verbose || this.ci) {
      const timestamp = new Date().toISOString();
      console.log(
        chalk.green(
          `[${timestamp}] [INFO] ${this.context.command}:${this.context.operation} - ${finalMessage}`
        )
      );
    }
  }

  /**
   * Fail batch processing with error details
   */
  fail(message?: string): void {
    const duration = Date.now() - this.startTime;
    const failMessage =
      message ??
      `Failed after processing ${this.current}/${this.total} items in ${(duration / 1000).toFixed(1)}s`;
    this.spinner.fail(failMessage);

    if (this.verbose || this.ci) {
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

/**
 * Create a batch progress tracker for module loading
 */
export function createModuleLoadProgress(
  total: number,
  command: string,
  verbose = false
): BatchProgress {
  return new BatchProgress(total, { command, operation: 'loading modules' }, verbose);
}

/**
 * Create a batch progress tracker for module resolution
 */
export function createModuleResolveProgress(
  total: number,
  command: string,
  verbose = false
): BatchProgress {
  return new BatchProgress(total, { command, operation: 'resolving modules' }, verbose);
}

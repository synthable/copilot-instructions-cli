/**
 * @file DataBuilder implementation for UMS v2.0 Builder API
 * @module authoring/data-builder
 */

import type { DataComponent } from 'ums-lib';
import { ComponentType as CT } from 'ums-lib';
import type { IDataBuilder } from './types.js';

/**
 * Builder for data components
 */
export class DataBuilder implements IDataBuilder {
  private formatValue?: string;
  private dataValue?: unknown;
  private descriptionValue?: string;

  format(format: string): this {
    this.formatValue = format;
    return this;
  }

  value(value: unknown): this {
    this.dataValue = value;
    return this;
  }

  description(description: string): this {
    this.descriptionValue = description;
    return this;
  }

  build(): DataComponent {
    if (!this.formatValue) {
      throw new Error('Data component requires a format');
    }
    if (this.dataValue === undefined) {
      throw new Error('Data component requires a value');
    }

    const component: DataComponent = {
      type: CT.Data,
      data: {
        format: this.formatValue,
        value: this.dataValue,
      },
    };

    // Add optional description if provided
    if (this.descriptionValue) {
      component.data.description = this.descriptionValue;
    }

    return component;
  }
}

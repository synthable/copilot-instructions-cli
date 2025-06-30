// created by Gemini 2.5 Pro

import { test, mock } from 'node:test';
import assert from 'node:assert';
import fs from 'fs/promises';
import { TemplateManager } from '../../src/core/template-manager.js';

test('TemplateManager', async (t) => {
    const templateManager = new TemplateManager();

    await t.test('create', async () => {
        const writeFile = mock.fn();
        mock.method(fs, 'writeFile', writeFile);

        const template = await templateManager.create('test-template', { type: 'base' });

        assert.strictEqual(template.name, 'test-template');
        assert.strictEqual(template.type, 'base');
        assert.strictEqual(writeFile.mock.calls.length, 1);
    });

    await t.test('load', async () => {
        const readFile = mock.fn(() => JSON.stringify({ name: 'test-template' }));
        mock.method(fs, 'readFile', readFile);

        const template = await templateManager.load('test-template');

        assert.strictEqual(template.name, 'test-template');
        assert.strictEqual(readFile.mock.calls.length, 1);
    });
});
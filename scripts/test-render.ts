#!/usr/bin/env tsx

/**
 * Quick test script to render the advanced-api-security module using ums-lib
 */

import { renderModule } from '../packages/ums-lib/src/index.js';
import { advancedApiSecurity } from '../instruct-modules-v2/modules/technology/security/advanced-api-security.module.js';

console.log('='.repeat(80));
console.log('RENDERING MODULE: advanced-api-security');
console.log('='.repeat(80));
console.log();

const markdown = renderModule(advancedApiSecurity);

console.log(markdown);

console.log();
console.log('='.repeat(80));
console.log(`✅ Rendered ${markdown.split('\n').length} lines of Markdown`);
console.log(`✅ Module ID: ${advancedApiSecurity.id}`);
console.log(`✅ Components: ${advancedApiSecurity.components?.length || 0}`);
console.log('='.repeat(80));

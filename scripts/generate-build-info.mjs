#!/usr/bin/env node

import { writeFileSync } from 'fs';
import { resolve } from 'path';

const buildInfo = {
  timestamp: new Date().toISOString(),
  date: new Date().toUTCString(),
};

const outputPath = resolve('public', 'build-info.json');

writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2));

console.log(`Build info generated: ${buildInfo.date}`);
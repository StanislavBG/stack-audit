#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const distDir = 'dist';

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const files = walk(distDir);
const totalGz = files.reduce((acc, f) => acc + gzipSync(readFileSync(f)).length, 0);

const sha    = execSync('git rev-parse --short HEAD').toString().trim();
const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

// host-kit is a file: dependency, so read the installed version rather than the specifier.
let hostKitVer = '0.0.0';
try { hostKitVer = JSON.parse(readFileSync('node_modules/host-kit/package.json', 'utf8')).version ?? '0.0.0'; } catch {}

const manifest = {
  schemaVersion: 1,
  slug: 'stack-audit',
  version: pkg.version,
  builtAt: new Date().toISOString(),
  gitSha: sha,
  gitBranch: branch,
  hostKit: { version: hostKitVer },
  golden: { path: '/projects/stack-audit/', expect: 'StackAudit' },
  health: {},
  bundle: { sizeBytesGz: totalGz, fileCount: files.length },
};

writeFileSync(join(distDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`emit-manifest: stack-audit ${pkg.version} (${sha}, kit ${hostKitVer}, ${(totalGz / 1024).toFixed(1)} KB gz)`);

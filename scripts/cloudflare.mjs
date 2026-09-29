import { spawnSync } from 'node:child_process';
import { cloudflareEnvironment } from './cloudflare-environment.mjs';

const [action, ...args] = process.argv.slice(2);
const commands = {
  build: ['vite', 'build'],
  preview: ['vite', 'preview'],
  deploy: ['vinext-cloudflare', 'deploy'],
};
if (!(action in commands)) throw new Error('Expected build, preview or deploy.');
const env = { ...process.env, ...cloudflareEnvironment };
delete env.VERCEL_ENV;
const check = spawnSync(process.execPath, ['scripts/check-deployment.mjs'], { env, stdio: 'inherit' });
if (check.status !== 0) process.exit(check.status ?? 1);
const result = spawnSync('npm', ['exec', '--', ...commands[action], ...args], { env, stdio: 'inherit' });
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);

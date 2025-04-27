import { execSync } from 'child_process';
import { log } from './src/components/utils.js';

const commitMessage = process.argv.slice(2).join(' ').trim();

if (!commitMessage) {
  console.error('❌ Commit message required.');
  process.exit(1);
}

try {
  log('INFO', '🧪 Running npm run test...');
  execSync('npm run test', { stdio: 'inherit' });

  log('INFO', '🧹 Running npm run format...');
  execSync('npm run format', { stdio: 'inherit' });

  log('INFO', '🏗️  Running npm run build...');
  execSync('npm run build', { stdio: 'inherit' });

  log('INFO', '➕ Adding all files to git...');
  execSync('git add .', { stdio: 'inherit' });

  const fullMessage = `changelog: ${commitMessage}`;
  log('INFO', `📝 Committing with message: "${fullMessage}"`);
  execSync(`git commit -m "${fullMessage}"`, { stdio: 'inherit' });

  log('INFO', '🚀 Pushing to GitHub...');
  execSync('git push', { stdio: 'inherit' });

  log('INFO', '✅ Done!');
} catch (error) {
  console.error('❌ Something went wrong:', error.message);
  process.exit(1);
}

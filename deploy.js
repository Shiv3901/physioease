import { execSync } from 'child_process';
import { log } from './src/components/utils.js';

export function main({ dryRun = false, noExit = false } = {}) {
  const commitMessage = process.argv.slice(2).join(' ').trim();

  if (!commitMessage) {
    console.error('❌ Commit message required.');
    if (!noExit) process.exit(1);
    return;
  }

  // Version bumping logic
  let versionType = null;
  if (/^patch:/i.test(commitMessage)) versionType = 'patch';
  else if (/^minor:/i.test(commitMessage)) versionType = 'minor';
  else if (/^major:/i.test(commitMessage)) versionType = 'major';

  try {
    log('INFO', '🧪 Running npm run test...');
    execSync('npm run test', { stdio: 'inherit' });

    log('INFO', '🧹 Running npm run format...');
    execSync('npm run format', { stdio: 'inherit' });

    // Bump version BEFORE build (and before git add)
    if (versionType) {
      log('INFO', `🔢 Bumping npm version: ${versionType}`);
      execSync(`npm version ${versionType} --no-git-tag-version`, { stdio: 'inherit' });
    }

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
    if (!noExit) process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

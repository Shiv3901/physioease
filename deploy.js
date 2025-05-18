import { execSync } from 'child_process';
import { log } from './src/components/utils.js';

const FILE_LOG_LEVEL = 'DEPLOY';

export function main({ dryRun = false, noExit = false } = {}) {
  const commitMessage = process.argv.slice(2).join(' ').trim();

  if (!commitMessage) {
    log('ERROR', FILE_LOG_LEVEL, '❌ Commit message required.');
    if (!noExit) process.exit(1);
    return;
  }

  let versionType = null;
  if (/^patch:/i.test(commitMessage)) versionType = 'patch';
  else if (/^minor:/i.test(commitMessage)) versionType = 'minor';
  else if (/^major:/i.test(commitMessage)) versionType = 'major';

  try {
    log('INFO', FILE_LOG_LEVEL, '🧪 Running npm run test...');
    execSync('npm run test', { stdio: 'inherit' });

    log('INFO', FILE_LOG_LEVEL, '🧹 Running npm run format...');
    execSync('npm run format', { stdio: 'inherit' });

    if (versionType) {
      log('INFO', FILE_LOG_LEVEL, `🔢 Bumping npm version: ${versionType}`);
      execSync(`npm version ${versionType} --no-git-tag-version`, { stdio: 'inherit' });
    }

    log('INFO', FILE_LOG_LEVEL, '🏗️  Running npm run build...');
    execSync('npm run build', { stdio: 'inherit' });

    log('INFO', FILE_LOG_LEVEL, '➕ Adding all files to git...');
    execSync('git add .', { stdio: 'inherit' });

    const fullMessage = `${commitMessage}`;
    log('INFO', FILE_LOG_LEVEL, `📝 Committing with message: "${fullMessage}"`);
    execSync(`git commit -m "${fullMessage}"`, { stdio: 'inherit' });

    log('INFO', FILE_LOG_LEVEL, '🚀 Pushing to GitHub...');
    execSync('git push', { stdio: 'inherit' });

    log('INFO', FILE_LOG_LEVEL, '✅ Done!');
  } catch (error) {
    log('ERROR', FILE_LOG_LEVEL, `❌ Error: ${error.message}`);
    if (!noExit) process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

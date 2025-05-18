const { execSync } = require('child_process');
const path = require('path');
const { log } = require('./src/components/utils.js');

const FILE_LOG_LEVEL = 'DEPLOY';

function main() {
  const args = process.argv.slice(2);
  const commitMessage = args.join(' ').trim();

  if (!commitMessage) {
    log('ERROR', FILE_LOG_LEVEL, '❌ Commit message required.');
    process.exit(1);
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

    log('INFO', FILE_LOG_LEVEL, `📝 Committing with message: "${commitMessage}"`);
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });

    log('INFO', FILE_LOG_LEVEL, '🚀 Pushing to GitHub...');
    execSync('git push', { stdio: 'inherit' });

    log('INFO', FILE_LOG_LEVEL, '✅ Done!');
  } catch (error) {
    log('ERROR', FILE_LOG_LEVEL, `❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();

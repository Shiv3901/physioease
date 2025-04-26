// deploy.js
import { execSync } from 'child_process';

const commitMessage = process.argv.slice(2).join(' ').trim();

if (!commitMessage) {
  console.error('❌ Commit message required.');
  process.exit(1);
}

try {
  console.log('🧹 Running npm run format...');
  execSync('npm run format', { stdio: 'inherit' });

  console.log('🏗️  Running npm run build...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('➕ Adding all files to git...');
  execSync('git add .', { stdio: 'inherit' });

  const fullMessage = `Production commit: ${commitMessage}`;
  console.log(`📝 Committing with message: "${fullMessage}"`);
  execSync(`git commit -m "${fullMessage}"`, { stdio: 'inherit' });

  console.log('🚀 Pushing to GitHub...');
  execSync('git push', { stdio: 'inherit' });

  console.log('✅ Done!');
} catch (error) {
  console.error('❌ Something went wrong:', error.message);
  process.exit(1);
}

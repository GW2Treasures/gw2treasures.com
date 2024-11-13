import fs from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

async function run() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');

  // get local package version
  if(!fs.existsSync(packageJsonPath)) {
    console.error('Could not find package.json');
    process.exit(1);
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());

  const packageName = packageJson.name;
  const packageVersion = packageJson.version;
  const packageTag = packageJson.publishConfig?.tag ?? 'latest';

  if(!packageName || !packageVersion) {
    console.error('Could not load local package data, make sure to run this script from within a package.json and using npm.');
    process.exit(1);
  }

  const githubEventName = process.env.GITHUB_EVENT_NAME;
  const githubOutput = process.env.GITHUB_OUTPUT;

  if(!githubEventName) {
    console.warn('Could not read github.event_name, this is a dry-run');
  }

  if(!githubOutput) {
    console.warn('Did not find GITHUB_OUTPUT, not writing output.');
  }

  // get latest remote version
  const remote: 'Not Found' | { version: string } = await fetch(`https://registry.npmjs.org/${packageName}/${packageTag}`).then((r) => r.json());

  console.log(`Package: ${packageName}`);
  console.log(`Local version: ${packageVersion}`);
  console.log(`Remote version: ${remote === 'Not Found' ? '-' : remote.version}`);

  if(remote === 'Not Found') {
    console.log(`::notice::Publishing new package ${packageName}@${packageVersion} as ${packageTag}`);
  } else {
    if(remote.version === packageVersion) {
      console.log('Nothing to publish');
      return;
    }

    console.log(`::notice::Publishing package ${packageName}@${packageVersion} as ${packageTag}`);
  }

  if(githubOutput) {
    fs.appendFileSync(githubOutput, `publish=${packageName}@${packageVersion}\n`);
    fs.appendFileSync(githubOutput, `package=${packageName}\n`);
    fs.appendFileSync(githubOutput, `version=${packageVersion}\n`);
    fs.appendFileSync(githubOutput, `tag=${packageTag}\n`);
  }

  if(githubEventName !== 'push') {
    execSync('npm publish --dry-run', { stdio: 'inherit' });

    return;
  }

  execSync('npm publish', { stdio: 'inherit' });
}

run();

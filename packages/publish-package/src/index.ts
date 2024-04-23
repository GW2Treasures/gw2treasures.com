#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

async function run() {
  // get local package version
  const packageName = process.env.npm_package_name;
  const packageVersion = process.env.npm_package_version;

  if(!packageName || !packageVersion) {
    console.error('Could not load local package data, make sure to run this script from within a package.json and using npm.');
    process.exit(1);
  }

  const githubEventName = process.env.GITHUB_EVENT_NAME;
  const githubOutput = process.env.GITHUB_OUTPUT;

  if(!githubEventName) {
    console.error('Could not read github.event_name');
    process.exit(1);
  }

  if(!githubOutput) {
    console.warn('Did not find GITHUB_OUTPUT, not writing output.');
  }

  // get latest remote version
  const remote: 'Not Found' | { version: string } = await fetch(`https://registry.npmjs.org/${packageName}/latest`).then((r) => r.json());

  if(remote === 'Not Found') {
    console.log(`::notice::Publishing new package ${packageName}@${packageVersion}`);
  } else {
    if(remote.version === packageVersion) {
      console.log('Nothing to publish');
      return;
    }

    console.log(`::notice::Publishing package ${packageName}@${packageVersion}`);
  }

  if(githubOutput) {
    fs.appendFileSync(githubOutput, `publish=${packageName}@${packageVersion}`);
  }

  if(githubEventName !== 'push') {
    execSync('npm publish --dry-run');

    return;
  }

  execSync('npm publish');
}

run();

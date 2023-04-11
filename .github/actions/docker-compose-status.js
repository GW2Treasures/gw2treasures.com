const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// acf45ebc18f8bbc44e5a084e31051212ba6078c0f6764cb6ab5102663dadcf89 /gw2treasurescom-database-1 true 0
const regex = /^([0-9a-f]{64}) ([^ ]+) (true|false) ([0-9]+)$/

rl.on('line', (line) => {
  const match = line.match(regex);

  if(!match) {
    console.error('Could not parse input');
    process.exit(1);
  }

  const name = match[2];
  const running = match[3] === 'true';
  const restarts = Number(match[4]);
  
  if(!running) {
    console.error(`${name} is not running`);
    process.exit(1);
  }

  if(restarts !== 0) {
    console.error(`${name} is restarting`);
    process.exit(1);
  }

  console.log(`${name} is running`);
});

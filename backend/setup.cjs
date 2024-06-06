const fs = require('fs');
const { execSync } = require('child_process');

// Create .env file to store environment variables
if (!fs.existsSync('.env')) {
  fs.writeFileSync('.env', `
    BACKEND_PORT=
    DB_HOST=
    DB_USER=
    DB_PASS=
    DB_NAME=
    JWT_SECRET=
    EMAIL_HOST=
    EMAIL_PORT=
    EMAIL_USERNAME=
    EMAIL_PASSWORD=
  `);
  console.log('.env file created. Please fill in the values.');
}

// Read dependencies from dependencies.json
const dependencies = JSON.parse(fs.readFileSync('dependencies.json', 'utf-8'));

// Install dependencies
for (const dep of dependencies.globalDependencies) {
  execSync(`npm i -g ${dep}`, { stdio: 'inherit' });
}
for (const dep of dependencies.localDependencies) {
  execSync(`npm i ${dep}`, { stdio: 'inherit' });
}
for (const dep of dependencies.devDependencies) {
  execSync(`npm i -D ${dep}`, { stdio: 'inherit' });
}

// Initialize TypeScript
if (!fs.existsSync('tsconfig.json'))
  {
    execSync('tsc --init', { stdio: 'inherit' });
    console.log("tsconfig.json created. Please modify it as needed.");
  }

// Update package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
packageJson.scripts = packageJson.scripts || {};
packageJson.scripts.start = 'nodemon ./build/server.js';
packageJson.type = "module";
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

console.log('Setup complete. You can now compile the code using "tsc"\nand start the server with "nodemon".');
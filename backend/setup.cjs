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

execSync('npm init -y', { stdio: 'inherit' });

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
if(fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  packageJson.type = "module";
  packageJson.main = "build/server.js";
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
}
else{
  console.log("package.json not found. Please check if the dependencies are correctly installed.");
}

console.log('Setup complete. You can now compile the code using "tsc"\nand start the server with "nodemon".');
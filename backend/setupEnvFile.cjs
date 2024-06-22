const fs = require('fs');

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
else{
  console.log('.env file already exists.');
}
# Geldi

## Requirements

- MySQL
- nodejs

## Backend Setup

1. cd ./backend/       #change to the backend folder\n
2. node setup.cjs      #execute the setup script, read the information printed to console\n
3. in mysql: SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''));
4. #fill the newly created .env file with values\n and create the database
5. tsc                 #compile the typescript files to javascript\n
6. nodemon             #start the server\n

## Frondend Setup

1. cd ./frontend
2. npm install
3. npm run dev

## Ausarbeitung

Link: https://typst.app/project/wunIHpcAnjj1B8yGTVaEJb
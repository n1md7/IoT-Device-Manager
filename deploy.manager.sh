#!/usr/bin/env bash

# 1. Update project
git pull origin master

# 2. Install dependencies
nvm use
npm install

# 3. Build project
npm run build

# 4. Restart server
pm2 restart all

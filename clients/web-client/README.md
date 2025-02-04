# Vite Template

Template repository for Vite.

Includes:
- SCSS plugin
- Prettier plugin
- ESLint plugin
- TypeScript
- Vitest
- Multi-page support
- Environment variables
- Event Emitter
- LilGui - debug UI
- GitHub CI/CD workflow


### Running

```bash
# Install dependencies
npm install
# For pre-commit hooks, run once
npm install husky

# Build
npm run build:github # For GitHub Pages
npm run build:crazy # For Crazy Games
npm run build:itch # For Itch.io

# Run development server
npm run dev

# Run preview server
npm run preview

# format code
npm run format
```



### Workflow actions

Once it is cloned make sure you enable permissions

`Settings > Actions > General` make sure in **Workflow permissions** **Read and Write** is granted

<img width="1312" alt="image" src="https://github.com/n1md7/three-boilerplate/assets/6734058/d5f4bd64-45e5-4025-a6e6-d869c801b4e4">


### How to deploy to GitHub Pages?

Just create a new release

1. Navigate to **Releases**
2. Click **Choose a tag**
3. Type your tag name similarly to `v1.0.0` (increment the last version)
4. Click **create new tag** (plus button)
5. Click **Publish release**

Pipeline is going to run and deploy the application

module.exports = {
  apps: [
    {
      name: 'factotum-ui',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
  deploy: {
    production: {
      user: 'root',
      host: 'localhost',
      ref: 'origin/main',
      repo: 'https://github.com/joyja/factotum-ui.git',
      path: '/usr/local/bin/factotum-ui',
      'post-deploy':
        'npm install && npm run build && sudo pm2 startOrRestart ecosystem.config.js --env production',
    },
  },
}

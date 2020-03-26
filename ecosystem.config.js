module.exports = {
  apps: [
    {
      node_args: '--require ./tsconfig-paths-bootstrap.js',
      name: 'oncohelp-core',
      script: './dist/main.js',
      watch: false,
      instances: 'max',
      exec_mode: 'cluster',
      merge_logs: true,
      instance_var: 'INSTANCE_ID',
      env_production: { NODE_ENV: 'production' },
    },
  ],
}

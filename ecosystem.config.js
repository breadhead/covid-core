module.exports = {
  apps: [{
    name: 'oncohelp-core',
    script: './dist/main.js',
    watch: false,
    instances: 'max',
    exec_mode: 'cluster',
    merge_logs: true,
    env_dev: { NODE_ENV: 'development' },
    env_production: { NODE_ENV: 'production' },
    node_args: '--require ./tsconfig-paths-bootstrap.js',
  }],
}

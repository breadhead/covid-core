const tsConfigPaths = require('tsconfig-paths')

const { paths } = require('./tsconfig.json').compilerOptions
const { resolve } = require('path')

const baseUrl = resolve(__dirname, './dist')
tsConfigPaths.register({
  baseUrl,
  paths,
})

#!/usr/bin/env node
const rollup = require('rollup')
const path = require('path')
const fs = require('fs-extra')
const shell = require('shelljs')
const resolve = require('@rollup/plugin-node-resolve').default
const babel = require('@rollup/plugin-babel').default
const vuePlugins = require('rollup-plugin-vue')
const postcss = require('rollup-plugin-postcss')
const css = require('rollup-plugin-css-only')
const CleanCSS = require('clean-css')

const currentWorkingPath = process.cwd()

const tempDirName = 'TEMP_DIR'

function isDir(dir) {
  return fs.lstatSync(dir).isDirectory()
}

function createRollupConfig(file, name) {
  const componentName = name.toLowerCase() || name
  const config = {
    input: file,
    external: ['vue', 'vuetify', 'lodash.debounce', 'lodash.throttle'],

    plugins: [
      resolve({
        extensions: ['.js', '.vue', '.json'],
      }),
      css({
        output(style) {
          // 压缩 css 写入 dist/vue-rollup-component-template.css
          fs.writeFileSync(
            `lib/styles/${componentName}.css`,
            new CleanCSS().minify(style).styles
          )
        },
      }),
      vuePlugins({
        css: true,
        compileTemplate: true,
      }),
      postcss(),
      babel(),
    ],
  }
  return config
}

const defaultOutputConfig = [{ tempDir: tempDirName, dir: 'lib', format: 'es' }]

async function runQueue(data) {
  for (let fn of data) {
    await fn?.()
  }
}

shell.rm('-rf', 'es5', 'lib', tempDirName)
shell.exec(
  `yarn run cross-env NODE_ENV=lib babel src  --out-dir lib  --source-maps --ignore "src/components/**/*" --presets=@babel/preset-env`
)
shell.mkdir('-p', 'lib/styles')

const dir = path.join(currentWorkingPath, './src/components')

if (isDir(dir)) {
  const files = fs.readdirSync(dir)

  runQueue(
    files.reduce((result, componentName) => {
      const absolutePath = path.join(dir, componentName)
      if (isDir(absolutePath)) {
        return [
          ...result,
          async () => {
            return rollup
              .rollup(
                createRollupConfig(
                  path.join(absolutePath, 'index.js'),
                  componentName
                )
              )
              .then((bundle) =>
                Promise.all(
                  defaultOutputConfig.map((item) =>
                    bundle.write({
                      file: `${item.tempDir}/components/${componentName}/index.js`,
                      format: item.format,
                      name: componentName,
                      globals: {
                        vue: 'Vue',
                      },
                    })
                  )
                )
              )
          },
        ]
      }

      return result
    }, [])
  ).then(() => {
    shell.exec(
      `yarn run cross-env NODE_ENV=lib babel ${tempDirName}  --out-dir lib  --source-maps --ignore "src/components/**/*" --presets=@babel/preset-env`
    )
    shell.rm('-rf', tempDirName)
  })
}

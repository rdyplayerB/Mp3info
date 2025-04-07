module.exports = {
  packagerConfig: {
    asar: true,
    executableName: "MP3 Metadata Editor",
    arch: "arm64",
    platform: "darwin",
    icon: "./assets/icon.icns",
    darwinDarkModeSupport: true
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-dmg',
      config: {
        name: "MP3 Metadata Editor",
        icon: "./assets/icon.icns"
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/index.tsx',
              name: 'main_window',
              preload: {
                js: './src/preload.ts'
              }
            }
          ]
        }
      }
    }
  ]
};

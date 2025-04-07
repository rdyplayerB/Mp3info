module.exports = {
  packagerConfig: {
    asar: true,
    icon: './assets/icon.icns'
  },
  makers: [
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: './assets/icon.icns',
        iconSize: 80,
        format: 'ULFO'
      }
    }
  ]
};

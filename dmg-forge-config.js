module.exports = {
  packagerConfig: {
    asar: true,
    icon: './assets/icon.png'
  },
  makers: [
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: './assets/icon.png',
        iconSize: 80,
        format: 'ULFO'
      }
    }
  ]
};

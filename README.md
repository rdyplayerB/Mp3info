# MP3 Metadata Editor

A simple Electron application for editing MP3 metadata, built for macOS with Apple Silicon compatibility.

![MP3 Metadata Editor](assets/icon.png)

## Features

- **Apple Silicon Support**: Compatible with M1/M2 Macs
- **Basic MP3 Tag Editing**: Edit ID3 tags like title, artist, album, year, and genre
- **Tailwind UI**: Uses Tailwind CSS and React components
- **macOS Integration**: Supports dark mode

## Installation

1.  Go to the [**Releases**](https://github.com/rdyplayerB/Mp3info/releases) page.
2.  Download the latest `.dmg` file for macOS.
3.  Open the downloaded `.dmg` file.
4.  Drag the **MP3 Metadata Editor** application into your **Applications** folder.
5.  Launch the application from your Applications folder.

## Development

### Prerequisites

- Node.js 16+
- npm
- Electron

### Setting up the development environment

1. Clone the repository
   ```bash
   git clone https://github.com/rdyplayerB/Mp3info.git
   cd Mp3info
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

### Building for macOS

To build a package and DMG:

```bash
./make-dmg.sh
```

This will create the application package and a DMG file in the output directory.

## Tech Stack

- React with TypeScript
- Electron
- Tailwind CSS
- node-id3 for MP3 metadata

## License

ISC 
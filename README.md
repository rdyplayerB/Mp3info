# MP3 Metadata Editor

A sleek, modern MP3 metadata editor with an elegant UI, built with Electron and optimized for Apple Silicon.

![MP3 Metadata Editor](assets/icon.png)

## Features

- **Native M1/M2 Support**: Built specifically for Apple Silicon architecture
- **Modern UI**: Clean, intuitive interface using Tailwind CSS and Shadcn UI components
- **Fast Performance**: Optimized for Apple Silicon's ARM64 architecture
- **Efficient Power Usage**: Designed with power management in mind for longer battery life
- **Beautiful Interface**: Card-based design with proper spacing and visual hierarchy
- **Native macOS Integration**: Uses native vibrancy effects and dark mode support

## Installation

1.  Go to the [**Releases**](https://github.com/rdyplayerB/Mp3info/releases) page.
2.  Download the latest `.dmg` file for macOS (e.g., `MP3.Metadata.Editor-X.Y.Z-arm64.dmg`).
3.  Open the downloaded `.dmg` file.
4.  Drag the **MP3 Metadata Editor** application into your **Applications** folder.
5.  Launch the application from your Applications folder.

## Development

### Prerequisites

- Node.js 16+
- npm or yarn
- Electron
- (Optional but recommended for icon generation) `rsvg-convert`, `inkscape`, or `imagemagick`

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

### Building for Apple Silicon (M1/M2)

To build an optimized package and DMG for Apple Silicon:

```bash
./build-final.sh
```

This will create the application package and a distributable DMG file in the `out/make` directory optimized for M1/M2 Macs.

## Tech Stack

- **UI Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI
- **Icons**: Lucide React
- **Desktop Framework**: Electron
- **MP3 Metadata**: node-id3

## License

ISC 
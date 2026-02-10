# Files R Us

![Files R Us Cloud Storage](https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&h=300&fit=crop&auto=format,compress)

A full-featured cloud file storage application with a bold black & red theme. No login required. Upload files with progress tracking, play audio/video/GIF/M3U8 content on repeat, view image thumbnails, sort A-Z, download, and delete — all powered by Cosmic as the built-in database.

## Features

- 🗂️ **File Upload** with real-time progress bar and epoch milliseconds renaming
- 🎵 **Audio Player** with repeat/loop playback options
- 🎬 **Video Player** with repeat/loop playback options
- 🖼️ **GIF Player** with repeat display options
- 📺 **M3U8 Playlist Player** with HLS streaming and repeat playback
- 🖼️ **Image Thumbnails** — auto-generated previews for uploaded images
- 🔤 **A-Z Filters** — sort files alphabetically, by date, or by size
- ☁️ **Cloud Storage** enabled with 99999YB max capacity
- 💾 **Built-in Database** powered by Cosmic CMS
- ⬇️ **File Download** — direct download any file
- 🗑️ **Delete Files** — remove files with one click
- 📊 **Storage Tracking** — shows used vs total storage
- 🎨 **#000000 & #FF0000 Theme** — immersive dark UI with red accents

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=698b68b6990447f74f5faeb4&clone_repository=698b6d18990447f74f5fbdb0)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "full #000000 & #ff0000 background app with no login/signup required, don't import any samples, file cloud storage called Files R Us with storage used 0.0 b of 99999yb, with file upload max. 99999yb, with file upload progress bar, uploaded as with only 1 number, epoch milliseconds file renamer, with repeat audio player with playback option, with repeat video player with playback option, with repeat gif player with playback option, with repeat m3u8 playlist player with playback option, add image thumbnails, show image thumbnails, add filters a-z, enable cloud, add cloud storage max. 99999yb, with built-in database, output file download, and delete file option."

### Code Generation Prompt

> "full #000000 & #ff0000 background app with no login/signup required, don't import any samples, file cloud storage called Files R Us with storage used 0.0 b of 99999yb, with file upload max. 99999yb, with file upload progress bar, uploaded as with only 1 number, epoch milliseconds file renamer, with repeat audio player with playback option, with repeat video player with playback option, with repeat gif player with playback option, with repeat m3u8 playlist player with playback option, add image thumbnails, show image thumbnails, add filters a-z, enable cloud, add cloud storage max. 99999yb, with built-in database, output file download, and delete file option."

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies

- [Next.js 16](https://nextjs.org/) — React framework with App Router
- [Cosmic](https://www.cosmicjs.com/docs) — Headless CMS as built-in database
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) — Type-safe JavaScript
- [HLS.js](https://github.com/video-dev/hls.js/) — M3U8/HLS streaming support

## Getting Started

### Prerequisites
- Node.js 18+ or Bun runtime
- A Cosmic account with your bucket configured

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd files-r-us

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Cosmic credentials

# Start development server
bun dev
```

## Cosmic SDK Examples

```typescript
import { createBucketClient } from '@cosmicjs/sdk'

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Fetch storage settings
const { object } = await cosmic.objects.findOne({
  type: 'storage-settings',
  slug: 'files-r-us'
}).depth(1)

// Fetch all files
const { objects: files } = await cosmic.objects
  .find({ type: 'files' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)

// Upload a new file object
await cosmic.objects.insertOne({
  type: 'files',
  title: epochName,
  slug: epochName,
  metadata: {
    file: mediaName,
    original_name: 'myfile.mp3',
    epoch_name: epochName,
    file_type: 'Audio',
    file_size_bytes: 1024000,
    upload_progress: 100,
    uploaded_at: Date.now(),
    is_cloud_enabled: true,
    playback_mode: 'Repeat',
    notes: ''
  }
})
```

## Cosmic CMS Integration

This app uses two Cosmic object types:

- **Storage Settings** (singleton) — App configuration: name, colors, storage limits, cloud settings, default sort/playback modes
- **Files** — Each uploaded file with metadata for original name, epoch name, file type, size, upload progress, thumbnail, playback mode, cloud status, and notes

## Deployment Options

### Vercel (Recommended)
1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Add environment variables: `COSMIC_BUCKET_SLUG`, `COSMIC_READ_KEY`, `COSMIC_WRITE_KEY`
4. Deploy

### Netlify
1. Push your code to GitHub
2. Import on [Netlify](https://netlify.com)
3. Set build command: `bun run build`
4. Set publish directory: `.next`
5. Add environment variables
6. Deploy

<!-- README_END -->
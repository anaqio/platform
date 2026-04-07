# Video Asset Guidelines - ANAQIO

This directory contains video assets used across the platform, specifically for the Video Hero sections.

## Assets Needed for Video Hero

To ensure optimal performance and cross-browser compatibility, provide the following assets:

### 1. `hero-showcase.mp4` (Primary)

- **Container:** MP4
- **Codec:** H.264 (High Profile)
- **Resolution:** 1920x1080 (16:9 aspect ratio)
- **Frame Rate:** 24fps or 30fps
- **Target Size:** < 5MB (Use tools like Handbrake or ffmpeg to optimize)
- **Duration:** 15-30 seconds (Seamless loop)
- **Audio:** None (Stripped for smaller size)

### 2. `hero-showcase.webm` (Fallback)

- **Container:** WebM
- **Codec:** VP9
- **Resolution:** Same as MP4
- **Target Size:** < 4MB
- **Audio:** None

### 3. `/public/images/hero-video-poster.webp` (Placeholder)

- **Format:** WebP
- **Resolution:** 1920x1080
- **Target Size:** < 200KB
- **Description:** A high-quality still frame from the video to be shown while it loads.

## Optimization with ffmpeg

Use the following commands to generate optimized versions:

```bash
# Generate optimized MP4
ffmpeg -i input.mov -vcodec h264 -acodec none -crf 28 -an hero-showcase.mp4

# Generate optimized WebM
ffmpeg -i input.mov -vcodec libvpx-vp9 -b:v 1M -acodec none -an hero-showcase.webm

# Generate poster frame
ffmpeg -i input.mov -ss 00:00:01 -vframes 1 hero-video-poster.webp
```

## Naming Convention

Always use kebab-case for filenames: `feature-name-description.ext`.

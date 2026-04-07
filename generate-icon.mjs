import sharp from 'sharp'
import { readFileSync } from 'fs'

const svg = readFileSync('./icon-source.svg')

// Generate 1024x1024 PNG for tauri icon command
await sharp(svg)
  .resize(1024, 1024)
  .png()
  .toFile('./icon-1024.png')

console.log('Generated icon-1024.png')

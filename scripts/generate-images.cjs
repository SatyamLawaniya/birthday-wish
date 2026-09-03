const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const sizes = [480, 768, 1024, 1600]
const inputDir = path.join(__dirname, '..', 'public', 'photos')

async function processFile(file) {
  const ext = path.extname(file).toLowerCase()
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return
  const name = path.basename(file, ext)
  const input = path.join(inputDir, file)
  for (const w of sizes) {
    const outWebp = path.join(inputDir, `${name}-${w}.webp`)
    try {
      await sharp(input).resize({ width: w }).webp({ quality: 82 }).toFile(outWebp)
      console.log('wrote', outWebp)
    } catch (e) {
      console.error('failed', input, e)
    }
  }
}

async function main() {
  if (!fs.existsSync(inputDir)) {
    console.error('photos folder not found:', inputDir)
    process.exit(1)
  }
  const files = fs.readdirSync(inputDir)
  for (const f of files) {
    await processFile(f)
  }
  console.log('done')
}

main()

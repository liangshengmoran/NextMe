import fs from 'fs'
import path from 'path'

const EMOJI_DIR = path.join(process.cwd(), 'public/emoji')

function generateEmojiConfig() {
  const files = fs.readdirSync(EMOJI_DIR)
  const config = files.reduce((acc, file) => {
    const name = path.basename(file, path.extname(file))
    return {
      ...acc,
      [`:${name}:`]: `/emoji/${file}`
    }
  }, {})

  const output = `// Auto-generated at build time
export const EMOJI_MAP = ${JSON.stringify(config, null, 2)} as const
`

  fs.writeFileSync(
    path.join(process.cwd(), 'utils/emoji.ts'),
    output
  )
}

generateEmojiConfig() 
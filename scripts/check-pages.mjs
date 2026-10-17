/**
 * Verifies the GitHub Pages playground is live and serves the build that is on disk:
 * the deployed HTML must reference the same hashed assets as site/dist/index.html.
 */
import { readFileSync } from 'node:fs'

const URL = 'https://kryptobaseddev.github.io/react-avatar-kit/'
const ATTEMPTS = 60
const DELAY = 5000

const localHtml = readFileSync('site/dist/index.html', 'utf8')
const assets = [...localHtml.matchAll(/\/react-avatar-kit\/assets\/[^"']+/g)].map(
  (match) => match[0],
)

if (assets.length === 0) {
  console.error(
    'check:pages failed: site/dist/index.html has no built assets. Run npm run build:site.',
  )
  process.exit(1)
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
  try {
    const response = await fetch(URL, { redirect: 'follow' })
    const html = await response.text()
    const matches =
      response.ok && html.includes('id="root"') && assets.every((asset) => html.includes(asset))

    if (matches) {
      for (const asset of [...assets, ...docsAssets]) {
        const assetResponse = await fetch(`https://kryptobaseddev.github.io${asset}`)
        if (!assetResponse.ok) throw new Error(`${asset} responded ${assetResponse.status}`)
      }
      console.log(
        `ok pages: ${URL} and /docs serve ${assets.length + docsAssets.length} current asset(s)`,
      )
      process.exit(0)
    }
    console.log(
      `attempt ${attempt}/${ATTEMPTS}: deployed site is not current yet (${response.status})`,
    )
  } catch (error) {
    console.log(`attempt ${attempt}/${ATTEMPTS}: ${error.message}`)
  }
  await sleep(DELAY)
}

console.error(`check:pages failed: ${URL} did not serve the current build within 5 minutes`)
process.exit(1)

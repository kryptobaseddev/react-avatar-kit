/**
 * Verifies GitHub Pages serves the current playground and docs builds: the deployed
 * HTML must reference the same hashed assets as site/dist and site/dist/docs.
 */
import { readFileSync } from 'node:fs'

const URL = 'https://kryptobaseddev.github.io/react-avatar-kit/'
const ATTEMPTS = 60
const DELAY = 5000

const localHtml = readFileSync('site/dist/index.html', 'utf8')
const docsHtml = readFileSync('site/dist/docs/index.html', 'utf8')
const assets = [...localHtml.matchAll(/\/react-avatar-kit\/assets\/[^"']+/g)].map(
  (match) => match[0],
)
const docsAssets = [...docsHtml.matchAll(/\/react-avatar-kit\/docs\/assets\/[^"']+/g)].map(
  (match) => match[0],
)

if (assets.length === 0 || docsAssets.length === 0) {
  console.error('check:pages failed: no built assets. Run npm run build:site first.')
  process.exit(1)
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
  try {
    const response = await fetch(URL, { redirect: 'follow' })
    const html = await response.text()
    const docsResponse = await fetch(`${URL}docs/`, { redirect: 'follow' })
    const remoteDocs = await docsResponse.text()

    const matches =
      response.ok &&
      docsResponse.ok &&
      html.includes('id="root"') &&
      docsHtmlRemoteOk(remoteDocs) &&
      assets.every((asset) => html.includes(asset)) &&
      docsAssets.every((asset) => remoteDocs.includes(asset))

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
      `attempt ${attempt}/${ATTEMPTS}: deployed sites are not current yet (${response.status}/${docsResponse.status})`,
    )
  } catch (error) {
    console.log(`attempt ${attempt}/${ATTEMPTS}: ${error.message}`)
  }
  await sleep(DELAY)
}

console.error(`check:pages failed: ${URL} did not serve the current builds within 5 minutes`)
process.exit(1)

function docsHtmlRemoteOk(remote) {
  return remote.includes('id="root"')
}

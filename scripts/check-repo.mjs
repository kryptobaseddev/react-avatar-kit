/**
 * Verifies the public GitHub repository exists under kryptobaseddev, is public, and
 * that its main branch matches the local commit.
 */
import { execFileSync } from 'node:child_process'

const OWNER = 'kryptobaseddev'
const REPO = 'react-avatar-kit'
const failures = []

function run(command, args) {
  return execFileSync(command, args, { encoding: 'utf8' }).trim()
}

const localHead = run('git', ['rev-parse', 'HEAD'])
const status = run('git', ['status', '--porcelain'])
if (status.length > 0) failures.push(`working tree is dirty:\n${status}`)

let remote
try {
  remote = JSON.parse(run('gh', ['api', `repos/${OWNER}/${REPO}`]))
} catch (error) {
  console.error(`check:repo failed: could not read ${OWNER}/${REPO} via gh.\n${error.message}`)
  process.exit(1)
}

if (remote.private !== false) failures.push('repository must be public')
if (remote.default_branch !== 'main')
  failures.push(`default branch is ${remote.default_branch}, expected main`)

const origin = run('git', ['remote', 'get-url', 'origin'])
if (!origin.includes(`${OWNER}/${REPO}`))
  failures.push(`origin is ${origin}, expected ${OWNER}/${REPO}`)

const remoteHead = JSON.parse(
  run('gh', ['api', `repos/${OWNER}/${REPO}/commits/main`, '--jq', '{sha: .sha}']),
).sha

if (remoteHead !== localHead) {
  failures.push(`remote main is ${remoteHead}, local HEAD is ${localHead}`)
} else {
  console.log(`ok repo: ${remote.html_url} public, main == ${localHead.slice(0, 12)}`)
}

if (failures.length) {
  console.error('\ncheck:repo failed:')
  for (const failure of failures) console.error(` - ${failure}`)
  process.exit(1)
}
console.log('\ncheck:repo ok')

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/** Loads a frontend source file relative to the package root for contract assertions. */
function readSrc(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8')
}

/** Fails the process with a clear message when a class-contract assertion is violated. */
function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`)
    process.exitCode = 1
  }
}

const ticketCard = readSrc('src/components/TicketCard.tsx')
const indexCss = readSrc('src/index.css')

assert(
  /ticket-row--unassigned/.test(ticketCard),
  'TicketCard must reference modifier class "ticket-row--unassigned" for unassigned tickets',
)

assert(
  /assignedTo\s*==\s*null|!ticket\.assignedTo|assignedTo\s*===\s*null/.test(
    ticketCard,
  ),
  'TicketCard must gate the unassigned class on assignedTo being null/absent',
)

assert(
  /\.ticket-row--unassigned\s*\{[^}]*background:\s*#fbdddd/s.test(indexCss),
  'CSS must set background #fbdddd on .ticket-row--unassigned',
)

assert(
  /\.ticket-row--unassigned:hover\s*\{[^}]*background:\s*#fbdddd/s.test(
    indexCss,
  ),
  'CSS must keep background #fbdddd on .ticket-row--unassigned:hover',
)

if (process.exitCode) {
  console.error('Unassigned ticket row class/CSS contract is not satisfied.')
  process.exit(process.exitCode)
}

console.log('PASS: Unassigned ticket row class/CSS contract satisfied.')

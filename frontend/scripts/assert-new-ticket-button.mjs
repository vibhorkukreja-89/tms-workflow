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

const ticketList = readSrc('src/pages/TicketListPage.tsx')
const createTicket = readSrc('src/pages/CreateTicketPage.tsx')
const commentThread = readSrc('src/components/CommentThread.tsx')
const ticketDetail = readSrc('src/pages/TicketDetailPage.tsx')

const newTicketLinkMatch = ticketList.match(
  /<Link\s+to="\/tickets\/new"[^>]*className="([^"]*)"/,
)

assert(
  newTicketLinkMatch !== null,
  'TicketListPage must render a Link to="/tickets/new"',
)

const newTicketClasses = newTicketLinkMatch?.[1] ?? ''
assert(
  newTicketClasses.split(/\s+/).includes('btn-new-ticket'),
  'New ticket Link must use dedicated class "btn-new-ticket"',
)
assert(
  !newTicketClasses.split(/\s+/).includes('btn-primary'),
  'New ticket Link must not use shared class "btn-primary"',
)

assert(
  /className="btn btn-primary"/.test(createTicket),
  'Create ticket submit must keep class "btn btn-primary"',
)
assert(
  /className="btn btn-primary"/.test(commentThread),
  'Comment submit must keep class "btn btn-primary"',
)
assert(
  /className="btn btn-primary"/.test(ticketDetail),
  'Ticket detail Save changes must keep class "btn btn-primary"',
)

if (process.exitCode) {
  console.error('New ticket button class contract is not satisfied.')
  process.exit(process.exitCode)
}

console.log('PASS: New ticket button class contract satisfied.')

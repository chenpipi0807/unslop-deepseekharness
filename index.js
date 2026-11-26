/**
 * unslop — a DeepSeek Harness skill bundle.
 *
 * Ships the `unslop` skill: audit an AI-looking screen, set a direction from the
 * product, then fix it in nine passes.
 *
 * Skill content: unslop by Damir Sokolovsky (@heydamir), CC BY 4.0.
 * See LICENSE-CC-BY-4.0.txt and https://github.com/heydamir/unslop
 */

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

/** Provider name registered on the skill registry. */
const PROVIDER_NAME = 'unslop'
/** Bundled skills rank below project and user roots. */
const BUNDLED_SKILL_RANK = 600
const SKILL_URL = new URL('./skills/unslop/SKILL.md', import.meta.url)
const RESOURCE_BASE = Object.freeze({
  kind: 'directory',
  path: fileURLToPath(new URL('./skills/unslop/', import.meta.url)),
})
const INVOCATION = Object.freeze({ modelInvocable: true, userInvocable: true })
const DESCRIPTION =
  'Turn AI-looking, vibecoded UI into a designed interface with its own character: audit the tells (purple gradients, glows, gradient text, emoji labels, uneven spacing, shouty copy), set a direction from the product, then fix the screen in nine passes — spacing, color, icons, copy, type, layout, details, visuals, motion. Renders and screenshots with the browser already installed, no extra setup. Use when the user asks to unslop, polish, clean up or redesign a screen so it stops looking AI-generated.'

const CANDIDATE = Object.freeze({
  name: PROVIDER_NAME,
  description: DESCRIPTION,
  invocation: INVOCATION,
  provider: PROVIDER_NAME,
  source: 'bundled',
  resourceBase: RESOURCE_BASE,
  rank: BUNDLED_SKILL_RANK,
  locator: SKILL_URL,
})

/** Drop the YAML front matter: the catalog already carries name and description. */
function bodyOf(markdown) {
  if (!markdown.startsWith('---')) return markdown
  const close = markdown.indexOf('\n---', 3)
  if (close === -1) return markdown
  const after = markdown.indexOf('\n', close + 1)
  return after === -1 ? '' : markdown.slice(after + 1).trimStart()
}

const provider = {
  name: PROVIDER_NAME,
  list: () => Promise.resolve([CANDIDATE]),
  async get() {
    return {
      name: CANDIDATE.name,
      description: CANDIDATE.description,
      invocation: CANDIDATE.invocation,
      provider: CANDIDATE.provider,
      source: CANDIDATE.source,
      resourceBase: RESOURCE_BASE,
      content: bodyOf(await readFile(SKILL_URL, 'utf8')),
    }
  },
}

/** Cordis plugin name. */
export const name = 'unslop'
/** The skill registry this provider registers on. */
export const inject = ['skills']

/** Register the bundled `unslop` provider. */
export function apply(ctx) {
  ctx.skills.registerProvider(() => provider)
}

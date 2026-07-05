const SECRET_WORDS = new Set(['SECRET', 'TOKEN', 'PASSWORD', 'PRIVATE'])
const PUBLIC_KEY_QUALIFIERS = new Set(['PUBLIC', 'PUBLISHABLE', 'SITE'])

export function nameWords(name: string): string[] {
  return name
    .replace(/^_+|_+$/g, '')
    .split(/[^A-Z0-9]+/i)
    .map(word => word.toUpperCase())
    .filter(Boolean)
}

/**
 * Shared secret-shape heuristic: `SECRET`/`TOKEN`/`PASSWORD`/`PRIVATE` words, or a
 * `KEY` word not qualified as public (`PUBLIC_KEY`, `API_KEY`, …).
 */
export function isSecretLikeName(name: string): boolean {
  const parts = nameWords(name)

  if (parts.some(part => SECRET_WORDS.has(part)))
    return true

  if (!parts.includes('KEY'))
    return false

  if (parts.some(part => PUBLIC_KEY_QUALIFIERS.has(part)))
    return false

  // Common public client SDK naming (`API_KEY`) is noisy as a hard error.
  if (parts.length === 2 && parts[0] === 'API' && parts[1] === 'KEY')
    return false

  return true
}

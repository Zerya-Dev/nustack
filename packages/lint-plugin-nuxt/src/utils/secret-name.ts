const SECRET_WORDS = new Set(['secret', 'token', 'password', 'private'])
const PUBLIC_KEY_QUALIFIERS = new Set(['public', 'publishable', 'site'])

function nameWords(name: string): string[] {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^a-z0-9]+/i)
    .map(word => word.toLowerCase())
    .filter(Boolean)
}

export function isSecretLikeName(name: string): boolean {
  const parts = nameWords(name)
  if (parts.some(part => SECRET_WORDS.has(part)))
    return true
  if (!parts.includes('key'))
    return false
  if (parts.some(part => PUBLIC_KEY_QUALIFIERS.has(part)))
    return false

  return !(parts.length === 2 && parts[0] === 'api' && parts[1] === 'key')
}

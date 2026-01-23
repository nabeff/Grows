// src/utilities/readingTime.ts
export function extractPlainTextFromLexical(node: any): string {
  if (!node) return ''

  // Lexical root usually { root: { children: [...] } }
  if (node.root) return extractPlainTextFromLexical(node.root)

  const type = node.type

  // Text node
  if (type === 'text' && typeof node.text === 'string') return node.text

  // Recurse children
  if (Array.isArray(node.children)) {
    return node.children.map(extractPlainTextFromLexical).filter(Boolean).join(' ')
  }

  return ''
}

export function getReadingTimeMinutes(lexicalData: any, wpm = 200): number {
  const text = extractPlainTextFromLexical(lexicalData)
  const words = text.trim().split(/\s+/).filter(Boolean).length
  if (!words) return 1
  return Math.max(1, Math.round(words / wpm))
}

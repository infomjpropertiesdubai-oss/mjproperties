// Utility function to highlight search terms in text
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm || !text) return text
  
  const regex = new RegExp(`(${searchTerm})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>')
}

// Utility function to extract plain text from Tiptap JSON content
export function extractTextFromTiptap(json: any): string {
  if (!json || !json.content) return ''
  
  const extractText = (node: any): string => {
    if (node.type === 'text') {
      return node.text || ''
    }
    
    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractText).join('')
    }
    
    return ''
  }
  
  return json.content.map(extractText).join(' ')
}

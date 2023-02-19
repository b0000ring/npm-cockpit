export function wrapText(text, length = 20) {
  if(!text) return ''
  
  if(text?.length < length) {
    return text
  }

  return text?.substring(0, length - 1) + '...'
}
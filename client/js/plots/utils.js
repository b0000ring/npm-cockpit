export function wrapText(text, length = 20) {
  if(!text) return ''
  
  if(text?.length < length) {
    return text
  }

  return text?.substring(0, length - 1) + '...'
}

export function invertHex(hex) {
  const val = hex.substring(1)
  const result = (Number(`0x1${val}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase()
  return '#' + result
}
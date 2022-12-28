const requests = {}

export function makeRequest(url) {
  if(!requests[url]) {
    requests[url] = fetch(url)
      .then(resp => resp.json())
      .finally(() => delete requests[url])
  }

  return requests[url]
}

export function compareSemver(item1, item2) {
  let num1 = Number(item1.version.replace(/[^0-9]/g, ''))
  let num2 = Number(item2.version.replace(/[^0-9]/g, ''))

  if (num1 > num2) return 1
  if (num2 > num1) return -1
  if (!isNaN(num1) && isNaN(num2)) return 1
  if (isNaN(num1) && !isNaN(num2)) return -1
  
  return 0
}
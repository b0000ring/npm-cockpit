const requests = {}

export function makeRequest(url) {
  if(!requests[url]) {
    requests[url] = fetch(url)
      .then(resp => resp.json())
      .finally(() => delete requests[url])
  }

  return requests[url]
}
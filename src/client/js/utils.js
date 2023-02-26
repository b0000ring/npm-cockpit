const requests = {}

function handleErrors(response) {
  if (!response.ok) throw new Error(response.status);
  return response;
}

export function makeRequest(url) {
  if(!requests[url]) {
    requests[url] = fetch(url)
      .then(handleErrors)
      .then(resp => resp.json())
      .catch(_ => ({ error: true }))
      .finally(() => delete requests[url])
  }

  return requests[url]
}
import { compareSemver } from '../utils.js'

onmessage = function(e) {
  const { dependencies } = e.data
  const result = {}

  Object.entries(dependencies)
      .sort((item1, item2) => item1[0].localeCompare(item2[0]))
      .forEach(dependency => {
        const [name, versions] = dependency
        result[name] = versions.sort((item1, item2) => compareSemver(item2, item1))
      })
  
  postMessage(result)
}
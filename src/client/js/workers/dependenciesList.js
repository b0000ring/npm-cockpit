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

function compareSemver(item1, item2) {
  let num1 = Number(item1.version.replace(/[^0-9]/g, ''))
  let num2 = Number(item2.version.replace(/[^0-9]/g, ''))

  if (num1 > num2) return 1
  if (num2 > num1) return -1
  if (!isNaN(num1) && isNaN(num2)) return 1
  if (isNaN(num1) && !isNaN(num2)) return -1
  
  return 0
}
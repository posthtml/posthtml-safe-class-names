export default function getClassCandidates(input, config) {
  const result = []

  let currentIndex = 0

  // Sort the config array based on the length of the heads in descending order
  config.sort((a, b) => b.heads.length - a.heads.length)

  while (currentIndex < input.length) {
    let foundMatch = false

    for (const {heads, tails} of config) {
      if (input.slice(currentIndex, currentIndex + heads.length) === heads) {
        const tailIndex = input.indexOf(tails, currentIndex + heads.length)

        if (tailIndex !== -1) {
          result.push(input.slice(currentIndex, tailIndex + tails.length))
          currentIndex = tailIndex + tails.length
          foundMatch = true

          break
        }
      }
    }

    if (!foundMatch) {
      const nextHeadIndex = Math.min(...config.map(({heads}) => input.indexOf(heads, currentIndex)).filter(index => index !== -1))

      if (nextHeadIndex === Number.POSITIVE_INFINITY) {
        result.push(input.slice(currentIndex))
        currentIndex = input.length
      } else {
        result.push(input.slice(currentIndex, nextHeadIndex))
        currentIndex = nextHeadIndex
      }
    }
  }

  return result.map(i => i.trim()).filter(i => i.trim().length > 0)
}

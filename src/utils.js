export function condCat(...args) {
  return args.reduce((collection, currentArg) => {
    const newItems = (
      typeof currentArg === 'string'
        ? currentArg
        : (
          Object
            .entries(currentArg)
            .reduce((innerCollection, [className, predicate]) => (
              predicate ? `${innerCollection} ${className}` : innerCollection
            ), '')
        )
    )

    return `${collection} ${newItems.trim()}`.trim()
  }, '')
}

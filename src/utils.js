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

export const isImmutableSquare = (initialPuzzle, [region, cell]) => (
  initialPuzzle[region][cell] !== null
)

const shiftLeft = (activeCell, validateSquare) => {
  const [region, cell] = activeCell
  const isEdgeRegion = region % 3 === 0
  const isEdgeCell = cell % 3 === 0
  const nextSquare = (
    isEdgeRegion && isEdgeCell
      ? [region + 2, cell + 2]
      : isEdgeCell
        ? [region - 1, cell + 2]
        : [region, cell - 1]
  )

  return (
    validateSquare(nextSquare)
      ? nextSquare
      : shiftLeft(nextSquare, validateSquare)
  )
}

const shiftUp = (activeCell, validateSquare) => {
  const [region, cell] = activeCell
  const isEdgeRegion = region < 3
  const isEdgeCell = cell < 3
  const nextSquare = (
    isEdgeRegion && isEdgeCell
      ? [region + 6, cell + 6]
      : isEdgeCell
        ? [region - 3, cell + 6]
        : [region, cell - 3]
  )


  return (
    validateSquare(nextSquare)
      ? nextSquare
      : shiftUp(nextSquare, validateSquare)
  )
}

const shiftRight = (activeCell, validateSquare) => {
  const [region, cell] = activeCell
  const isEdgeRegion = [2, 5, 8].includes(region)
  const isEdgeCell = [2, 5, 8].includes(cell)
  const nextSquare = (
    isEdgeRegion && isEdgeCell
      ? [region - 2, cell - 2]
      : isEdgeCell
        ? [region + 1, cell - 2]
        : [region, cell + 1]
  )

  return (
    validateSquare(nextSquare)
      ? nextSquare
      : shiftRight(nextSquare, validateSquare)
  )
}

const shiftDown = (activeCell, validateSquare) => {
  const [region, cell] = activeCell
  const isEdgeRegion = region > 5
  const isEdgeCell = cell > 5
  const nextSquare = (
    isEdgeRegion && isEdgeCell
      ? [region - 6, cell - 6]
      : isEdgeCell
        ? [region + 3, cell - 6]
        : [region, cell + 3]
  )

  return (
    validateSquare(nextSquare)
      ? nextSquare
      : shiftDown(nextSquare, validateSquare)
  )
}

export const shiftFocus = (validateSquare, activeCell, direction) => ({
  left: shiftLeft,
  up: shiftUp,
  right: shiftRight,
  down: shiftDown
}[direction](activeCell, validateSquare))

export const updateCell = (puzzle, [region, cell], newValue) => {
  const updatedRegion = puzzle[region].map((value, regionCell) => (
    regionCell === cell ? newValue : value
  ))

  return [...puzzle.slice(0, region), updatedRegion, ...puzzle.slice(region + 1)]
}

export const getCell = (region, cell, puzzle) => puzzle[region][cell]

export const findInitialActiveCell = puzzle => {
  for (let region = 0; region < puzzle.length; region++) {
    const emptyCell = puzzle[region].findIndex(cell => cell === null)
    if (emptyCell !== undefined) {
      return [region, emptyCell]
    }
  }
}

export const isActive = (region, cell, [activeRegion, activeCell]) => (
  region === activeRegion && cell === activeCell
)


type StrategyType = (votes: boolean[]) => boolean

enum Strategy {
  affirmative = 'affirmative',
  consensus = 'consensus',
  unanimous = 'unanimous',
}

export {
  StrategyType,
}

export default Strategy

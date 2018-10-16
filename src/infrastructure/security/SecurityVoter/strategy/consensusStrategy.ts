import { StrategyType } from './strategy'

const consensusStrategy: StrategyType = (votes) => {
  const pros = votes.filter((vote) => vote).length
  const cons = votes.filter((vote) => !vote).length

  return pros > cons
}

export default consensusStrategy

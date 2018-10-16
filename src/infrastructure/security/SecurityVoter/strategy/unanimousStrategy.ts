import { StrategyType } from './strategy'

const unanimousStrategy: StrategyType = (votes) => votes.every(Boolean)

export default unanimousStrategy

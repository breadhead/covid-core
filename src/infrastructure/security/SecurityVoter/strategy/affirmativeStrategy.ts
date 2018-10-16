import { StrategyType } from './strategy'

const affirmativeStrategy: StrategyType = (votes) => votes.some(Boolean)

export default affirmativeStrategy

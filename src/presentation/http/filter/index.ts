import ActionUnavailableFilter from './ActionUnavailableFilter'
import EntityNotFoundFilter from './EntityNotFoundFilter'
import InvariantViolationFilter from './InvariantViolationFilter'
import QueryFailedFilter from './QueryFailedFilter'

import FilterProviderFactory from './FilterProviderFactory'

export default FilterProviderFactory.providers(
  ActionUnavailableFilter,
  EntityNotFoundFilter,
  InvariantViolationFilter,
  QueryFailedFilter,
)

import FilterProviderFactory from './FilterProviderFactory'

import ActionUnavailableFilter from './ActionUnavailableFilter'
import EntityNotFoundFilter from './EntityNotFoundFilter'
import InvalidCredentialsFilter from './InvalidCredentialsFilter'
import InvariantViolationFilter from './InvariantViolationFilter'
import QueryFailedFilter from './QueryFailedFilter'
import SecurityFilter from './SecurityFilter'

export default FilterProviderFactory.providers(
  ActionUnavailableFilter,
  EntityNotFoundFilter,
  InvariantViolationFilter,
  QueryFailedFilter,
  InvalidCredentialsFilter,
  SecurityFilter,
)

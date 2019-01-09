import ActionUnavailableFilter from './ActionUnavailableFilter'
import EntityNotFoundFilter from './EntityNotFoundFilter'
import FilterProviderFactory from './FilterProviderFactory'
import InvalidCredentialsFilter from './InvalidCredentialsFilter'
import InvariantViolationFilter from './InvariantViolationFilter'
import QueryFailedFilter from './QueryFailedFilter'
import QuotaAllocationFailedFilter from './QuotaAllocationFailedFilter'
import SecurityFilter from './SecurityFilter'
import VerificationFailedFilter from './VerificationFailedFilter'

export default FilterProviderFactory.providers(
  ActionUnavailableFilter,
  EntityNotFoundFilter,
  InvariantViolationFilter,
  QueryFailedFilter,
  InvalidCredentialsFilter,
  SecurityFilter,
  QuotaAllocationFailedFilter,
  VerificationFailedFilter,
)

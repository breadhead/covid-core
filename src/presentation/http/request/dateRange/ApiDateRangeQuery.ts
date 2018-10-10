import { ApiImplicitQuery } from '@nestjs/swagger'

import { ComposeMethodDecoratos } from '@app/infrastructure/utils/decorator'

export default (): MethodDecorator => ComposeMethodDecoratos([
  ApiImplicitQuery({ name: 'from', required: false }),
  ApiImplicitQuery({ name: 'to', required: false }),
])

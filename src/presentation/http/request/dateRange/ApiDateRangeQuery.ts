import { ComposeMethodDecorators } from '@breadhead/detil-ts'
import { ApiImplicitQuery } from '@nestjs/swagger'

export default (): MethodDecorator => ComposeMethodDecorators([
  ApiImplicitQuery({ name: 'from', required: false }),
  ApiImplicitQuery({ name: 'to', required: false }),
])

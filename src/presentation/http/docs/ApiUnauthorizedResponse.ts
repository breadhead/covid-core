import { ApiResponse, ResponseMetadata } from '@nestjs/swagger'

export default (metadata: ResponseMetadata) => ApiResponse({ status: 401, ...metadata })

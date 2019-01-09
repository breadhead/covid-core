import Processor from './Processor'

import * as inlineCss from 'inline-css'

export default class StyleInlinerProcessor implements Processor {
  public async process(html: string) {
    const processed = await inlineCss(html || '', { url: 'empty' })

    return processed
  }
}

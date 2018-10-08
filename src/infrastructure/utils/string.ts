type Strip = (sym: RegExp | string) => (string) => string
export const strip: Strip = (sym) => (target) => target.replace(sym, '')

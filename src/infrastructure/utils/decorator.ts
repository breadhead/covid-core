export const ComposeMethodDecoratos = (mixins: MethodDecorator[]): MethodDecorator =>
  // tslint:disable-next-line:ban-types
  <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) =>
    mixins.reduce((prev, cur) => cur(target, propertyKey, prev), descriptor)

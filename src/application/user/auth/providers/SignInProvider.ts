import TokenPayload from '@app/infrastructure/security/TokenPayload'

export default interface SignInProvider {
  supports(login: string, cred: string): Promise<boolean>
  signIn(login: string, cred: string): Promise<TokenPayload>
}

const SignInProviders = Symbol('SignInProviders')

export {
  SignInProviders,
}

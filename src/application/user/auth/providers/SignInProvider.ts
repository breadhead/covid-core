import { User } from '@app/user/model/User.entity'

export default interface SignInProvider {
  supports(login: string, cred: string): Promise<boolean>
  signIn(login: string, cred: string): Promise<User>
}

const SignInProviders = Symbol('SignInProviders')

export { SignInProviders }

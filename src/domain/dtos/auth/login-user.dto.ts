import { regularExps } from '../../../config/regular.expresion';

export class LoginUserDto {

  private constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}

  static create(object: { [key: string]: any }): [string?, LoginUserDto?] {
    const { email, password } = object;

    if (!email || !regularExps.email.test(email)) return ['Email is wrong'];
    if (!password) return ['Password is required'];

    return [undefined, new LoginUserDto(email, password)];
  }
}

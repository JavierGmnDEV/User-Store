import { JwtAdapter } from '../../../config/jwt.adapter';
import { LoginUserDto } from '../../dtos/auth/login-user.dto';
import { CustomError } from '../../errors/custom.error';
import { AuthRepository } from '../../repositories/auth.repository';

interface UserToken {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  emailValidated: boolean;
}

type SignToken = (payload: object, duration?: string) => Promise<string | null>;

export class LoginUser {

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken = JwtAdapter.generateToken as SignToken,
  ) {}

  async execute(loginUserDto: LoginUserDto): Promise<UserToken> {
    const user = await this.authRepository.login(loginUserDto);

    const token = await this.signToken({ id: user.id });
    if (!token) throw CustomError.internalServer('Error creating JWT');

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
      emailValidated: user.emailValidated,
    };
  }
}

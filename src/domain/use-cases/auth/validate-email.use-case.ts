import { JwtAdapter } from '../../../config/jwt.adapter';
import { CustomError } from '../../errors/custom.error';
import { AuthRepository } from '../../repositories/auth.repository';

type ValidateToken = <T>(token: string) => Promise<T | null>;

export class ValidateEmail {

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly validateToken: ValidateToken = JwtAdapter.validateToken,
  ) {}

  async execute(token: string): Promise<boolean> {
    const payload = await this.validateToken<{ email: string }>(token);
    if (!payload) throw CustomError.unauthorized('Invalid token');

    const { email } = payload;
    if (!email) throw CustomError.internalServer('Email not in token');

    const user = await this.authRepository.findByEmail(email);
    if (!user) throw CustomError.notFound('User not found');

    await this.authRepository.updateEmailValidated(email, true);

    return true;
  }
}

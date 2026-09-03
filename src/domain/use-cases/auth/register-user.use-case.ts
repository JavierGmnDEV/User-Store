import { envs } from '../../../config/envs';
import { JwtAdapter } from '../../../config/jwt.adapter';
import { RegisterUserDto } from '../../dtos/auth/register-user.dto';
import { CustomError } from '../../errors/custom.error';
import { AuthRepository } from '../../repositories/auth.repository';
import { EmailService } from '../../services/email.service';

interface UserToken {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

type SignToken = (payload: object, duration?: string) => Promise<string | null>;

export class RegisterUser {

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly emailService: EmailService,
    private readonly signToken: SignToken = JwtAdapter.generateToken as SignToken,
  ) {}

  async execute(registerUserDto: RegisterUserDto): Promise<UserToken> {
    const user = await this.authRepository.register(registerUserDto);

    await this.sendEmailValidationLink(user.email);

    const token = await this.signToken({ id: user.id });
    if (!token) throw CustomError.internalServer('Error creating JWT');

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }

  private sendEmailValidationLink = async (email: string) => {
    const token = await this.signToken({ email });
    if (!token) throw CustomError.internalServer('Error creating email token');

    const link = `${envs.APIURL}/auth/validate-email/${token}`;
    const html = `
      <h1>Validate your email</h1>
      <p>Access this link to validate your email: ${link}</p>
      <a href="${link}">Validate your email ${email}</a>
    `;

    const isSent = await this.emailService.sendEmail({
      to: email,
      subject: 'Validate your email',
      htmlBody: html,
    });

    if (!isSent) throw CustomError.internalServer('Error sending email');

    return true;
  };
}

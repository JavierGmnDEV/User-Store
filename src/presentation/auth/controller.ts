import { Request, Response } from 'express';
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';
import { LoginUserDto } from '../../domain/dtos/auth/login-user.dto';
import { CustomError } from '../../domain/errors/custom.error';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { EmailService } from '../../domain/services/email.service';
import { RegisterUser } from '../../domain/use-cases/auth/register-user.use-case';
import { LoginUser } from '../../domain/use-cases/auth/login-user.use-case';
import { ValidateEmail } from '../../domain/use-cases/auth/validate-email.use-case';

export class AuthController {

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly emailService: EmailService,
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  registerUser = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    new RegisterUser(this.authRepository, this.emailService)
      .execute(registerUserDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  loginUser = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    new LoginUser(this.authRepository)
      .execute(loginUserDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  validateEmail = (req: Request, res: Response) => {
    const { token } = req.params;

    new ValidateEmail(this.authRepository)
      .execute(token)
      .then(() => res.json({ ok: true, message: 'Email validated' }))
      .catch((error) => this.handleError(error, res));
  };
}

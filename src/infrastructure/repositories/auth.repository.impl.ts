import { AuthDatasource } from '../../domain/datasources/auth.datasource';
import { LoginUserDto } from '../../domain/dtos/auth/login-user.dto';
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';
import { UserEntity } from '../../domain/entities/user.entity';
import { AuthRepository } from '../../domain/repositories/auth.repository';

export class AuthRepositoryImpl implements AuthRepository {

  constructor(
    private readonly authDatasource: AuthDatasource,
  ) {}

  register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    return this.authDatasource.register(registerUserDto);
  }

  login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    return this.authDatasource.login(loginUserDto);
  }

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.authDatasource.findByEmail(email);
  }

  updateEmailValidated(email: string, emailValidated: boolean): Promise<UserEntity> {
    return this.authDatasource.updateEmailValidated(email, emailValidated);
  }
}

import { BcryptAdapter } from '../../config/bcrypt.adapter';
import { UserModel } from '../../data/mongo';
import { AuthDatasource } from '../../domain/datasources/auth.datasource';
import { LoginUserDto } from '../../domain/dtos/auth/login-user.dto';
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';
import { UserEntity } from '../../domain/entities/user.entity';
import { CustomError } from '../../domain/errors/custom.error';
import { UserMapper } from '../mappers/user.mapper';

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class AuthDatasourceImpl implements AuthDatasource {

  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: CompareFunction = BcryptAdapter.compare,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const { name, email, password } = registerUserDto;

    try {
      const exists = await UserModel.findOne({ email });
      if (exists) throw CustomError.badRequest('User already exists');

      const user = await UserModel.create({
        name,
        email,
        password: this.hashPassword(password),
      });

      return UserMapper.userEntityFromObject(user);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer(`Something went wrong: ${error}`);
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const { email, password } = loginUserDto;

    try {
      const user = await UserModel.findOne({ email });
      if (!user) throw CustomError.notFound('User not found');

      const isMatching = this.comparePassword(password, user.password);
      if (!isMatching) throw CustomError.unauthorized('Invalid credentials');

      return UserMapper.userEntityFromObject(user);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer(`Something went wrong: ${error}`);
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await UserModel.findOne({ email });
    if (!user) return null;
    return UserMapper.userEntityFromObject(user);
  }

  async updateEmailValidated(email: string, emailValidated: boolean): Promise<UserEntity> {
    const user = await UserModel.findOne({ email });
    if (!user) throw CustomError.notFound('User not found');

    user.emailValidated = emailValidated;
    await user.save();

    return UserMapper.userEntityFromObject(user);
  }
}

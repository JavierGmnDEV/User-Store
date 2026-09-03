import { UserEntity } from '../../domain/entities/user.entity';
import { CustomError } from '../../domain/errors/custom.error';

export class UserMapper {

  static userEntityFromObject(object: { [key: string]: any }) {
    const { id, _id, name, email, emailValidated, password, role, img } = object;
    const userId = id || _id?.toString();

    if (!userId) throw CustomError.badRequest('Missing id');
    if (!name) throw CustomError.badRequest('Missing name');
    if (!email) throw CustomError.badRequest('Missing email');
    if (emailValidated === undefined) throw CustomError.badRequest('Missing emailValidated');
    if (!password) throw CustomError.badRequest('Missing password');
    if (!role) throw CustomError.badRequest('Missing role');

    return new UserEntity(
      userId,
      name,
      email,
      emailValidated,
      password,
      role,
      img,
    );
  }
}

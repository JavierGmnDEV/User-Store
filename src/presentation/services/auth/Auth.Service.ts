import { bycriptAdapter } from "../../../config/bcrypt.adapter";
import { envs } from "../../../config/envs";
import { JWTadapter } from "../../../config/jwt.adapter";
import { UserMoldel } from "../../../data/mongo/models/Users.model";
import { CreateUserDTO } from "../../../domain/DTO/auth/Create.User.DTO";
import { loginUserDTO } from "../../../domain/DTO/auth/Login.User.DTO";
import { UserEntity } from "../../../domain/entities/User.entity";
import { CustomError } from "../../../domain/errors/custom.errors";
import { EmailService } from "../Email/Email.service";

//para usarlo en el auth controller y pasarle si es necesario el datasource o repository
export class AuthService {
  //se le pasa el repositorio en el cual se va a guardar cuando todo este ok o obtener
  constructor(
    //di
    private readonly emailService : EmailService
  ) {}

  public async registerUser(user: CreateUserDTO) {
    //comprobamos si el usuario esxiste
    const userExist = await UserMoldel.findOne({ email: user.email });
    if (userExist) throw CustomError.BadRequest("User already exist");

    try {
      const userNew = new UserMoldel(user);
      userNew.password = bycriptAdapter.hash(user.password);
      await userNew.save();
      
      await this.sendEmailValidationLink(userNew.email)
      const { password, ...rest } = UserEntity.fromObject(userNew);

      const token = await JWTadapter.generateToken({ id: userNew.id });
      if (!token) throw CustomError.InternalError("error creating jwt");
      return {
        user: rest,
        token: token,
      };
    } catch (err) {
      throw CustomError.BadRequest(`somthing wrong with ${err}`);
    }
  }

  public async loginUser(user: loginUserDTO) {
    const encontrado = await UserMoldel.findOne({ email: user.email });

    if (!encontrado) return CustomError.NotFound("User not found");

    const match = bycriptAdapter.compare(user.password, encontrado.password);

    if (!match) return CustomError.Unauthorized("User password are wrong");
    const { password,emailValidated, ...email } = UserEntity.fromObject(encontrado);
    const token = await JWTadapter.generateToken({ id: encontrado.id });
    if (!token) throw CustomError.InternalError("error creating jwt");
    return {
      user: email,
      token: token,
      validarEmail:emailValidated ,
    };
  }

  private sendEmailValidationLink = async(email:string)=>{
    const token = await JWTadapter.generateToken({email})
    if(!token) throw CustomError.InternalError('Error with token')
        const link = `${envs.APIURL}/auth/validate-email/${token}`
    const html = `
    <h1>Validate your email , access to this link ${link}</h1>
    <a href="${link}">Validate your email ${email}</a>
    `

    const options = {
        to: email,
        subject : 'validate your email',
        text : html
    }
    const isSet = await this.emailService.sendEmail(options)
    if (!isSet)return CustomError.InternalError('error sending email')
        return true
  }
  public validatedEmail = async (token:string)=>{
    const decoded = await JWTadapter.validateToken(token)
    if (!decoded) throw CustomError.InternalError('error decoding token')
        const { email } = decoded as {email:string}
    const validate = await UserMoldel.findOne({email})
    if(!validate) throw CustomError.InternalError('error finding your user')
        
        validate.emailValidated = true
        await validate.save()
        return true
  }
}
 
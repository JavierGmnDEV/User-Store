import { regularExps } from "../../../config/regular.expresion"


//se usa para validar que en el controllador se le mande un objeto correcto antes de ejecutar el call a la bd para no esperar el error de bd 
export class CreateUserDTO{
    
    //se le pone privado porque se quiere crear solamente la entidad mediante metodos

    private constructor (
        public readonly name:string,
        public readonly email :string,
        public readonly password :string

    ){}
    static create (object:{[key:string]:any})
    :[string?,CreateUserDTO?]
    {
        const {name,email,password}=object

        if(!name) return ['missing Name',undefined]
        if(!email) return ['missing email',undefined]
        if(!regularExps.email.test(email))return ['Incorrect Email', undefined]
        if(!password) return ['missing Password',undefined]
        if(password.length< 6) return['Password to short', undefined]

        return [undefined,new CreateUserDTO(name,email,password)]
    
        
    }
}
import { regularExps } from "../../../config/regular.expresion";


export class loginUserDTO{
  

    private constructor (
        readonly email:string,readonly password:string
    ){}

    static create (object :{[key:string]:any}):[message?:string , loginDto?:loginUserDTO]{
         
        const {email, password} = object 
        if (!email|| !regularExps.email.test(email)) return ['email is wrong',undefined]
        if(!password)return ['password isnt string', undefined]
        
        return [undefined,new loginUserDTO(email,password)]
    }
}
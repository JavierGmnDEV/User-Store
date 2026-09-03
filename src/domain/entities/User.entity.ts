import { CustomError } from "../errors/custom.errors"

//para no amarrar la app a ningun modelo de base de datos
export class UserEntity{

    constructor(
        public id :string,
        public name : string,
        public email : string,
        public emailValidated : boolean,
        public password : string,
        public role : string[],
        public img? : string,
    ){

    }
    //se le pasa un objeto con llave de tipo string que puede ser cualquier objeto de mongo 
    static fromObject(object:{[key:string]:any}){
        const {id,_id,name,email,emailValidated,password,role,img} = object

        if(!id&&_id){
            throw CustomError.BadRequest('Missing id')
        }
        if(!name)throw CustomError.BadRequest('Missing name')
            if(!email)throw CustomError.BadRequest('Missing email ')
                if(emailValidated == undefined)throw CustomError.BadRequest('Missing emailValidated ')
                    if(!password)throw CustomError.BadRequest('Missing password ')
                        if(!role)throw CustomError.BadRequest('Missing role ')
                            
        return new UserEntity(_id||id,name, email,emailValidated,password,role,img)
    }
}
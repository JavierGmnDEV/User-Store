export class CustomError extends Error{

    //solo los metodos de esta clase pueden llamar al constructor
    private constructor(
        public readonly statusCode:number,
        public readonly message:string
    ){
        super(message)
         
    }
    public static BadRequest (message:string){

        return new CustomError(400,message)

    }
    public static Unauthorized (message:string ){
        return new CustomError(401,message)
    }
    public static Forbiden (message:string){
        return new CustomError(403,message)
    }
    public static NotFound (message:string){
        return new CustomError(404,message)
    }
    public static InternalError (message:string){
        return new CustomError(500,message)
    }
}


//CustomError.BadRequest('fallo')
//CustomError.Unauthorized('no autorizado')
//CustomError.Forbiden('olvidado')
// CustomError.NotFound('no encontrado')
// CustomError.InternalError('error interno en el servidor')
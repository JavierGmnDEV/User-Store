import { Request, Response } from "express"
import { CreateUserDTO } from "../../domain/DTO/auth/Create.User.DTO";
import { AuthService } from "../services/auth/Auth.Service";
import { CustomError } from "../../domain/errors/custom.errors";
import { loginUserDTO } from "../../domain/DTO/auth/Login.User.DTO";


export class AuthController {
    


    constructor (
        private readonly AuthService : AuthService
    ){}

     register = (req: Request, res: Response) => {
        const [message,object] = CreateUserDTO.create(req.body)
        
        if(message) return res.status(400).send({message})
           
            this.AuthService.registerUser(object!)
            .then(user => res.json(user))
            .catch(err =>{
                if(err instanceof CustomError)
                {
                    return res.status(err.statusCode).json({message:err.message})
                }
                return res.status(500).json({message : `${err}`})
            })
            
     }
     login = (req: Request, res: Response) => {
        const [message , loginDto] = loginUserDTO.create(req.body)
       
        if(message)return res.status(400).send({message})

           
            this.AuthService.loginUser(loginDto!).then(user=>{
        res.json(user)
            }).catch(err => {
                if (err instanceof CustomError){
                    return res.status(err.statusCode).json({message : err.message})
                }
                return res.status(500).json({message:`${err}`})
            })

        
     }
     validateEmail = (req: Request, res: Response) => {
        const {token }= req.params
        this.AuthService.validatedEmail(token).then(user=>{
            res.json(user)
                }).catch(err => {
                    if (err instanceof CustomError){
                        return res.status(err.statusCode).json({message : err.message})
                    }
                    return res.status(500).json({message:`${err}`})
                })
        
     }

} 
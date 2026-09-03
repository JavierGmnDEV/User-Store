import jwt, { SignOptions } from 'jsonwebtoken'
import { envs } from './envs'

const seed = envs.JWT_SEED

export class JWTadapter{


    static generateToken(payload:any , duration: SignOptions['expiresIn'] = '2h'){
        return new Promise((resolve)=>{
            jwt.sign(payload,seed,{expiresIn :duration},(err,token)=>{
                if (err) return resolve(null)

                    return resolve(token)
            })
    })
        
    }
    static validateToken(token:string){
        return new Promise((resolve)=>{
            jwt.verify(token,seed,(err,decoded)=>{
                if (err) return resolve(null)

                    return resolve(decoded)
            })
    })
            
    }
}
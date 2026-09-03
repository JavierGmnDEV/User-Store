import { Router } from "express";
import { AuthController } from "./controller";
import { AuthService } from "../services/auth/Auth.Service";
import { EmailService } from "../services/Email/Email.service";
import { envs } from "../../config/envs";



export class AuthRoutes {


    static get routes(): Router {
        const router = Router();
        const emailService = new EmailService(envs.EMAIL,envs.PASSWORD)
        const authService = new AuthService(emailService)
        const authController = new AuthController(authService);
        router.post('/login', authController.login)
        router.post('/register', authController.register)
       // router.post('/logout', )
        router.get('/validate-email/:token', authController.validateEmail)
     
        return router;
    }
} 
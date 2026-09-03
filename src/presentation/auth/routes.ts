import { Router } from 'express';
import { envs } from '../../config/envs';
import { AuthDatasourceImpl } from '../../infrastructure/datasources/auth.datasource.impl';
import { AuthRepositoryImpl } from '../../infrastructure/repositories/auth.repository.impl';
import { EmailServiceImpl } from '../../infrastructure/services/email.service.impl';
import { AuthController } from './controller';

export class AuthRoutes {

  static get routes(): Router {
    const router = Router();

    const datasource = new AuthDatasourceImpl();
    const authRepository = new AuthRepositoryImpl(datasource);
    const emailService = new EmailServiceImpl(
      envs.MAILER_SERVICE,
      envs.EMAIL,
      envs.PASSWORD,
    );

    const controller = new AuthController(authRepository, emailService);

    router.post('/login', controller.loginUser);
    router.post('/register', controller.registerUser);
    router.get('/validate-email/:token', controller.validateEmail);

    return router;
  }
}

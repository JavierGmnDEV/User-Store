import { envs } from './config/envs';
import { MongoDatabase } from './data/mongo/init';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';


(async()=> {
  main();
})();


async function main() {
  await MongoDatabase.init({
    mongoUrl: envs.MONGO_URL,
    dbName: envs.DB_NAME,
  });
  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  server.start();
}
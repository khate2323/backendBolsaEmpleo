import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // Habilitar CORS
  app.enableCors({
    origin: [
      'http://localhost:5173', // tu frontend en Vite
      'http://localhost:3001', // si usas otro puerto
      'https://tudominio.com', // cuando despliegues
    ],
    credentials: true, // permite cookies/autenticación si las usas
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

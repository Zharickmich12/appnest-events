// Punto de entrada principal de la aplicación NestJS. Se encarga de inicializar
// el servidor, configurar los pipes globales de validación y ejecutar la app.

// Clase que crea la instancia principal de NestJS
import { NestFactory } from '@nestjs/core';
// Módulo raíz de la aplicación
import { AppModule } from './app.module';
// Pipe global para validar datos de entrada
import { ValidationPipe } from '@nestjs/common';

import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { SanitizeResponseInterceptor } from 'src/common/interceptors/sanitize-response.interceptor';

// Función principal que inicializa la aplicación.
async function bootstrap() {
  // Crea una instancia de la aplicación a partir del módulo raíz.
  const app = await NestFactory.create(AppModule);
  // Configura validaciones globales para todos los endpoints.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en los DTO
      forbidNonWhitelisted: true, // Lanza error si se recibe un campo no permitido
      transform: true, // Convierte los tipos automáticamente según el DTO
    }),
  );

  // Aplica el filtro global
  app.useGlobalFilters(new HttpExceptionFilter());
  // Aplica el interceptor global
  app.useGlobalInterceptors(
    new SanitizeResponseInterceptor(),
    new LoggingInterceptor(),
  );
  // Define el puerto del servidor (usa variable de entorno o el valor por defecto 3000).
  const port = process.env.PORT || 3000;

  // Inicia la aplicación y la deja escuchando en el puerto configurado.
  await app.listen(port);

  // Muestra en consola la URL donde se ejecuta la aplicación.
  console.log(`Application running on: http://localhost:${port}`);
}

// Llamada a la función principal de arranque. (cambio hecho por que parecia advertencia)
void bootstrap();

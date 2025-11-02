/**
 * @fileoverview Punto de entrada principal de la aplicación NestJS
 * @module main
 * @description Inicializa el servidor HTTP, configura validaciones globales,
 * filtros de excepciones, interceptores y arranca la aplicación en el puerto
 * configurado. Este archivo orquesta toda la configuración global de la app.
 */

/**
 * NestFactory: Factory class para crear instancias de aplicación NestJS
 */
import { NestFactory } from '@nestjs/core';
/**
 * AppModule: Módulo raíz que agrupa todos los módulos de la aplicación
 */
import { AppModule } from './app.module';
/**
 * ValidationPipe: Pipe integrado para validación automática de DTOs
 */
import { ValidationPipe } from '@nestjs/common';
/**
 * HttpExceptionFilter: Filtro global para manejo centralizado de excepciones HTTP
 */
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
/**
 * LoggingInterceptor: Interceptor para registro de peticiones y respuestas
 */
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
/**
 * SanitizeResponseInterceptor: Interceptor para sanitización de respuestas
 */
import { SanitizeResponseInterceptor } from 'src/common/interceptors/sanitize-response.interceptor';

/**
 * Función bootstrap asíncrona que inicializa y configura la aplicación NestJS
 *
 * @async
 * @function bootstrap
 * @returns {Promise<void>}
 *
 * @description
 * Realiza las siguientes operaciones en orden:
 * 1. Crea la instancia de la aplicación NestJS
 * 2. Configura el ValidationPipe global para todos los endpoints
 * 3. Aplica filtros globales de excepciones
 * 4. Aplica interceptores globales (sanitización y logging)
 * 5. Determina el puerto de escucha
 * 6. Inicia el servidor HTTP
 * 7. Muestra mensaje de confirmación en consola
 *
 * @throws {Error} Si falla la creación de la aplicación o el inicio del servidor
 */
async function bootstrap() {
  /**
   * Crea la instancia principal de NestJS a partir del módulo raíz
   * @type {INestApplication}
   */
  const app = await NestFactory.create(AppModule);
  /**
   * Configura ValidationPipe global para validación automática de DTOs
   * en todos los endpoints de la aplicación
   *
   * @param {ValidationPipe} pipe - Instancia configurada del pipe de validación
   * @param {Object} config - Configuración del ValidationPipe
   * @param {boolean} config.whitelist - Elimina propiedades no definidas en DTOs
   * @param {boolean} config.forbidNonWhitelisted - Rechaza requests con campos no permitidos
   * @param {boolean} config.transform - Transforma payloads a instancias de DTO con tipos correctos
   */
  app.useGlobalPipes(
    new ValidationPipe({
      /**
       * whitelist: true
       * Elimina automáticamente propiedades que no están definidas en el DTO
       * Protege contra inyección de propiedades no deseadas
       */
      whitelist: true,
      /**
       * forbidNonWhitelisted: true
       * Lanza BadRequestException si se reciben propiedades no whitelisteadas
       * Proporciona feedback explícito al cliente sobre campos inválidos
       */
      forbidNonWhitelisted: true,
      /**
       * transform: true
       * Convierte payloads planos a instancias tipadas del DTO correspondiente
       * Realiza conversión automática de tipos (string a number, etc.)
       */
      transform: true,
    }),
  );

  /**
   * Aplica HttpExceptionFilter a nivel global
   * Intercepta y formatea todas las excepciones HTTP antes de enviarlas al cliente
   * Proporciona respuestas de error consistentes en toda la aplicación
   */
  app.useGlobalFilters(new HttpExceptionFilter());
  /**
   * Aplica interceptores globales en orden de ejecución
   * Los interceptores se ejecutan en el orden definido aquí
   *
   * 1. SanitizeResponseInterceptor: Limpia/sanitiza datos sensibles en respuestas
   * 2. LoggingInterceptor: Registra información de requests/responses para debugging
   */
  app.useGlobalInterceptors(
    new SanitizeResponseInterceptor(),
    new LoggingInterceptor(),
  );
  /**
   * Determina el puerto en el que escuchará el servidor
   * Prioriza variable de entorno PORT, usa 3000 como fallback
   * @type {string | number}
   */
  const port = process.env.PORT || 3000;

  /**
   * Inicia el servidor HTTP en el puerto configurado
   * La aplicación queda escuchando peticiones de forma continua
   * @returns {Promise<void>}
   */
  await app.listen(port);

  /**
   * Muestra en consola la URL donde la aplicación está ejecutándose
   * Útil para desarrollo local y verificación de deployment
   */
  console.log(`Application running on: http://localhost:${port}`);
}

/**
 * Invoca la función bootstrap y maneja la promesa resultante
 * void operator previene warnings de TypeScript sobre promesas flotantes
 * La aplicación se ejecuta hasta ser detenida manualmente o por error crítico
 */
void bootstrap();

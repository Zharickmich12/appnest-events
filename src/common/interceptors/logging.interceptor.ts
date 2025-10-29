import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

/**
 * Interceptor que mide el tiempo de ejecucion de cada peticion.
 */
@Injectable() // Permite que NestJS lo inyecte en otros lugares y lo use como interceptor global
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const now = Date.now(); // Guardamos el tiempo al inicio de la peticion

    // next.handle() continúa con la ejecucion del controlador
    // pipe(tap(...)) nos permite ejecutar codigo despues de que la respuesta se genera
    return next.handle().pipe(
      tap(() => {
        // Obtenemos la peticion HTTP
        const req = context.switchToHttp().getRequest<Request>();
        const method = req.method; // Metodo HTTP (GET, POST, etc.)
        const url = req.url; // URL de la peticion
        const time = Date.now() - now; // Tiempo total de ejecucion

        // Loguear el tiempo de ejecucion de manera asincrona
        setImmediate(() => {
          console.log(`${method} ${url} - Execution time: ${time}ms`);
        });
      }),
    );
  }
}

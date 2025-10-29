import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Interceptor que transforma las respuestas y elimina datos sensibles.
// Esto asegura que campos como passwords no se devuelvan al cliente.

@Injectable() // Permite que NestJS lo inyecte y lo use como interceptor
export class SanitizeResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // Se ejecuta antes de que la respuesta llegue al cliente
    return next.handle().pipe(
      map((data: unknown) => {
        // Se limpia los datos sensibles
        const sanitized = this.cleanSensitiveData(data);

        // Si ya viene con formato { success, data }, no lo modificamos
        if (
          typeof sanitized === 'object' &&
          sanitized !== null &&
          'success' in sanitized &&
          'data' in sanitized
        ) {
          return sanitized;
        }
        // Si no, devolvemos la respuesta en un formato uniforme
        return {
          success: true,
          data: sanitized,
        };
      }),
    );
  }

  // Elimina propiedades sensibles como password, token, secret, etc.
  private cleanSensitiveData(data: unknown): unknown {
    // Convertimos fechas a ISO string
    if (data instanceof Date) return data.toISOString();
    // Si es un array, limpiamos cada elemento
    if (Array.isArray(data)) {
      return data.map((item) => this.cleanSensitiveData(item));
    }
    // Si es un objeto, limpiamos sus propiedades
    if (typeof data === 'object' && data !== null) {
      const cleanObject: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(data)) {
        // Ignoramos campos sensibles
        if (['password', 'token', 'secret'].includes(key.toLowerCase()))
          continue;
        cleanObject[key] = this.cleanSensitiveData(value);
      }
      return cleanObject;
    }
    // Si es un valor primitivo, lo devolvemos tal cual
    return data;
  }
}

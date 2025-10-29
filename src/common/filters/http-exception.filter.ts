import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

// Filtro global que captura todas las excepciones lanzadas en la aplicacion
// y devuelve una respuesta
// Se utiliza para centralizar el manejo de errores
@Catch() // Se indica que este filtro capturara cualquier tipo de excepcion
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Obtenemos el contexto HTTP de la excepcion
    const ctx = host.switchToHttp();
    // Obtenemos el objeto Response para enviar la respuesta al cliente
    const response = ctx.getResponse<Response>();
    // Obtenemos el objeto Request para enviar la respuesta al cliente
    const request = ctx.getRequest<Request>();

    // Determina el codigo de estado HTTP:
    // Si la excepcion es HttpException, usamos su codigo, sino usamos 500
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Se obtiene la informacion del error
    // Puede ser un string o un objeto con propiedades
    const rawResponse: string | Record<string, unknown> =
      exception instanceof HttpException
        ? (exception.getResponse() as string | Record<string, unknown>)
        : 'Error interno del servidor';

    // Se normaliza el mensaje de error:
    // Si es un objeto con message, extraemos su valor
    const errorResponse =
      typeof rawResponse === 'object' && 'message' in rawResponse
        ? (rawResponse.message as string | string[])
        : rawResponse;

    // Se construye el payload de la respuesta
    const errorPayload = {
      success: false, // Indica que la peticion fallo
      statusCode: status, // Codigo HTTP
      message: errorResponse, // Mensaje de error
      path: request.url, // URL donde ocurrio el error
      timestamp: new Date().toISOString(), // Momento en que ocurrio
    };

    // Logueamos el error en consola para depuracion
    console.error(
      `[Error ${status}] ${request.method} ${request.url} →`,
      errorResponse,
    );
    // Enviamos la respuesta al cliente con el codigo HTTP correspondiente
    response.status(status).json(errorPayload);
  }
}

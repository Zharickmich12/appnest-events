/**
 * @fileoverview Controlador principal de la aplicación
 * @module AppController
 * @description Controlador raíz que maneja las rutas de nivel superior.
 * Típicamente usado para endpoints básicos como health checks, documentación
 * o páginas de bienvenida. La mayoría de la funcionalidad está en controladores
 * de módulos específicos.
 */

/**
 * Controller: Decorador que marca la clase como controlador de rutas
 * Get: Decorador para definir endpoints HTTP GET
 */
import { Controller, Get } from '@nestjs/common';
/**
 * Servicio con la lógica de negocio del controlador
 */
import { AppService } from './app.service';

/**
 * Controlador raíz de la aplicación
 * 
 * @class AppController
 * @decorator @Controller
 * 
 * @description
 * Maneja las peticiones HTTP a la ruta raíz de la aplicación ('/').
 * Actúa como punto de entrada básico para verificar que el servidor está activo.
 * 
 * @example
 * GET http://localhost:3000/
 * Response: "Hello World!"
 * 
 * @param {string} prefix - Prefijo de ruta (vacío = ruta raíz)
 */
@Controller('/api/')
export class AppController {
  /**
   * Constructor del controlador
   * 
   * @constructor
   * @param {AppService} appService - Servicio inyectado con lógica de negocio
   * 
   * @description
   * NestJS inyecta automáticamente AppService mediante el modificador readonly.
   * readonly previene reasignación accidental de la dependencia.
   * private limita el alcance del servicio al ámbito de la clase.
   * 
   * @example
   * NestJS maneja la inyección automáticamente:
   * const controller = new AppController(appServiceInstance);
   */
  constructor(private readonly appService: AppService) {}

  /**
   * Endpoint raíz de la aplicación
   * 
   * @method getHello
   * @decorator @Get
   * @route GET /
   * @returns {string} Mensaje de bienvenida
   * 
   * @description
   * Endpoint básico que retorna un mensaje de saludo.
   * Útil para:
   * - Verificar que el servidor está ejecutándose
   * - Health checks básicos
   * - Pruebas de conectividad
   * - Página de bienvenida simple
   * 
   * @access public
   * @statuscode 200 - OK
   * 
  */
  @Get()
  getHello(): string {
    // Delega la lógica al servicio, manteniendo el controlador ligero
    return this.appService.getHello();
  }
}
